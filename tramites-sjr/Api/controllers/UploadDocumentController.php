<?php
require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

use Cloudinary\Cloudinary;
use Cloudinary\Api\Exception\ApiError;

class UploadDocumentController {
    private $cloudinary;

    public function __construct() {
        $this->cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => 'dsngx5ckc',
                'api_key' => '423797554566581',
                'api_secret' => 'e8p741pLv-v66FYLUaQajcKXNQU',
            ],
        ]);
    }

    public function upload($data) {
        if ($_FILES['file']['error'] === UPLOAD_ERR_OK) {
            $fileTmpPath = $_FILES['file']['tmp_name'];
            $fileName = $_FILES['file']['name'];

            // Validar que sea un archivo permitido (por ejemplo, PDF)
            if (mime_content_type($fileTmpPath) !== 'application/pdf') {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Solo se permiten archivos PDF."
                ]);
                return;
            }

            // Puedes recibir un ID del trabajador y usarlo para organizar carpetas
            $id_trabajador = $data['id_trabajador'] ?? 'default';

            try {
                $response = $this->cloudinary->uploadApi()->upload($fileTmpPath, [
                    'resource_type' => 'raw', // Para documentos como PDFs
                    'folder' => 'trabajadores/' . $id_trabajador,
                    'public_id' => pathinfo($fileName, PATHINFO_FILENAME),
                ]);

                // Respuesta exitosa
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "message" => "Documento subido exitosamente.",
                    "url" => $response['secure_url'],
                    "public_id" => $response['public_id']
                ]);
            } catch (ApiError $e) {
                http_response_code(500);
                echo json_encode([
                    "success" => false,
                    "message" => "Error al subir el archivo.",
                    "error" => $e->getMessage()
                ]);
            }
        } else {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Error al subir el archivo."
            ]);
        }
    }
}
?>
