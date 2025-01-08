<?php
class UsuarioDireccion {
    private $conn;
    private $table_name = "usuario_direccion";

    public $id_direccion;
    public $id_usuario;
    public $tipo_asentamiento;
    public $asentamiento;
    public $calle;
    public $numero_exterior;
    public $numero_interior;
    public $codigo_postal;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear una nueva dirección de usuario
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET id_usuario=:id_usuario, tipo_asentamiento=:tipo_asentamiento, asentamiento=:asentamiento, calle=:calle, numero_exterior=:numero_exterior, numero_interior=:numero_interior, codigo_postal=:codigo_postal";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id_usuario", $this->id_usuario, PDO::PARAM_INT);
        $stmt->bindParam(":tipo_asentamiento", $this->tipo_asentamiento);
        $stmt->bindParam(":asentamiento", $this->asentamiento);
        $stmt->bindParam(":calle", $this->calle);
        $stmt->bindParam(":numero_exterior", $this->numero_exterior);
        $stmt->bindParam(":numero_interior", $this->numero_interior);
        $stmt->bindParam(":codigo_postal", $this->codigo_postal);

        return $stmt->execute();
    }

    // Leer todas las direcciones de usuario
    public function read() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Actualizar una dirección de usuario
    public function update() {
        $query = "UPDATE " . $this->table_name . " SET tipo_asentamiento=:tipo_asentamiento, asentamiento=:asentamiento, calle=:calle, numero_exterior=:numero_exterior, numero_interior=:numero_interior, codigo_postal=:codigo_postal WHERE id_direccion=:id_direccion";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id_direccion", $this->id_direccion, PDO::PARAM_INT);
        $stmt->bindParam(":tipo_asentamiento", $this->tipo_asentamiento);
        $stmt->bindParam(":asentamiento", $this->asentamiento);
        $stmt->bindParam(":calle", $this->calle);
        $stmt->bindParam(":numero_exterior", $this->numero_exterior);
        $stmt->bindParam(":numero_interior", $this->numero_interior);
        $stmt->bindParam(":codigo_postal", $this->codigo_postal);

        return $stmt->execute();
    }

    // Eliminar una dirección de usuario
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id_direccion = :id_direccion";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id_direccion", $this->id_direccion, PDO::PARAM_INT);

        return $stmt->execute();
    }
}
?>
