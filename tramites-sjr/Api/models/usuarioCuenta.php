<?php
class UsuarioCuenta {
    private $conn;
    private $table_name = "usuarios_cuentas";

    public $id_cuenta;
    public $id_usuario;
    public $llave_cuenta_usuario;
    public $fecha_creacion;
    public $fecha_actualizacion;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear una nueva cuenta de usuario
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET id_usuario=:id_usuario, llave_cuenta_usuario=:llave_cuenta_usuario, fecha_creacion=NOW(), fecha_actualizacion=NOW()";
        $stmt = $this->conn->prepare($query);
    
        $stmt->bindParam(":id_usuario", $this->id_usuario, PDO::PARAM_INT);
        $stmt->bindParam(":llave_cuenta_usuario", $this->llave_cuenta_usuario, PDO::PARAM_INT);
    
        return $stmt->execute();
    }
    

    // Leer todas las cuentas de usuario
    public function read() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Actualizar una cuenta de usuario
    public function update() {
        $query = "UPDATE " . $this->table_name . " SET id_usuario=:id_usuario, llave_cuenta_usuario=:llave_cuenta_usuario, fecha_actualizacion=NOW() WHERE id_cuenta=:id_cuenta";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id_cuenta", $this->id_cuenta, PDO::PARAM_INT);
        $stmt->bindParam(":id_usuario", $this->id_usuario, PDO::PARAM_INT);
        $stmt->bindParam(":llave_cuenta_usuario", $this->llave_cuenta_usuario, PDO::PARAM_INT);

        return $stmt->execute();
    }

    // Eliminar una cuenta de usuario
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id_cuenta = :id_cuenta";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id_cuenta", $this->id_cuenta, PDO::PARAM_INT);

        return $stmt->execute();
    }
}
?>
