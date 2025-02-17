<?php
// Asegúrate de que este archivo maneja la conexión a la base de datos correctamente

class UploadDocumentsSuelo {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Llama al procedimiento almacenado para guardar un documento en la base de datos.
     * Devuelve el ID del documento insertado.
     */
    public function guardarDocumento($datos) {
        $sql = "CALL InsertarDocumentoSuelo(:id_usuario, :carpeta, :public_id, :nombre_documento, :url_documento, @id_documento)";
        $stmt = $this->conn->prepare($sql);

        $stmt->bindParam(':id_usuario', $datos['id_usuario'], PDO::PARAM_INT);
        $stmt->bindParam(':carpeta', $datos['carpeta'], PDO::PARAM_STR);
        $stmt->bindParam(':public_id', $datos['public_id'], PDO::PARAM_STR);
        $stmt->bindParam(':nombre_documento', $datos['nombre_documento'], PDO::PARAM_STR);
        $stmt->bindParam(':url_documento', $datos['url_documento'], PDO::PARAM_STR);

        if ($stmt->execute()) {
            // Obtener el ID generado
            $id_documento = $this->conn->query("SELECT @id_documento AS id")->fetch(PDO::FETCH_ASSOC);
            return $id_documento['id'] ?? false;
        }
        return false;
    }

    /**
     * Obtiene todos los documentos de un usuario en particular.
     */
    public function obtenerDocumentosPorUsuario($id_usuario) {
        $sql = "SELECT * FROM docs_suelo WHERE id_usuario = :id_usuario";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Asigna un nuevo usuario a un documento ya guardado en `docs_becas`.
     */
    public function actualizarUsuarioEnDocumento($id_documento, $id_usuario) {
        $sql = "UPDATE docs_suelo SET id_usuario = :id_usuario WHERE id_documento = :id_documento";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
        $stmt->bindParam(':id_documento', $id_documento, PDO::PARAM_INT);
        return $stmt->execute();
    }

    /**
     * Obtiene los documentos relacionados a un usuario desde una tabla cruzada.
     */
    public function obtenerDocumentosRelacionadosPorUsuario($id_usuario) {
        $sql = "SELECT db.* FROM docs_suelo db
                INNER JOIN usuarios u ON db.id_usuario = u.id_usuario
                WHERE u.id_usuario = :id_usuario";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
