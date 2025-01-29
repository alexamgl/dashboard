<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../models/UploadDocument.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

use Cloudinary\Cloudinary;
use Cloudinary\Api\Exception\ApiError;


class UploadDocumentController {
    private $db;
    private $uploadModel;
    private $cloudinary;

    public function __construct($db) {
        // Inicializar la conexión a la base de datos y el modelo
        $this->db = $db;
        $this->uploadModel = new UploadDocument($db);

        // Inicializar Cloudinary con credenciales desde el archivo .env
        $this->cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => $_ENV['CLOUDINARY_CLOUD_NAME'],
                'api_key' => $_ENV['CLOUDINARY_API_KEY'],
                'api_secret' => $_ENV['CLOUDINARY_API_SECRET'],
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

            // Recibir datos del formulario
            $id_usuario = $data['id_usuario'] ?? null;
            $rol = $data['rol'] ?? 'default';

            if (!$id_usuario || !$rol) {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Faltan datos necesarios (id_usuario o rol)."
                ]);
                return;
            }

            try {
                // Subir el archivo a Cloudinary
                $response = $this->cloudinary->uploadApi()->upload($fileTmpPath, [
                    'resource_type' => 'raw',
                    'folder' => $rol . '/' . $id_usuario,
                    'public_id' => pathinfo($fileName, PATHINFO_FILENAME),
                ]);

                // Obtener información del archivo
                $url_documento = $response['secure_url'];
                $public_id = $response['public_id'];
                $carpeta = $rol . '/' . $id_usuario;
                $nombre_documento = $fileName;

                // Guardar en la base de datos usando el modelo
                $resultado = $this->uploadModel->guardarDocumento($id_usuario, $rol, $carpeta, $public_id, $nombre_documento, $url_documento);

                if ($resultado) {
                    http_response_code(200);
                    echo json_encode([
                        "success" => true,
                        "message" => "Documento subido y registrado exitosamente.",
                        "url" => $url_documento,
                        "public_id" => $public_id
                    ]);
                } else {
                    throw new Exception("Error al guardar el documento en la base de datos.");
                }
            } catch (ApiError $e) {
                http_response_code(500);
                echo json_encode([
                    "success" => false,
                    "message" => "Error al subir el archivo a Cloudinary.",
                    "error" => $e->getMessage()
                ]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode([
                    "success" => false,
                    "message" => $e->getMessage()
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

