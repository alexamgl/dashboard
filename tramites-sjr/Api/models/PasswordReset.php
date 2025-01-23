<?php
class PasswordReset {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Buscar usuario en todas las tablas
    public function findUser($email, $identifier) {
        // Consultas para cada tabla
        $queries = [
            "trabajador" => "
                SELECT t.id_trabajador AS user_id, 'trabajador' AS role 
                FROM trabajadores t
                JOIN trabajador_contacto tc ON t.id_trabajador = tc.id_trabajador
                WHERE t.curp_trabajador = :identifier AND tc.email = :email
            ",
            "ciudadano" => "
                SELECT c.id_ciudadano AS user_id, 'ciudadano' AS role 
                FROM ciudadanos c
                JOIN ciudadano_contacto cc ON c.id_ciudadano = cc.id_ciudadano
                WHERE c.curp_ciudadano = :identifier AND cc.email = :email
            ",
            "organizacion" => "
                SELECT o.id_organizacion AS user_id, 'organizacion' AS role 
                FROM organizacion o
                JOIN organizacion_contacto oc ON o.id_organizacion = oc.id_organizacion
                WHERE o.rfc_organizacion = :identifier AND oc.email = :email
            "
        ];

        foreach ($queries as $role => $query) {
            $stmt = $this->conn->prepare($query);
            $stmt->execute(['identifier' => $identifier, 'email' => $email]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($result) {
                return $result;
            }
        }

        return null; // No se encontró el usuario
    }

    // Guardar el código de recuperación
    public function saveRecoveryCode($userId, $role, $code, $expiresAt) {
        $stmt = $this->conn->prepare("
            INSERT INTO password_resets (user_id, role, code, expires_at) 
            VALUES (:user_id, :role, :code, :expires_at)
        ");
        return $stmt->execute([
            'user_id' => $userId,
            'role' => $role,
            'code' => $code,
            'expires_at' => $expiresAt
        ]);
    }
}
