<?php
class ValidaRFC {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Verificar si la RFC ya está registrada en la tabla organizacion
    public function checkRFC($rfc) {
        $query = "SELECT id_organizacion AS id FROM organizacion WHERE rfc_organizacion = :rfc";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':rfc', $rfc);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return [
                "exists" => true,
                "message" => "El RFC ya está registrado."
            ];
        }

        // Si no se encuentra en la tabla organizacion
        return [
            "exists" => false,
            "message" => "El RFC no está registrado."
        ];
    }
}
?>
