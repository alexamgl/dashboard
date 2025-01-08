<?php
include_once __DIR__. '/../config/db.php';
include_once __DIR__. '/../models/usuarioexp.php';
include_once __DIR__. '/../utils/response.php';

class UsuarioExpController {
private $db;
private $usuarioExp;

public function __construct() {
    $database = new Database();
    $this->db = $database->getConnection();
    $this->usuarioExp = new UsuarioExp($this->db);
}
//Metodo para crear el registro de archivo digital
public function create_exp(){
    
}

public function read() {
    $stmt = $this->usuarioExp->read();
    $usuarioExp = $stmt->fetchAll(PDO::FETCH_ASSOC);
    sendResponse(200, $usuarioExp);
}

public function create() {
    // Verificar que los datos requeridos estén presentes
    if (!isset($_POST['id_usuario']) || !isset($_FILES['nombre_archivo']) || !isset($_POST['descripcion_archivo'])) {
        sendErrorResponse(400, "Datos incompletos: 'id_usuario', 'nombre_archivo', 'descripcion_archivo, son requeridos.");
        return;
    }

    // Directorio de destino para archivos desde la bd
    $id_usuario = $_POST['id_usuario'];
    $query = "SELECT carpeta_raiz FROM usuarios WHERE id_usuario = :id_usuario";
    $stmt = $this->db->prepare($query);
    $stmt->bindParam(':id_usuario',$id_usuario);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ((!$result) || !isset($result['carpeta_raiz'])) {
        sendErrorResponse(404, "Error al obtener el directorio.");
        return;
    }

    // Directorio de destino para archivos
    $targetDir = $result['carpeta_raiz'];
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0777, true); // Crear la carpeta si no existe
    }

    function saveFile($file, $targetDir) {
        $fileName = uniqid() . "_" . basename($file['name']);
        $targetFilePath = $targetDir . $fileName;
        if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
            return $targetFilePath;
        }
        return null;
    }

    // Guardar archivo y obtener su ruta
    $archivoPath = saveFile($_FILES['nombre_archivo'], $targetDir);

    if ($archivoPath) {
        // Asignar los datos al modelo
        $this->usuarioExp->id_usuario = $_POST['id_usuario'];
        $this->usuarioExp->nombre_archivo = $archivoPath;
        $this->usuarioExp->descripcion_archivo = $_POST['descripcion_archivo'];

        // Crear el registro en la base de datos
        if ($this->usuarioExp->create()) {
            sendResponse(201, ["success" => true, "mensaje" => "Registro de auditoría de usuario creado exitosamente"]);
        } else {
            sendErrorResponse(500, ["success" => false, "mensaje" => "Error al crear registro de auditoría de usuario."]);
        }
    } else {
        sendErrorResponse(500, "Error al guardar los archivos.");
    }
    }
}
?>
