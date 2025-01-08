<?php
include_once __DIR__. '/../config/db.php';
include_once __DIR__. '/../models/TramiteUsuario.php';
include_once __DIR__. '/../utils/response.php';

class TramiteUsuarioController {
    private $db;
    private $tramiteUsuario;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->tramiteUsuario = new TramiteUsuario($this->db);
    }

    public function create($data) {
        if (!isset($data->homoclave_tramite) || !isset($data->id_usuario) || !isset($data->estatus)) {
            sendErrorResponse(400, "Datos incompletos: 'homoclave_tramite', 'id_usuario' y 'estatus' son requeridos.");
            return;
        }

        $this->tramiteUsuario->homoclave_tramite = $data->homoclave_tramite;
        $this->tramiteUsuario->id_usuario = $data->id_usuario;
        $this->tramiteUsuario->estatus = $data->estatus;

        if ($this->tramiteUsuario->create()) {
            sendResponse(201, ["mensaje" => "Trámite de usuario creado exitosamente"]);
        } else {
            sendErrorResponse(500, "Error al crear trámite de usuario.");
        }
    }

    public function read() {
        $stmt = $this->tramiteUsuario->read();
        $tramites = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendResponse(200, $tramites);
    }

    public function update($data) {
        if (!isset($data->id_seguimiento)) {
            sendErrorResponse(400, "ID de seguimiento es requerido para actualizar.");
            return;
        }

        $this->tramiteUsuario->id_seguimiento = $data->id_seguimiento;
        $this->tramiteUsuario->homoclave_tramite = $data->homoclave_tramite ?? null;
        $this->tramiteUsuario->id_usuario = $data->id_usuario ?? null;
        $this->tramiteUsuario->estatus = $data->estatus ?? null;

        if ($this->tramiteUsuario->update()) {
            sendResponse(200, ["mensaje" => "Trámite de usuario actualizado correctamente"]);
        } else {
            sendErrorResponse(500, "Error al actualizar trámite de usuario.");
        }
    }

    public function delete($id_seguimiento) {
        $this->tramiteUsuario->id_seguimiento = $id_seguimiento;

        if ($this->tramiteUsuario->delete()) {
            sendResponse(200, ["mensaje" => "Trámite de usuario eliminado correctamente"]);
        } else {
            sendErrorResponse(500, "Error al eliminar trámite de usuario.");
        }
    }
}
?>
