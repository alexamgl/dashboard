<?php
include_once __DIR__. '/../config/db.php';
include_once __DIR__. '/../models/GraficaTrabajadoresDependencia.php';
include_once __DIR__. '/../utils/response.php';

class GraficaDependenciasController {
    private $db;
    private $graficaModel;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->graficaModel = new GraficaTrabajadoresDependencia($this->db);
    }

    // Método para manejar la solicitud de la gráfica
    public function read() {
        $data = $this->graficaModel->contarPorSecretaria();

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
