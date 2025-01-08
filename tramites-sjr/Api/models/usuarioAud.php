<?php
class UsuarioAud {
    private $conn;
    private $table_name = "usuario_aud";

    public $id_control;
    public $id_usuario;
    public $nombre_curp;
    public $nombre_cdom;
    public $nombre_actanac;
    public $nombre_ine;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear un nuevo registro de auditoría de usuario
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET id_usuario=:id_usuario, nombre_curp=:nombre_curp, nombre_cdom=:nombre_cdom, nombre_actanac=:nombre_actanac, nombre_ine=:nombre_ine";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id_usuario", $this->id_usuario, PDO::PARAM_INT);
        $stmt->bindParam(":nombre_curp", $this->nombre_curp);
        $stmt->bindParam(":nombre_cdom", $this->nombre_cdom);
        $stmt->bindParam(":nombre_actanac", $this->nombre_actanac);
        $stmt->bindParam(":nombre_ine", $this->nombre_ine);

        return $stmt->execute();
    }

    // Leer todos los registros de auditoría de usuarios
    public function read() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Actualizar un registro de auditoría de usuario
    public function update() {
        $query = "UPDATE " . $this->table_name . " SET nombre_curp=:nombre_curp, nombre_cdom=:nombre_cdom, nombre_actanac=:nombre_actanac, nombre_ine=:nombre_ine WHERE id_control=:id_control";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id_control", $this->id_control, PDO::PARAM_INT);
        $stmt->bindParam(":nombre_curp", $this->nombre_curp);
        $stmt->bindParam(":nombre_cdom", $this->nombre_cdom);
        $stmt->bindParam(":nombre_actanac", $this->nombre_actanac);
        $stmt->bindParam(":nombre_ine", $this->nombre_ine);

        return $stmt->execute();
    }

    // Eliminar un registro de auditoría de usuario
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id_control = :id_control";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id_control", $this->id_control, PDO::PARAM_INT);

        return $stmt->execute();
    }
}
?>
