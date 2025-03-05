<?php
// Api/principal/CreateReciboAcuatica.php
header("Content-Type: application/json; charset=UTF-8");

// 1. Leer JSON del POST
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// 2. Extraer variables
$id_ciudadano    = $data['id_ciudadano']   ?? 0;
$nombre_cliente  = $data['nombre_cliente'] ?? '';
$tipo_tramite    = $data['tipo_tramite']  ?? '';
$referencia_pago = $data['referencia_pago'] ?? '';
$fecha_pago      = $data['fecha_pago']     ?? ''; // form. YYYY-MM-DD
$hr_pago         = $data['hr_pago']        ?? ''; // form. HH:MM:SS
$monto           = $data['monto']          ?? 0;

if (!$id_ciudadano || !$nombre_cliente || !$tipo_tramite || !$referencia_pago) {
  echo json_encode([
    "success" => false,
    "message" => "Faltan datos para generar el recibo."
  ]);
  exit;
}

// 3. Conexión a la BD (ajusta tu config)
require_once '../../config/Database.php';
$db = new Database();
$conn = $db->getConnection();

// 4. Insertar en la tabla acuatica_pagos
$stmt = $conn->prepare("
  INSERT INTO acuatica_pagos
    (id_ciudadano, nombre_cliente, tipo_tramite, referencia_pago, fecha_pago, hr_pago, monto)
  VALUES
    (:id_ciudadano, :nombre_cliente, :tipo_tramite, :referencia_pago, :fecha_pago, :hr_pago, :monto)
");

$stmt->bindParam(':id_ciudadano',    $id_ciudadano);
$stmt->bindParam(':nombre_cliente',  $nombre_cliente);
$stmt->bindParam(':tipo_tramite',    $tipo_tramite);
$stmt->bindParam(':referencia_pago', $referencia_pago);
$stmt->bindParam(':fecha_pago',      $fecha_pago);
$stmt->bindParam(':hr_pago',         $hr_pago);
$stmt->bindParam(':monto',           $monto);

if (!$stmt->execute()) {
  echo json_encode([
    "success" => false,
    "message" => "Error al guardar el pago en la BD."
  ]);
  exit;
}
$id_pago = $conn->lastInsertId(); // ID del nuevo registro

// 5. Generar PDF con Dompdf
require_once '../../vendor/autoload.php'; // Ajusta tu ruta al autoload de Composer
use Dompdf\Dompdf;

$dompdf = new Dompdf();

$html = "
<html>
  <head><meta charset='UTF-8'></head>
  <body>
    <h1>Recibo de Pago</h1>
    <p><strong>ID Pago:</strong> $id_pago</p>
    <p><strong>Referencia:</strong> $referencia_pago</p>
    <p><strong>Nombre Cliente:</strong> $nombre_cliente</p>
    <p><strong>Tipo de Trámite:</strong> $tipo_tramite</p>
    <p><strong>Fecha de Pago:</strong> $fecha_pago</p>
    <p><strong>Hora de Pago:</strong> $hr_pago</p>
    <p><strong>Monto:</strong> $$monto MXN</p>
    <hr>
    <p style='font-size:14px'>¡Gracias por tu pago!</p>
  </body>
</html>
";

$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();

// 6. Guardar PDF en una carpeta en el servidor
$uploadDir = __DIR__ . '/../../recibos_acuatica/';
if (!is_dir($uploadDir)) {
  mkdir($uploadDir, 0777, true);
}
$filename = "ReciboAcuatica-$id_pago.pdf";
file_put_contents($uploadDir.$filename, $dompdf->output());

// 7. Guardar la ruta del PDF en la tabla
$pdfPath = "recibos_acuatica/$filename";
$updateStmt = $conn->prepare("UPDATE acuatica_pagos SET recibo_pdf = :pdfPath WHERE id_pago = :id_pago");
$updateStmt->bindParam(':pdfPath', $pdfPath);
$updateStmt->bindParam(':id_pago', $id_pago);
$updateStmt->execute();

// 8. Retornar la URL completa al frontend
// Ajusta la URL base de tu proyecto
$pdfUrl = "http://localhost/Panel_ciudadano/Api/principal/".$pdfPath;

echo json_encode([
  "success" => true,
  "message" => "Pago y recibo registrados correctamente",
  "pdfUrl"   => $pdfUrl
]);
exit;
