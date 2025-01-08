<?php
class UsuarioContacto {
    private $conn;
    private $table_name = "usuarios_contactos";

    public $id_contacto;
    public $id_usuario;
    public $telefono;
    public $email;
    public $tipo_telefono; // Nuevo campo

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear un nuevo contacto de usuario
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET id_usuario=:id_usuario, telefono=:telefono, email=:email, tipo_telefono=:tipo_telefono";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id_usuario", $this->id_usuario, PDO::PARAM_INT);
        $stmt->bindParam(":telefono", $this->telefono);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":tipo_telefono", $this->tipo_telefono, PDO::PARAM_BOOL);

        return $stmt->execute();
    }

    // Leer todos los contactos de usuario
    public function read() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Actualizar un contacto de usuario
    public function update() {
        $query = "UPDATE " . $this->table_name . " SET telefono=:telefono, email=:email, tipo_telefono=:tipo_telefono WHERE id_contacto=:id_contacto";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id_contacto", $this->id_contacto, PDO::PARAM_INT);
        $stmt->bindParam(":telefono", $this->telefono);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":tipo_telefono", $this->tipo_telefono, PDO::PARAM_BOOL);

        return $stmt->execute();
    }

    // Eliminar un contacto de usuario
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id_contacto = :id_contacto";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id_contacto", $this->id_contacto, PDO::PARAM_INT);

        return $stmt->execute();
    }
}
?>
