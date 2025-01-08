<?php

class OtpController {

    public function sendOtp($data) {
        if (empty($data->phone_number) || empty($data->message)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Número de teléfono y mensaje son requeridos."]);
            return;
        }

        $auth_basic = base64_encode("myUsrname:myToken"); // Reemplaza con tus credenciales correctas

        $curl = curl_init();
        $url = 'https://api.labsmobile.com/otp/sendCode'; // URL de la API de LabsMobile

        $data = array(
            'env' => 'verifApp',  // Ajusta según tu entorno
            'sender' => 'MyBRAND',  // Ajusta el remitente
            'phone_number' => $data->phone_number,  // Número de teléfono del destinatario
            'message' => $data->message,  // El mensaje que se enviará
        );

        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query($data),
            CURLOPT_HTTPHEADER => array(
                'Authorization: Basic ' . $auth_basic
            ),
        ));

        $response = curl_exec($curl);

        if (curl_errno($curl)) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Error al enviar OTP: " . curl_error($curl)]);
        } else {
            $response_data = json_decode($response, true);
            if (isset($response_data['code']) && $response_data['code'] == '200') {
                echo json_encode(["success" => true, "message" => "OTP enviado correctamente."]);
            } else {
                echo json_encode(["success" => false, "message" => "Error en la respuesta de la API: " . $response_data['message']]);
            }
        }

        curl_close($curl);
    }

    // Método para validar el OTP
    public function validateOtp($data) {
        if (empty($data->phone_number) || empty($data->otp_code)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Número de teléfono y código OTP son requeridos."]);
            return;
        }

        $auth_basic = base64_encode("myUsrname:myToken"); // Reemplaza con tus credenciales correctas

        $curl = curl_init();
        $url = 'https://api.labsmobile.com/otp/verifyCode';  // URL de la API para verificar el OTP

        $data = array(
            'env' => 'verifApp',  // Ajusta según tu entorno
            'phone_number' => $data->phone_number,  // Número de teléfono del destinatario
            'otp_code' => $data->otp_code,  // Código OTP proporcionado por el usuario
        );

        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query($data),
            CURLOPT_HTTPHEADER => array(
                'Authorization: Basic ' . $auth_basic
            ),
        ));

        $response = curl_exec($curl);

        if (curl_errno($curl)) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Error al verificar OTP: " . curl_error($curl)]);
        } else {
            $response_data = json_decode($response, true);
            if (isset($response_data['code']) && $response_data['code'] == '200') {
                echo json_encode(["success" => true, "message" => "OTP verificado correctamente."]);
            } else {
                echo json_encode(["success" => false, "message" => "Código OTP inválido."]);
            }
        }

        curl_close($curl);
    }
}
