<?php
include_once __DIR__. '/../config/db.php';
include_once __DIR__. '/../models/pagosTramites.php';
include_once __DIR__. '/../utils/response.php';
include_once __DIR__. '/../utils/fileController.php';

class PagosTramitesController {
    private $db;
    private $usuario;
    private $fileController;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->pagosTramites = new PagosTramites($this->db); 
    }

    public function create($data) {
        // Asignación de datos al modelo
        $this->pagosTramites->homoclave = $data->homoclave ?? null;
        $this->pagosTramites->id_lugar = $data->id_lugar ?? null;
        $this->pagosTramites->id_usuario = $data->id_usuario ?? null;
        $this->pagosTramites->total_pago = $data->total_pago ?? null;
        try {
            if ($this->usuario->create()) {
                sendResponse(201, ["mensaje" => "Pago creado exitosamente"]);
            } else {
                sendErrorResponse(500, "Error al crear el pago.");
            }
        } catch (Exception $e) {
            sendErrorResponse(500, "Error al crear usuario: " . $e->getMessage());
        }
    }
}