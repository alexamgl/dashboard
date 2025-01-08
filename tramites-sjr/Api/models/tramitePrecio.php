<?php
class TramitePrecio {
    private $conn;
    private $table_name = "tramites_precios";

    public $id_precio;
    public $homoclave_tramite;
    public $nombre_pago;
    public $descripcion_pago;
    public $costo_pago;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear un nuevo precio de trámite
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET homoclave_tramite=:homoclave_tramite, nombre_pago=:nombre_pago, descripcion_pago=:descripcion_pago, costo_pago=:costo_pago";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":homoclave_tramite", $this->homoclave_tramite);
        $stmt->bindParam(":nombre_pago", $this->nombre_pago);
        $stmt->bindParam(":descripcion_pago", $this->descripcion_pago);
        $stmt->bindParam(":costo_pago", $this->costo_pago);

        return $stmt->execute();
    }

    // Leer todos los precios de trámites
    public function read() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Actualizar un precio de trámite
    public function update() {
        $query = "UPDATE " . $this->table_name . " SET homoclave_tramite=:homoclave_tramite, nombre_pago=:nombre_pago, descripcion_pago=:descripcion_pago, costo_pago=:costo_pago WHERE id_precio=:id_precio";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id_precio", $this->id_precio, PDO::PARAM_INT);
        $stmt->bindParam(":homoclave_tramite", $this->homoclave_tramite);
        $stmt->bindParam(":nombre_pago", $this->nombre_pago);
        $stmt->bindParam(":descripcion_pago", $this->descripcion_pago);
        $stmt->bindParam(":costo_pago", $this->costo_pago);

        return $stmt->execute();
    }

    // Eliminar un precio de trámite
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id_precio = :id_precio";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id_precio", $this->id_precio, PDO::PARAM_INT);

        return $stmt->execute();
    }
}
?>
