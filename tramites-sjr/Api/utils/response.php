<?php
function sendResponse($statusCode, $data) {
    header("Content-Type: application/json");
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

function sendErrorResponse($statusCode, $errorMessage) {
    header("Content-Type: application/json");
    http_response_code($statusCode);
    echo json_encode(["error" => $errorMessage]);
    exit;
}

