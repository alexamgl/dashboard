<?php
include_once __DIR__. '/../config/db.php';
include_once __DIR__. '/../models/UsuarioCuenta.php';
include_once __DIR__. '/../utils/response.php';

class UsuarioCuentaController {
    private $db;
    private $usuarioCuenta;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->usuarioCuenta = new UsuarioCuenta($this->db);
    }

    public function create($data) {
        if (!isset($data->id_usuario) || !isset($data->llave_cuenta_usuario)) {
            sendErrorResponse(400, "Datos incompletos: 'id_usuario' y 'llave_cuenta_usuario' son requeridos.");
            return;
        }
    
        $this->usuarioCuenta->id_usuario = $data->id_usuario;
        $this->usuarioCuenta->llave_cuenta_usuario = $data->llave_cuenta_usuario;
    
        if ($this->usuarioCuenta->create()) {
            sendResponse(201, ["mensaje" => "Cuenta de usuario creada exitosamente"]);
        } else {
            sendErrorResponse(500, "Error al crear cuenta de usuario.");
        }
    }

    public function read() {
        $stmt = $this->usuarioCuenta->read();
        $cuentas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendResponse(200, $cuentas);
    }

    public function update($data) {
        $this->usuarioCuenta->id_cuenta = $data->id_cuenta ?? null;
        $this->usuarioCuenta->id_usuario = $data->id_usuario ?? null;
        $this->usuarioCuenta->llave_cuenta_usuario = $data->llave_cuenta_usuario ?? null;

        if ($this->usuarioCuenta->update()) {
            sendResponse(200, ["mensaje" => "Cuenta de usuario actualizada correctamente"]);
        } else {
            sendErrorResponse(500, "Error al actualizar cuenta de usuario.");
        }
    }

    public function delete($id_cuenta) {
        $this->usuarioCuenta->id_cuenta = $id_cuenta;

        if ($this->usuarioCuenta->delete()) {
            sendResponse(200, ["mensaje" => "Cuenta de usuario eliminada correctamente"]);
        } else {
            sendErrorResponse(500, "Error al eliminar cuenta de usuario.");
        }
    }
}
?>
