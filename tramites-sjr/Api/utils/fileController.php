<?php
class FileController {
    public function CreateUserDir($nombreUsuario) {
        // Limpiar el nombre de usuario para asegurarse de que solo tenga caracteres válidos
        $nombreUsuario = preg_replace('/[^A-Za-z0-9_\-]/','_',$nombreUsuario);

        // Obtener los primeros 3 caracteres del nombre de usuario
        $subname = substr($nombreUsuario, 0, 3);

        // Generar un prefijo único con uniqid()
        $prefix = uniqid($subname . '_');

        // Definir la ruta base
        $ruta_base = "../uploads/usuarios/";
        $ruta = $ruta_base . $prefix . "/";

        // Verificar si el directorio ya existe, si no, crearlo
        if (!is_dir($ruta)) {
            mkdir($ruta, 0777, true); // Crear el directorio con permisos adecuados
        } else {
            // Si el directorio ya existe, asignar null a la ruta
            $ruta = null;
        }

        // Devolver la ruta
        return $ruta;
    }
}

    
?>