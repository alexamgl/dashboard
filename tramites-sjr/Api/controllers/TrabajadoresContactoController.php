<?php
include_once __DIR__ . '/../config/db.php';
include_once __DIR__ . '/../models/TrabajadoresContactoModel.php';
include_once __DIR__ . '/../utils/response.php';

class TrabajadoresContactoController {
    private $db;
    private $model;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->model = new TrabajadoresContactoModel($this->db);
    }

    // Método para manejar la solicitud de datos de nómina y correo
    public function obtenerNominaYCorreo() {
        $data = $this->model->fetchNominaAndCorreo();

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