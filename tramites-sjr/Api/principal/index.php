<?php
// Definir la constante DOC_ROOT_PATH para evitar repetir $_SERVER['DOCUMENT_ROOT'] en todo el código
define('DOC_ROOT_PATH', $_SERVER['DOCUMENT_ROOT'] . '/');

// Incluir los archivos de configuración y controladores utilizando la constante DOC_ROOT_PATH
require_once '../config/config.php';
//require_once '../src/jwt_helper.php';




// Configuración de CORS y tipo de contenido
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
header("Content-Type: application/json; charset=UTF-8");

// Si la solicitud es de tipo OPTIONS, responder con un 200 OK
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Función para verificar los roles del usuario
function checkRole($requiredRole, $userRole) {
    if ($requiredRole !== $userRole) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Acceso denegado: rol insuficiente"]);
        exit();
    }
}

// Obtener la ruta solicitada
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);
$requestParts = explode('/', trim($path, '/'));
$entity = isset($requestParts[5]) ? $requestParts[5] : null;

$controller = null;

// Verificar si la solicitud es para login
if ($entity === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require DOC_ROOT_PATH . 'tramites-sjr/Api/controllers/auth.php';
    exit();
}

// Obtener el encabezado de autorización
$headers = apache_request_headers();
$authHeader = $headers['Authorization'] ?? '';

// Definir las rutas públicas
$publicRoutes = ['usuario_exp','upload_document','grafica_dependencias','insert_organizacion' ,'update_trabajador_data','insert_full_data', 'insert_full_trabajador_data', 'validar_curp', 'send_otp', 'validate_otp', 
'trabajadores', 'ciudadanos', 'usuario_datos','insert_full_beca_data','upload_documents_beca_data',
'get_datos_becas','insert_full_suelo_data','upload_documents_suelo_data','get_datos_suelo','insert_full_giro_data'
,'get_datos_giro','upload_documents_giro_data','insert_full_visto_data','insert_full_visto_docs',
'insert_full_suelo_docs','insert_full_giro_docs'];

// Verificar el token solo si la ruta no es pública
if (!in_array($entity, $publicRoutes)) {
    if ($authHeader) {
        list($bearer, $token) = explode(" ", $authHeader, 5);
        $userData = validateJWT($token);

        if (!$userData) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Token inválido o expirado"]);
            exit();
        }
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Token no proporcionado"]);
        exit();
    }

    // Definir los permisos de rol
    $rolePermissions = [    
        'admin' => ['usuarios', 'tramites', 'usuarios_cuentas','pagos_tramites'],
        'trabajador' => ['tramites', 'areas_responsables','pagos_tramites'],
        'ciudadano' => ['tramites', 'areas_responsables','pagos_tramites'],
    ];

    $userRole = $userData['role'] ?? 'ciudadano';

    // Verificar los permisos de rol
    if (!in_array($entity, $rolePermissions[$userRole])) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Acceso denegado: rol insuficiente para esta acción"]);
        exit();
    }
}

// Instanciar el controlador correspondiente según la entidad
if ($entity === 'usuarios') {
    $controller = new UsuarioController();
} elseif ($entity === 'usuarios_cuentas') {
    $controller = new UsuarioCuentaController();
} elseif ($entity === 'tramites_usuarios') {
    $controller = new TramiteUsuarioController();
} elseif ($entity === 'tramite_descripcion') {
    $controller = new TramiteDescripcionController();
} elseif ($entity === 'usuario_direccion') {
    $controller = new UsuarioDireccionController();
} elseif ($entity === 'usuarios_contactos') {
    $controller = new UsuarioContactoController();
} elseif ($entity === 'tramites_precios') {
    $controller = new TramitePrecioController();
} elseif ($entity === 'usuario_aud') {
    $controller = new UsuarioAudController();
} elseif ($entity === 'insert_full_data') {  
    $controller = new InsertFullDataController();
}elseif ($entity === 'insert_organizacion') {
    $controller = new InsertOrganizacionController();
}elseif ($entity === 'insert_full_trabajador_data') {  
    $controller = new InsertFullDataTrabajadorController();
}elseif($entity === 'pagos'){
    $controller = new PagosUsuariosController();
}elseif($entity === 'tramites'){
    $controller = new TramiteController();
}elseif($entity === 'tramites_usuarios'){
    $controller = new TramiteUsuarioController();
}elseif($entity === 'tramite_paquetes'){
    $controller = new TramitePaquetesController();
}elseif($entity === 'areas_responsables'){
    $controller = new AreasController();
}elseif($entity === 'trabajadores'){
    $controller = new TrabajadorController();
}elseif($entity === 'ciudadanos'){
    $controller = new CiudadanoController();
}elseif($entity === 'grafica_dependencias'){
    $controller = new GraficaDependenciasController();
}elseif($entity === 'usuario_exp'){
    $controller = new UsuarioExpController();
}elseif($entity === 'pagos_tramites'){
    $controller = new PagosTramitesController();
}elseif($entity === 'update_trabajador_data'){
    $controller = new UpdateFullDataTrabajadorController();
}elseif ($entity === 'validar_curp') {
    $controller = new ValidaCurpController();
}elseif ($entity === 'insert_full_beca_data') {
    require_once '../controllers/InsertFullDataBecaController.php';
    $controller = new InsertFullDataBecaController();

}elseif ($entity === 'insert_full_suelo_data') {
    require_once '../controllers/InsertFullDataSueloController.php';
    $controller = new InsertFullDataSueloController();

}elseif ($entity === 'insert_full_giro_data') {
    require_once '../controllers/InsertFullDataGiroController.php';
    $controller = new InsertFullDataGiroController();

}elseif ($entity === 'insert_full_visto_data') {
    require_once '../controllers/InsertFullDataVistoBuenoController.php';
    $controller = new InsertFullDataVistoBuenoController();
   
}elseif ($entity === 'insert_full_visto_docs') {
    require_once '../controllers/InsertFullDocsVistoBuenoController.php';
    $controller = new InsertFullDocsVistoBuenoController();

}elseif ($entity === 'insert_full_giro_docs') {
    require_once '../controllers/InsertFullDocsGiroController.php';
    $controller = new InsertFullDocsGiroController();

}elseif ($entity === 'insert_full_suelo_docs') {
    require_once '../controllers/InsertFullDocsSueloController.php';
    $controller = new InsertFullDocsSueloController();

}elseif ($entity === 'upload_documents_suelo_data') {
    require_once '../controllers/UploadDocumentsSueloController.php';
    $controller = new UploadDocumentsSueloController();
    $controller -> uploadDocumentsSuelo($_POST);
    exit();

}elseif ($entity === 'upload_documents_giro_data') {
    require_once '../controllers/UploadDocumentsGiroController.php';
    $controller = new UploadDocumentsGiroController();
    $controller -> uploadDocumentsGiro($_POST);
    exit();

}elseif ($entity === 'get_datos_becas' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once '../controllers/GetDatosBecaController.php';
    $controller = new GetDatosBecaController();
    $data = json_decode(file_get_contents("php://input"));
    $controller->read($data);
    exit();

}elseif ($entity === 'get_datos_suelo' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once '../controllers/GetDatosSueloController.php';
    $controller = new GetDatosSueloController();
    $data = json_decode(file_get_contents("php://input"));
    $controller->read($data);
    exit();
    
}elseif ($entity === 'get_datos_giro' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once '../controllers/GetDatosGiroController.php';
    $controller = new GetDatosGiroController();
    $data = json_decode(file_get_contents("php://input"));
    $controller->read($data);
    exit();

    
    
   /* $data = json_decode(file_get_contents("php://input"));

    // Llama al método adecuado, en este caso 'create'
    $controller->create($data); // Aquí usas el método 'create' porque 'read()' no está definido
    exit();*/
}else // Nuevo caso para la ruta send_otp
if ($entity === 'send_otp' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once DOC_ROOT_PATH . 'sanjuandelrio.gob.mx/tramites-sjr/Api/controllers/OtpController.php';
    $controller = new OtpController();

    // Obtener los datos del cuerpo de la solicitud (número de teléfono y mensaje)
    $data = json_decode(file_get_contents("php://input"));

    // Llamar al método para enviar el OTP
    $controller->sendOtp($data);
    exit();
}elseif ($entity === 'validate_otp' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once DOC_ROOT_PATH . 'sanjuandelrio.gob.mx/tramites-sjr/Api/controllers/OtpController.php';
    $controller = new OtpController();

    // Obtener los datos del cuerpo de la solicitud (número de teléfono y OTP)
    $data = json_decode(file_get_contents("php://input"));

    // Llamar al método para validar el OTP
    $controller->validateOtp($data);
    exit();
}elseif ($entity === 'usuario_datos' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once DOC_ROOT_PATH . 'tramites-sjr/Api/controllers/UsuarioDatosController.php';
    $controller = new UsuarioDatosController();
    $controller->getUsuarioDatos();
    exit();
}elseif($entity === 'upload_document') {
    require_once DOC_ROOT_PATH . 'tramites-sjr/Api/controllers/UploadDocumentController.php';
    $controller = new UploadDocumentController();
    $controller->upload($_POST); // Pasar datos del formulario
    exit();
}


// Ejecuta el método en el controlador correspondiente
// definir método http y datos recibidos
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));

// manejar solicitudes según el método http
switch ($method) {
    case 'POST':
        if (method_exists($controller, 'create')) {
            $controller->create($data);
        } else {
            echo json_encode(["error" => "El método 'create' no está definido en este controlador."]);
        }
        break;
    case 'GET':
        if (method_exists($controller, 'read')) {
            $controller->read($data);
        } else {
            echo json_encode(["error" => "El método 'read' no está definido en este controlador."]);
        }
        break;
    case 'PUT':
        if (method_exists($controller, 'update')) {
            $controller->update($data);
        } else {
            echo json_encode(["error" => "El método 'update' no está definido en este controlador."]);
        }
        break;
    case 'DELETE':
        if (method_exists($controller, 'delete')) {
            $controller->delete($data);
        } else {
            echo json_encode(["error" => "El método 'delete' no está definido en este controlador."]);
        }
        break;
    default:
        echo json_encode(["error" => "Método no permitido"]);
        break;
}


?>
