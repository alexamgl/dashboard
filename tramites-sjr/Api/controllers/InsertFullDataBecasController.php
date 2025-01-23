<?php
require_once DOC_ROOT_PATH . 'tramites-sjr/Api/config/db.php';
require_once DOC_ROOT_PATH . 'tramites-sjr/Api/utils/response.php';
require_once DOC_ROOT_PATH . 'tramites-sjr/Api/utils/fileController.php';


class InsertFullDataBecasController {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function Create($data) {
        // Inicia un buffer de salida para prevenir salidas no deseadas
        ob_start();
    
        try {
            // Configurar la variable de salida en MySQL
          
    
            // Preparar la llamada al procedimiento almacenado
            $query = "CALL insert_user(
                :nombre,
                :primer_apellido,
                :segundo_apellido,
                :curp_usuario,
                :nombre_completo,
                :fecha_nacimiento,
                :password,
                :carpeta_raiz,
                :acepto_terminos_condiciones,
                :tipo_asentamiento,
                :asentamiento,
                :calle,
                :numero_exterior,
                :numero_interior,
                :codigo_postal,
                :latitud,
                :longitud,
                :telefono,
                :email,
                :tipo_telefono
            )";
    
            $stmt = $this->conn->prepare($query);
    
            // Vincular parámetros de entrada
            $stmt->bindParam(':nombre', $data->nombre);
            $stmt->bindParam(':primer_apellido', $data->primer_apellido);
            $stmt->bindParam(':segundo_apellido', $data->segundo_apellido);
            $stmt->bindParam(':curp_usuario', $data->curp_usuario);
            $stmt->bindParam(':nombre_completo', $data->nombre_completo);
            $stmt->bindParam(':fecha_nacimiento', $data->fecha_nacimiento);
            $stmt->bindParam(':password', $data->password, PDO::PARAM_LOB);
            $stmt->bindParam(':acepto_terminos_condiciones', $data->acepto_terminos_condiciones, PDO::PARAM_INT);
    
            // Datos de dirección
            $stmt->bindParam(':tipo_asentamiento', $data->tipo_asentamiento);
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
            $stmt->bindParam(':tipo_telefono', $data->tipo_telefono, PDO::PARAM_INT);
    
            // Ejecutar el procedimiento almacenado
            if ($stmt->execute()) {
                // Recuperar el valor del parámetro de salida
                
    
                ob_end_clean(); // Limpia el buffer de salida antes de enviar la respuesta
                sendResponse(201, [
                    "mensaje" => "Datos insertados exitosamente en las tablas relacionadas",
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
