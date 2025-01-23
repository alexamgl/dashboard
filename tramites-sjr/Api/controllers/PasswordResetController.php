<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../models/PasswordReset.php';
require_once __DIR__ . '/../utils/response.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

use GuzzleHttp\Client;

class PasswordResetController {
    private $db;
    private $passwordResetModel;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->passwordResetModel = new PasswordReset($this->db);
    }

    public function requestReset($data) {
        $email = $data->email ?? null;
        $identifier = $data->identifier ?? null;

        if (!$email || !$identifier) {
            sendResponse(400, ["success" => false, "message" => "Correo o identificador no proporcionados."]);
            return;
        }

        // Buscar usuario
        $user = $this->passwordResetModel->findUser($email, $identifier);

        if (!$user) {
            sendResponse(404, ["success" => false, "message" => "Usuario no encontrado con los datos proporcionados."]);
            return;
        }

        // Generar código y guardarlo
        $code = bin2hex(random_bytes(4)); // Código de 8 caracteres
        $expiresAt = date('Y-m-d H:i:s', strtotime('+15 minutes'));

        if (!$this->passwordResetModel->saveRecoveryCode($user['user_id'], $user['role'], $code, $expiresAt)) {
            sendResponse(500, ["success" => false, "message" => "Error al guardar el código de recuperación."]);
            return;
        }

        // Enviar correo con Mailersend
        $apiKey = $_ENV['MAILERSEND_API'];
        $client = new Client();
        $subject = 'Recuperación de contraseña';
        $htmlContent = "
        <h1>Recuperación de contraseña</h1>
        <p>Hola <strong>{$user['name']}</strong>,</p>
        <p>Tu código de recuperación es: <strong>$code</strong></p>
        <p>Este código es válido por 15 minutos. Si no solicitaste este código, por favor, ignora este mensaje.</p>
        <p>Cualquier duda, ponte en contacto con nosotros en <a href='mailto:sistemas@sanjuandelrio.gob.mx'>sistemas@sanjuandelrio.gob.mx</a>.</p>
        <p>Gracias,</p>
        <p><strong>Equipo de soporte</strong></p>
    ";
    $textContent = "
        Hola {$user['name']},\n
        Tu código de recuperación es: $code\n
        Este código es válido por 15 minutos. Si no solicitaste este código, por favor, ignora este mensaje.\n
        Cualquier duda, ponte en contacto con nosotros en sistemas@sanjuandelrio.gob.mx.\n
        Gracias,\n
        Equipo de soporte
    ";
        try {
            $response = $client->post('https://api.mailersend.com/v1/email', [
                'headers' => [
                    'Authorization' => "Bearer $apiKey",
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'from' => ['email' => 'soporte@tudominio.com', 'name' => 'Soporte'],
                    'to' => [['email' => $email, 'name' => 'Usuario']],
                    'subject' => $subject,
                    'html' => $htmlContent,
                ],
            ]);

            if ($response->getStatusCode() === 202) {
                sendResponse(200, ["success" => true, "message" => "Código enviado al correo."]);
            } else {
                sendResponse(500, ["success" => false, "message" => "Error al enviar el correo."]);
            }
        } catch (Exception $e) {
            sendResponse(500, ["success" => false, "message" => $e->getMessage()]);
        }
    }
}
