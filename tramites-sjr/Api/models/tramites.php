<?php
    class Tramites{
        private $conn;
        private $table_name = "catalogo_tramites";

        public $id_control;
        public $id_area_resp;
        public $homoclave;
        public $nombre_tramite;
        public $descripcion_tramite;
        public $requiere_pago;

        public function __construct($db){
            $this->conn = $db;
        }

        public function read(){
            $query = "SELECT * FROM " . $this->table_name;
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt;
        }
    }