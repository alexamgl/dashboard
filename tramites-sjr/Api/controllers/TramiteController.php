<?php
include_once __DIR__. '/../config/db.php';
include_once __DIR__. '/../models/tramites.php';
include_once __DIR__. '/../utils/response.php';

class TramiteController {
    private $db;
    private $tramites;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->tramites = new Tramites($this->db);
    }

    public function read(){
        $stmt = $this->tramites->read();
        $tramites = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendResponse(200, $tramites);
    }
}
?>