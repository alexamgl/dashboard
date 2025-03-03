<?php
include_once '../config/db.php';
include_once '../utils/response.php';

class InsertFullDocsVistoBuenoController {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function Create($data) {
        ob_start();

        try {
            if (!isset($_POST['id_usuario'], $_POST['tipoRiesgo']) || !isset($_FILES['files'])) {
                ob_end_clean();
                sendErrorResponse(400, "Faltan datos para la inserción.");
                return;
            }

            $id_usuario = $_POST['id_usuario'];
            $tipoRiesgo = $_POST['tipoRiesgo'];
            $nombres = $_POST['nombres']; // Recibimos nombres de documentos desde el front
            $archivos = $_FILES['files']; 

            // Determinar qué procedimiento usar según el nivel de riesgo
            switch ($tipoRiesgo) {
                case "Bajo":
                    $procedimiento = "CALL insertar_doc_riesgo_bajo(:id_usuario, :nombre_documento, :archivo, :tipo_mime)";
                    break;
                case "Medio":
                    $procedimiento = "CALL insertar_doc_riesgo_medio(:id_usuario, :nombre_documento, :archivo, :tipo_mime)";
                    break;
                case "Alto":
                    $procedimiento = "CALL insertar_doc_riesgo_alto(:id_usuario, :nombre_documento, :archivo, :tipo_mime)";
                    break;
                default:
                    sendErrorResponse(400, "Tipo de riesgo inválido.");
                    return;
            }

            // Recorrer y subir múltiples archivos
            for ($i = 0; $i < count($archivos['name']); $i++) {
                $contenido = file_get_contents($archivos['tmp_name'][$i]);
                $nombreArchivo = $nombres[$i];
                $tipo_mime = $archivos['type'][$i];

                $stmt = $this->conn->prepare($procedimiento);
                $stmt->bindParam(':id_usuario', $id_usuario);
                $stmt->bindParam(':nombre_documento', $nombreArchivo);
                $stmt->bindParam(':archivo', $contenido, PDO::PARAM_LOB);
                $stmt->bindParam(':tipo_mime', $tipo_mime);
                $stmt->execute();
            }

            ob_end_clean();
            sendResponse(201, ["mensaje" => "Todos los archivos se subieron correctamente"]);

        } catch (PDOException $e) {
            ob_end_clean();
            sendErrorResponse(500, "Error en la inserción: " . $e->getMessage());
        }
    }
}
?>
