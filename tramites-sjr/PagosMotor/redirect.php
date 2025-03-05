<?php
// Detectar si los datos vienen por GET o POST y asignarlos a variables
$nbResponse = isset($_REQUEST['nbResponse']) ? $_REQUEST['nbResponse'] : '';
$idLiga = isset($_REQUEST['idLiga']) ? $_REQUEST['idLiga'] : '';
$referencia = isset($_REQUEST['referencia']) ? $_REQUEST['referencia'] : '';
$importe = isset($_REQUEST['importe']) ? $_REQUEST['importe'] : '';
$email = isset($_REQUEST['email']) ? $_REQUEST['email'] : '';
$nuAut = isset($_REQUEST['nuAut']) ? $_REQUEST['nuAut'] : '';
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultado del Pago</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
            background-color: #f9f9f9;
            color: #333;
        }
        h1 {
            color: #4CAF50;
        }
        p {
            font-size: 18px;
            margin: 10px 0;
        }
    </style>
</head>
<body onload="window.history.replaceState(null, null, window.location.pathname);">
    <?php if (strcasecmp($nbResponse, "Aprobado") === 0 && !empty($nuAut)) { ?>
        <!-- Lógica en caso de pago aprobado -->
        <h1>¡Gracias por tu compra por <?= htmlspecialchars($importe) ?>!</h1>
        <p>En breve recibirás un correo a <?= htmlspecialchars($email) ?></p>
    <?php } elseif (strcasecmp($nbResponse, "Rechazado") === 0) { ?>
        <!-- Lógica en caso de pago rechazado -->
        <h1>Lo sentimos, tu pago por <?= htmlspecialchars($importe) ?> ha sido rechazado por tu banco.</h1>
        <p>Por favor, intenta nuevamente con otro método de pago.</p>
    <?php } else { ?>
        <!-- Lógica en caso de error o respuesta desconocida -->
        <h1>Lo sentimos, no podemos procesar la respuesta.</h1>
    <?php } ?>
</body>
</html>
