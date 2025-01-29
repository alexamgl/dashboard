<?php

class Areas {
    private $conn;
    private $table_name = "areas";

    public $id_area;
    public $nombre_area;
    public $tipo_area;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT tp.costo_paquete, tp.descripcion_paquete, tp.nombre_paquete, tp.id_paquete_orden, ct.homoclave, ct.nombre_tramite, ct.descripcion AS descripcion_tramite, ct.requiere_pago, a.nombre_area FROM tramites_paquetes tp INNER JOIN catalogo_tramites ct ON tp.homoclave_tramite = ct.homoclave INNER JOIN areas a ON a.id_area = ct.id_area_resp";
        //$stmt = $conn->prepare($query);
        //$stmt->execute();
        //return $stmt;
    }
}

?>
