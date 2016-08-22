<?php

namespace Fuel\Tasks;

define('GENDER_MEM', 1);      // 男性
define('GENDER_WOMEN', 2);    // 女性
define('JOB_1', 1);             // 公務員
define('JOB_2', 2);             // 会社役員
define('JOB_3', 3);             // 会社員（正社員）
define('JOB_4', 4);             // 会社員（契約社員／派遣社員）
define('JOB_5', 5);             // 自営業・自由業
define('JOB_6', 6);             // 高校生
define('JOB_7', 7);             // 大学生・大学院生
define('JOB_8', 8);             // パート・アルバイト
define('JOB_9', 9);             // 主婦
define('JOB_10', 10);           // 無職
define('JOB_11', 11);           // その他
define('PREFECTURE_1', 1);     // 北海道
define('PREFECTURE_2', 2);     // 青森県
define('PREFECTURE_3', 3);     // 岩手県
define('PREFECTURE_4', 4);     // 宮城県
define('PREFECTURE_5', 5);     // 秋田県
define('PREFECTURE_6', 6);     // 山形県
define('PREFECTURE_7', 7);     // 福島県
define('PREFECTURE_8', 8);     // 茨城県
define('PREFECTURE_9', 9);     // 栃木県
define('PREFECTURE_10', 10);   // 群馬県
define('PREFECTURE_11', 11);   // 埼玉県
define('PREFECTURE_12', 12);   // 千葉県
define('PREFECTURE_13', 13);   // 東京都
define('PREFECTURE_14', 14);   // 神奈川県
define('PREFECTURE_15', 15);   // 新潟県
define('PREFECTURE_16', 16);   // 富山県
define('PREFECTURE_17', 17);   // 石川県
define('PREFECTURE_18', 18);   // 福井県
define('PREFECTURE_19', 19);   // 山梨県
define('PREFECTURE_20', 20);   // 長野県
define('PREFECTURE_21', 21);   // 岐阜県
define('PREFECTURE_22', 22);   // 静岡県
define('PREFECTURE_23', 23);   // 愛知県
define('PREFECTURE_24', 24);   // 三重県
define('PREFECTURE_25', 25);   // 滋賀県
define('PREFECTURE_26', 26);   // 京都府
define('PREFECTURE_27', 27);   // 大阪府
define('PREFECTURE_28', 28);   // 兵庫県
define('PREFECTURE_29', 29);   // 奈良県
define('PREFECTURE_30', 30);   // 和歌山県
define('PREFECTURE_31', 31);   // 鳥取県
define('PREFECTURE_32', 32);   // 島根県
define('PREFECTURE_33', 33);   // 岡山県
define('PREFECTURE_34', 34);   // 広島県
define('PREFECTURE_35', 35);   // 山口県
define('PREFECTURE_36', 36);   // 徳島県
define('PREFECTURE_37', 37);   // 香川県
define('PREFECTURE_38', 38);   // 愛媛県
define('PREFECTURE_39', 39);   // 高知県
define('PREFECTURE_40', 40);   // 福岡県
define('PREFECTURE_41', 41);   // 佐賀県
define('PREFECTURE_42', 42);   // 長崎県
define('PREFECTURE_43', 43);   // 熊本県
define('PREFECTURE_44', 44);   // 大分県
define('PREFECTURE_45', 45);   // 宮崎県
define('PREFECTURE_46', 46);   // 鹿児島県
define('PREFECTURE_47', 47);   // 沖縄県



class daily_store_info
{
    public static function run($args = null)
    {

        try {
            \Additional_Log::info(' 【DAILY STORE INFORMATION BATCH】:START');
            \DB::start_transaction(MASTER);

            // 引数取得
            // 引数指定は『php oil r daily_store_info -f=2016-06-01 -t=2016-06-10』で指定
            $original_date_from    = \Cli::option('f');
            $original_date_to      = \Cli::option('t');
            $target_dates = \Cli::option('d');

            //  期間指定時
            if (isset($original_date_from) || isset($original_date_to)) {
                $original_date_from = date('Y-m-d H:i:s', strtotime($original_date_from));
                $original_date_to   = date('Y-m-d H:i:s', strtotime($original_date_to.'+1 day'));
            // 対象日指定時
            }elseif(isset($target_dates)){
                $original_date_from = date('Y-m-d H:i:s', strtotime($target_dates));
                $original_date_to   = date('Y-m-d H:i:s', strtotime($original_date_from.'+1 day'));
            // 期間指定が無い、もしくは一方の指定しか無い場合は前日を指定日として設定
            }else{
                $original_date_from = date('Y-m-d H:i:s', strtotime(date('Y-m-d').'-1 day'));
                $original_date_to   = date('Y-m-d H:i:s', strtotime(date('Y-m-d')));
            }

            // 集計対象店舗取得
            $stores = self::getAllActiveStores();

            foreach($stores as $store){
                \Additional_Log::info('【DAILY STORE INFORMATION BATCH】- START STORE:'. $store['store_id']);

                // 期間初期化
                $date_from = $original_date_from;
                $date_to   = $original_date_to;

                while (strtotime($date_from) < strtotime($date_to)) {
                    // 日次店舗情報初期化
                    $daily_info = self::setInitialDailyInfo($store, $date_from);

                    // 対象日FROM TO生成
                    \Additional_Log::info('【DAILY STORE INFORMATION BATCH】-- DATE:'. $date_from);
                    $previous_day = date('Y-m-d H:i:s', strtotime($date_from));
                    $next_day     = date('Y-m-d H:i:s', strtotime($previous_day . '+1 day'));

                    // 対象日の登録ユーザ情報取得
                    $members = self::getActiveMemberByStore($store, $previous_day, $next_day);
                    \Additional_Log::info('【DAILY STORE INFORMATION BATCH】--- GET ACTIVE USER INFO:'.count($members));

                    // 登録者数設定
                    $daily_info["register_count"] = count($members);
                    // 退会者数設定
                    $leaveCount = self::getLeaverCount($store, $previous_day, $next_day);
                    $daily_info["leaver_count"] = $leaveCount;

                    // 属性情報設定
                    foreach($members as $member){
                        // 性別情報設定
                        self::setGenders($daily_info, $member);
                        // 年代情報設定
                        self::setAges($daily_info, $member);
                        // 職業情報設定
                        self::setJobs($daily_info, $member);
                        // 住所情報設定
                        self::setPrefecture($daily_info, $member);
                    }
                    \Additional_Log::info('【DAILY STORE INFORMATION BATCH】--- SET USER DAILY AGGREGATE');

                    // 日次店舗情報TBL登録処理
                    $check_daily_info = \Model_Daily_Store_Info::findById($previous_day, $store['company_id'], $store['brand_id'], $store['store_id']);
                    \Additional_Log::info('【DAILY STORE INFORMATION BATCH】--- GET DAILY STORE INFO IN THE PAST');

                    if(empty($check_daily_info)){
                        // 新規登録処理
                        \Model_Daily_Store_Info::insertDailyStoreInfo($daily_info);
                        \Additional_Log::info('【DAILY STORE INFORMATION BATCH】--- INSERT DAILY STORE INFO');
                    }else{
                        // 更新処理
                        \Model_Daily_Store_Info::updateDailyStoreInfo($check_daily_info, $daily_info);
                        \Additional_Log::info('【DAILY STORE INFORMATION BATCH】--- UPDATE DAILY STORE INFO');
                    }
                    $date_from = date('Y-m-d H:i:s', strtotime($previous_day . '+1 day'));
                }
            }

            \DB::commit_transaction(MASTER);
            \Additional_Log::info('【DAILY STORE INFORMATION BATCH】:END');
        } catch (\Exception $e) {
            \Additional_Log::error("[task][run][unknown][error]{$e->getMessage()}");
            \DB::rollback_transaction(MASTER);
            throw $e;
        }
    }

    /**
     * 営業中の店舗一覧取得
     * @return mixed
     */
    private static function getAllActiveStores()
    {
        $query = \DB::select('b.company_id', 's.brand_id', \DB::expr('s.id as store_id'));
        $query->from(array('stores', 's'));
        $query->join(array('brands', 'b'), 'INNER');
        $query->on('b.id', '=', 's.brand_id');
        $query->where('s.store_status', STATUS_DURING_BUSINESS);
        $result = $query->execute(SLAVE);

        return $result;
    }

    /**
     * 対象日に会員登録を行ったメンバー一覧取得
     * @param $store
     * @param $date_from
     * @param $date_to
     * @return mixed
     */
    private static function getActiveMemberByStore($store, $date_from, $date_to)
    {
        $query = \DB::select('sm.member_id','bm.birthday','bm.gender','bm.job','bm.prefecture');
        $query->from(array('store_members', 'sm'));
        $query->join(array('brand_members', 'bm'), 'INNER');
        $query->on('sm.brand_id', '=', 'bm.brand_id');
        $query->and_on('sm.member_id', '=', 'bm.member_id');
        $query->where('bm.status', BRAND_MEMBER_STATUS_REGISTRATION);
        $query->and_where('sm.store_id', $store['store_id']);
//        $query->and_where('sm.store_member_status', STORE_MEMBER_STATUS_ACTIVE);
        $query->and_where('sm.member_registration_date', '>=', $date_from);
        $query->and_where('sm.member_registration_date', '<', $date_to);
        $result = $query->execute(SLAVE);

        return $result;
    }

    /**
     * 対象日に退会したメンバー数を取得
     * @param $store
     * @param $target_date
     * @param $next_day
     * @return mixed
     */
    private static function getLeaverCount($store, $target_date, $next_day)
    {
        $query = \DB::select(\DB::expr('COUNT(member_id) as cnt'))->from('store_members');
        $query->where('brand_id', $store['brand_id']);
        $query->and_where('store_id', $store['store_id']);
        $query->and_where('store_member_status', STORE_MEMBER_STATUS_WITHDRAWAL);
        $query->and_where('member_leave_date', '>=', $target_date);
        $query->and_where('member_leave_date', '<', $next_day);
        $result = $query->execute(SLAVE)->as_array();

        return $result[0]['cnt'];
    }

    /**
     * 日次店舗情報性別を集計
     * @param $daily_info
     * @param $member
     */
    private static function setGenders(&$daily_info, $member){
        if($member["gender"] == GENDER_MEM){
            $daily_info["men_count"]++;
        }else{
            $daily_info["women_count"]++;
        }
    }

    /**
     * 日次店舗情報年代を集計
     * @param $daily_info
     * @param $member
     */
    private static function setAges(&$daily_info, $member)
    {
        $age = date('Y', strtotime($member['birthday']));
        $baseAge = date('Y', strtotime(date('Y')));

        if(($baseAge-10) <= $age){
            // 10歳以下 処理なし
        }elseif(($baseAge-20) <= $age){
            // 10台集計
            $daily_info["10s_count"]++;
        }elseif(($baseAge-30) <= $age){
            // 20台集計
            $daily_info["20s_count"]++;
        }elseif(($baseAge-40) <= $age){
            // 30台集計
            $daily_info["30s_count"]++;
        }elseif(($baseAge-50) <= $age){
            // 40台集計
            $daily_info["40s_count"]++;
        }elseif(($baseAge-60) <= $age){
            // 50台集計
            $daily_info["50s_count"]++;
        }elseif(($baseAge-70) <= $age){
            // 60台集計
            $daily_info["60s_count"]++;
        }elseif(($baseAge-80) <= $age){
            // 70台集計
            $daily_info["70s_count"]++;
        }elseif(($baseAge-90) <= $age){
            // 80台集計
            $daily_info["80s_count"]++;
        }elseif(($baseAge-100) <= $age){
            // 90台集計
            $daily_info["90s_count"]++;
        }
    }

    /**
     * 日次店舗情報職業を集計
     * @param $daily_info
     * @param $member
     */
    private static function setJobs(&$daily_info, $member)
    {
        if($member["job"] == JOB_1){
            $daily_info["job1_count"]++;
        }elseif($member["job"] == JOB_2){
            $daily_info["job2_count"]++;
        }elseif($member["job"] == JOB_3){
            $daily_info["job3_count"]++;
        }elseif($member["job"] == JOB_4){
            $daily_info["job4_count"]++;
        }elseif($member["job"] == JOB_5){
            $daily_info["job5_count"]++;
        }elseif($member["job"] == JOB_6){
            $daily_info["job6_count"]++;
        }elseif($member["job"] == JOB_7){
            $daily_info["job7_count"]++;
        }elseif($member["job"] == JOB_8){
            $daily_info["job8_count"]++;
        }elseif($member["job"] == JOB_9){
            $daily_info["job9_count"]++;
        }elseif($member["job"] == JOB_10){
            $daily_info["job10_count"]++;
        }elseif($member["job"] == JOB_11){
            $daily_info["job11_count"]++;
        }
    }

    /**
     * 日次店舗情報都道府県を集計
     * @param $daily_info
     * @param $member
     */
    private static function setPrefecture(&$daily_info, $member)
    {
        if($member["prefecture"] == PREFECTURE_1){
            $daily_info["prefecture01"]++;
        }elseif($member["prefecture"] == PREFECTURE_2){
            $daily_info["prefecture02"]++;
        }elseif($member["prefecture"] == PREFECTURE_3){
            $daily_info["prefecture03"]++;
        }elseif($member["prefecture"] == PREFECTURE_4){
            $daily_info["prefecture04"]++;
        }elseif($member["prefecture"] == PREFECTURE_5){
            $daily_info["prefecture05"]++;
        }elseif($member["prefecture"] == PREFECTURE_6){
            $daily_info["prefecture06"]++;
        }elseif($member["prefecture"] == PREFECTURE_7){
            $daily_info["prefecture07"]++;
        }elseif($member["prefecture"] == PREFECTURE_8){
            $daily_info["prefecture08"]++;
        }elseif($member["prefecture"] == PREFECTURE_9){
            $daily_info["prefecture09"]++;
        }elseif($member["prefecture"] == PREFECTURE_10){
            $daily_info["prefecture10"]++;
        }elseif($member["prefecture"] == PREFECTURE_11){
            $daily_info["prefecture11"]++;
        }elseif($member["prefecture"] == PREFECTURE_12){
            $daily_info["prefecture12"]++;
        }elseif($member["prefecture"] == PREFECTURE_13){
            $daily_info["prefecture13"]++;
        }elseif($member["prefecture"] == PREFECTURE_14){
            $daily_info["prefecture14"]++;
        }elseif($member["prefecture"] == PREFECTURE_15){
            $daily_info["prefecture15"]++;
        }elseif($member["prefecture"] == PREFECTURE_16){
            $daily_info["prefecture16"]++;
        }elseif($member["prefecture"] == PREFECTURE_17){
            $daily_info["prefecture17"]++;
        }elseif($member["prefecture"] == PREFECTURE_18){
            $daily_info["prefecture18"]++;
        }elseif($member["prefecture"] == PREFECTURE_19){
            $daily_info["prefecture19"]++;
        }elseif($member["prefecture"] == PREFECTURE_20){
            $daily_info["prefecture20"]++;
        }elseif($member["prefecture"] == PREFECTURE_21){
            $daily_info["prefecture21"]++;
        }elseif($member["prefecture"] == PREFECTURE_22){
            $daily_info["prefecture22"]++;
        }elseif($member["prefecture"] == PREFECTURE_23){
            $daily_info["prefecture23"]++;
        }elseif($member["prefecture"] == PREFECTURE_24){
            $daily_info["prefecture24"]++;
        }elseif($member["prefecture"] == PREFECTURE_25){
            $daily_info["prefecture25"]++;
        }elseif($member["prefecture"] == PREFECTURE_26){
            $daily_info["prefecture26"]++;
        }elseif($member["prefecture"] == PREFECTURE_27){
            $daily_info["prefecture27"]++;
        }elseif($member["prefecture"] == PREFECTURE_28){
            $daily_info["prefecture28"]++;
        }elseif($member["prefecture"] == PREFECTURE_29){
            $daily_info["prefecture29"]++;
        }elseif($member["prefecture"] == PREFECTURE_30){
            $daily_info["prefecture30"]++;
        }elseif($member["prefecture"] == PREFECTURE_31){
            $daily_info["prefecture31"]++;
        }elseif($member["prefecture"] == PREFECTURE_32){
            $daily_info["prefecture32"]++;
        }elseif($member["prefecture"] == PREFECTURE_33){
            $daily_info["prefecture33"]++;
        }elseif($member["prefecture"] == PREFECTURE_34){
            $daily_info["prefecture34"]++;
        }elseif($member["prefecture"] == PREFECTURE_35){
            $daily_info["prefecture35"]++;
        }elseif($member["prefecture"] == PREFECTURE_36){
            $daily_info["prefecture36"]++;
        }elseif($member["prefecture"] == PREFECTURE_37){
            $daily_info["prefecture37"]++;
        }elseif($member["prefecture"] == PREFECTURE_38){
            $daily_info["prefecture38"]++;
        }elseif($member["prefecture"] == PREFECTURE_39){
            $daily_info["prefecture39"]++;
        }elseif($member["prefecture"] == PREFECTURE_40){
            $daily_info["prefecture40"]++;
        }elseif($member["prefecture"] == PREFECTURE_41){
            $daily_info["prefecture41"]++;
        }elseif($member["prefecture"] == PREFECTURE_42){
            $daily_info["prefecture42"]++;
        }elseif($member["prefecture"] == PREFECTURE_43){
            $daily_info["prefecture43"]++;
        }elseif($member["prefecture"] == PREFECTURE_44){
            $daily_info["prefecture44"]++;
        }elseif($member["prefecture"] == PREFECTURE_45){
            $daily_info["prefecture45"]++;
        }elseif($member["prefecture"] == PREFECTURE_46){
            $daily_info["prefecture46"]++;
        }elseif($member["prefecture"] == PREFECTURE_47){
            $daily_info["prefecture47"]++;
        }
    }

    /**
     * 日次店舗情報初期化
     * @param $store
     * @param $date
     * @return array
     */
    private static function setInitialDailyInfo($store, $date){
        $daily_info = array();

        $daily_info["date"] = date('Y-m-d', strtotime($date));
        $daily_info["company_id"] = $store["company_id"];
        $daily_info["brand_id"] = $store["brand_id"];
        $daily_info["store_id"] = $store["store_id"];
        $daily_info["register_count"] = 0;
        $daily_info["leaver_count"] = 0;
        $daily_info["men_count"] = 0;
        $daily_info["women_count"] = 0;
        $daily_info["10s_count"] = 0;
        $daily_info["20s_count"] = 0;
        $daily_info["30s_count"] = 0;
        $daily_info["40s_count"] = 0;
        $daily_info["50s_count"] = 0;
        $daily_info["60s_count"] = 0;
        $daily_info["70s_count"] = 0;
        $daily_info["80s_count"] = 0;
        $daily_info["90s_count"] = 0;
        $daily_info["job1_count"] = 0;
        $daily_info["job2_count"] = 0;
        $daily_info["job3_count"] = 0;
        $daily_info["job4_count"] = 0;
        $daily_info["job5_count"] = 0;
        $daily_info["job6_count"] = 0;
        $daily_info["job7_count"] = 0;
        $daily_info["job8_count"] = 0;
        $daily_info["job9_count"] = 0;
        $daily_info["job10_count"] = 0;
        $daily_info["job11_count"] = 0;
        $daily_info["prefecture01"] = 0;
        $daily_info["prefecture02"] = 0;
        $daily_info["prefecture03"] = 0;
        $daily_info["prefecture04"] = 0;
        $daily_info["prefecture05"] = 0;
        $daily_info["prefecture06"] = 0;
        $daily_info["prefecture07"] = 0;
        $daily_info["prefecture08"] = 0;
        $daily_info["prefecture09"] = 0;
        $daily_info["prefecture10"] = 0;
        $daily_info["prefecture11"] = 0;
        $daily_info["prefecture12"] = 0;
        $daily_info["prefecture13"] = 0;
        $daily_info["prefecture14"] = 0;
        $daily_info["prefecture15"] = 0;
        $daily_info["prefecture16"] = 0;
        $daily_info["prefecture17"] = 0;
        $daily_info["prefecture18"] = 0;
        $daily_info["prefecture19"] = 0;
        $daily_info["prefecture20"] = 0;
        $daily_info["prefecture21"] = 0;
        $daily_info["prefecture22"] = 0;
        $daily_info["prefecture23"] = 0;
        $daily_info["prefecture24"] = 0;
        $daily_info["prefecture25"] = 0;
        $daily_info["prefecture26"] = 0;
        $daily_info["prefecture27"] = 0;
        $daily_info["prefecture28"] = 0;
        $daily_info["prefecture29"] = 0;
        $daily_info["prefecture30"] = 0;
        $daily_info["prefecture31"] = 0;
        $daily_info["prefecture32"] = 0;
        $daily_info["prefecture33"] = 0;
        $daily_info["prefecture34"] = 0;
        $daily_info["prefecture35"] = 0;
        $daily_info["prefecture36"] = 0;
        $daily_info["prefecture37"] = 0;
        $daily_info["prefecture38"] = 0;
        $daily_info["prefecture39"] = 0;
        $daily_info["prefecture40"] = 0;
        $daily_info["prefecture41"] = 0;
        $daily_info["prefecture42"] = 0;
        $daily_info["prefecture43"] = 0;
        $daily_info["prefecture44"] = 0;
        $daily_info["prefecture45"] = 0;
        $daily_info["prefecture46"] = 0;
        $daily_info["prefecture47"] = 0;

        return $daily_info;
    }
}