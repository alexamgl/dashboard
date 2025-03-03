<?php
include_once '../config/db.php';
include_once '../utils/response.php';

class InsertFullDataVistoBuenoController {
    private $conn;
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }
    
    public function Create($data) {
        ob_start();
        
        try {
            // Preparar la llamada al procedimiento almacenado
            $query = "CALL insertar_visto_bueno(
                :id_usuario,
                :denomComer,
                :giro,
                :apertura,
                :cierre,
                :domicilio,
                :telefono,
                :correo,
                :codigoPostal,
                :colonia,
                :calle,
                :numeroExterior,
                :numeroInterior,
                :latitud,
                :longitud,
                :tipoRiesgo
            )";

            $stmt = $this->conn->prepare($query);

            // Mapear los valores del frontend a los nombres de la base de datos
            $stmt->bindParam(':id_usuario', $data->id_usuario);
            $stmt->bindParam(':denomComer', $data->denomComer);
            $stmt->bindParam(':giro', $data->giro);
            $stmt->bindParam(':apertura', $data->apertura);
            $stmt->bindParam(':cierre', $data->cierre);
            $stmt->bindParam(':domicilio', $data->domicilio);
            $stmt->bindParam(':telefono', $data->telefono);
            $stmt->bindParam(':correo', var: $data->correo);
            $stmt->bindParam(':codigoPostal', $data->codigoPostal);
            $stmt->bindParam(':colonia', $data->colonia);
            $stmt->bindParam(':calle', $data->calle);
            $stmt->bindParam(':numeroExterior', $data->numeroExterior);
            $stmt->bindParam(':numeroInterior', $data->numeroInterior);
            $stmt->bindParam(':latitud', $data->latitud);
            $stmt->bindParam(':longitud', $data->longitud);
            $stmt->bindParam(':tipoRiesgo', $data->tipoRiesgo);
           

            // Ejecutar el procedimiento almacenado
            if ($stmt->execute()) {
                ob_end_clean();
                sendResponse(201, [
                    "mensaje" => "Datos insertados exitosamente en dictamen_giro"
                ]);
            } else {
                ob_end_clean();
                sendErrorResponse(500, "Error al insertar los datos");
            }
        } catch (PDOException $e) {
            ob_end_clean();
            sendErrorResponse(500, "Error al insertar datos: " . $e->getMessage());
        }
    }
}
