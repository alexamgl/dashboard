<?php
include('AESCrypto.php');

function generarReferenciaUnica($prefijo = "REF") {
    // obtener la marca de tiempo actual en milisegundos
    $timestamp = round(microtime(true) * 1000);

    // generar un hash aleatorio
    $randomHash = bin2hex(random_bytes(16)); // 32 caracteres

    // combinar prefijo, marca de tiempo y hash aleatorio
    $referencia = sprintf("%s%s%s", $prefijo, $timestamp, $randomHash);

    // recortar la referencia para que tenga exactamente 50 caracteres
    return substr($referencia, 0, 50);
}

$ruta = "cadena.xml";

// Validar si el archivo XML existe
if (!file_exists($ruta)) {
    die("Error: El archivo XML no existe.");
}

// Leer y cargar el contenido del XML
$xml = simplexml_load_file($ruta);
if ($xml === false) {
    die('Error al cargar el archivo XML.');
}

// Generar una referencia única y actualizar el XML
$key = 'BF4AF2E05BE330F1D46AA39A100996D4';
$referenciaUnica = generarReferenciaUnica("FACT");
$xml->url->reference = $referenciaUnica;
$xml->asXML($ruta);

// Validar la clave (debe ser de 32 caracteres hexadecimales)
if (!preg_match('/^[a-fA-F0-9]{32}$/', $key)) {
    die("Error: La clave de encriptación no es válida.\n");
}

// Encriptar el contenido del XML
try {
    $encrypted = AESCrypto::encriptar($xml->asXML(), $key);
} catch (Exception $e) {
    die("Error durante la encriptación: " . $e->getMessage() . "\n");
}

// Crear la cadena cifrada con el formato requerido
$encodedString = '<pgs><data0>9265660202</data0><data>' . $encrypted . '</data></pgs>';

// Validar si el XML generado es válido
$dom = new DOMDocument();
if (!$dom->loadXML($encodedString)) {
    die("Error: El XML generado no es válido o no está bien formado.\n");
}

// Encabezados para la solicitud
$enc = [
    'cache-control: no-cache',
    'content-type: application/x-www-form-urlencoded',
    'content-security-policy: frame-src *; default-src \"self\" https://fonts.googleapis.com https://fonts.gstatic.com https://qa5.mitec.com.mx; style-src \"self\" \"unsafe-inline\" https://fonts.googleapis.com; font-src \"self\" https://fonts.gstatic.com; script-src \"self\" \"nonce-randomstring\";'
];
$url = "https://qa5.mitec.com.mx/p/gen";
$ch = curl_init();

// Configura cURL
curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'xml' => $encodedString
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, $enc);

// Ejecutar la solicitud
$result = curl_exec($ch);
if (curl_errno($ch)) {
    die('Error en cURL: ' . curl_errno($ch) . ' - ' . curl_error($ch));
}
curl_close($ch);

// Desencriptar la respuesta
try {
    $decrypted = AESCrypto::desencriptar($result, $key);

    // Extraer la URL de la respuesta desencriptada
    $posicionInicio = strpos($decrypted, '<nb_url>') + strlen('<nb_url>');
    $posicionFin = strpos($decrypted, '</nb_url>');
    if ($posicionInicio !== false && $posicionFin !== false) {
        $nvacadena = substr($decrypted, $posicionInicio, $posicionFin - $posicionInicio);

        // Redirigir a pagos_genericos.html con la URL como parámetro
        header("Location: /Tramites/dashboard/tramites-sjr/src/components/PagosMotor/pagos_genericos.html?url=" . urlencode($nvacadena));
        exit;


    } else {
        echo "No se encontró una URL válida en la respuesta desencriptada.";
        exit;
    }
} catch (Exception $e) {
    echo "Error durante la desencriptación: " . $e->getMessage();
    exit;
}
?>