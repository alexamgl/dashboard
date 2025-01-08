<?php
class TramiteDescripcion {
    private $conn;
    private $table_name = "tramite_descripcion";

    public $homoclave_tramite;
    public $area_responsable;
    public $nombre_tramite;
    public $descripcion;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear una nueva descripción de trámite
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET homoclave_trámite=:homoclave_tramite, area_responsable=:area_responsable, nombre_tramite=:nombre_tramite, descripción=:descripcion";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":homoclave_tramite", $this->homoclave_tramite);
        $stmt->bindParam(":area_responsable", $this->area_responsable, PDO::PARAM_INT);
        $stmt->bindParam(":nombre_tramite", $this->nombre_tramite);
        $stmt->bindParam(":descripcion", $this->descripcion);

        return $stmt->execute();
    }

    // Leer todas las descripciones de trámites
    public function read() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Actualizar una descripción de trámite
    public function update() {
        $query = "UPDATE " . $this->table_name . " SET area_responsable=:area_responsable, nombre_tramite=:nombre_tramite, descripción=:descripcion WHERE homoclave_trámite=:homoclave_tramite";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":homoclave_tramite", $this->homoclave_tramite);
        $stmt->bindParam(":area_responsable", $this->area_responsable, PDO::PARAM_INT);
        $stmt->bindParam(":nombre_tramite", $this->nombre_tramite);
        $stmt->bindParam(":descripcion", $this->descripcion);

        return $stmt->execute();
    }

    // Eliminar una descripción de trámite
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE homoclave_trámite = :homoclave_tramite";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":homoclave_tramite", $this->homoclave_tramite);

        return $stmt->execute();
    }
}
?>
