<?php

namespace Fuel\Tasks;

class monthly_store_info
{
    public static function run($args = null)
    {

        try {
            \Additional_Log::info(' 【MONTHLY STORE INFORMATION BATCH】: START');
            \DB::start_transaction(MASTER);

            // 引数取得
            // 引数指定は『php oil r monthly_store_info -f=2016-06 -t=2016-10』で指定
            $original_month_from = \Cli::option('f');
            $original_month_to   = \Cli::option('t');
            $target_month        = \Cli::option('d');

            //  期間指定時
            if (isset($original_month_from) || isset($original_month_to)) {
                $original_month_from = date('Y-m-01', strtotime($original_month_from));
                $original_month_to   = date('Y-m-01', strtotime($original_month_to.'+1 month'));
            // 対象日指定時
            }elseif(isset($target_month)){
                $original_month_from = date('Y-m-01', strtotime($target_month));
                $original_month_to   = date('Y-m-01', strtotime($original_month_from.'+1 month'));
            // 期間指定が無い、もしくは一方の指定しか無い場合は前日を指定日として設定
            }else{
                $original_month_from = date('Y-m-01', strtotime('-1 month'));
                $original_month_to   = date('Y-m-01', strtotime(date('Y-m')));
            }

            // 集計対象店舗取得
            $stores = self::getAllActiveStores();

            foreach($stores as $store){
                \Additional_Log::info('【MONTHLY STORE INFORMATION BATCH】- START STORE: '. $store['store_id']);

                // 期間初期化
                $month_from = $original_month_from;
                $month_to   = $original_month_to;

                while (strtotime($month_from) < strtotime($month_to)) {
                    // 対象日FROM TO生成
                    $previous_month = date('Y-m-d', strtotime($month_from));
                    $next_month     = date('Y-m-d', strtotime($previous_month . '+1 month'));
                    $month          = date('Y-m', strtotime($previous_month));
                    \Additional_Log::info('【MONTHLY STORE INFORMATION BATCH】-- MONTH: '. $month);

                    // 集計情報取得
                    $aggregate_info = self::calDailyStoreInfo($store, $previous_month, $next_month);
                    \Additional_Log::info('【MONTHLY STORE INFORMATION BATCH】-- GET AGGREGATE INFO');

                    // 既存情報チェック
                    $check_monthly_info = \Model_Monthly_Store_Info::findById($month, $store['company_id'], $store['brand_id'], $store['store_id']);

                    if(empty($check_monthly_info)){
                        // 新規登録
                        $result = \Model_Monthly_Store_Info::insertMonthlyStoreInfo($month, $aggregate_info[0]);
                        \Additional_Log::info('【MONTHLY STORE INFORMATION BATCH】-- INSERT MONTHLY STORE INFO: '.$result);
                    }else{
                        // 更新処理
                        $result = \Model_Monthly_Store_Info::updateMonthlyStoreInfo($check_monthly_info, $aggregate_info[0]);
                        \Additional_Log::info('【MONTHLY STORE INFORMATION BATCH】-- UPDATE MONTHLY STORE INFO: '.$result);
                    }

                    $month_from = date('Y-m-d H:i:s', strtotime($month_from . '+1 month'));
                }
            }

            \DB::commit_transaction(MASTER);
            \Additional_Log::info('【MONTHLY STORE INFORMATION BATCH】: END');
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
     * 月次店舗情報集計処理
     * @param $store
     * @param $month_from
     * @param $month_to
     * @return mixed
     */
    private static function calDailyStoreInfo($store, $month_from, $month_to){
        $query = \DB::select(
            "company_id","brand_id","store_id"
            , \DB::expr("SUM(register_count) as register_count")
            , \DB::expr("SUM(leaver_count) as leaver_count")
            , \DB::expr("SUM(men_count) as men_count")
            , \DB::expr("SUM(women_count) as women_count")
            , \DB::expr("SUM(10s_count) as 10s_count")
            , \DB::expr("SUM(20s_count) as 20s_count")
            , \DB::expr("SUM(30s_count) as 30s_count")
            , \DB::expr("SUM(40s_count) as 40s_count")
            , \DB::expr("SUM(50s_count) as 50s_count")
            , \DB::expr("SUM(60s_count) as 60s_count")
            , \DB::expr("SUM(70s_count) as 70s_count")
            , \DB::expr("SUM(80s_count) as 80s_count")
            , \DB::expr("SUM(90s_count) as 90s_count")
            , \DB::expr("SUM(job1_count) as job1_count")
            , \DB::expr("SUM(job2_count) as job2_count")
            , \DB::expr("SUM(job3_count) as job3_count")
            , \DB::expr("SUM(job4_count) as job4_count")
            , \DB::expr("SUM(job5_count) as job5_count")
            , \DB::expr("SUM(job6_count) as job6_count")
            , \DB::expr("SUM(job7_count) as job7_count")
            , \DB::expr("SUM(job8_count) as job8_count")
            , \DB::expr("SUM(job9_count) as job9_count")
            , \DB::expr("SUM(job10_count) as job10_count")
            , \DB::expr("SUM(job11_count) as job11_count")
            , \DB::expr("SUM(prefecture01) as prefecture01")
            , \DB::expr("SUM(prefecture02) as prefecture02")
            , \DB::expr("SUM(prefecture03) as prefecture03")
            , \DB::expr("SUM(prefecture04) as prefecture04")
            , \DB::expr("SUM(prefecture05) as prefecture05")
            , \DB::expr("SUM(prefecture06) as prefecture06")
            , \DB::expr("SUM(prefecture07) as prefecture07")
            , \DB::expr("SUM(prefecture08) as prefecture08")
            , \DB::expr("SUM(prefecture09) as prefecture09")
            , \DB::expr("SUM(prefecture10) as prefecture10")
            , \DB::expr("SUM(prefecture11) as prefecture11")
            , \DB::expr("SUM(prefecture12) as prefecture12")
            , \DB::expr("SUM(prefecture13) as prefecture13")
            , \DB::expr("SUM(prefecture14) as prefecture14")
            , \DB::expr("SUM(prefecture15) as prefecture15")
            , \DB::expr("SUM(prefecture16) as prefecture16")
            , \DB::expr("SUM(prefecture17) as prefecture17")
            , \DB::expr("SUM(prefecture18) as prefecture18")
            , \DB::expr("SUM(prefecture19) as prefecture19")
            , \DB::expr("SUM(prefecture20) as prefecture20")
            , \DB::expr("SUM(prefecture21) as prefecture21")
            , \DB::expr("SUM(prefecture22) as prefecture22")
            , \DB::expr("SUM(prefecture23) as prefecture23")
            , \DB::expr("SUM(prefecture24) as prefecture24")
            , \DB::expr("SUM(prefecture25) as prefecture25")
            , \DB::expr("SUM(prefecture26) as prefecture26")
            , \DB::expr("SUM(prefecture27) as prefecture27")
            , \DB::expr("SUM(prefecture28) as prefecture28")
            , \DB::expr("SUM(prefecture29) as prefecture29")
            , \DB::expr("SUM(prefecture30) as prefecture30")
            , \DB::expr("SUM(prefecture31) as prefecture31")
            , \DB::expr("SUM(prefecture32) as prefecture32")
            , \DB::expr("SUM(prefecture33) as prefecture33")
            , \DB::expr("SUM(prefecture34) as prefecture34")
            , \DB::expr("SUM(prefecture35) as prefecture35")
            , \DB::expr("SUM(prefecture36) as prefecture36")
            , \DB::expr("SUM(prefecture37) as prefecture37")
            , \DB::expr("SUM(prefecture38) as prefecture38")
            , \DB::expr("SUM(prefecture39) as prefecture39")
            , \DB::expr("SUM(prefecture40) as prefecture40")
            , \DB::expr("SUM(prefecture41) as prefecture41")
            , \DB::expr("SUM(prefecture42) as prefecture42")
            , \DB::expr("SUM(prefecture43) as prefecture43")
            , \DB::expr("SUM(prefecture44) as prefecture44")
            , \DB::expr("SUM(prefecture45) as prefecture45")
            , \DB::expr("SUM(prefecture46) as prefecture46")
            , \DB::expr("SUM(prefecture47) as prefecture47")
        );
        $query->from('daily_store_info');
        $query->where('company_id', '=', $store["company_id"]);
        $query->and_where('brand_id', '=', $store["brand_id"]);
        $query->and_where('store_id', '=', $store["store_id"]);
        $query->and_where('date', '>=', $month_from);
        $query->and_where('date', '<', $month_to);
        $query->group_by('company_id', 'brand_id', 'store_id');
        $result = $query->execute(SLAVE);

        return $result;
    }
}