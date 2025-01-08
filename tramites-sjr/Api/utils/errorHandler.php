<?php
function logError($message) {
    error_log($message, 3, '../logs/errors.log'); // Registro de errores en un archivo
}

function handleException($exception) {
    logError($exception->getMessage());
    sendErrorResponse(500, "Error interno del servidor.");
}

set_exception_handler('handleException');
?>
