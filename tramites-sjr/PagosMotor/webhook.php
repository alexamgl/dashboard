<?php
date_default_timezone_set('America/Mexico_City');

//define('SECRET_KEY', 'BF4AF2E05BE330F1D46AA39A100996D4');
define('SECRET_KEY', '2CA3EE72CC75A949FCCC4181A4F2D859');

include_once 'AESCrypto.php';
// Incluir la conexión a la base de datos (ajusta la ruta)
//require_once '../config/db.php';
require_once '../Api/config/db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Verificar método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode([
        'status' => 'error',
        'message' => 'Método no permitido. Solo se aceptan solicitudes POST.'
    ]));
}

// Leer datos: Puede venir en JSON
$decodedJson = json_decode(file_get_contents('php://input'), true);

// Extraer el string cifrado
$strResponse = $decodedJson['strResponse'] ?? null;

// Registrar datos recibidos (para depuración)
file_put_contents(
    'webhook_raw.log',
    date('Y-m-d H:i:s') . " - Data recibida: " . print_r($decodedJson, true) . PHP_EOL,
    FILE_APPEND
);

if (empty($strResponse)) {
    file_put_contents(
        'webhook_errors.log',
        date('Y-m-d H:i:s') . " - ERROR: strResponse vacío" . PHP_EOL,
        FILE_APPEND
    );
    http_response_code(400);
    die(json_encode(['status' => 'error', 'message' => 'strResponse vacío']));
}

// Decodificar el string
$strResponseDecoded = rawurldecode($strResponse);
$strResponseDecoded = trim($strResponseDecoded);

// (Aquí puedes seguir con tu validación Base64 y desencriptación tal como ya tienes)
function isBase64($string) {
    $decoded = base64_decode($string, true);
    return $decoded !== false && base64_encode($decoded) === $string;
}

$responseParts = strpos($strResponseDecoded, ';') !== false
    ? explode(';', $strResponseDecoded)
    : [$strResponseDecoded];

$decryptedData = null;
foreach ($responseParts as $part) {
    if (!isBase64($part)) {
        file_put_contents(
            'webhook_errors.log',
            date('Y-m-d H:i:s') . " - ERROR: Invalid Base64 for part: " . $part . PHP_EOL,
            FILE_APPEND
        );
        continue;
    }
    try {
        $decrypted = AESCrypto::desencriptar($part, SECRET_KEY);
        if ($decrypted === false) {
            throw new Exception("Falló la desencriptación.");
        }
        file_put_contents(
            'webhook_success.log',
            date('Y-m-d H:i:s') . " - DECRYPTED: " . $decrypted . PHP_EOL,
            FILE_APPEND
        );
        $decryptedData = $decrypted;
        break;
    } catch (Exception $e) {
        file_put_contents(
            'webhook_errors.log',
            date('Y-m-d H:i:s') . " - ERROR decrypting: " . $part . " - " . $e->getMessage() . PHP_EOL,
            FILE_APPEND
        );
    }
}

if ($decryptedData === null) {
    http_response_code(400);
    die(json_encode(['status' => 'error', 'message' => 'No se pudo desencriptar la data.']));
}

// Procesar el XML desencriptado
$xml = simplexml_load_string($decryptedData);
if ($xml === false) {
    http_response_code(400);
    die(json_encode(['status' => 'error', 'message' => 'Error al parsear el XML desencriptado.']));
}

// Extraer datos del XML
$reference = (string)$xml->url->reference;
$monto = (string)$xml->url->amount;
$canal = (string)$xml->url->canal;
$version = (string)$xml->url->version;

// Extraer los campos extra enviados desde ciudadano.js
$id_ciudadano   = $decodedJson['id_ciudadano'] ?? 0;
$nombre_cliente = $decodedJson['nombre_cliente'] ?? '';
$tramite        = $decodedJson['tramite'] ?? '';
$correo         = $decodedJson['correo'] ?? '';
$folio          = $decodedJson['folio'] ?? '';
$estado         = $decodedJson['estado'] ?? 'Pagado';
$metodo_pago    = $decodedJson['metodo_pago'] ?? 'Online';


// Fecha y hora del pago
$fecha_pago = date('Y-m-d');
$hora_pago  = date('H:i:s');

// Guardar la cadena desencriptada completa en raw_response
$raw_response = $decryptedData;

// Insertar en la base de datos
$database = new Database();
$conn = $database->getConnection();

$sql = "INSERT INTO pagos (
            id_ciudadano,
            nombre_cliente,
            tramite,
            monto,
            referencia,
            correo,
            folio,
            fecha_pago,
            hora_pago,
            estado,
            metodo_pago,
            canal,
            version,
            raw_response
        ) VALUES (
            :id_ciudadano,
            :nombre_cliente,
            :tramite,
            :monto,
            :referencia,
            :correo,
            :folio,
            :fecha_pago,
            :hora_pago,
            :estado,
            :metodo_pago,
            :canal,
            :version,
            :raw_response
        )";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':id_ciudadano', $id_ciudadano, PDO::PARAM_INT);
$stmt->bindParam(':nombre_cliente', $nombre_cliente, PDO::PARAM_STR);
$stmt->bindParam(':tramite', $tramite, PDO::PARAM_STR);
$stmt->bindParam(':monto', $monto);
$stmt->bindParam(':referencia', $reference, PDO::PARAM_STR);
$stmt->bindParam(':correo', $correo, PDO::PARAM_STR);
$stmt->bindParam(':folio', $folio, PDO::PARAM_STR);
$stmt->bindParam(':fecha_pago', $fecha_pago, PDO::PARAM_STR);
$stmt->bindParam(':hora_pago', $hora_pago, PDO::PARAM_STR);
$stmt->bindParam(':estado', $estado, PDO::PARAM_STR);
$stmt->bindParam(':metodo_pago', $metodo_pago, PDO::PARAM_STR);
$stmt->bindParam(':canal', $canal, PDO::PARAM_STR);
$stmt->bindParam(':version', $version, PDO::PARAM_STR);
$stmt->bindParam(':raw_response', $raw_response, PDO::PARAM_STR);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(['status' => 'success', 'message' => 'Pago registrado exitosamente.']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error al insertar el pago en la base de datos.']);
}
?>
