<?php
include_once '../config/db.php';
include_once '../utils/response.php';

class InsertFullDataSueloController {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }
    

    public function Create($data) {
        ob_start();
        

        try {
            // Preparar la llamada al procedimiento almacenado
            $query = "CALL insert_dictamen_suelo(
                :id_usuario,
                :superficie,
                :claveCatastral,
                :razonSocial,
                :apellidoPaterno,
                :apellidoMaterno,
                :nombre,
                :telefono,
                :correo,
                :personaAutorizada,
                :codigoPostal,
                :colonia,
                :calle,
                :numeroExterior,
                :numeroInterior,
                :latitud,
                :longitud,
                :descAct,
                :tipoSolicitud,
                :usoSolicitado,
                :cantidad,
                :descUso
            )";

            $stmt = $this->conn->prepare($query);

            // Mapear los valores del frontend a los nombres de la base de datos
            $stmt->bindParam(':id_usuario', $data->id_usuario);
            $stmt->bindParam(':superficie', $data->superficie);
            $stmt->bindParam(':claveCatastral', $data->claveCatastral);
            $stmt->bindParam(':razonSocial', $data->razonSocial);
            $stmt->bindParam(':apellidoPaterno', $data->apellidoPaterno);
            $stmt->bindParam(':apellidoMaterno', $data->apellidoMaterno);
            $stmt->bindParam(':nombre', $data->nombre);
            $stmt->bindParam(':telefono', $data->telefono);
            $stmt->bindParam(':correo', $data->correo);
            $stmt->bindParam(':personaAutorizada', $data->personaAutorizada);
            $stmt->bindParam(':codigoPostal', $data->codigoPostal);
            $stmt->bindParam(':colonia', $data->colonia);
            $stmt->bindParam(':calle', $data->calle);
            $stmt->bindParam(':numeroExterior', $data->numeroExterior);
            $stmt->bindParam(':numeroInterior', $data->numeroInterior);
            $stmt->bindParam(':latitud', $data->latitud);
            $stmt->bindParam(':longitud', $data->longitud);
            $stmt->bindParam(':descAct', $data->descAct);
            $stmt->bindParam(':tipoSolicitud', $data->tipoSolicitud);
            $stmt->bindParam(':usoSolicitado', $data->usoSolicitado);
            $stmt->bindParam(':cantidad', $data->cantidad);
            $stmt->bindParam(':descUso', $data->descUso);

            // Ejecutar el procedimiento almacenado
            if ($stmt->execute()) {
                ob_end_clean();
                sendResponse(201, [
                    "mensaje" => "Datos insertados exitosamente en dictamen_suelo"
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
