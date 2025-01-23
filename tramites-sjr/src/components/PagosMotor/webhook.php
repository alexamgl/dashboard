<?php
// lee el cuerpo de la solicitud
$raw_post_data = file_get_contents('php://input');

if (!$raw_post_data) {
    http_response_code(400); // error si no hay datos
    die('no data received');
}

// decodifica el json recibido
$data = json_decode($raw_post_data, true);

if (!$data) {
    http_response_code(400); // error si el json no es válido
    die('invalid json');
}

// identifica el trámite a partir de un campo en el payload (por ejemplo, "id_tramite")
$id_tramite = $data['id_tramite'] ?? null;

if (!$id_tramite) {
    http_response_code(400); // error si no hay id_tramite
    die('id_tramite missing');
}

// registra el payload recibido para auditoría
file_put_contents(
    'webhook.log',
    date('Y-m-d H:i:s') . " - Trámite $id_tramite - " . json_encode($data) . PHP_EOL,
    FILE_APPEND
);

// procesa el trámite específico
switch ($id_tramite) {
    case 'acuatica':
        // lógica específica para acuática
        break;

    case 'otro_tramite':
        // lógica específica para otro trámite
        break;

    default:
        // lógica por defecto
        break;
}

// responde a webpay plus
http_response_code(200);
echo json_encode([
    'status' => 'success',
    'message' => 'webhook received',
    'additional_data' => 'some_value'
]);

?>
