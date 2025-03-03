<?php
require '../vendor/autoload.php';
require_once '../models/uploadDocumentsGiro.php'; // Modelo de base de datos
require_once '../config/db.php';

use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;

// Cargar configuración desde .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

class UploadDocumentsGiroController {
    private $model;
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->model = new UploadDocumentsGiro($this->db);

        // Configuración de Cloudinary
        Configuration::instance([
            'cloud' => [
                'cloud_name' => $_ENV['CLOUDINARY_CLOUD_NAME'],
                'api_key'    => $_ENV['CLOUDINARY_API_KEY'],
                'api_secret' => $_ENV['CLOUDINARY_API_SECRET'],
            ],
        ]);
    }

    /**
     * Método para subir documentos a Cloudinary y guardarlos en la BD.
     */
    public function uploadDocumentsGiro($data) {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_FILES['file']) || !isset($data['nombre']) || !isset($data['id_usuario'])) {
            echo json_encode(['success' => false, 'message' => 'Faltan datos requeridos.']);
            exit();
        }
        
        $file = $_FILES['file'];
        $nombre_documento = $data['nombre'];
        $id_usuario = $data['id_usuario']; // Ahora se recibe desde el frontend

        // Subir archivo a Cloudinary
        try {
            $upload = (new UploadApi())->upload($file['tmp_name'], [
                'folder' => 'giro_documentos/' . $id_usuario,
            ]);

            $url_documento = $upload['secure_url'];
            $public_id = $upload['public_id'];
            $carpeta = 'giro_documentos/' . $id_usuario;

            // Guardar en la base de datos con el procedimiento almacenado
            $id_documento = $this->model->guardarDocumento([
                'id_usuario' => $id_usuario,
                'carpeta' => $carpeta,
                'public_id' => $public_id,
                'nombre_documento' => $nombre_documento,
                'url_documento' => $url_documento
            ]);

            if ($id_documento) {
                // Obtener documentos por usuario (reemplaza id_form por id_usuario)
                $documentos = $this->model->obtenerDocumentosPorUsuario($id_usuario);

                echo json_encode(['success' => true, 'url' => $url_documento, 'documentos' => $documentos]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al guardar en la base de datos.']);
            }
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => 'Error al subir a Cloudinary: ' . $e->getMessage()]);
        }
    }
}
?>
