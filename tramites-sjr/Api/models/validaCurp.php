<?php
class ValidaCurp {
    private $conn;
    private $table_name = "usuarios";

    public function __construct($db) {
        $this->conn = $db;
    }

    // Verificar si la CURP ya está registrada
    public function checkCurp($curp) {
        $query = "SELECT id_usuario FROM " . $this->table_name . " WHERE curp_usuario = :curp";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':curp', $curp);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
}
?>
