<?php
class GraficaTrabajadoresDependencia {
    private $conn;
    private $table_name = "trabajadores"; // Cambia esto por el nombre real de tu tabla

    public function __construct($db) {
        $this->conn = $db;
    }

    // Función para contar los trabajadores por secretaria
    public function contarPorSecretaria() {
        $query = "SELECT secretaria, COUNT(*) AS total FROM " . $this->table_name . " GROUP BY secretaria";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }
}
?>
