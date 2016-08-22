<?php

namespace Fuel\Tasks;

class send_mail
{
    public static function run($args = null)
    {

        try {
            \Additional_Log::info('【SEND MAIL BATCH】:START');

            // 未対応の最古レコード取得
            $delivery_info = \Model_Delivery::getUnExecutedRecord();

            if(!empty($delivery_info)){
                \DB::start_transaction(MASTER);

                \Additional_Log::info('【SEND MAIL BATCH】:DELIVERY ID['.$delivery_info["id"].']');

                // 取得レコードの配信状況を配信中に変更
                \Model_Delivery::updateStatus($delivery_info["id"], DELIVERY_STATUS_DELIVERING);
                \Additional_Log::info('【SEND MAIL BATCH】:UPDATE STATUS[DELIVERING]');

                // 送信対象者習得
                $target_members = array();
                foreach($delivery_info->delivery_stores as  $store){
                    // 組織状況チェック
                    if(!self::checkStatus($store)){
                        \Additional_Log::info('【SEND MAIL BATCH】:SKIP TARGET STORE['.$store->id.']');
                        continue;
                    }

                    $segments_param = json_decode($delivery_info->delivery_segment);
                    // 配信履歴情報設定
                    $send_mail_histories = array();
                    if(!empty($segments_param->lastMailSentDay)){
                        $params = self::setConditionForMemberDelivery($delivery_info, $segments_param);
                        $store_member_histories = \Model_Member_Delivery_History::getLastSendMailUsers($params);
                        foreach($store_member_histories as $member_history){
                            $send_mail_histories[] = $member_history->member_id;
                        }

                        // 送信From日付が存在しない場合はメール未送信ユーザも対象
                        if(empty($segments_param->lastMailSentDay->from)){
                            // 配信履歴情報取得
                            $no_send_history_users  = self::getNoSendHistoryUsers($delivery_info->store_id);
                            foreach($no_send_history_users as $no_send_history_user){
                                $send_mail_histories[] = $no_send_history_user["member_id"];
                            }
                        }
                    }

                    // 配信対象ユーザ取得
                    $store_members = \Model_Store_Member::findActiveMember($store->brand_id, $store->id, $segments_param);


                    foreach($store_members as $member){
                        // 配信履歴情報チェック
                        if(!empty($send_mail_histories) && !(in_array($member->member_id, $send_mail_histories))){
                            continue;
                        }
                        array_push($target_members, $member);
                    }
                }
                \Additional_Log::info('【SEND MAIL BATCH】:SET DESTINATIONS['.count($target_members).']');

                if(!empty($target_members)){
                    // deliveryモデルに情報設定
                    $mail_delivery = new \Model_Mail_Delivery("1");
                    $mail_delivery->store_members = $target_members;
                    $mail_delivery->delivery = $delivery_info;
                    $mail_delivery->is_testmail = false;
                    \Additional_Log::info('【SEND MAIL BATCH】:SET DATA ON MODEL');

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
                    \Additional_Log::info('【SEND MAIL BATCH】:SET MAIL DATA');

                    // 送信処理
                    if ($response->getStatusCode() == 200) {
                        $res_body = (string)$response->getBody();
                        $res_body_parsed = new \SimpleXMLElement($res_body);

                        if (isset($res_body_parsed->errors)) {
                            // エラー
                            self::throwError($res_body_parsed);
                        } else if(isset($res_body_parsed->delivery->errors)){
                            // エラー
                            self::throwError($res_body_parsed->delivery);
                        }else if(isset($res_body_parsed->delivery->deliver_id)){
                            // 正常終了
                            $repica_deliver_id = $res_body_parsed->delivery->deliver_id;
                            // レピカ配信ID登録
                            \Model_Delivery::updateRepicaInfo($delivery_info["id"], $repica_deliver_id);
                        }
                    } else {
                        // リクエストに失敗
                        throw new \ProtocolException(\Lang::get('delivery_fail_to_send_mail_request'), "Failure request send mail.", \ProtocolException::RESULT_CODE_DELIVERY_FAIL_TO_SEND_REQUEST);
                    }
                    \Additional_Log::info('【SEND MAIL BATCH】:SEND MAILS');
                }else{
                    \Additional_Log::info('【SEND MAIL BATCH】:NO SEND MAIL TARGET. SKIP THE PROCESS.');
                }

                // 配信状況を送信済みに変更
                \Model_Delivery::updateStatus($delivery_info["id"], DELIVERY_STATUS_DELIVERED);
                \Additional_Log::info('【SEND MAIL BATCH】:UPDATE STATUS[DELIVERED]');

                \DB::commit_transaction(MASTER);
            }else{
                \Additional_Log::info('【SEND MAIL BATCH】:TARGET IS NOT EXIST. SKIP PROCESS.');
            }

            \Additional_Log::info('【SEND MAIL BATCH】:END');
        } catch (\Exception $e) {
            \Additional_Log::error("【SEND MAIL BATCH】:ERROR - {$e->getMessage()}");
            \DB::rollback_transaction(MASTER);
            \Model_Delivery::updateStatus($delivery_info["id"], DELIVERY_STATUS_ERROR);
            throw $e;
        }
    }

    /**
     * 組織状況チェック
     *   上位組織を含め、"準備中・営業中"状況で無い場合はfalse返却
     * @param $store
     * @return bool
     * @throws \ProtocolException
     */
    private static function checkStatus($store)
    {
        // 店舗状況チェック
        if($store->store_status == STORE_STATUS_DELETE || $store->store_status == STORE_STATUS_CLOSED){
            // 状況が"0:削除"、及び"1:閉店・休店"の場合
            \Additional_Log::info('【SEND MAIL BATCH】:STORE IS NOT ACTIVE[store_id - '.$store->id.' / status - '.$store->store_status.']');
            return false;
        }

        // ブランド状況チェック
        $brand = \Model_Brand::find($store->brand_id);
        if($brand->brand_status == BRAND_STATUS_DELETE || $brand->brand_status == BRAND_STATUS_CLOSED){
            // 状況が"0:削除"、及び"1:閉店・休店"の場合
            \Additional_Log::info('【SEND MAIL BATCH】:BRAND IS NOT ACTIVE[brand_id - '.$brand->id.' / status - '.$brand->brand_status.']');
            return false;
        }

        // 企業状況チェック
        $company = \Model_Company::find($brand->company_id);
        if($company->company_status == COMPANY_STATUS_DELETE || $company->company_status == COMPANY_STATUS_CLOSED){
            // 状況が"0:削除"、及び"1:閉店・休店"の場合
            \Additional_Log::info('【SEND MAIL BATCH】:COMPANY IS NOT ACTIVE[company_id - '.$company->id.' / status - '.$company->company_status.']');
            return false;
        }

        return true;
    }

    /**
     * 配信履歴条件設定
     * @param $delivery_info
     * @param $segments_param
     * @return array
     */
    private static function setConditionForMemberDelivery($delivery_info, $segments_param){
        $params = array();
        if(!empty($delivery_info->store_id)){
            $params["store_id"] = $delivery_info->store_id;
        }
        if(!empty($segments_param->lastMailSentDay->from)){
            $params["lastMailSentDayFrom"] = $segments_param->lastMailSentDay->from;
        }
        if(!empty($segments_param->lastMailSentDay->to)){
            $params["lastMailSentDayTo"] = $segments_param->lastMailSentDay->to;
        }

        return $params;
    }

    /**
     * 店舗会員且つ、対象店舗のメール配信履歴が存在しないユーザIDを取得
     * @param $store_id
     * @return mixed
     */
    private static function getNoSendHistoryUsers($store_id){
        $no_send_history_users = \DB::query(
            'SELECT
                member_id
            FROM
                (
                  SELECT
                    sm.member_id,
                    mdh.delivery_date
                  FROM
                    store_members sm LEFT JOIN member_delivery_histories mdh ON
                      sm.store_id = mdh.store_id
                      AND sm.member_id = mdh.member_id
                      AND sm.store_member_status = 1
                  WHERE
                    sm.store_id=\''.$store_id.'\'
                ) TMP
            WHERE
                TMP.delivery_date is null;
            '
        )->execute();

        return $no_send_history_users;
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