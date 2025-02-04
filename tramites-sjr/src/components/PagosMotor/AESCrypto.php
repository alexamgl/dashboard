<?php

/**
 * @author Mercadotecnia, Ideas y Tecnologia
 * @version 1.1
 * @date 2025/01/28
 * 
 * En php.ini habilitar la línea extension=php_openssl.dll (o equivalente en Linux)
 */

class AESCrypto {

    /**
     * Permite cifrar una cadena a partir de una llave proporcionada
     * @param string $plaintext
     * @param string $key128
     * @return string|false Cadena encriptada o false en caso de error
     */
    public static function encriptar($plaintext, $key128) {
        if (!preg_match('/^[a-fA-F0-9]{32}$/', $key128)) {
            throw new Exception("Error: La clave de encriptación no es válida.");
        }

        $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length('aes-128-cbc'));
        $cipherText = openssl_encrypt($plaintext, 'AES-128-CBC', hex2bin($key128), OPENSSL_RAW_DATA, $iv);

        if ($cipherText === false) {
            throw new Exception("Error: Falló la encriptación.");
        }

        return base64_encode($iv . $cipherText);
    }

    /**
     * Permite descifrar una cadena a partir de una llave proporcionada
     * @param string $encodedInitialData
     * @param string $key128
     * @return string|false Cadena desencriptada o false en caso de error
     */
    public static function desencriptar($encodedInitialData, $key128) {
        if (!preg_match('/^[a-fA-F0-9]{32}$/', $key128)) {
            throw new Exception("Error: La clave de encriptación no es válida.");
        }

        $encodedInitialData = base64_decode($encodedInitialData);
        if ($encodedInitialData === false) {
            throw new Exception("Error: Falló la decodificación base64.");
        }

        $iv = substr($encodedInitialData, 0, 16);
        $cipherText = substr($encodedInitialData, 16);
        $decrypted = openssl_decrypt($cipherText, 'AES-128-CBC', hex2bin($key128), OPENSSL_RAW_DATA, $iv);

        if ($decrypted === false) {
            throw new Exception("Error: Falló la desencriptación.");
        }

        return $decrypted;
    }
}
?>
