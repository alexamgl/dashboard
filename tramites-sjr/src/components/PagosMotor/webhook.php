<?php
date_default_timezone_set('America/Mexico_City');

define('SECRET_KEY', 'BF4AF2E05BE330F1D46AA39A100996D4');

include_once 'AESCrypto.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Verificar que la solicitud sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Método no permitido
    die(json_encode([
        'status' => 'error',
        'message' => 'Método no permitido. Solo se aceptan solicitudes POST.'
    ]));
}

$decodedJson = json_decode(file_get_contents('php://input'), true);
$strResponse = $_POST['strResponse'] ?? $decodedJson['strResponse'] ?? null;

// Registrar $_POST recibido
file_put_contents(
    'webhook_raw.log',
    date('Y-m-d H:i:s') . " - \$_POST Data: " . print_r($_POST, true) . PHP_EOL,
    FILE_APPEND
);

// Decodificar `strResponse` asegurando que la estructura se mantiene
$strResponseDecoded = rawurldecode($strResponse);
$strResponseDecoded = trim($strResponseDecoded);

// Registrar la cadena decodificada antes de desencriptarla
file_put_contents(
    'webhook_raw.log',
    date('Y-m-d H:i:s') . " - DECODED strResponse (antes de desencriptar): " . $strResponseDecoded . PHP_EOL,
    FILE_APPEND
);

// Si la cadena sigue vacía después de decodificación, registrar el error
if (empty($strResponseDecoded)) {
    file_put_contents(
        'webhook_errors.log',
        date('Y-m-d H:i:s') . ' - ERROR: strResponse vacío tras decodificación' . PHP_EOL,
        FILE_APPEND
    );
    http_response_code(400);
    die(json_encode(['status' => 'error', 'message' => 'strResponse vacío tras decodificación']));
}

// Función para validar Base64
function isBase64($string) {
    $decoded = base64_decode($string, true);
    return $decoded !== false && base64_encode($decoded) === $string;
}

// Separar múltiples respuestas en caso de que haya más de una
$responseParts = strpos($strResponseDecoded, ';') !== false
    ? explode(';', $strResponseDecoded)
    : [$strResponseDecoded];

$decryptionResults = [];
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
    } catch (Exception $e) {
        file_put_contents(
            'webhook_errors.log',
            date('Y-m-d H:i:s') . " - ERROR decrypting: " . $part . " - " . $e->getMessage() . PHP_EOL,
            FILE_APPEND
        );
    }
}

http_response_code(200);
echo json_encode(['status' => 'processed']);
?>
