<?php
include_once __DIR__ . '/../config/db.php';
include_once __DIR__ . '/../models/TrabajadoresDocumentosModel.php';
include_once __DIR__ . '/../utils/response.php';

class TrabajadoresDocumentosController {
    private $db;
    private $model;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->model = new TrabajadoresDocumentosModel($this->db);
    }

    // Método para manejar la solicitud de datos de nómina, documento y URL
    public function obtenerNominaDocumentoURL() {
        $data = $this->model->fetchNominaDocumentoURL();

        if (!empty($data)) {
            sendResponse(200, [
                "success" => true,
                "data" => $data
            ]);
        } else {
            sendResponse(200, [
                "success" => false,
                "message" => "No se encontraron datos."
            ]);
        }
    }
}
?>