<?php
include_once '../config/db.php';
include_once '../utils/response.php';

class InsertFullDocsSueloController {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function create($data) {
        ob_start();

        try {
            // Verificamos que existan id_usuario, nombres[] y files[]
            if (!isset($_POST['id_usuario'], $_POST['nombres']) || !isset($_FILES['files'])) {
                ob_end_clean();
                sendErrorResponse(400, "Faltan datos para la inserción.");
                return;
            }

            $id_usuario = $_POST['id_usuario'];
            // "nombres" será un array
            $nombres = $_POST['nombres']; 
            // "files" será un array de archivos
            $archivos = $_FILES['files']; 

            // Verificamos que la cantidad de archivos coincida con la de nombres
            if (count($archivos['name']) !== count($nombres)) {
                ob_end_clean();
                sendErrorResponse(400, "La cantidad de nombres y archivos no coincide.");
                return;
            }

            // Recorremos todos los archivos
            for ($i = 0; $i < count($archivos['name']); $i++) {
                $contenido = file_get_contents($archivos['tmp_name'][$i]);
                $nombreDocumento = $nombres[$i];
                $tipo_mime = $archivos['type'][$i];

                // Llamada al procedimiento almacenado
                $procedimiento = "CALL insertar_doc_suelo_local(:id_usuario, :nombre_documento, :archivo, :tipo_mime)";
                $stmt = $this->conn->prepare($procedimiento);
                $stmt->bindParam(':id_usuario', $id_usuario);
                $stmt->bindParam(':nombre_documento', $nombreDocumento);
                $stmt->bindParam(':archivo', $contenido, PDO::PARAM_LOB);
                $stmt->bindParam(':tipo_mime', $tipo_mime);
                $stmt->execute();
            }

            ob_end_clean();
            sendResponse(201, [
                "success" => true,
                "mensaje" => "Todos los archivos se subieron correctamente"
            ]);

        } catch (PDOException $e) {
            ob_end_clean();
            sendErrorResponse(500, "Error en la inserción: " . $e->getMessage());
        }
    }
}
?>
