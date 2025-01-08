<?php
class Usuario {
    private $conn;
    private $table_name = "usuarios";

    public $id_usuario;
    public $nombre;
    public $primer_apellido;
    public $segundo_apellido;
    public $curp_usuario;
    public $nombre_completo;
    public $fecha_nacimiento;
    public $password;
    public $acepto_terminos_condiciones;
    public $Url_usuario;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        try {
            $query = "INSERT INTO " . $this->table_name . " SET nombre=:nombre, primer_apellido=:primer_apellido, segundo_apellido=:segundo_apellido, curp_usuario=:curp_usuario, nombre_completo=:nombre_completo, fecha_nacimiento=:fecha_nacimiento, password=:password, acepto_terminos_condiciones=:acepto_terminos_condiciones";
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(":nombre", $this->nombre);
            $stmt->bindParam(":primer_apellido", $this->primer_apellido);
            $stmt->bindParam(":segundo_apellido", $this->segundo_apellido);
            $stmt->bindParam(":curp_usuario", $this->curp_usuario);
            $stmt->bindParam(":nombre_completo", $this->nombre_completo);
            $stmt->bindParam(":fecha_nacimiento", $this->fecha_nacimiento);
            $stmt->bindParam(":password", $this->password);
            $stmt->bindParam(":acepto_terminos_condiciones", $this->acepto_terminos_condiciones);

            if ($stmt->execute()) {
                return true;
            } else {
                throw new Exception("No se pudo insertar el registro.");
            }
        } catch (PDOException $e) {
            throw new Exception("Error en la base de datos: " . $e->getMessage());
        }
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . " SET nombre=:nombre, primer_apellido=:primer_apellido, segundo_apellido=:segundo_apellido, curp_usuario=:curp_usuario, nombre_completo=:nombre_completo, fecha_nacimiento=:fecha_nacimiento, password=:password, acepto_terminos_condiciones=:acepto_terminos_condiciones WHERE id_usuario=:id_usuario";
        $stmt = $this->conn->prepare($query);
    
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":primer_apellido", $this->primer_apellido);
        $stmt->bindParam(":segundo_apellido", $this->segundo_apellido);
        $stmt->bindParam(":curp_usuario", $this->curp_usuario);
        $stmt->bindParam(":nombre_completo", $this->nombre_completo);
        $stmt->bindParam(":fecha_nacimiento", $this->fecha_nacimiento);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":acepto_terminos_condiciones", $this->acepto_terminos_condiciones);
        $stmt->bindParam(":id_usuario", $this->id_usuario, PDO::PARAM_INT);
    
        return $stmt->execute();
    }
    

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id_usuario = :id_usuario";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id_usuario", $this->id_usuario);

        return $stmt->execute();
    }
}
?>
