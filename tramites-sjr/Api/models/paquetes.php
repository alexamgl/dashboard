<?php
    class Paquetes{
        private $conn;
        private $table_name = "tramites_paquetes";

        public $id_seguimiento;
        public $homoclave_tramite;
        public $nombre_paquete;
        public $descripcion_paquete;
        public $costo_paquete;

        public function __construct($db){
            $this->conn = $db;
        }

        public function read_tramite_paquete($homo) {
            $query = "SELECT * FROM " . $this->table_name . " WHERE homoclave_tramite = :homo";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':homo', $homo->homoclave);
            $stmt->execute();
            
            return $stmt;
        }
    }
?>