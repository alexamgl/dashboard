<?php
include_once __DIR__. '/../config/db.php';
include_once __DIR__. '/../models/ValidaCurp.php';
include_once __DIR__. '/../utils/response.php';

class ValidaCurpController {
    private $db;
    private $validaCurp;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->validaCurp = new ValidaCurp($this->db);
    }

    // Método para manejar la solicitud de validación de la CURP
    public function create() {
        // Validar que la solicitud contiene el campo 'curp'
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['curp']) || empty(trim($data['curp']))) {
            sendErrorResponse(400, "El campo 'curp' es obligatorio.");
            return;
        }

        $curp = trim($data['curp']);

        // Validar si la CURP ya está registrada
        $curpExists = $this->validaCurp->checkCurp($curp);

        if ($curpExists) {
            sendResponse(200, [
                "success" => false,
                "message" => "La CURP ya está registrada."
            ]);
        } else {
            sendResponse(200, [
                "success" => true,
                "message" => "La CURP no está registrada."
            ]);
        }
    }
}
?>
