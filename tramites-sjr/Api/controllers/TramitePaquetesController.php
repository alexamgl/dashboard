<?php
include_once __DIR__. '/../config/db.php';
include_once __DIR__. '/../models/paquetes.php';
include_once __DIR__. '/../utils/response.php';

class TramitePaquetesController{
    private $db;
    private $paquetes;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->paquetes = new Paquetes($this->db);
    }

    public function read($homoclave) {
        $stmt = $this->paquetes->read_tramite_paquete($homoclave);
        $trampaq = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendResponse(200,$trampaq);
    }
}
?>
