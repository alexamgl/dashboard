<?php
class TrabajadoresContactoModel {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Función para obtener número de nómina y correo
    public function fetchNominaAndCorreo() {
        $query = "
            SELECT 
                t.numero_nomina AS nomina,
                tc.correo AS correo
            FROM 
                trabajadores t
            INNER JOIN 
                trabajadores_contacto tc
            ON 
                t.id_trabajador = tc.id_trabajador
        ";

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
