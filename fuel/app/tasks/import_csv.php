<?php

namespace Fuel\Tasks;

use SplFileObject;

define('CSV_PATH','tmp');

define('STORE_TABLE',1);
define('MEMBER_TABLE',2);

define('CSV_TARGET','{"1":"store","2":"member"}');

define('CSV_COLUMN',
    '{
        "member":
            {
                "ブランドコード":["brands","brand_code"],
                "店舗コード":["stores","store_code"],
                "メールアドレス":["brand_members","mail_address"],
                "メルマガ配信可否":["store_members","mail_reception"],
                "アカウント登録状態":["store_members","store_member_status"],
                "会員登録日":["store_members","member_registration_date"],
                "会員退会日":["store_members","member_leave_date"],
                "名前":["brand_members","name"],
                "電話番号":["brand_members","tel_no"],
                "生年月日":["brand_members","birthday"],
                "性別":["brand_members","gender"],
                "職業":["brand_members","job"],
                "都道府県":["brand_members","prefecture"]
            },
        "store":
            {
                "ブランドコード":["brands","brand_code"],
                "店舗コード":["stores","store_code"],
                "店舗名":["stores","store_name"],
                "状態":["stores","store_status"],
                "郵便番号":["stores","store_postal_code"],
                "都道府県":["stores","store_prefectures"],
                "市区町村":["stores","store_address"],
                "ビル名等":["stores","store_building"],
                "アクセス":["stores","store_access"],
                "電話番号":["stores","store_phone_no"],
                "FAX":["stores","store_fax_no"],
                "店長名":["stores","store_manager_name"],
                "営業時間":["stores","store_business_hours"],
                "定休日":["stores","store_regular_holiday"],
                "駐車場情報":["stores","store_parking_lot"],
                "席情報":["stores","store_seat"],
                "キッズルーム":["stores","store_kids_room"],
                "メール署名":["stores","store_signature_block"],
                "利用規約":["stores","store_terms_of_use"],
                "プライバシーポリシー":["stores","store_privacy_policy"],
                "フリーワード":["stores","store_freeword"],
                "SEOキーワード1":["stores","store_seo_key1"],
                "SEOキーワード2":["stores","store_seo_key2"],
                "SEOキーワード3":["stores","store_seo_key3"]
            }
    }'
);



class import_csv
{
    public static function run($args = null)
    {
        \Additional_Log::info(' 【IMPORT CSV BATCH】: START');

        // 処理内容変数設定
        $duplicate_count = 0;
        $error_count = 0;
        $process_count = 0;

        // CSVインポート未実行情報を取得
        $conditions[] = array('status', BATCH_STATUS_READY);
        $csv_imports = \Model_Csv_Import::find('first', array(
            'where' => $conditions,
            'order_by' => array('created_at' => 'asc'),
        ));
        \Additional_Log::info(' 【IMPORT CSV BATCH】: GET CSV IMPORT RECORD');

        // 処理対象レコードが存在する場合のみ処理を実行
        if(!empty($csv_imports)){
            \Additional_Log::info(' 【IMPORT CSV BATCH】: CSV IMPORT PROCESS BEGIN');

            try {
                \DB::start_transaction(MASTER);

                // 状況を"対応中"に更新
                \Additional_Log::info(' 【IMPORT CSV BATCH】: STATUS UPDATE['.BATCH_STATUS_DOING.']');
                \Model_Csv_import::updateCsvImportStatus($csv_imports, BATCH_STATUS_DOING);

                $csv_file_path = CSV_PATH;
                // ファイル読み込み
                if ($csv_imports["company_id"]) {
                    $csv_file_path .= '/'.$csv_imports["company_id"];
                }
                if ($csv_imports["brand_id"]) {
                    $csv_file_path .= '/'.$csv_imports["brand_id"];
                }
                if ($csv_imports["store_id"]) {
                    $csv_file_path .= '/'.$csv_imports["store_id"];
                }
                $csv_file_path .= '/'.$csv_imports["file_path"];

                // 文字コード変換処理
                $file = self::convertEncoding($csv_file_path);
                \Additional_Log::info(' 【IMPORT CSV BATCH】: CSV FILE['.$csv_file_path.']');

                $fields_list = array();
                foreach ($file as $key => $line) {
                    // ヘッダー行チェック
                    if($key == 0){
                        $fields_list = self::checkCsvFile($line, $csv_imports["target_table"]);
                        \Additional_Log::info(' 【IMPORT CSV BATCH】: CHECK HEADER');
                    }else{
                        // 2行目以降の処理
                        if(!empty($fields_list)){
                            // 登録処理
                            self::importProcess(
                                $line
                                ,$fields_list
                                ,$csv_imports
                                ,$duplicate_count
                                ,$process_count
                                ,$error_count
                            );
                        }
                    }
                }

                // CSVファイル削除処理
                unlink($csv_file_path);

                // 状況を"正常終了"に更新
                \Model_Csv_import::updateCsvImportStatus($csv_imports, BATCH_STATUS_DONE);
                \Additional_Log::info(' 【IMPORT CSV BATCH】: STATUS UPDATE['.BATCH_STATUS_DONE.']');

                \DB::commit_transaction(MASTER);
            } catch (\Exception $e) {
                \Additional_Log::error("【IMPORT CSV  BATCH】: {$e->getMessage()}");
                \DB::rollback_transaction(MASTER);

                // 状況を"エラー発生"に更新
                \Model_Csv_import::updateCsvImportStatus($csv_imports, BATCH_STATUS_ERROR);
                \Additional_Log::info(' 【IMPORT CSV BATCH】: STATUS UPDATE['.BATCH_STATUS_ERROR.']');
            }
        }

        \Additional_Log::info(' 【IMPORT CSV  BATCH】: END');

        // 完了メール送信
        self::sendMail($csv_imports, $process_count, $duplicate_count, $error_count);
    }

    /**
     * 文字コード変換処理（SJIS ⇒ UTF-8）
     * @param $csv_file_path
     * @return array
     */
    private static function convertEncoding($csv_file_path)
    {
        // アップロードファイル読込
        $data = file_get_contents($csv_file_path);

        // 文字コード変換
        if(mb_detect_encoding($data) != "UTF-8"){
            $data = mb_convert_encoding($data, 'UTF-8', 'SJIS');
        }
        // 一時ファイル作成
        $temp = tmpfile();
        // 一時ファイルにエンコードデータ書込み
        fwrite($temp, $data);
        // ファイルポインタ位置移動
        rewind($temp);
        // 一時ファイルのファイルパス取得
        $meta = stream_get_meta_data($temp);
        // 一時ファイル読込
        $objFile = new SplFileObject($meta['uri'], 'rb');
        $objFile->setFlags(SplFileObject::READ_CSV);

        \Additional_Log::info(' 【IMPORT CSV BATCH】: CONVERT ENCODING');
        return $objFile;
    }

    /**
     * インポート制御処理
     * @param $line
     * @param $fields_list
     * @param $csv_imports
     * @param $duplicate_count
     * @param $process_count
     * @param $error_count
     * @return bool
     */
    private static function importProcess($line, $fields_list, $csv_imports, &$duplicate_count, &$process_count, &$error_count)
    {
        // 項目数チェック
        if(count($line) != $fields_list["count"]){
            // CSVファイル最終行チェック
            if(!empty($line[0])){
                $error_count++;
            }
            return false;
        }

        // 登録・更新用配列生成
        $record = array();
        foreach($fields_list["field_name"] as $key => $field){
            $record[$field] = $line[$key];
        }

        // 対象TBL毎に処理を切り分け
        switch($csv_imports["target_table"])
        {
            case STORE_TABLE:
                // 店舗処理呼出
                self::importStores($record, $csv_imports, $duplicate_count, $process_count, $error_count);
                \Additional_Log::info(' 【IMPORT CSV  BATCH】: IMPORT STORES PROCESS DONE');
                break;
            case MEMBER_TABLE:
                // 会員処理呼出
                self::importMember($record, $csv_imports, $duplicate_count, $process_count, $error_count);
                \Additional_Log::info(' 【IMPORT CSV  BATCH】: IMPORT MEMBERS PROCESS DONE');
                break;
            default:
                break;
        }
    }

    /**
     * 店舗情報インポート処理
     * @param $record
     * @param $csv_imports
     * @param $duplicate_count
     * @param $process_count
     * @param $error_count
     */
    private static function importStores($record, $csv_imports, &$duplicate_count, &$process_count, &$error_count)
    {
        // ブランド情報取得
        $brand = \Model_brand::findByCompanyIdAndBrandCode($csv_imports["company_id"], $record["brand_code"]);

        if(!empty($brand)){
            // 店舗情報取得
            $store_record = \Model_Store::findByBrandIdAndStoreCode($brand->id, $record["store_code"]);

            if(empty($store_record)){
                // 登録用項目追加
                $record["brand_id"] = $brand->id;

                // 店舗登録処理
                \Model_Store::insertStore($record);
                \Additional_Log::info(' 【IMPORT CSV  BATCH】: IMPORT STORES PROCESS - INSERT RECORD[brand_id:'.$brand->id.' / store_code:'.$record["store_code"].']');
            }else{
                // 重複時処理チェック
                if($csv_imports["duplicate_process_type"] == BATCH_DUPLICATE_OVERWRITE){
                    // 上書き更新処理
                    \Model_Store::updateStore($record, $store_record);
                    \Additional_Log::info(' 【IMPORT CSV  BATCH】: IMPORT STORES PROCESS - UPDATE RECORD[brand_id:'.$brand->id.' / store_code:'.$record["store_code"].']');
                }
                // 重複処理カウント
                $duplicate_count++;
                \Additional_Log::info(' 【IMPORT CSV  BATCH】: IMPORT STORES PROCESS - DUPLICATE COUNT UP');
            }
        }else{
            // エラーカウント（ブランド未存在）
            $error_count++;
            \Additional_Log::info(' 【IMPORT CSV  BATCH】: IMPORT STORES PROCESS - BRAND IS NOT EXIST[company_id:'.$csv_imports["company_id"].' / brand_code:'.$record["brand_code"].']');
        }

        // 処理件数カウント
        $process_count++;
    }

    /**
     * 店舗会員情報インポート処理
     * @param $record
     * @param $csv_imports
     * @param $duplicate_count
     * @param $process_count
     * @param $error_count
     * @throws \ProtocolException
     */
    private static function importMember($record, $csv_imports, &$duplicate_count, &$process_count, &$error_count)
    {
        // ブランド情報取得
        $brand = \Model_brand::findByCompanyIdAndBrandCode($csv_imports["company_id"], $record["brand_code"]);

        if(!empty($brand)){
            // 店舗情報取得
            $store = \Model_Store::findByBrandIdAndStoreCode($brand->id, $record["store_code"]);

            // ブランド会員情報取得
            $brand_member = \Model_Brand_Member::findByMailAddress($brand->id, $record["mail_address"]);
            if(empty($brand_member)){
                // 会員TBL登録処理
                $member_id = \Model_Member::insertMember(0);
                // ブランド会員TBL登録処理
                $record["company_id"] = $brand->company_id;
                $record["brand_id"] = $brand->id;
                $record["member_id"] = $member_id;
                \Model_Brand_Member::insertBrandMember($record);

                // 店舗会員TBL登録処理
                $record["store_id"] = $store->id;
                \Model_Store_Member::insertStoreMember($record);

                \Additional_Log::info(' 【IMPORT CSV  BATCH】: IMPORT MEMBERS PROCESS - INSERT 3 KINDS OF MEMBER TABLES');
            }else{
                // ブランド会員情報
                if($csv_imports["duplicate_process_type"] == BATCH_DUPLICATE_OVERWRITE){
                    // ブランド会員情報更新
                    $record["company_id"] = $brand_member->company_id;
                    $record["brand_id"] = $brand_member->brand_id;
                    $record["member_id"] = $brand_member->member_id;

                    \Model_Brand_Member::updateBrandMember($record, $brand_member);
                    \Additional_Log::info(' 【IMPORT CSV  BATCH】: IMPORT MEMBERS PROCESS - UPDATE BRAND MEMBER TABLES');
                }

                // 店舗会員情報取得
                $store_member = \Model_Store_Member::findById($brand_member->brand_id, $store->id, $brand_member->member_id);
                if(empty($store_member)){
                    // 店舗会員TBL登録処理
                    $record["brand_id"] = $brand_member->brand_id;
                    $record["store_id"] = $store->id;
                    $record["member_id"] = $brand_member->member_id;

                    \Model_Store_Member::insertStoreMember($record);
                    \Additional_Log::info(' 【IMPORT CSV  BATCH】: IMPORT MEMBERS PROCESS - INSERT STORE MEMBER TABLES');
                }else{
                    // 重複時処理チェック
                    if($csv_imports["duplicate_process_type"] == BATCH_DUPLICATE_OVERWRITE){
                        // 上書き更新処理
                        \Model_Store_Member::updateStoreMember($record, $store_member);
                        \Additional_Log::info(' 【IMPORT CSV  BATCH】: IMPORT MEMBERS PROCESS - UPDATE STORE MEMBER TABLES');
                    }
                }
                // 重複処理カウント(ブランド会員情報が存在する時点で重複しているのでカウントアップ)
                $duplicate_count++;
            }

        }else{
            // エラーカウント（ブランド未存在）
            $error_count++;
        }

        // 処理件数カウント
        $process_count++;
    }

    /**
     * CSVフィールドチェック
     * @param $first_line
     * @param $table_key
     * @return array
     * @throws \ProtocolException
     */
    private static function checkCsvFile($first_line, $table_key)
    {
        $field_list = self::getFieldList($table_key);

        if(count($first_line) == $field_list["count"]){
            // 項目チェック処理
            foreach($field_list["csv_field"] as $key => $check_field){
                if($check_field != self::deleteBom($first_line[$key])){
                    \Additional_Log::info(' 【IMPORT CSV  BATCH】: CHECK CSV FILE - TABLE COLUMN NOT EQUAL ERROR['.$check_field.' / '.self::deleteBom($first_line[$key]).']');
                    throw new \ProtocolException('CSVファイルの項目不正です。項目名や順序を確認して下さい。', "TABLE COLUMN ERROR", \ProtocolException::RESULT_CODE_CSV_CHECK_ERROR);
                }
            }
            return $field_list;
        }else{
            \Additional_Log::info(' 【IMPORT CSV  BATCH】: CHECK CSV FILE - TABLE COLUMN NOT EQUAL ERROR['.count($first_line).' / '.$field_list["count"].']');
            throw new \ProtocolException('CSVファイルの項目数が不正です。対象の項目を確認して下さい。['.count($first_line)." / ".$field_list["count"]."]", "ILLEGAL FORMAT ERROR", \ProtocolException::RESULT_CODE_CSV_CHECK_ERROR);
        }
    }

    /**
     * 文字列からBOMデータを削除する
     *
     * @param string $str 対象文字列
     * @return string $str BOM削除した文字列
     */
    private  static function deleteBom($str)
    {
        if (($str == NULL) || (mb_strlen($str) == 0)) {
            return $str;
        }
        if (ord($str{0}) == 0xef && ord($str{1}) == 0xbb && ord($str{2}) == 0xbf) {
            $str = substr($str, 3);
        }
        return $str;
    }

    /**
     * 対象項目を取得
     * @param $tableKey
     * @return bool|string
     */
    private static function getFieldList($tableKey)
    {
        // 対象TBL判断値取得
        $csv_target = json_decode(CSV_TARGET, true);
        // CSVカラム一覧取得
        $csv_columns = json_decode(CSV_COLUMN, true);

        // CSV情報設定
        $check_fields["csv_field"] = array_keys($csv_columns[$csv_target[$tableKey]]);
        foreach($csv_columns[$csv_target[$tableKey]] as $column){
            // TODO 1つの配列に全カラムを統合しているが、同物理名のTBL項目を更新するケースが発生したら下記のTBL毎の配列を使用する。
            $check_fields["field_name"][] = $column[1];
            $check_fields[$column[0]][] = $column[1];
        }
        $check_fields["count"] = count($check_fields["csv_field"]);

        return $check_fields;
    }

    /**
     * メール送信処理
     * @param $csv_imports
     * @param $process_count
     * @param $duplicate_count
     * @param $error_count
     */
    private static function sendMail($csv_imports, $process_count, $duplicate_count, $error_count)
    {

        if(empty($csv_imports)){
            \Additional_Log::info(' 【IMPORT CSV  BATCH】: NO CSV DATA. SKIP SEND MAIL.');
            return;
        }

        $email = $csv_imports["mail_address"];

        $sender = \Email::forge();
        $sender->from(\Config::get('repeater.email_key.from'));
        $sender->to($email);
        $sender->subject('【GMOリピーター】CSVインポート処理完了のお知らせ');
        $sender->body('TO:担当者様
            ['.$csv_imports["upload_filename"].']のインポート処理が完了しましたので、ご連絡いたします。
処理結果は下記の通りとなります。
            -------------------------------------------------------------------------------
            総処理件数：'.$process_count.'
            重複対応件数：'.$duplicate_count.'
            エラー発生件数：'.$error_count.'
-------------------------------------------------------------------------------
            '
        );
        try {
            $sender->send();
            \DB::commit_transaction();
//            \Response::redirect_back('web/user/password/result');
        } catch (\EmailValidationFailedException $e) {
            \DB::rollback_transaction();
//            \Session::set_flash(current($email->get_to())['email'] . 'が見つかりません。');
            \Additional_Log::error("\n Cannot send to your e-mail address not found " . current($email->get_to())['email'] . "\n");
        } catch (\EmailSendingFailedException $e) {
            \DB::rollback_transaction();
//            \Session::set_flash(current($email->get_to())['email'] . 'に送信できません。');
            \Additional_Log::error("\n Cannot send to your e-mail address " . current($email->get_to())['email'] . "\n");
        }
        \Additional_Log::info(' 【IMPORT CSV  BATCH】: SEND MAIL DONE');
    }
}