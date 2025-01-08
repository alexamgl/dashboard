<?php
include_once __DIR__. '/../config/db.php';
include_once __DIR__. '/../models/Usuario.php';
include_once __DIR__. '/../utils/response.php';
include_once __DIR__. '/../utils/fileController.php';

class UsuarioController {
    private $db;
    private $usuario;
    private $fileController;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->usuario = new Usuario($this->db); // Instancia del modelo Usuario
    }

    public function create($data) {
        $directorioUrl = $this->fileController->CreateUserDir($data->nombre);
        if($directorioUrl === null){
            sendErrorResponse(500,"Error al crear el directorio");
            return;
        }
        // Asignación de datos al modelo
        $this->usuario->nombre = $data->nombre ?? null;
        $this->usuario->primer_apellido = $data->primer_apellido ?? null;
        $this->usuario->segundo_apellido = $data->segundo_apellido ?? null;
        $this->usuario->curp_usuario = $data->curp_usuario ?? null;
        $this->usuario->nombre_completo = $data->nombre_completo ?? null;
        $this->usuario->fecha_nacimiento = $data->fecha_nacimiento ?? null;
        $this->usuario->password = password_hash($data->password, PASSWORD_BCRYPT) ?? null;
        $this->usuario->acepto_terminos_condiciones = $data->acepto_terminos_condiciones ?? 0;
        try {
            if ($this->usuario->create()) {
                sendResponse(201, ["mensaje" => "Usuario creado exitosamente"]);
            } else {
                sendErrorResponse(500, "Error al crear usuario.");
            }
        } catch (Exception $e) {
            sendErrorResponse(500, "Error al crear usuario: " . $e->getMessage());
        }
    }

    public function read() {
        $stmt = $this->usuario->read();
        $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendResponse(200, $usuarios);
    }

    public function update($data) {
        // Asignación de datos al modelo
        $this->usuario->id_usuario = $data->id_usuario ?? null;
        $this->usuario->nombre = $data->nombre ?? null;
        $this->usuario->primer_apellido = $data->primer_apellido ?? null;
        $this->usuario->segundo_apellido = $data->segundo_apellido ?? null;
        $this->usuario->curp_usuario = $data->curp_usuario ?? null;
        $this->usuario->nombre_completo = $data->nombre_completo ?? null;
        $this->usuario->fecha_nacimiento = $data->fecha_nacimiento ?? null;
        $this->usuario->password = password_hash($data->password, PASSWORD_BCRYPT) ?? null;
        $this->usuario->acepto_terminos_condiciones = $data->acepto_terminos_condiciones ?? 0;

        try {
            if ($this->usuario->update()) {
                sendResponse(200, ["mensaje" => "Usuario actualizado correctamente"]);
            } else {
                sendErrorResponse(500, "Error al actualizar usuario.");
            }
        } catch (Exception $e) {
            sendErrorResponse(500, "Error al actualizar usuario: " . $e->getMessage());
        }
    }

    public function delete($id_usuario) {
        $this->usuario->id_usuario = $id_usuario;

        try {
            if ($this->usuario->delete()) {
                sendResponse(200, ["mensaje" => "Usuario eliminado correctamente"]);
            } else {
                sendErrorResponse(500, "Error al eliminar usuario.");
            }
        } catch (Exception $e) {
            sendErrorResponse(500, "Error al eliminar usuario: " . $e->getMessage());
        }
    }

    public function verificarCURP($data) {
        $curp = $data->curp ?? null;
    
        if (!$curp) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "La CURP no fue proporcionada."]);
            return;
        }
    
        // Consulta a la base de datos para verificar si la CURP existe
        $query = "SELECT id_usuario FROM usuarios WHERE include_once __DIR__. =/ :curp LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':curp', $curp);
    
        if ($stmt->execute() && $stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(["success" => true, "message" => "CURP ya registrada."]);
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "CURP no encontrada."]);
        }
    }
    
}
?>
