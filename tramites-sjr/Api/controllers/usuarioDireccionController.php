<?php
include_once __DIR__. '/../config/db.php';
include_once __DIR__. '/../models/UsuarioDireccion.php';
include_once __DIR__. '/../utils/response.php';

class UsuarioDireccionController {
    private $db;
    private $usuarioDireccion;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->usuarioDireccion = new UsuarioDireccion($this->db);
    }

    public function create($data) {
        if (!isset($data->id_usuario) || !isset($data->tipo_asentamiento) || !isset($data->asentamiento) || !isset($data->calle) || !isset($data->numero_exterior)|| !isset($data->numero_exterior) || !isset($data->codigo_postal)) {
            sendErrorResponse(400, "Datos incompletos: 'id_usuario', 'tipo_asentamiento', 'asentamiento', 'calle', 'numero_exterior' y 'codigo_postal' son requeridos.");
            return;
        }

        $this->usuarioDireccion->id_usuario = $data->id_usuario;
        $this->usuarioDireccion->tipo_asentamiento = $data->tipo_asentamiento;
        $this->usuarioDireccion->asentamiento = $data->asentamiento;
        $this->usuarioDireccion->calle = $data->calle;
        $this->usuarioDireccion->numero_exterior = $data->numero_exterior;
        $this->usuarioDireccion->numero_interior = $data->numero_interior ?? null;
        $this->usuarioDireccion->codigo_postal = $data->codigo_postal;

        if ($this->usuarioDireccion->create()) {
            sendResponse(201, ["mensaje" => "Dirección de usuario creada exitosamente"]);
        } else {
            sendErrorResponse(500, "Error al crear dirección de usuario.");
        }
    }

    public function read() {
        $stmt = $this->usuarioDireccion->read();
        $direcciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendResponse(200, $direcciones);
    }

    public function update($data) {
        if (!isset($data->id_direccion)) {
            sendErrorResponse(400, "ID de dirección es requerido para actualizar.");
            return;
        }

        $this->usuarioDireccion->id_direccion = $data->id_direccion;
        $this->usuarioDireccion->tipo_asentamiento = $data->tipo_asentamiento ?? null;
        $this->usuarioDireccion->asentamiento = $data->asentamiento ?? null;
        $this->usuarioDireccion->calle = $data->calle ?? null;
        $this->usuarioDireccion->numero_exterior = $data->numero_exterior ?? null;
        $this->usuarioDireccion->numero_interior = $data->numero_interior ?? null;
        $this->usuarioDireccion->codigo_postal = $data->codigo_postal ?? null;

        if ($this->usuarioDireccion->update()) {
            sendResponse(200, ["mensaje" => "Dirección de usuario actualizada correctamente"]);
        } else {
            sendErrorResponse(500, "Error al actualizar dirección de usuario.");
        }
    }

    public function delete($id_direccion) {
        $this->usuarioDireccion->id_direccion = $id_direccion;

        if ($this->usuarioDireccion->delete()) {
            sendResponse(200, ["mensaje" => "Dirección de usuario eliminada correctamente"]);
        } else {
            sendErrorResponse(500, "Error al eliminar dirección de usuario.");
        }
    }
}
?>
