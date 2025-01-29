<?php
include_once '../config/db.php';
include_once '../utils/response.php';

class GetDatosBecasController {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function read($data) {
        if (!isset($_GET['id_usuario'])) {
            echo json_encode(["success" => false, "message" => "Falta el ID del usuario."]);
            return;
        }

        $id_usuario = $_GET['id_usuario'];

        $query = "SELECT * FROM becas_estudiantes WHERE id_usuario = :id_usuario";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            echo json_encode(["success" => true, "data" => $result]);
        } else {
            echo json_encode(["success" => false, "message" => "No se encontraron datos."]);
        }
    }
}

