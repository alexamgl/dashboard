<?php
include_once __DIR__. '/../config/db.php';
include_once __DIR__. '/../models/UsuarioAud.php';
include_once __DIR__. '/../utils/response.php';

class UsuarioAudController {
    private $db;
    private $usuarioAud;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->usuarioAud = new UsuarioAud($this->db);
    }
    //Metodo para crear el registro de archivo digital
    public function create_exp(){
        
    }
    // Método para crear un registro de auditoría de usuario con carga de múltiples PDFs
    public function create() {
        // Verificar que los datos requeridos estén presentes
        if (!isset($_POST['id_usuario']) || !isset($_FILES['nombre_curp']) || !isset($_FILES['nombre_cdom']) || !isset($_FILES['nombre_actanac']) || !isset($_FILES['nombre_ine'])) {
            sendErrorResponse(400, "Datos incompletos: 'id_usuario', 'nombre_curp' (PDF), 'nombre_cdom' (PDF), 'nombre_actanac' (PDF) y 'nombre_ine' (PDF) son requeridos.");
            return;
        }

        // Directorio de destino para archivos
        $targetDir = "../uploads/";
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0777, true); // Crear la carpeta si no existe
        }

        // Función auxiliar para guardar archivos y devolver la ruta
        function saveFile($file, $targetDir) {
            $fileName = uniqid() . "_" . basename($file['name']);
            $targetFilePath = $targetDir . $fileName;
            if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
                return $targetFilePath;
            }
            return null;
        }

        // Guardar cada archivo y obtener su ruta
        $curpPath = saveFile($_FILES['nombre_curp'], $targetDir);
        $cdomPath = saveFile($_FILES['nombre_cdom'], $targetDir);
        $actanacPath = saveFile($_FILES['nombre_actanac'], $targetDir);
        $inePath = saveFile($_FILES['nombre_ine'], $targetDir);

        // Verificar si todos los archivos se guardaron correctamente
        if ($curpPath && $cdomPath && $actanacPath && $inePath) {
            // Asignar los datos al modelo
            $this->usuarioAud->id_usuario = $_POST['id_usuario'];
            $this->usuarioAud->nombre_curp = $curpPath;
            $this->usuarioAud->nombre_cdom = $cdomPath;
            $this->usuarioAud->nombre_actanac = $actanacPath;
            $this->usuarioAud->nombre_ine = $inePath;

            // Crear el registro en la base de datos
            if ($this->usuarioAud->create()) {
                sendResponse(201, ["mensaje" => "Registro de auditoría de usuario creado exitosamente"]);
            } else {
                sendErrorResponse(500, "Error al crear registro de auditoría de usuario.");
            }
        } else {
            sendErrorResponse(500, "Error al guardar los archivos.");
        }
    }

    // Método para leer todos los registros de auditoría de usuarios
    public function read() {
        $stmt = $this->usuarioAud->read();
        $auditorias = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendResponse(200, $auditorias);
    }

    // Método para actualizar un registro de auditoría de usuario
    public function update($data) {
        if (!isset($data->id_control)) {
            sendErrorResponse(400, "ID de control es requerido para actualizar.");
            return;
        }

        // Asignar datos al modelo
        $this->usuarioAud->id_control = $data->id_control;
        $this->usuarioAud->nombre_curp = $data->nombre_curp ?? null;
        $this->usuarioAud->nombre_cdom = $data->nombre_cdom ?? null;
        $this->usuarioAud->nombre_actanac = $data->nombre_actanac ?? null;
        $this->usuarioAud->nombre_ine = $data->nombre_ine ?? null;

        // Actualizar en la base de datos
        if ($this->usuarioAud->update()) {
            sendResponse(200, ["mensaje" => "Registro de auditoría de usuario actualizado correctamente"]);
        } else {
            sendErrorResponse(500, "Error al actualizar registro de auditoría de usuario.");
        }
    }

    // Método para eliminar un registro de auditoría de usuario
    public function delete($id_control) {
        $this->usuarioAud->id_control = $id_control;

        // Eliminar el registro de la base de datos
        if ($this->usuarioAud->delete()) {
            sendResponse(200, ["mensaje" => "Registro de auditoría de usuario eliminado correctamente"]);
        } else {
            sendErrorResponse(500, "Error al eliminar registro de auditoría de usuario.");
        }
    }
}
?>
