<?php

namespace Fuel\Tasks;

class daily_delivery_info
{
    public static function run($args = null)
    {

        try {
            \Additional_Log::info('【DAILY DELIVERY INFORMATION BATCH】:START');
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

            \Additional_Log::info('【DAILY DELIVERY INFORMATION BATCH】- PROCESS TARGET['. $original_date_from . ' ～ ' . $original_date_to);

            // 期間設定
            $date_from = $original_date_from;
            $date_to   = $original_date_to;

            while (strtotime($date_from) < strtotime($date_to)) {
                // 対象日FROM TO生成
                \Additional_Log::info('【DAILY DELIVERY INFORMATION BATCH】-- DATE:'. $date_from);
                $previous_day = date('Y-m-d H:i:s', strtotime($date_from));
                $next_day     = date('Y-m-d H:i:s', strtotime($previous_day . '+1 day'));

                // 対象日の配信情報取得
                $delivery_info = self::getDeliveryInfo($previous_day, $next_day);
                \Additional_Log::info('【DAILY DELIVERY INFORMATION BATCH】-- DELIVERY COUNT: '. count($delivery_info));

                foreach($delivery_info as $delivery_object){
                    // 店舗情報取得
                    $store_info = \Model_store::find($delivery_object["store_id"]);
                    // ブランド情報取得
                    $brand_info = \Model_brand::findById($store_info["brand_id"]);

                    if(!empty($store_info) && !empty($brand_info)){
                        // 日次配信情報設定
                        $set_date = date('Y-m-d', strtotime($previous_day));
                        $new_daily_delivery_info = self::setDailyDelivery($set_date, $delivery_object, $brand_info, $store_info);
                        \Additional_Log::info('【DAILY DELIVERY INFORMATION BATCH】--- SET DAILY DELIVERY AGGREGATE');

                        // 日時配信情報登録・更新処理
                        $original_daily_delivery_info = \Model_Daily_Delivery_Info::findById($set_date, $delivery_object["delivery_id"], $brand_info["company_id"], $store_info["brand_id"], $store_info["id"]);
                        \Additional_Log::info('【DAILY DELIVERY INFORMATION BATCH】--- GET DAILY DELIVERY INFO IN THE PAST');

                        if(empty($original_daily_delivery_info)){
                            // 新規登録処理
                            \Model_Daily_Delivery_Info::insertDailyDelivery($new_daily_delivery_info);
                            \Additional_Log::info('【DAILY DELIVERY INFORMATION BATCH】--- INSERT DAILY DELIVERY INFO['.$set_date.'/'.$delivery_object["delivery_id"].'/'.$brand_info["company_id"].'/'.$store_info["brand_id"].'/'.$store_info["id"].']');
                        }else{
                            // 更新処理
                            \Model_Daily_Delivery_Info::updateDailyDelivery($original_daily_delivery_info, $new_daily_delivery_info);
                            \Additional_Log::info('【DAILY DELIVERY INFORMATION BATCH】--- UPDATE DAILY DELIVERY INFO['.$set_date.'/'.$delivery_object["delivery_id"].'/'.$brand_info["company_id"].'/'.$store_info["brand_id"].'/'.$store_info["id"].']');
                        }
                    }
                }

//                print_r(var_dump($delivery_info));die();

                $date_from = date('Y-m-d H:i:s', strtotime($previous_day . '+1 day'));
            }

            \DB::commit_transaction(MASTER);
            \Additional_Log::info('【DAILY DELIVERY INFORMATION BATCH】:END');
        } catch (\Exception $e) {
            \Additional_Log::error("[task][run][unknown][error]{$e->getMessage()}");
            \DB::rollback_transaction(MASTER);
            throw $e;
        }
    }

    /**
     * 対象日に配信した配信情報取得
     * @param $date_from
     * @param $date_to
     * @return mixed
     */
    private static function getDeliveryInfo($date_from, $date_to)
    {
        $query = \DB::select(
            'delivery_date'
            , 'delivery_id'
            , 'store_id'
            , \DB::expr('COUNT(member_id) as total')
            , \DB::expr('COUNT(site_reference = 0 or null) as reach')
            , \DB::expr('COUNT(site_reference = 1 or null) as open')
            , \DB::expr('COUNT(site_reference = 2 or null) as error')
        )->from('member_delivery_histories');
        $query->where('delivery_date', '>=', $date_from);
        $query->and_where('delivery_date', '<', $date_to);
        $query->group_by('delivery_date', 'delivery_id', 'store_id');
        $result = $query->execute(SLAVE);

        return $result;
    }

    /**
     * 日次配信情報初期化
     * @param $date
     * @param $delivery_object
     * @param $brand_info
     * @param $store_info
     * @return array
     */
    private static function setDailyDelivery($date, $delivery_object, $brand_info, $store_info)
    {
        $daily_delivery = array();

        $daily_delivery["delivery_date"] = date('Y-m-d', strtotime($date));
        $daily_delivery["delivery_id"] = $delivery_object["delivery_id"];
        $daily_delivery["company_id"] = $brand_info["company_id"];
        $daily_delivery["brand_id"] = $store_info["brand_id"];
        $daily_delivery["store_id"] = $store_info["id"];
        $daily_delivery["delivery_total"] = $delivery_object["total"];
        $daily_delivery["reach_count"] = $delivery_object["reach"];
        $daily_delivery["open_count"] = $delivery_object["open"];
        $daily_delivery["visit_count"] = 0;

        return $daily_delivery;
    }

}