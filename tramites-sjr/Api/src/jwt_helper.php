<?php
require_once '../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function generateJWT($userId, $userRole) {
    $issuedAt = time();
    $expirationTime = $issuedAt + 3600; // Token expira en 1 hora
    $payload = [
        'iat' => $issuedAt,
        'exp' => $expirationTime,
        'sub' => $userId,
        'role' => $userRole // Agregar el rol al token
    ];

    return JWT::encode($payload, JWT_SECRET_KEY, 'HS256');
}


function validateJWT($token) {
    try {
        $decoded = JWT::decode($token, new Key(JWT_SECRET_KEY, 'HS256'));
        return (array) $decoded;
    } catch (Exception $e) {
        return null; 
    }
}
