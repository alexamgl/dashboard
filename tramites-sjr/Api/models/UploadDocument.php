<?php
class UploadDocument {
    private $conn; // Conexión a la base de datos

    public function __construct($db) {
        $this->conn = $db;
    }

    // Método para guardar los datos del documento en la base de datos
    public function guardarDocumento($id_usuario, $rol, $carpeta, $public_id, $nombre_documento, $url_documento) {
        $query = "CALL GuardarDocumento(:id_usuario, :rol, :carpeta, :public_id, :nombre_documento, :url_documento)";
        $stmt = $this->conn->prepare($query);

        // Vincular parámetros
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->bindParam(':rol', $rol);
        $stmt->bindParam(':carpeta', $carpeta);
        $stmt->bindParam(':public_id', $public_id);
        $stmt->bindParam(':nombre_documento', $nombre_documento);
        $stmt->bindParam(':url_documento', $url_documento);

        // Ejecutar la consulta
        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }
}
?>
