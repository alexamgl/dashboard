<?php
include_once '../config/db.php';
include_once '../utils/response.php';

class GetDatosBecaController {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    /**
     * Obtiene los datos de becas y documentos para un usuario dado.
     */
    public function read($data) {
        // Verificar si el body contiene id_usuario
        if (!isset($data->id_usuario)) {
            echo json_encode(["success" => false, "message" => "Falta el ID del usuario."]);
            return;
        }

        $id_usuario = $data->id_usuario;

        try {
            // Obtener datos del usuario en `becas_estudiantes`
            $queryBeca = "SELECT * FROM becas_estudiantes WHERE id_usuario = :id_usuario";
            $stmtBeca = $this->conn->prepare($queryBeca);
            $stmtBeca->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
            $stmtBeca->execute();
            $becaData = $stmtBeca->fetch(PDO::FETCH_ASSOC);

            // Obtener documentos del usuario en `docs_becas`
            $queryDocs = "SELECT * FROM docs_becas WHERE id_usuario = :id_usuario";
            $stmtDocs = $this->conn->prepare($queryDocs);
            $stmtDocs->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
            $stmtDocs->execute();
            $docsData = $stmtDocs->fetchAll(PDO::FETCH_ASSOC); // `fetchAll()` porque puede haber varios documentos

            if ($becaData || count($docsData) > 0) {
                echo json_encode(["success" => true, "beca" => $becaData, "documentos" => $docsData]);
            } else {
                echo json_encode(["success" => false, "message" => "No se encontraron datos ni documentos."]);
            }
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "message" => "Error en la consulta: " . $e->getMessage()]);
        }
    }
}
