<?php
include_once __DIR__. '/../config/db.php';
include_once __DIR__. '/../models/UsuarioContacto.php';
include_once __DIR__. '/../utils/response.php';

class UsuarioContactoController {
    private $db;
    private $usuarioContacto;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->usuarioContacto = new UsuarioContacto($this->db);
    }

    public function create($data) {
        if (!isset($data->id_usuario) || !isset($data->telefono) || !isset($data->email) || !isset($data->tipo_telefono)) {
            sendErrorResponse(400, "Datos incompletos: 'id_usuario', 'telefono', 'email' y 'tipo_telefono' son requeridos.");
            return;
        }

        $this->usuarioContacto->id_usuario = $data->id_usuario;
        $this->usuarioContacto->telefono = $data->telefono;
        $this->usuarioContacto->email = $data->email;
        $this->usuarioContacto->tipo_telefono = $data->tipo_telefono;

        if ($this->usuarioContacto->create()) {
            sendResponse(201, ["mensaje" => "Contacto de usuario creado exitosamente"]);
        } else {
            sendErrorResponse(500, "Error al crear contacto de usuario.");
        }
    }

    public function read() {
        $stmt = $this->usuarioContacto->read();
        $contactos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendResponse(200, $contactos);
    }

    public function update($data) {
        if (!isset($data->id_contacto)) {
            sendErrorResponse(400, "ID de contacto es requerido para actualizar.");
            return;
        }

        $this->usuarioContacto->id_contacto = $data->id_contacto;
        $this->usuarioContacto->telefono = $data->telefono ?? null;
        $this->usuarioContacto->email = $data->email ?? null;
        $this->usuarioContacto->tipo_telefono = $data->tipo_telefono ?? null;

        if ($this->usuarioContacto->update()) {
            sendResponse(200, ["mensaje" => "Contacto de usuario actualizado correctamente"]);
        } else {
            sendErrorResponse(500, "Error al actualizar contacto de usuario.");
        }
    }

    public function delete($id_contacto) {
        $this->usuarioContacto->id_contacto = $id_contacto;

        if ($this->usuarioContacto->delete()) {
            sendResponse(200, ["mensaje" => "Contacto de usuario eliminado correctamente"]);
        } else {
            sendErrorResponse(500, "Error al eliminar contacto de usuario.");
        }
    }
}
?>
