<?php

namespace Api;

define('EMPTY_PICTURE', DOCROOT."assets".DIRECTORY_SEPARATOR."img".DIRECTORY_SEPARATOR."empty.png");

class Controller_access extends \Controller_Api
{
    // 継承変数設定
    protected $is_access_token_ignore_request = true;
    protected $is_picture_request = true;

    protected static $required_parameters = array(
        'index' => array(
            'key' => true,
        ),
    );

    /**
     * メール開封情報更新
     * 『<img src="ドメイン/1/access?key=XXX" alt=""/>』の様な感じでメール内に記述
     */
    protected function index()
    {
        \Additional_Log::debug('【MAIL OPEN API】:START');

        try{
            // 引数取得
            $random_key = $this->params['key'];
            \Additional_Log::debug('【MAIL OPEN API】:KEY['.$random_key.']');

            // 開封日時更新
            \Model_Member_Delivery_History::updateOpenMailDate($random_key);

        } catch (\Exception $e){
            // ログ出力のみ
            \Additional_Log::error('【MAIL OPEN API】['.$random_key.']:'.$e->getMessage());
        }

        $this->response_fields = EMPTY_PICTURE;

        \Additional_Log::debug('【MAIL OPEN API】:END');
    }
}

