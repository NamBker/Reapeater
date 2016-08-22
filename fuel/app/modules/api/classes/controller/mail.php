<?php

namespace Api;
class Controller_Mail extends \Controller_Api
{
    protected static $required_parameters = array(
        'create' => array(
            'delivery_sender_name' => true,
            'delivery_sender_address' => true,
            'delivery_title' => true,
            'delivery_html_body' => true,
            'delivery_text_body' => true,
            'delivery_send_to_addresses' => true,
            'delivery_store_ids' => true,
        ),
    );

    /**
     * 質問作成
     */
    protected function create()
    {
        \Additional_Log::debug('【DELIVERY CREATE API】:START');

        // ユーザー取得
        $user = \Model_User::find($this->user_id);

        if (USER_AUTHORITY_BRAND < $user->authority) {
            // ブランドユーザー以上の権限のみ
            throw new \ProtocolException(\Lang::get('user_authority_error'), "user does not have authority for operation.", \ProtocolException::RESULT_CODE_USER_OPERATION_AUTHORITY_ERROR);
        }

        $mail_delivery = new \Model_Mail_Delivery("1");
        $mail_delivery->from_name = $this->params['delivery_sender_name'];
        $mail_delivery->from = $this->params['delivery_sender_address'];
        $mail_delivery->subject = $this->params['delivery_title'];
        $mail_delivery->html_body = $this->params['delivery_html_body'];
        $mail_delivery->text_body = $this->params['delivery_text_body'];
        $mail_delivery->targets = $this->params['delivery_send_to_addresses'];
        $mail_delivery->store_ids = $this->params['delivery_store_ids'];
        $mail_delivery->user = $user;

        \Additional_Log::debug("mail 本文");
        \Additional_Log::debug("mail body:" . $mail_delivery->to_xml());

        // 本文作成用データ作成
        $client = new \GuzzleHttp\Client(['base_uri' => \Config::get('repeater.mail_service_url')]);
        $response = null;
        try {
            $response = $client->post(\Config::get('repeater.mail_service.url'), [
                'headers' => ['Content-Type' => 'application/octet-stream'],
                'body' => $mail_delivery->to_xml()
            ]);
        } catch (\RequestException $e) {
            throw new \ProtocolException(\Lang::get('delivery_fail_to_send_mail_request'), "Failure request send mail.", \ProtocolException::RESULT_CODE_DELIVERY_FAIL_TO_SEND_REQUEST);
        }

        if ($response->getStatusCode() == 200) {
            $res_body = (string)$response->getBody();
            $res_body_parsed = new \SimpleXMLElement($res_body);
            if (isset($res_body_parsed->errors)) {
                // エラー
                $code = (string)$res_body_parsed->errors[0]->error['code'];
                $message = (string)$res_body_parsed->errors[0]->error;
                throw new \ProtocolException(\Lang::get('delivery_fail_to_send_mail_request')."(#{$code}:#{$message})", "Failure request send mail.", \ProtocolException::RESULT_CODE_DELIVERY_FAIL_TO_SEND_REQUEST);
            }
        } else {
            // リクエストに失敗
            throw new \ProtocolException(\Lang::get('delivery_fail_to_send_mail_request'), "Failure request send mail.", \ProtocolException::RESULT_CODE_DELIVERY_FAIL_TO_SEND_REQUEST);
        }
        \Additional_Log::debug('【DELIVERY CREATE API】:END');
    }
}

