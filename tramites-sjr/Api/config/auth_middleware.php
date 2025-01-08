<?php
require_once '../src/jwt_helper.php'; 

function authorize($requiredRole) {
    $headers = apache_request_headers();
    if (isset($headers['Authorization'])) {
        $token = str_replace('Bearer ', '', $headers['Authorization']);
        try {
            $decoded = JWT::decode($token, new Key(JWT_SECRET_KEY, 'HS256'));
            $decodedArray = (array) $decoded;

            // Verificar el rol del usuario
            if ($decodedArray['role'] === $requiredRole) {
                return true;
            } else {
                http_response_code(403);
                echo json_encode(["success" => false, "message" => "Acceso denegado"]);
                return false;
            }
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Token inválido"]);
            return false;
        }
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "No se proporcionó un token"]);
        return false;
    }
}
