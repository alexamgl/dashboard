<?php
$password = "H1dV1c**P";
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

echo $hashedPassword;
?>
