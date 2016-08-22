<?php

class ProtocolException extends \Exception
{
    const RESULT_CODE_OK = 0;     // 正常
    const RESULT_CODE_ERROR = 1;  // エラー（HTTPステータスコードにてエラー）
    const RESULT_CODE_ILLEGAL_PARAMETER = 10;    // パラメータエラー
    const RESULT_CODE_EXECUTE_AUTHORITY = 20;    // API実行権限エラー

    // Login
    const RESULT_CODE_OAUTH_CLIENT_NOT_FOUND = 100;
    const RESULT_CODE_OAUTH_ACCESS_TOKEN_NOT_FOUND = 101;
    const RESULT_CODE_LOGIN_USER_NAME_OR_PASSWORD_INCORRECT = 102;
    const RESULT_CODE_LOGIN_USER_IS_NOT_ACTIVATED = 103;

    // user
    const RESULT_CODE_USER_NOT_FOUND = 200;
    const RESULT_CODE_CREATE_USER_INVALID = 201;
    const RESULT_CODE_USER_OPERATION_AUTHORITY_ERROR = 210;

    // store
    const RESULT_CODE_ADMIN_NOT_PERMISSION = 300;
    const RESULT_CODE_BRAND_NOT_PERMISSION = 301;
    const RESULT_CODE_COMPANY_NOT_EXIST = 302;
    const RESULT_CODE_COMPANY_AND_BRAND_NOT_EXIST = 303;
    const RESULT_CODE_COMPANY_STATUS_DELETED = 304;
    const RESULT_CODE_BRAND_STATUS_DELETED = 305;
    const RESULT_CODE_COMPANY_IS_DIFFERENT = 306;
    const RESULT_CODE_BRAND_IS_DIFFERENT = 307;
    const RESULT_CODE_SECTION_IS_DIFFERENT = 308;
    const RESULT_CODE_STORE_IS_DIFFERENT = 309;
    const RESULT_CODE_STORE_NOT_FOUND = 310;
    const RESULT_CODE_DUPLICATE_STORE_CODE = 311;

    // member
    const RESULT_CODE_BRAND_MEMBER_NOT_FOUND = 400;
    const RESULT_CODE_STORE_MEMBER_NOT_FOUND = 401;
    const RESULT_CODE_MEMBER_IS_ALREADY_EXIST = 410;           // 会員登録済み
    const RESULT_CODE_MEMBER_FAIL_TO_SAVE_CSV_FILE = 420;

    // section
    const RESULT_CODE_SECTION_NOT_FOUND = 500;                  // 事業部情報無し

    // brand
    const RESULT_CODE_BRAND_NOT_FOUND = 600;
    const RESULT_CODE_CREATE_BRAND_INVALID = 601;
    const RESULT_CODE_STORE_FAIL_TO_SAVE_CSV_FILE = 620;
    const RESULT_CODE_BRAND_CODE_IS_ALREADY_EXIST = 630;

    // information
    const RESULT_CODE_INFORMATION_NOT_FOUND = 700;

    // questionnaires
    const RESULT_CODE_QUESTIONNAIRES_RESPOND_RECORD_IS_ALREADY_EXIST = 800; // アンケート質問登録済み
    const RESULT_CODE_QUESTIONNAIRES_COUPON_RECORD_IS_ALREADY_EXIST = 810;  // アンケートクーポン登録済み
    const RESULT_CODE_QUESTION_NOT_FOUND = 820; // 質問未登録
    const RESULT_CODE_QUESTIONNAIRES_NOT_FOUND = 830; // アンケート未登録
    const RESULT_CODE_QUESTIONNAIRES_IS_ALREADY_RELEASED = 840; // アンケート公開済み
    const RESULT_CODE_QUESTIONNAIRES_RESPOND_NOT_FOUND = 850; // アンケート質問未登録
    const RESULT_CODE_QUESTIONNAIRES_COUPON_NOT_FOUND = 860; // アンケートクーポン未登録

    // batch
    const RESULT_CODE_CSV_CHECK_ERROR = 900; // CSVファイルチェックエラー
    const RESULT_CODE_CSV_IMPORT_ERROR = 910; // CSVインポート情報未登録

    // coupon
    const RESULT_CODE_COUPON_NOT_FOUND = 1000;  // クーポン情報未登録
    const RESULT_CODE_COUPON_RELEASED = 1010;  // クーポン公開済み

    // delivery
    const RESULT_CODE_DELIVERY_NOT_FOUND = 1100; // 配信情報未登録
    const RESULT_CODE_DELIVERY_FAIL_TO_SEND_REQUEST = 1101;    // メール送信リクエストに失敗

    // area
    const RESULT_CODE_AREA_NOT_FOUND = 1200; // エリア未登録
    const RESULT_CODE_AREA_IS_ALREADY_EXIST = 1210; // エリア登録済み

    // site_header_footer
    const RESULT_CODE_SITE_HEADER_FOOTER_EXISTS = 1300;
    const RESULT_CODE_SITE_HEADER_FOOTER_NOT_FOUND = 1310;
    const RESULT_CODE_SITE_BRAND_OR_STORE_IS_NOT_EXIST = 1320;
    const RESULT_CODE_SITE_STORE_FREE_IS_NOT_EXIST = 1330;

    // picture
    const RESULT_CODE_PICTURE_NOT_FOUND = 1400; // 画像未登録
    const RESULT_CODE_CREATE_PICTURE_INVALID = 1410; // 
    const RESULT_CODE_PICTURE_FAIL_TO_SAVE_PICTURE_FILE = 1420; // 画像保存失敗
    const RESULT_CODE_OBJECT_STORAGE_ERROR = 1430; // オブジェクトストレージ保存失敗
    const RESULT_CODE_PICTURE_INVALID = 1440; //  

    protected $userMessage;

    public function __construct($user_message, $develop_message, $code, $previous = null)
    {
        parent::__construct($develop_message, (int)$code, $previous);
        $this->userMessage = $user_message;
    }

    public function getUserMessage()
    {
        return $this->userMessage;
    }
}
