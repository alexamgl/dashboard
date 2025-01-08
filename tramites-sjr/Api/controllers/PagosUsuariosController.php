<?php

class PagosUsuariosController{

    public function pagos(){
        sendResponse(201, ["mensaje" => "Pago realizado con exito"]);
    }
    
}
?>