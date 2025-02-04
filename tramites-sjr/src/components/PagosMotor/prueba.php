<?php
require_once('AESCrypto.php');

$iv = "1234567890123456";      // Usa el mismo IV
$key = "BF4AF2E05BE330F1D46AA39A100996D4"; // Debe ser una clave válida de 32 caracteres hexadecimales
//$cipherText = "";
$cipherText = "t5EOJ8kjfj1nFMhYP8AsgVE2kFhVtEqWl5gV4PWLHpc6Co1k8lunIY7vBjCpZz0i7eEh9EudosWmabcMfdGgWkDqheuhloUg0wr9gq6fG5PMPDesnI9zpf3ERvqWIA23XiwoezdME4IxtSUiiMLIm9z5HqLDMfsb1trzGD5DXqO4oKqzDFunq6P9htWS6mRPJl6jCDQh6a7EerokizJ7Y1YrdfcHDJMbFAYg1lw9MxLVQrCLPBoly+CSEZdjWpR12c/57PbnbzevpJrWNAmKEAwKhDnGtBbvUgr9oE5JpVQDR+AaLjExFZ6tuOvajGeLSQH7AsweUe1Z7HtPbKAukRAGNjn/TeiZMWvMLAA12oAAeyeQtd+stwKl9/Uuv38L+NOH2OjHKZRjuSnDjeHkdEh5/2Cc/LH4hw4ejEiHpf0FR+XrJAHT7jVqFaYQYxp4FgQLGx3Vi+lrrOPKXoKCcc/n8VgaSCVKqeo9fmUev97pfVy2As1cKUNhlBVU7Jnd1KcjcFkzU6oCT31tU7/20Qrocwbl9aeD2VZpHG3FCenVfE9qfUSeq2+0B5ezsTwlzAiWkNcG5NqpvjgtRX9AlpJVTrASwJWJM7UPcaDd7HKwHBRoPwf2RJeNmjVFaiGtPLFV292rFqGay+tMjVp/jpsaOZDCyjewDGrq2hOUJyi4ZzAyWeWarOBB5ZI1HOXAtZnxGbjDXbPFMrwXjnXjiXSX7SdOFGlRU568xmVNTKGX5zqLk1hgjxEUz3I6XvzmdFqH4OF2JTBOBlGXCBW2Fz8EekEc1uJJ7mgFC6f8dag7QE7fL4JD1FToSMcqnk/kLk0Q4Iboi1ckg85wj9EZL6F6zqmSnGWtN8+NEan3iXq3fqCe661FEMqAvDR4p9vkLqXL3NoWP26Dpaovai2RTv4LPkJBK1EyDiPSbm2WAW4HHUi/32w1WbwCe1teCut9Q6gdUdHpvfArq5FH1jYOVe/aY2jT8CbQEOzdXGHmlSiB6VPw3bx9onIN/+R2fsj6npbE2F2RxS9Iu7jsvt81wQjRdPcBLDPEk+cxQ6bH7tHqIAtzVhiVCcYgszuCVPBo";

try {
    $decryptedText = AESCrypto::desencriptar($cipherText, $key);
    echo "Texto desencriptado: " . $decryptedText;
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

?>
