<?php
include_once '../config/db.php';
include_once '../utils/response.php';


class InsertFullDataBecaController {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }
            
    public function Create($data) {
        
        // Inicia un buffer de salida para prevenir salidas no deseadas
        ob_start();
    
        try {
            // Preparar la llamada al procedimiento almacenado
            $query = "CALL insert_beca_info(
                :id_usuario,
                :ubicacion_tramite_beca,
                :primer_apellido_estudiante,
                :segundo_apellido_estudiante,
                :nombre_estudiante,
                :lugar_nac_estudiante,
                :fec_nac_estudiante,
                :calle_dom_estudiante,
                :num_dom_estudiante,
                :col_dom_estudiante,
                :mun_dom_estudiante,
                :tel_dom_estudiante,
                :curp_estudiante,
                :calle_inst,
                :num_inst,
                :colonia_inst,
                :municipio_inst,
                :nombre_inst,
                :promedio_estudiante,
                :ape_paterno_tutor,
                :ape_materno_tutor,
                :nombre_tutor_estudiante,
                :ocupacion_tutor_estudiante,
                :num_habitan_beca,
                :num_personas_aportan,
                :ingreso_mensual_familiar,
                :protesta_ingreso_beca
            )";

            $stmt = $this->conn->prepare($query);
            
             // Mapear los valores del frontend a los nombres de la base de datos
    $stmt->bindParam(':id_usuario', $data->id_usuario);
    $stmt->bindParam(':ubicacion_tramite_beca', $data->ubicacion_tramite_beca);
    $stmt->bindParam(':primer_apellido_estudiante', $data->primer_apellido_estudiante);
    $stmt->bindParam(':segundo_apellido_estudiante', $data->segundo_apellido_estudiante);
    $stmt->bindParam(':nombre_estudiante', $data->nombre_estudiante);
    $stmt->bindParam(':lugar_nac_estudiante', $data->lugar_nac_estudiante);
    $stmt->bindParam(':fec_nac_estudiante', $data->fec_nac_estudiante);
    $stmt->bindParam(':calle_dom_estudiante', $data->calle_dom_estudiante);
    $stmt->bindParam(':num_dom_estudiante', $data->num_dom_estudiante);
    $stmt->bindParam(':col_dom_estudiante', $data->col_dom_estudiante);
    $stmt->bindParam(':mun_dom_estudiante', $data->mun_dom_estudiante);
    $stmt->bindParam(':tel_dom_estudiante', $data->tel_dom_estudiante);
    $stmt->bindParam(':curp_estudiante', $data->curp_estudiante);
    $stmt->bindParam(':calle_inst', $data->calle_inst);
    $stmt->bindParam(':num_inst', $data->num_inst);
    $stmt->bindParam(':colonia_inst', $data->colonia_inst);
    $stmt->bindParam(':municipio_inst', $data->municipio_inst);
    $stmt->bindParam(':nombre_inst', var: $data->nombre_inst);
    $stmt->bindParam(':promedio_estudiante', $data->promedio_estudiante);
    $stmt->bindParam(':ape_paterno_tutor', $data->ape_paterno_tutor);
    $stmt->bindParam(':ape_materno_tutor', $data->ape_materno_tutor);
    $stmt->bindParam(':nombre_tutor_estudiante', $data->nombre_tutor_estudiante);
    $stmt->bindParam(':ocupacion_tutor_estudiante', $data->ocupacion_tutor_estudiante);
    $stmt->bindParam(':num_habitan_beca', $data->num_habitan_beca);
    $stmt->bindParam(':num_personas_aportan', $data->num_personas_aportan);
    $stmt->bindParam(':ingreso_mensual_familiar', $data->ingreso_mensual_familiar);
    $stmt->bindParam(':protesta_ingreso_beca', $data->protesta_ingreso_beca);
            
            // Ejecutar el procedimiento almacenado
            if ($stmt->execute()) {
                ob_end_clean(); // Limpia el buffer de salida antes de enviar la respuesta
                sendResponse(201, [
                    "mensaje" => "Datos insertados exitosamente en las tablas relacionadas"
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