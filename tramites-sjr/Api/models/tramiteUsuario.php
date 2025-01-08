<?php
class TramiteUsuario {
    private $conn;
    private $table_name = "tramies_usuarios";

    public $id_seguimiento;
    public $homoclave_tramite;
    public $id_usuario;
    public $estatus;
    public $fecha_creacion;
    public $fecha_actualizacion;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear un nuevo trámite de usuario
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET homoclave_tramite=:homoclave_tramite, id_usuario=:id_usuario, estatus=:estatus, fecha_creación=NOW(), fecha_actualización=NOW()";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":homoclave_tramite", $this->homoclave_tramite);
        $stmt->bindParam(":id_usuario", $this->id_usuario, PDO::PARAM_INT);
        $stmt->bindParam(":estatus", $this->estatus, PDO::PARAM_INT);

        return $stmt->execute();
    }

    // Leer todos los trámites de usuario
    public function read() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Actualizar un trámite de usuario
    public function update() {
        $query = "UPDATE " . $this->table_name . " SET homoclave_tramite=:homoclave_tramite, id_usuario=:id_usuario, estatus=:estatus, fecha_actualización=NOW() WHERE id_seguimiento=:id_seguimiento";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id_seguimiento", $this->id_seguimiento, PDO::PARAM_INT);
        $stmt->bindParam(":homoclave_tramite", $this->homoclave_tramite);
        $stmt->bindParam(":id_usuario", $this->id_usuario, PDO::PARAM_INT);
        $stmt->bindParam(":estatus", $this->estatus, PDO::PARAM_INT);

        return $stmt->execute();
    }

    // Eliminar un trámite de usuario
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id_seguimiento = :id_seguimiento";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id_seguimiento", $this->id_seguimiento, PDO::PARAM_INT);

        return $stmt->execute();
    }
}
?>
