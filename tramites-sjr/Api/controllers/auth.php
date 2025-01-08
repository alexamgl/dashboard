<?php
header("Content-Type: application/json; charset=UTF-8");
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once __DIR__. '/../config/config.php';
include_once __DIR__. '/../src/jwt_helper.php';
include_once __DIR__. '/../config/db.php';

function authenticate($usernameOrEmail, $password) {
    try {
        // Conexión a la base de datos
        $database = new Database();
        $db = $database->getConnection();

        if (!$db) {
            throw new Exception("Error de conexión a la base de datos");
        }

        $query = "
            SELECT u.id_usuario, u.password 
            FROM usuarios u
            LEFT JOIN usuarios_contactos uc ON u.id_usuario = uc.id_usuario
            WHERE (u.curp_usuario = :usernameOrEmail OR uc.email = :usernameOrEmail) AND password =:password";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':usernameOrEmail', $usernameOrEmail);
        $stmt->bindParam(':password', $password);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            $userId = $user['id_usuario'];
            $hashedPassword = $user['password'];


            $queryRole = "SELECT r.nombre_rol 
                            FROM usuario_rol ur
                            JOIN roles r ON ur.id_rol = r.id_rol
                            WHERE ur.id_usuario = :userId";
            $stmtRole = $db->prepare($queryRole);
            $stmtRole->bindParam(':userId', $userId);
            $stmtRole->execute();

            if ($stmtRole->rowCount() > 0) {
                $roleData = $stmtRole->fetch(PDO::FETCH_ASSOC);
                $userRole = $roleData['nombre_rol'];

                // Genera el JWT con el rol del usuario
                $jwt = generateJWT($userId, $userRole);

                echo json_encode([
                    "success" => true,
                    "token" => $jwt
                ]);
            } else {
                http_response_code(403);
                echo json_encode(["success" => false, "message" => "Rol de usuario no encontrado"]);
            }
        } else {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Credenciales incorrectas"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error del servidor", "error" => $e->getMessage()]);
    }
}


$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['username']) && isset($data['password'])) {
    authenticate($data['username'], $data['password']);
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Faltan credenciales"]);
}
