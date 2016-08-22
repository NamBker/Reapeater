<?php

class Model_Mail_Delivery
{
    // private properties
    private $id;
    // parameters
    private $parameters;
    // 権限チェック用
    private $company_id = 0;
    private $brand_id = 0;
    private $section_id = 0;
    private $store_id = 0;

    // サービス全体にユニークな値
    public $request_id;
    // 送信予定時刻(YYYY/MM/DD HH:MI) - 即時送信の場合は「now」を設定
    public $send_date = 'now';
    // trueの別途サイン用の証明書の設定が必要
    public $s_mime = false;
    // 送信者名
    public $from_name;
    // 送信者アドレス
    public $from;
    // 件名
    public $subject;
    // メール本文（HTML）
    public $html_body;
    // メール本文（Text）
    public $text_body;
    // テスト送信かどうか
    public $is_testmail = true;
    // 送信ユーザー - テスト送信専用
    public $user;
    // 送信先店舗 - テスト送信専用
    public $store_ids = array();
    // 送信先ユーザー - テスト送信専用
    public $targets = array();
    // 送信先ユーザー - メール配信用
    public $store_members = array();
    // 配信ID - メール配信用
    public $delivery = null;
    // レピカ配信ID
    public $repica_deliver_id = null;

    function __construct($id)
    {
        $this->id = $id;
    }

    public function to_xml()
    {
        $stores = array();
        $delivery_histories = array();

        if ($this->is_testmail) {
            if (empty($this->user)) {
                return null;
            }
            switch($this->user->authority) {
            case USER_AUTHORITY_STORE:
                $this->store_id = $this->user->store_id;
            case USER_AUTHORITY_SECTION:
                $this->section_id = $this->user->section_id;
            case USER_AUTHORITY_BRAND:
                $this->brand_id = $this->user->brand_id;
            case USER_AUTHORITY_COMPANY:
                $this->company_id = $this->user->company_id;
            }
            $store = \Model_Store::findById(reset($this->store_ids));
            if (empty($store)) {
                return null;
            }
            $stores[] = $store;
            foreach ($this->targets as $target) {
                // テスト送信は配信データがない
                $delivery_history = \Model_Member_Delivery_History::forge();
                $delivery_history->random_key = uniqid();
                $delivery_history->delivery_date = date('Y-m-d');
                $delivery_history->delivery_id = 0;
                $delivery_history->member_id = 0;
                $delivery_history->store = $store;
                $delivery_history->site_reference = SITE_REFERENCE_UNREFERENCED;
                $delivery_history->test_address = $target;
                $delivery_history->save();
                $delivery_histories[] = $delivery_history;
            }
        } else {
            if (empty($this->delivery)) {
                return null;
            }
            $this->company_id = $this->delivery->company_id;
            $this->brand_id = $this->delivery->brand_id;
            //$this->section_id = $this->delivery->section_id;
            $this->store_id = $this->delivery->store_id;
            $this->from_name = $this->delivery->delivery_sender_name;
            $this->from = $this->delivery->delivery_sender_address;
            $this->subject = $this->delivery->delivery_title;
            $this->html_body = $this->delivery->delivery_html_body;
            $this->text_body = $this->delivery->delivery_text_body;

            $store_ids = array();
            foreach ($this->store_members as $store_member) {
                $delivery_history = \Model_Member_Delivery_History::forge();
                $delivery_history->random_key = uniqid();
                $delivery_history->delivery_date = date('Y-m-d');
                $delivery_history->delivery = $this->delivery;
                $delivery_history->member_id = $store_member->member_id;
                $delivery_history->store = $store_member->store;
                $delivery_history->site_reference = SITE_REFERENCE_UNREFERENCED;
                $delivery_history->save();
                $delivery_histories[] = $delivery_history;
                if (!in_array($store_member->store->id, $store_ids)) {
                    $stores[] = $store_member->store;
                    $store_ids[] = $store_member->store->id;
                }
            }
        }

        $xml_data = array();
        $xml_data['auth'] = $this->getAuth();
        $xml_data['delivery'] = $this->getDelivery($stores, $delivery_histories);

        return \Array2XML::createXML('mail', $xml_data)->saveXML();
    }

    /**
     * 配信結果取得用xml生成
     * @return string
     */
    public function to_result_xml()
    {
        $xml_data = array();
        $xml_data['auth'] = $this->getAuth();

        $res = array();
        $res['@attributes'] = array('id' => "1");
        $res['action'] = 'get_result';
        $res['deliver_id'] = $this->repica_deliver_id;
        $xml_data['delivery'] = $res;

        return \Array2XML::createXML('mail', $xml_data)->saveXML();
    }

    private function getAuth()
    {
        $res = array();
        $res['site'] = array(
            '@attributes' => array(
                'id' => \Config::get('repeater.mail_service.account.site_id'),
            ),
        );
        $res['service'] = array(
            '@attributes' => array(
                'id' => \Config::get('repeater.mail_service.account.service_id'),
            ),
        );
        $res['name'] = array('@cdata' => \Config::get('repeater.mail_service.account.name'));
        $res['pass'] = array('@cdata' => \Config::get('repeater.mail_service.account.password'));
        return $res;
    }

    private function getDelivery($stores, $delivery_histories)
    {
        $scheme = \Config::get('repeater.server_apps.api_server.scheme');
        $host = \Config::get('repeater.server_apps.api_server.host');
        $version = \Config::get('repeater.server_apps.api_server.version');

        $this->parameters = array('int' => array(), 'ext' => array());

        // 開封チェック用タグ追加
        $html_body_custom = str_replace("</body>", "<img src='{$scheme}://{$host}/{$version}/access?key=##int_txt_4##'/></body>", $this->html_body);

        $html_body = $this->replaceParameters($html_body_custom, true);
        $text_body = $this->replaceParameters($this->text_body, false);
        // 重複排除
        $this->parameters['ext'] = array_unique($this->parameters['ext']);
        foreach($this->parameters['int'] as $type => $values) {
            $this->parameters['int'][$type] = array_unique($values);
        }
        $res = array();
        $res['@attributes'] = array('id' => "1");
        $res['action'] = 'reserve';
        $res['request_id'] = uniqid();
        $res['setting'] = array(
            'send_date' => 'now',
            'from_name' => array('@cdata' => $this->from_name),
            'from' => $this->from,
            's_mime' => array(
                '@attributes' => array(
                    'use' => '0',
                ),
            ),
        );
        $res['contents'] = $this->getStoreParams($stores);
        $res['contents']['subject'] = array('@cdata' => $this->subject);
        $res['contents']['body'] = array(
            array(
                '@attributes' => array(
                    'part' => 'html',
                ),
                '@value' => array('@cdata' => $html_body),
            ),
            array(
                '@attributes' => array(
                    'part' => 'text',
                ),
                '@value' => array('@cdata' => $text_body),
            ),
        );
        $res['send_list'] = $this->getSendList($delivery_histories);
        return $res;
    }

    private function getStoreParams($stores)
    {
        $scheme = \Config::get('repeater.server_apps.web_server.scheme');
        $host = \Config::get('repeater.server_apps.web_server.host');
        $res = array();
        foreach($stores as $store) {
            if (empty($store->brand)) {
                continue;
            }
            $brand = $store->brand;
            if (in_array(1, $this->parameters['ext'])) {
                // ブランド名
                $res['text'][] = array(
                    '@attributes' => array(
                        'id' => '1'.$store->id,
                    ),
                    '@value' => array('@cdata' => $brand->brand_name),
                );
            }
            if (in_array(2, $this->parameters['ext'])) {
                // 店舗名
                $res['text'][] = array(
                    '@attributes' => array(
                        'id' => '2'.$store->id,
                    ),
                    '@value' => array('@cdata' => $store->store_name),
                );
            }
            if (in_array(3, $this->parameters['ext'])) {
                // 店長名
                $res['text'][] = array(
                    '@attributes' => array(
                        'id' => '3'.$store->id,
                    ),
                    '@value' => array('@cdata' => $store->store_manager_name),
                );
            }
            if (in_array(4, $this->parameters['ext'])) {
                // 店舗電話番号
                $res['text'][] = array(
                    '@attributes' => array(
                        'id' => '4'.$store->id,
                    ),
                    '@value' => array('@cdata' => $store->store_phone_no),
                );
            }
            if (in_array(5, $this->parameters['ext'])) {
                // baseUrl
                $baseUrl = '';
                if ($brand->brand_domain) {
//                    $baseUrl = "{$scheme}://{$brand->brand_domain}/b";
                    $baseUrl = "http://{$brand->brand_domain}";
                } else {
                    $baseUrl = "{$scheme}://{$host}/{$brand->company_id}/{$brand->brand_code}/b";
//                    $baseUrl = "{$scheme}://{$host}";
                }
                $res['text'][] = array(
                    '@attributes' => array(
                        'id' => '5'.$store->id,
                    ),
                    '@value' => array('@cdata' => $baseUrl),
                );
            }
        }
        return $res;
    }

    private function getSendList($delivery_histories)
    {
        $res = array();
        $send_index = 1;
        foreach ($delivery_histories as $delivery_history) {
            $mail_address = null;
            if ($this->is_testmail) {
                $mail_address = $delivery_history->test_address;
            } else {
                if (empty($delivery_history->store_member)) {
                    continue;
                }
                $mail_address = $delivery_history->store_member->brand_member->mail_address;
            }
            $res['data'][] = array(
                '@attributes' => array(
                    'id' => $send_index,
                ),
                'address' => array(
                    '@attributes' => array(
                        'device' => '0',    // 指定なし
                    ),
                    '@value' => $mail_address,
                ),
                'int_txt' => $this->getUrlParamsForMember($delivery_history),
                'ext_txt' => $this->getStoreParamsForMember($delivery_history->store),
            );
            $send_index++;
        }
        return $res;
    }

    private function getStoreParamsForMember($store)
    {
        $res = array();
        if (in_array(1, $this->parameters['ext'])) {
            // ブランド名
            if (empty($store->brand)) {
                return array();
            }
            $res[] = array(
                '@attributes' => array(
                    'id' => '1',
                ),
                '@value' => '1'.$store->id,
            );
        }
        if (in_array(2, $this->parameters['ext'])) {
            // 店舗名
            $res[] = array(
                '@attributes' => array(
                    'id' => '2'
                ),
                '@value' => '2'.$store->id,
            );
        }
        if (in_array(3, $this->parameters['ext'])) {
            // 店長名
            $res[] = array(
                '@attributes' => array(
                    'id' => '3',
                ),
                '@value' => '3'.$store->id,
            );
        }
        if (in_array(4, $this->parameters['ext'])) {
            // 店舗電話番号
            $res[] = array(
                '@attributes' => array(
                    'id' => '4',
                ),
                '@value' => '4'.$store->id,
            );
        }
        if (in_array(5, $this->parameters['ext'])) {
            $res[] = array(
                '@attributes' => array(
                    'id' => '5',
                ),
                '@value' => '5'.$store->id,
            );
        }
        return $res;
    }

    private function getUrlParamsForMember($delivery_history)
    {
        $res = array();
        if (isset($this->parameters['int'][1])) {
            // クーポン
            foreach($this->parameters['int'][1] as $coupon_id) {
                $coupon = $this->getCouponById($coupon_id);
                if (!$coupon) {
                    continue;
                }
                $member_coupon_history = \Model_Member_Coupon_History::forge();
                $member_coupon_history->coupon = $coupon;
                $member_coupon_history->store_id = $delivery_history->store_id;
                $member_coupon_history->member_id = $delivery_history->member_id;
                $member_coupon_history->deliery_id = $delivery_history->delivery_id;
                $member_coupon_history->member_delivery_history = $delivery_history;
                $member_coupon_history->member_random_coupon_history_id = 0;
                $member_coupon_history->random_key = uniqid();
                $member_coupon_history->save();
                $res[] = array(
                    '@attributes' => array(
                        'id' => '1'.$coupon_id,
                    ),
                    '@value' => $member_coupon_history->random_key,
                );
            }
        }
        if (isset($this->parameters['int'][2])) {
            // ランダムクーポン
            foreach($this->parameters['int'][2] as $random_coupon_id) {
                $random_coupon = $this->getRandomCouponById($random_coupon_id);
                if (!$random_coupon) {
                    continue;
                }
                $member_random_coupon_history = \Model_Member_Random_Coupon_History::forge();
                $member_random_coupon_history->random_coupon = $random_coupon;
                $member_random_coupon_history->store_id = $delivery_history->store_id;
                $member_random_coupon_history->member_id = $delivery_history->member_id;
                $member_random_coupon_history->deliery_id = $delivery_history->delivery_id;
                $member_random_coupon_history->member_delivery_history = $delivery_history;
                $member_random_coupon_history->coupon_id = 0;
                $member_random_coupon_history->random_key = uniqid();
                $member_random_coupon_history->save();
                $res[] = array(
                    '@attributes' => array(
                        'id' => '2'.$random_coupon_id,
                    ),
                    '@value' => $member_random_coupon_history->random_key,
                );
            }
        }
        if (isset($this->parameters['int'][3])) {
            // アンケート
            foreach($this->parameters['int'][3] as $questionnaire_id) {
                $questionnaire = $this->getQuestionnaireById($questionnaire_id);
                if (!$questionnaire) {
                    continue;
                }
                $member_questionnaire_history = \Model_Member_Questionnaire_History::findByMemberIdAndQuestionnaireId($delivery_history->member_id, $questionnaire_id);
                if (!$member_questionnaire_history) {
                    $member_questionnaire_history = \Model_Member_Questionnaire_History::forge();
                    $member_questionnaire_history->questionnaire = $questionnaire;
                    $member_questionnaire_history->member_id = $delivery_history->member_id;
                    $member_questionnaire_history->member_delivery_history = $delivery_history;
                    $member_questionnaire_history->questionnaire_send_date = date('Y-m-d');
                    $member_questionnaire_history->random_key = uniqid();
                    $member_questionnaire_history->save();
                }

                // アンケート公開フラグ更新
                $questionnaire->questionnaire_release_flg = QUESTIONNAIRES_RELEASED;
                $questionnaire->save();
                \Additional_Log::debug('【SEND MAIL BATCH】:UPDATE QUESTIONNAIRES RELEASE FLG [' . $questionnaire->id . ']');
                // 質問公開フラグ更新
                foreach($questionnaire->questionnaire_responds as $respond){
                    \Model_Question::updateUsedFlg($respond->question_id, QUESTION_USED_FLG_RELEASED);
                    \Additional_Log::debug('【SEND MAIL BATCH】:UPDATE QUESTIONS USED FLG [' . $respond->question_id . ']');
                }

                $res[] = array(
                    '@attributes' => array(
                        'id' => '3'.$questionnaire_id,
                    ),
                    '@value' => $member_questionnaire_history->random_key,
                );
            }
        }
        $res[] = array(
            '@attributes' => array(
                'id' => '4',
            ),
            '@value' => $delivery_history->random_key,
        );
        return $res;
    }

    private function replaceParameters($content, $is_html)
    {
        // ext_txt_1: ブランド名
        // ext_txt_2: 店舗名
        // ext_txt_3: 店舗の店長名
        // ext_txt_4: 店舗の電話番号
        // ext_txt_5: BaseUrl
        // int_txt_1xx: クーポン
        // int_txt_2xx: ランダムクーポン
        // int_txt_3xx: アンケート
        $res = preg_replace_callback('/{([a-z][a-z_]+[a-z])((: )([1-9][0-9]*)){0,1}}/m',
            function($matches) use ($is_html) {
                if (count($matches) < 2) {
                    return "";
                }
                switch ($matches[1]) {
                case 'left':
                    return '{';
                case 'right':
                    return '}';
                case 'user_registered_brand_name':
                    $this->parameters['ext'][] = 1;
                    return "##ext_txt_1##";
                case 'user_registered_store_name':
                    $this->parameters['ext'][] = 2;
                    return "##ext_txt_2##";
                case 'user_registered_store_manager_name':
                    $this->parameters['ext'][] = 3;
                    return "##ext_txt_3##";
                case 'user_registered_store_phone_no':
                    $this->parameters['ext'][] = 4;
                    return "##ext_txt_4##";
                case 'picture':
                    if (5 == count($matches)) {
                        if ($is_html) {
                            $picture = $this->getPictureById($matches[4]);
                            if ($picture) {
                                $picture_urls = \Model_Picture::makePictureUrl($picture);
                                $rec['picture_url'] = $picture_urls['url'];
                                $rec['picture_thumb_url'] = $picture_urls['thumb_url'];
                                return $is_html ? "<img src='{$picture_urls['url']}'/>" : "";
                            }
                        }
                        return "";
                    }
                    break;
                case 'coupon':
                    if (5 == count($matches)) {
                        $this->parameters['ext'][] = 5;
                        $this->parameters['int'][1][] = $matches[4];
                        $url = "##ext_txt_5##/media/coupon?key=##int_txt_1{$matches[4]}##";
                        return $is_html ? "<a href='{$url}'>{$url}</a>" : "{$url}";
                    }
                    break;
                case 'random_coupon':
                    if (5 == count($matches)) {
                        $this->parameters['ext'][] = 5;
                        $this->parameters['int'][2][] = $matches[4];
                        $url = "##ext_txt_5##/media/random_coupon?key=##int_txt_2{$matches[4]}##";
                        return $is_html ? "<a href='{$url}'>{$url}</a>" : "{$url}";
                    }
                    break;
                case 'questionnaire':
                    if (5 == count($matches)) {
                        $this->parameters['ext'][] = 5;
                        $this->parameters['int'][3][] = $matches[4];
                        $url = "##ext_txt_5##/media/questionnaire?key=##int_txt_3{$matches[4]}##";
                        return $is_html ? "<a href='{$url}'>{$url}</a>" : "{$url}";
                    }
                    break;
                }
                return "";
            }, $content);
        return $res;
    }

    private function getPictureById($picture_id)
    {
        $picture = \Model_Picture::find($picture_id);
        if (empty($picture)) {
            \Additional_Log::debug("画像探しに失敗 画像ID:[{$picture_id}]");
            return null;
        }
        if (($this->store_id != 0 && $picture->store_id != $this->store_id) ||
            ($this->section_id != 0 && $picture->section_id != $this->section_id) ||
            ($this->brand_id != 0 && $picture->brand_id != $this->brand_id) ||
            ($this->company_id != 0 && $picture->company_id != $this->company_id)) {
            \Additional_Log::debug("画像対する権限なし！画像ID:[{$picture_id}] 依頼主：企業ID[{$this->company_id}] ブランドID[{$this->brand_id}] 事業部ID[{$this->section_id}] 店舗ID[{$this->store_id}]");
            return null;
        }
        return $picture;
    }

    private function getCouponById($coupon_id)
    {
        $coupon = \Model_Coupon::find($coupon_id);
        if (empty($coupon)) {
            \Additional_Log::debug("クーポン探しに失敗 クーポンID:[{$coupon_id}]");
            return null;
        }
        if (($this->store_id != 0 && $coupon->store_id != $this->store_id) ||
            ($this->section_id != 0 && $coupon->section_id != $this->section_id) ||
            ($this->brand_id != 0 && $coupon->brand_id != $this->brand_id) ||
            ($this->company_id != 0 && $coupon->company_id != $this->company_id)) {
            \Additional_Log::debug("クーポン対する権限なし！クーポンID:[{$coupon_id}] 依頼主：企業ID[{$this->company_id}] ブランドID[{$this->brand_id}] 事業部ID[{$this->section_id}] 店舗ID[{$this->store_id}]");
            return null;
        }
        return $coupon;
    }

    private function getRandomCouponById($random_coupon_id)
    {
        $random_coupon = \Model_Random_Coupon::find($random_coupon_id);
        if (empty($random_coupon)) {
            \Additional_Log::debug("ランダムクーポン探しに失敗 ランダムクーポンID:[{$random_coupon_id}]");
            return null;
        }
        if (($this->store_id != 0 && $random_coupon->store_id != $this->store_id) ||
            ($this->section_id != 0 && $random_coupon->section_id != $this->section_id) ||
            ($this->brand_id != 0 && $random_coupon->brand_id != $this->brand_id) ||
            ($this->company_id != 0 && $random_coupon->company_id != $this->company_id)) {
            \Additional_Log::debug("ランダムクーポン対する権限なし！ランダムクーポンID:[{$random_coupon_id}] 依頼主：企業ID[{$this->company_id}] ブランドID[{$this->brand_id}] 事業部ID[{$this->section_id}] 店舗ID[{$this->store_id}]");
            return null;
        }
        return $random_coupon;
    }

    private function getQuestionnaireById($questionnaire_id)
    {
        $questionnaire = \Model_Questionnaire::find($questionnaire_id);
        if (empty($questionnaire)) {
            \Additional_Log::debug("アンケート探しに失敗 アンケートID:[{$questionnaire_id}]");
            return null;
        }
        if (($this->store_id != 0 && $questionnaire->store_id != $this->store_id) ||
            ($this->section_id != 0 && $questionnaire->section_id != $this->section_id) ||
            ($this->brand_id != 0 && $questionnaire->brand_id != $this->brand_id) ||
            ($this->company_id != 0 && $questionnaire->company_id != $this->company_id)) {
            \Additional_Log::debug("アンケート対する権限なし！アンケートID:[{$questionnaire_id}] 依頼主：企業ID[{$this->company_id}] ブランドID[{$this->brand_id}] 事業部ID[{$this->section_id}] 店舗ID[{$this->store_id}]");
            return null;
        }
        return $questionnaire;
    }
}

