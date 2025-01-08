<?php
class PagosTramites {
    private $conn;
    private $table_name = "pagos_tramites";

    public $id_pagoTramites;
    public $homoclave;
    public $id_lugar;
    public $id_usuario;
    public $total_pago; 

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        try {
            $query = "INSERT INTO " . $this->table_name . " SET homoclave=:homoclave, id_lugar=:id_lugar , id_usuario=:id_usuario, total_pago=:total_pago";
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(":homoclave", $this->homoclave);
            $stmt->bindParam(":id_lugar", $this->id_lugar);
            $stmt->bindParam(":id_usuario", $this->id_usuario);
            $stmt->bindParam(":total_pago", $this->total_pago);

            if ($stmt->execute()) {
                return true;
            } else {
                throw new Exception("No se pudo insertar el registro.");
            }
        } catch (PDOException $e) {
            throw new Exception("Error en la base de datos: " . $e->getMessage());
        }
    }

}