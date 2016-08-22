<?php

namespace Fuel\Tasks;

class send_mail_results
{
    public static function run($args = null)
    {

        try {
            \Additional_Log::info('【SEND MAIL RESULT BATCH】:START');
            // 処理対象インターバル取得 ※指定が無い場合は1日以上前のレコードを対象に処理を行います。(※ php oil r send_mail_results -t=XX)
            $interval = \Cli::option('t');
            if(!isset($interval)){
                $interval = 1;
            }

            // レピカ配信状況未確認の最古レコード取得
            $delivery_info = \Model_Delivery::getUnCheckedRecord($interval);

            if(!empty($delivery_info)){
                \DB::start_transaction(MASTER);

                // レピカ配信確認状況を"確認中”へ変更
                \Model_Delivery::updateRepicaInfo($delivery_info["id"],null, DELIVERY_REPICA_STATUS_CHECKING);

                // レピカ確認XML生成
                // deliveryモデルに情報設定
                $mail_delivery = new \Model_Mail_Delivery("1");
                $mail_delivery->repica_deliver_id = $delivery_info->repica_deliver_id;
                \Additional_Log::info('【SEND MAIL RESULT BATCH】:SET DATA ON MODEL');

                // レピカ確認処理
                $client = new \GuzzleHttp\Client(['base_uri' => \Config::get('repeater.mail_service_url')]);
                $response = null;
                try {
                    $response = $client->post(\Config::get('repeater.mail_service.url'), [
                        'headers' => ['Content-Type' => 'application/octet-stream'],
                        'body' => $mail_delivery->to_result_xml()
                    ]);
                } catch (\RequestException $e) {
                    throw new \ProtocolException(\Lang::get('delivery_fail_to_send_mail_request'), "Failure request send mail.", \ProtocolException::RESULT_CODE_DELIVERY_FAIL_TO_SEND_REQUEST);
                }
                \Additional_Log::info('【SEND MAIL RESULT BATCH】:GET MAIL DATA');

                // レピカ確認結果処理
                if ($response->getStatusCode() == 200) {
                    $res_body = (string)$response->getBody();
                    $res_body_parsed = new \SimpleXMLElement($res_body);

                    // 送信対象者処理
                    foreach($res_body_parsed->delivery->sent_list->data as $send_user){
                        //  送信ステータスが正常"0"以外の場合に更新処理実行
                        if($send_user->status != DELIVERY_REPICA_SEND_SUCCESS){
                            // 対象ユーザの配信履歴情報取得
                            $user_info = \Model_Brand_Member::findByMailAddress($delivery_info->brand_id, $send_user->to_addr);
                            foreach($user_info->store_members as $store_member){
                                // 配信対象店舗判定
                                if($delivery_info->store_id = $store_member->store_id){
                                    $param = self::setConditionForMemberDelivery($delivery_info, $store_member);
                                    $member_delivery_history =  \Model_Member_Delivery_History::getSendMailUsers($param);
                                    // 対象店舗の対象ユーザ配信履歴状況を失敗に更新
                                    $member_delivery_history->site_reference = SITE_REFERENCE_DELIVERY_FAILURE;
                                    $member_delivery_history->save();

                                    // TODO 店舗会員のエラー発生用項目更新する
                                }
                            }
                        }
                    }
                } else {
                    // リクエストに失敗
                    throw new \ProtocolException(\Lang::get('delivery_fail_to_send_mail_request'), "Failure request send mail.", \ProtocolException::RESULT_CODE_DELIVERY_FAIL_TO_SEND_REQUEST);
                }
                \Additional_Log::info('【SEND MAIL RESULT BATCH】:GET MAIL RESULT');

                // レピカ配信確認状況を"確認済み”へ変更
                \Model_Delivery::updateRepicaInfo($delivery_info["id"],null, DELIVERY_REPICA_STATUS_CHECKED);
                \Additional_Log::info('【SEND MAIL RESULT BATCH】:UPDATE STATUS[CHECKED]');

                \DB::commit_transaction(MASTER);
            }else{
                \Additional_Log::info('【SEND MAIL RESULT BATCH】:TARGET IS NOT EXIST. SKIP PROCESS.');
            }

            \Additional_Log::info('【SEND MAIL RESULT BATCH】:END');
        } catch (\Exception $e) {
            \Additional_Log::error("【SEND MAIL RESULT BATCH】:ERROR - {$e->getMessage()}");
            \DB::rollback_transaction(MASTER);
            if(!empty($delivery_info)){
                \Model_Delivery::updateRepicaInfo($delivery_info["id"],null, DELIVERY_REPICA_STATUS_ERROR);
            }
            throw $e;
        }
    }

    /**
     * 配信履歴用条件設定
     * @param $delivery_info
     * @param $store_members
     * @return array
     */
    private static function setConditionForMemberDelivery($delivery_info, $store_members){
        $params = array();

        if(!empty($delivery_info->store_id)){
            $params["store_id"] = $delivery_info->store_id;
        }
        if(!empty($delivery_info->id)){
            $params["delivery_id"] = $delivery_info->id;
        }
        if(!empty($store_members->member_id)){
            $params["member_id"] = $store_members->member_id;
        }
        $params["site_reference"] = SITE_REFERENCE_UNREFERENCED;

        return $params;
    }

    /**
     * エラー処理
     * @param $error
     * @throws \ProtocolException
     */
    private static function throwError($error){
        $code = (string)$error[0]->error['code'];
        $message = (string)$error[0]->error;
        throw new \ProtocolException(\Lang::get('delivery_fail_to_send_mail_request')."(#{$code}:#{$message})", "Failure request send mail.", \ProtocolException::RESULT_CODE_DELIVERY_FAIL_TO_SEND_REQUEST);
    }
}