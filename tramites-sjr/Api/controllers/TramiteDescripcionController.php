<?php
include_once __DIR__. '/../config/db.php';
include_once __DIR__. '/../models/TramiteDescripcion.php';
include_once __DIR__. '/../utils/response.php';

class TramiteDescripcionController {
    private $db;
    private $tramiteDescripcion;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->tramiteDescripcion = new TramiteDescripcion($this->db);
    }

    public function create($data) {
        if (!isset($data->homoclave_tramite) || !isset($data->area_responsable) || !isset($data->nombre_tramite) || !isset($data->descripcion)) {
            sendErrorResponse(400, "Datos incompletos: 'homoclave_tramite', 'area_responsable', 'nombre_tramite' y 'descripcion' son requeridos.");
            return;
        }

        $this->tramiteDescripcion->homoclave_tramite = $data->homoclave_tramite;
        $this->tramiteDescripcion->area_responsable = $data->area_responsable;
        $this->tramiteDescripcion->nombre_tramite = $data->nombre_tramite;
        $this->tramiteDescripcion->descripcion = $data->descripcion;

        if ($this->tramiteDescripcion->create()) {
            sendResponse(201, ["mensaje" => "Descripción de trámite creada exitosamente"]);
        } else {
            sendErrorResponse(500, "Error al crear la descripción de trámite.");
        }
    }

    public function read() {
        $stmt = $this->tramiteDescripcion->read();
        $descripciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendResponse(200, $descripciones);
    }

    public function update($data) {
        if (!isset($data->homoclave_tramite)) {
            sendErrorResponse(400, "Homoclave del trámite es requerida para actualizar.");
            return;
        }

        $this->tramiteDescripcion->homoclave_tramite = $data->homoclave_tramite;
        $this->tramiteDescripcion->area_responsable = $data->area_responsable ?? null;
        $this->tramiteDescripcion->nombre_tramite = $data->nombre_tramite ?? null;
        $this->tramiteDescripcion->descripcion = $data->descripcion ?? null;

        if ($this->tramiteDescripcion->update()) {
            sendResponse(200, ["mensaje" => "Descripción de trámite actualizada correctamente"]);
        } else {
            sendErrorResponse(500, "Error al actualizar la descripción de trámite.");
        }
    }

    public function delete($homoclave_tramite) {
        $this->tramiteDescripcion->homoclave_tramite = $homoclave_tramite;

        if ($this->tramiteDescripcion->delete()) {
            sendResponse(200, ["mensaje" => "Descripción de trámite eliminada correctamente"]);
        } else {
            sendErrorResponse(500, "Error al eliminar la descripción de trámite.");
        }
    }
}
?>
