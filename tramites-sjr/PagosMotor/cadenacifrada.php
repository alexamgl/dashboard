<?php
date_default_timezone_set('America/Mexico_City');
require __DIR__ . '/../Api/config/db.php';
include('AESCrypto.php');

// Obtén la conexión (objeto PDO)
$database = new Database();
$conn = $database->getConnection();

// Prepara y ejecuta la consulta
$sql = "SELECT id_company, id_branch, user, bs_country, pwd FROM pagos_config LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->execute();

// Obtén la fila (fetch) con PDO
$fila = $stmt->fetch(PDO::FETCH_ASSOC);

// Valida si hay resultados
if ($fila) {
    $id_company = $fila['id_company'];
    $id_branch  = $fila['id_branch'];
    $userConfig = $fila['user'];
    $bs_country = $fila['bs_country'];
    $pwdDB      = $fila['pwd'];
} else {
    // Valores por defecto en caso de no obtener resultados
    $id_company = "default_company";
    $id_branch  = "default_branch";
    $userConfig = "default_user";
    $bs_country = "default_country";
    $pwdDB      = "default_pwd";
}

// Opcionalmente, "cierra" la conexión en PDO
$conn = null;

// Lista de trámites y sus costos
define('TRAMITES', [
    "acuatica" => 1.00,
    "visto_bueno" => 422.39,
    "giro" => 1.50
]);

function generarReferenciaUnica($prefijo = "REF") {
    return substr($prefijo . round(microtime(true) * 1000) . bin2hex(random_bytes(8)), 0, 50);
}

if (!isset($_GET['tramite']) || !array_key_exists($_GET['tramite'], TRAMITES)) {
    header('Content-Type: application/json');
    echo json_encode(["error" => "Trámite inválido o no especificado"]);
    exit;
}

$tramite = $_GET['tramite'];
$monto = TRAMITES[$tramite];

$ruta = "cadena.xml";
if (!file_exists($ruta) || !is_readable($ruta)) {
    die(json_encode(["error" => "El archivo XML no existe o no es accesible."]));
}

$xml = simplexml_load_file($ruta);
if ($xml === false) {
    die(json_encode(["error" => "Error al cargar el archivo XML."]));
}

// ACTUALIZAR LA SECCIÓN <business> CON LOS DATOS EXTRAÍDOS DE LA BD
$xml->business->id_company = $id_company;
$xml->business->id_branch = $id_branch;
$xml->business->user = $userConfig;
$xml->business->bs_country = $bs_country;
$xml->business->pwd = $pwdDB;

//$key = 'BF4AF2E05BE330F1D46AA39A100996D4';
$key = '2CA3EE72CC75A949FCCC4181A4F2D859';
$referenciaUnica = generarReferenciaUnica("FACT");

$xml->url->reference = $referenciaUnica;
$xml->url->amount = number_format($monto, 2, '.', '');
$xmlString = $xml->asXML();

file_put_contents('cadenacifrada.log', date('Y-m-d H:i:s') . ' - Original String Before Encryption: ' . $xmlString . PHP_EOL, FILE_APPEND);

try {
    $encrypted = AESCrypto::encriptar($xmlString, $key);
    file_put_contents('cadenacifrada.log', date('Y-m-d H:i:s') . ' - ENCRYPTED STRING: ' . $encrypted . PHP_EOL, FILE_APPEND);
} catch (Exception $e) {
    die(json_encode(["error" => "Error durante la encriptación: " . $e->getMessage()]));
}

// Desencriptación de prueba (solo para debug)
try {
    $decryptedTest = AESCrypto::desencriptar($encrypted, $key);
    file_put_contents('cadenacifrada.log', date('Y-m-d H:i:s') . ' - DECRYPTED TEST: ' . $decryptedTest . PHP_EOL, FILE_APPEND);
} catch (Exception $e) {
    die(json_encode(["error" => "Error en la desencriptación de prueba: " . $e->getMessage()]));
}

// CONSTRUCCIÓN DEL XML PARA ENVIAR
//$encodedString = '<pgs><data0>9265660202</data0><data>' . $encrypted . '</data></pgs>';
$encodedString = '<pgs><data0>9265655258</data0><data>' . $encrypted . '</data></pgs>';
$dom = new DOMDocument();
if (!$dom->loadXML($encodedString)) {
    die(json_encode(["error" => "El XML generado no es válido."]));
}

// PETICIÓN HTTP CON cURL
$encHeaders = [
    'cache-control: no-cache',
    'content-type: application/x-www-form-urlencoded'
];

//$url = "https://qa5.mitec.com.mx/p/gen";
$url = "https://bc.mitec.com.mx/p/gen";
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
// Opcional: forzar TLS 1.2 si la pasarela lo requiere
curl_setopt($ch, CURLOPT_SSLVERSION, CURL_SSLVERSION_TLSv1_2);

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(['xml' => $encodedString]));
curl_setopt($ch, CURLOPT_HTTPHEADER, $encHeaders);
$result = curl_exec($ch);

if (curl_errno($ch)) {
    die(json_encode(["error" => "Error en cURL: " . curl_error($ch)]));
}
curl_close($ch);

// PROCESAR RESPUESTA
try {
    $decryptedResponse = AESCrypto::desencriptar($result, $key);
    $xmlResponse = simplexml_load_string($decryptedResponse);

    if ($xmlResponse === false || !isset($xmlResponse->nb_url)) {
        die(json_encode(["error" => "No se encontró una URL en la respuesta."]));
    }

    $nvacadena = (string) $xmlResponse->nb_url;
    header("Location: pagos_genericos.html?url=" . urlencode($nvacadena) 
    . "&data=" . urlencode($encrypted));
exit;



} catch (Exception $e) {
    die(json_encode(["error" => "Error durante la desencriptación: " . $e->getMessage()]));
}
?>
