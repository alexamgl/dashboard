<?php

require_once DOC_ROOT_PATH . 'tramites-sjr/Api/config/db.php';
require_once DOC_ROOT_PATH . 'tramites-sjr/Api/models/validaRFC.php';
require_once DOC_ROOT_PATH . 'tramites-sjr/Api/utils/response.php';


class ValidaRFCController {
    private $db;
    private $validaRFC;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->validaRFC = new ValidaRFC($this->db);
    }

    // Método para manejar la solicitud de validación de la CURP
    public function create() {
        // Validar que la solicitud contiene el campo 'rfc'
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['rfc']) || empty(trim($data['rfc']))) {
            sendErrorResponse(400, "El campo 'rfc' es obligatorio.");
            return;
        }

        $rfc = trim($data['rfc']);

        // Validar si la CURP ya está registrada
        $result = $this->validaRFC->checkRFC($rfc);

        if ($result['exists']) {
            sendResponse(200, [
                "success" => false,
                "message" => $result['message']
            ]);
        } else {
            sendResponse(200, [
                "success" => true,
                "message" => $result['message']
            ]);
        }
    }
}
?>
