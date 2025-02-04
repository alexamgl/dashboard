<?php
date_default_timezone_set('America/Mexico_City');

include('AESCrypto.php');

// Lista de trámites y sus costos
define('TRAMITES', [
    "acuatica" => 375.22,
    "visto_bueno" => 422.39
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

$key = 'BF4AF2E05BE330F1D46AA39A100996D4';
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

// Construcción del XML para enviar
$encodedString = '<pgs><data0>9265660202</data0><data>' . $encrypted . '</data></pgs>';
$dom = new DOMDocument();
if (!$dom->loadXML($encodedString)) {
    die(json_encode(["error" => "El XML generado no es válido."]));
}

// Petición HTTP con cURL
$encHeaders = [
    'cache-control: no-cache',
    'content-type: application/x-www-form-urlencoded'
];

$url = "https://qa5.mitec.com.mx/p/gen";
$ch = curl_init();
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

// Procesar respuesta
try {
    $decryptedResponse = AESCrypto::desencriptar($result, $key);
    $xmlResponse = simplexml_load_string($decryptedResponse);

    if ($xmlResponse === false || !isset($xmlResponse->nb_url)) {
        die(json_encode(["error" => "No se encontró una URL en la respuesta."]));
    }

    $nvacadena = (string) $xmlResponse->nb_url;
    header("Location: pagos_genericos.html?url=" . urlencode($nvacadena));
    exit;

} catch (Exception $e) {
    die(json_encode(["error" => "Error durante la desencriptación: " . $e->getMessage()]));
}

?>
