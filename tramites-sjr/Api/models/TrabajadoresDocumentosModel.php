
<?php
class TrabajadoresDocumentosModel {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Función para obtener nómina, nombre del documento y URL del documento
    public function fetchNominaDocumentoURL() {
        $query = "
            SELECT 
                t.no_nomina AS nomina,
                d.nombre_documento AS documento,
                d.url_documento AS url
            FROM 
                trabajadores t
            INNER JOIN 
                documentos d
            ON 
                t.id_trabajador = d.id_usuario
            WHERE 
                d.rol = 2
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
