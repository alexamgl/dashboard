<?php
include_once __DIR__. '/../config/db.php';
include_once __DIR__. '/../models/TramitePrecio.php';
include_once __DIR__. '/../utils/response.php';

class TramitePrecioController {
    private $db;
    private $tramitePrecio;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->tramitePrecio = new TramitePrecio($this->db);
    }

    public function create($data) {
        if (!isset($data->homoclave_tramite) || !isset($data->nombre_pago) || !isset($data->descripcion_pago) || !isset($data->costo_pago)) {
            sendErrorResponse(400, "Datos incompletos: 'homoclave_tramite', 'nombre_pago', 'descripcion_pago' y 'costo_pago' son requeridos.");
            return;
        }

        $this->tramitePrecio->homoclave_tramite = $data->homoclave_tramite;
        $this->tramitePrecio->nombre_pago = $data->nombre_pago;
        $this->tramitePrecio->descripcion_pago = $data->descripcion_pago;
        $this->tramitePrecio->costo_pago = $data->costo_pago;

        if ($this->tramitePrecio->create()) {
            sendResponse(201, ["mensaje" => "Precio de trámite creado exitosamente"]);
        } else {
            sendErrorResponse(500, "Error al crear precio de trámite.");
        }
    }

    public function read() {
        $stmt = $this->tramitePrecio->read();
        $precios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendResponse(200, $precios);
    }

    public function update($data) {
        if (!isset($data->id_precio)) {
            sendErrorResponse(400, "ID de precio es requerido para actualizar.");
            return;
        }

        $this->tramitePrecio->id_precio = $data->id_precio;
        $this->tramitePrecio->homoclave_tramite = $data->homoclave_tramite ?? null;
        $this->tramitePrecio->nombre_pago = $data->nombre_pago ?? null;
        $this->tramitePrecio->descripcion_pago = $data->descripcion_pago ?? null;
        $this->tramitePrecio->costo_pago = $data->costo_pago ?? null;

        if ($this->tramitePrecio->update()) {
            sendResponse(200, ["mensaje" => "Precio de trámite actualizado correctamente"]);
        } else {
            sendErrorResponse(500, "Error al actualizar precio de trámite.");
        }
    }

    public function delete($id_precio) {
        $this->tramitePrecio->id_precio = $id_precio;

        if ($this->tramitePrecio->delete()) {
            sendResponse(200, ["mensaje" => "Precio de trámite eliminado correctamente"]);
        } else {
            sendErrorResponse(500, "Error al eliminar precio de trámite.");
        }
    }
}
?>
