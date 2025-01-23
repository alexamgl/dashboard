<?php
require __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use GuzzleHttp\Client;

$mail = new PHPMailer(true);

try {
    // Configuración de Mailersend API
    $apiKey = 'mlsn.88d680cd51b87eb78bdede7261a996334105800de86085f15432df041d2a4932'; // Reemplaza con tu API Key de Mailersend
    $apiEndpoint = 'https://api.mailersend.com/v1/email';

    // Configurar el remitente y destinatario
    $sender = 'MS_1ruPjG@trial-pq3enl6zn1042vwr.mlsender.net'; // Remitente verificado en Mailersend
    $recipient = 'sistemas@sanjuandelrio.gob.mx'; // Destinatario
    $subject = 'Correo de prueba desde Mailersend';
    $htmlContent = '<h1>Hola desde Mailersend</h1><p>Este es un correo de prueba enviado mediante Mailersend y PHPMailer.</p>';
    $textContent = 'Hola desde Mailersend. Este es un correo de prueba.';

    // Crear el cliente HTTP con Guzzle
    $client = new Client();

    // Enviar el correo usando la API de Mailersend
    $response = $client->post($apiEndpoint, [
        'headers' => [
            'Authorization' => "Bearer $apiKey",
            'Content-Type' => 'application/json',
        ],
        'json' => [
            'from' => [
                'email' => $sender,
                'name' => 'Tu Nombre',
            ],
            'to' => [
                ['email' => $recipient, 'name' => 'Destinatario'],
            ],
            'subject' => $subject,
            'html' => $htmlContent,
            'text' => $textContent,
        ],
    ]);

    // Verifica la respuesta
    if ($response->getStatusCode() === 202) {
        echo 'Correo enviado correctamente.';
    } else {
        echo 'Error al enviar el correo: ' . $response->getBody();
    }
} catch (Exception $e) {
    echo 'Error al enviar el correo: ' . $e->getMessage();
}
