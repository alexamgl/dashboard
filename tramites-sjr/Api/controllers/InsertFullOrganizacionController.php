<?php

require_once DOC_ROOT_PATH . 'tramites-sjr/Api/config/db.php';
require_once DOC_ROOT_PATH . 'tramites-sjr/Api/utils/response.php';
require_once DOC_ROOT_PATH . 'tramites-sjr/Api/utils/fileController.php';

class InsertOrganizacionController {
    private $conn;
    private $fileController;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
        $this->fileController = new FileController();
    }

    public function Create($data) {
        // Inicia un buffer de salida para prevenir salidas no deseadas
        ob_start();
    
        // Crear la carpeta para la organización
        $directorioUrl = $this->fileController->CreateUserDir($data->razon_social);
        if ($directorioUrl === null) {
            ob_end_clean(); // Limpia el buffer si hay error
            sendErrorResponse(500, "Error al crear la carpeta de raíz");
            return;
        }
    
        try {
            // Configurar la variable de salida en MySQL
            $this->conn->query("SET @new_id_organizacion = NULL");
    
            // Preparar la llamada al procedimiento almacenado
            $query = "CALL insert_organizacion(
                :rfc_organizacion,
                :razon_social,
                :curp_representante,
                :nombre_representante,
                :primer_apellido_representante,
                :segundo_apellido_representante,
                :nombre_completo_representante,
                :fecha_nacimiento_representante,
                :sexo_representante,
                :estado_representante,
                :password,
                :asentamiento,
                :calle,
                :numero_exterior,
                :numero_interior,
                :codigo_postal,
                :latitud,
                :longitud,
                :telefono,
                :email,
                @new_id_organizacion
            )";
    
            $stmt = $this->conn->prepare($query);
    
            // Vincular parámetros de entrada
            $stmt->bindParam(':rfc_organizacion', $data->rfc_organizacion);
            $stmt->bindParam(':razon_social', $data->razon_social);
            $stmt->bindParam(':curp_representante', $data->curp_representante);
            $stmt->bindParam(':nombre_representante', $data->nombre_representante);
            $stmt->bindParam(':primer_apellido_representante', $data->primer_apellido_representante);
            $stmt->bindParam(':segundo_apellido_representante', $data->segundo_apellido_representante);
            $stmt->bindParam(':nombre_completo_representante', $data->nombre_completo_representante);
            $stmt->bindParam(':fecha_nacimiento_representante', $data->fecha_nacimiento_representante);
            $stmt->bindParam(':sexo_representante', $data->sexo_representante);
            $stmt->bindParam(':estado_representante', $data->estado_representante);
            $stmt->bindParam(':password', $data->password, PDO::PARAM_LOB);
    
            // Datos de dirección
            $stmt->bindParam(':asentamiento', $data->asentamiento);
            $stmt->bindParam(':calle', $data->calle);
            $stmt->bindParam(':numero_exterior', $data->numero_exterior);
            $stmt->bindParam(':numero_interior', $data->numero_interior);
            $stmt->bindParam(':codigo_postal', $data->codigo_postal);
            $stmt->bindParam(':latitud', $data->latitud);
            $stmt->bindParam(':longitud', $data->longitud);
    
            // Datos de contacto
            $stmt->bindParam(':telefono', $data->telefono);
            $stmt->bindParam(':email', $data->email);
    
            // Ejecutar el procedimiento almacenado
            if ($stmt->execute()) {
                // Recuperar el valor del parámetro de salida
                $result = $this->conn->query("SELECT @new_id_organizacion AS new_id_organizacion");
                $new_id_organizacion = $result->fetch(PDO::FETCH_ASSOC)['new_id_organizacion'];
    
                ob_end_clean(); // Limpia el buffer de salida antes de enviar la respuesta
                sendResponse(201, [
                    "mensaje" => "Datos insertados exitosamente en las tablas relacionadas",
                    "id_organizacion" => $new_id_organizacion
                ]);
            } else {
                ob_end_clean(); // Limpia el buffer
                sendErrorResponse(500, "Error al insertar los datos");
            }
        } catch (PDOException $e) {
            ob_end_clean(); // Limpia el buffer
            sendErrorResponse(500, "Error al insertar datos: " . $e->getMessage());
        }
    }    
}
?>
