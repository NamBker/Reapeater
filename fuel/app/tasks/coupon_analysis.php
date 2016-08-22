<?php

namespace Fuel\Tasks;

class coupon_analysis
{
    public static function run($args = null)
    {

        try {
            \Additional_Log::info('【COUPON ANALYSIS BATCH】:START');
            \DB::start_transaction(MASTER);

            // 引数取得
            // 引数指定は『php oil r daily_store_info -f=2016-06-01 -t=2016-06-10』で指定
            $original_date_from  = \Cli::option('f');
            $original_date_to    = \Cli::option('t');
            $target_dates        = \Cli::option('d');

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

            \Additional_Log::info('【COUPON ANALYSIS BATCH】- PROCESS TARGET['. $original_date_from . ' ～ ' . $original_date_to);

            // 期間設定
            $date_from = $original_date_from;
            $date_to   = $original_date_to;

            while (strtotime($date_from) < strtotime($date_to)) {
                // 対象日FROM TO生成
                \Additional_Log::info('【COUPON ANALYSIS BATCH】-- DATE:'. $date_from);
                $previous_day = date('Y-m-d H:i:s', strtotime($date_from));
                $next_day     = date('Y-m-d H:i:s', strtotime($previous_day . '+1 day'));

                // 集計対象クーポンID設定
                // 有効期限内のクーポンID取得
                $coupon_ids = self::getCouponIds($previous_day);

                // クーポン情報処理
                foreach($coupon_ids as $coupon_id){
                    \Additional_Log::info('【COUPON ANALYSIS BATCH】--- COUPON ID: '. $coupon_id);
                    $coupon_store_info = self::calculateCoupon($coupon_id, $previous_day, $next_day);

                    // 店舗情報処理
                    foreach($coupon_store_info as $coupon_store){
                        $type = 2;
                        if(!empty($coupon_store["delivery_id"])){
                            $type = 1; // 配信
                        }
                        // 既存TBLを検索
                        $analysis = \Model_Coupon_Analysis::findById($previous_day, $coupon_store["store_id"], $coupon_id, $type);

                        $params = self::setParam($previous_day, $coupon_id, $type, $coupon_store);
                        if(empty($analysis)){
                            // 新規登録処理
                            \Model_Coupon_Analysis::insertCouponAnalysis($params);
                            \Additional_Log::info('【COUPON ANALYSIS BATCH】---- INSERT[STORE_ID='.$coupon_store["store_id"].'/TYPE='.$type.']');
                        }else{
                            // 更新処理
                            \Model_Coupon_Analysis::updateCouponAnalysis($analysis, $params);
                            \Additional_Log::info('【COUPON ANALYSIS BATCH】---- UPDATE[STORE_ID='.$coupon_store["store_id"].'/TYPE='.$type.']');
                        }
                    }
                }
//                print_r(var_dump($delivery_info));die();

                $date_from = date('Y-m-d H:i:s', strtotime($previous_day . '+1 day'));
            }

            \DB::commit_transaction(MASTER);
            \Additional_Log::info('【COUPON ANALYSIS BATCH】:END');
        } catch (\Exception $e) {
            \Additional_Log::error("[task][run][unknown][error]{$e->getMessage()}");
            \DB::rollback_transaction(MASTER);
            throw $e;
        }
    }

    /**
     * パラム設定
     * @param $date
     * @param $coupon_id
     * @param $type
     * @param $coupon_store
     * @return array
     */
    private static function setParam($date, $coupon_id, $type, $coupon_store){
        $param = array();
        $param["date"] = $date;
        $param["store_id"] = $coupon_store["store_id"];
        $param["coupon_id"] = $coupon_id;
        $param["distribute_type"] = $type;
        $param["display_coupon_count"] = $coupon_store["display_count"];
        $param["used_coupon_count"] = $coupon_store["used_count"];
        $param["display_two_step_coupon_count"] = $coupon_store["display_two_step_count"];
        $param["used_two_step_coupon_count"] = $coupon_store["two_step_used_count"];
        $param["unique_user_count"] = $coupon_store["unique_user_count"];

        return $param;
    }

    /**
     * 対象日のそれぞれの値をクーポンID毎に集計
     * @param $coupon_id
     * @param $previous_day
     * @param $next_day
     * @return mixed
     */
    private static function calculateCoupon($coupon_id, $previous_day, $next_day)
    {
        $query = \DB::select(
            'store_id'
            ,'delivery_id'
            , \DB::expr('COUNT(display_date >= \''.$previous_day.'\' AND display_date < \''.$next_day.'\' or null) as display_count')
            , \DB::expr('COUNT(second_display_date >= \''.$previous_day.'\' AND second_display_date < \''.$next_day.'\' or null) as display_two_step_count')
            , \DB::expr('COUNT(used_date >= \''.$previous_day.'\' AND used_date < \''.$next_day.'\' or null) as used_count')
            , \DB::expr('COUNT(second_used_date >= \''.$previous_day.'\' AND second_used_date < \''.$next_day.'\' or null) as two_step_used_count')
            , \DB::expr('COUNT(distinct member_id) as unique_user_count')
        )->from('member_coupon_histories');
        $query->where('coupon_id',$coupon_id);
        $query->group_by('coupon_id', 'store_id');
        $result = $query->execute(SLAVE);

        return $result;
    }

    /**
     * 集計対象クーポンID一覧取得
     * @param $date
     * @return array
     */
    private static function getCouponIds($date)
    {
        $response = array();

        // 有効期限タイプ 設定なし・期限設定型の有効クーポンID取得
        $query = \DB::select('id')->from('coupons');
        $query->where('coupon_release_flg', DELIVERY_RELEASE_FLG_PUBLISHED);
        $query->and_where('coupon_status', COUPON_STATUS_ACTIVE);
        $query->and_where('coupon_deleted_flg', DELETION_OFF);
        $query->and_where_open()
                    ->where('coupon_limit_type', COUPON_LIMIT_TYPE_UNSET)
                    ->or_where_open()
                        ->where('coupon_limit_type', COUPON_LIMIT_TYPE_SET)
                        ->where('coupon_limit_from', '<=', $date)
                        ->where('coupon_limit_to', '>', $date)
                    ->or_where_close()
                ->and_where_close();
        $type_one_results = $query->execute(SLAVE);
        foreach($type_one_results as $type_one_result){
            $response[] = $type_one_result["id"];
        }

        // 有効期限タイプ メルマガ型の有効クーポンID取得
        $type_two_results = \DB::query(
            'SELECT
                cp.id
            FROM
                coupons cp
            WHERE
                cp.coupon_limit_type='.COUPON_LIMIT_TYPE_MAIL.'
                AND ADDDATE(coupon_delivery_date, coupon_limit_send_start) <= \''.$date.'\'
                AND ADDDATE(coupon_delivery_date, (coupon_limit_send_start + coupon_limit_send_count)) > \''.$date.'\''
        )->execute();

        foreach($type_two_results as $type_two_result){
            if(!in_array($type_two_result["id"], $response)){
                $response[] = $type_two_result["id"];
            }
        }

        return $response;
    }

}