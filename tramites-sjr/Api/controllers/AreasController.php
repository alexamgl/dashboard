<?php
include_once __DIR__. '/../config/db.php';
include_once __DIR__. '/../models/areas.php';
include_once __DIR__. '/../utils/response.php';

class AreasController{
    private $db;
    private $areas;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
        $this->areas=new Areas($this->db);
    }

    public function read(){
        $stmt = $this->areas->read();
        $descripciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendResponse(200, $descripciones);
    }

    public function read_areas_relacion(){
        $stmt = $this->areas->read_areas_relacion();
        $areas_ = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendResponse(200, $areas_);
    }
}
?>