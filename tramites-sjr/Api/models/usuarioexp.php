<?php
class UsuarioExp {
    private $conn;
    private $table_name = "usuario_aud";

    public $id_control;
    public $id_usuario;
    public $nombre_archivo;
    public $descripcion_archivo;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Crear un nuevo registro de auditoría de usuario
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET id_usuario=:id_usuario, nombre_archivo=:nombre_archivo, descripcion_archivo=:descripcion_archivo";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id_usuario", $this->id_usuario, PDO::PARAM_INT);
        $stmt->bindParam(":nombre_archivo", $this->nombre_archivo);
        $stmt->bindParam(":descripcion_archivo", $this->descripcion_archivo);

        return $stmt->execute();
    }
}
?>


