<?php
include_once '../config/db.php';
include_once '../utils/response.php';

class GetDatosGiroController {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    /**
     * Obtiene los datos del dictamen de suelo para un usuario dado.
     */
    public function read($data) {
        // Verificar si el body contiene id_usuario
        if (!isset($data->id_usuario)) {
            echo json_encode(["success" => false, "message" => "Falta el ID del usuario."]);
            return;
        }

        $id_usuario = $data->id_usuario;

        try {
            // Obtener datos del usuario en `factibilidad_giro`
            $querySuelo = "SELECT * FROM factibilidad_giro WHERE id_usuario = :id_usuario";
            $stmtSuelo = $this->conn->prepare($querySuelo);
            $stmtSuelo->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
            $stmtSuelo->execute();
            $sueloData = $stmtSuelo->fetch(PDO::FETCH_ASSOC);

            if ($sueloData) {
                echo json_encode(["success" => true, "dictamen" => $sueloData]);
            } else {
                echo json_encode(["success" => false, "message" => "No se encontraron datos."]);
            }
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "message" => "Error en la consulta: " . $e->getMessage()]);
        }
    }
}
