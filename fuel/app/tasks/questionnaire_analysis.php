<?php

namespace Fuel\Tasks;

class questionnaire_analysis
{
    public static function run($args = null)
    {

        try {
            \Additional_Log::info('【QUESTIONNAIRE ANALYSIS BATCH】:START');
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

            \Additional_Log::info('【QUESTIONNAIRE ANALYSIS BATCH】- PROCESS TARGET['. $original_date_from . ' ～ ' . $original_date_to);

            // 期間設定
            $date_from = $original_date_from;
            $date_to   = $original_date_to;

            while (strtotime($date_from) < strtotime($date_to)) {
                // 対象日FROM TO生成
                \Additional_Log::info('【QUESTIONNAIRE ANALYSIS BATCH】-- DATE:'. $date_from);
                $previous_day = date('Y-m-d H:i:s', strtotime($date_from));
                $next_day     = date('Y-m-d H:i:s', strtotime($previous_day . '+1 day'));

                // 回答期限内のアンケート情報取得
                $questionnaires = self::getQuestionnaireInfo($previous_day, $next_day);
                foreach($questionnaires as $questionnaire){
                    // アンケート回答集計
                    $responds = self::getAggregation($questionnaire["id"], $previous_day, $next_day);
                    \Additional_Log::info('【QUESTIONNAIRE ANALYSIS BATCH】--- QUESTION_ID: '.$questionnaire["id"]);

                    foreach($responds as $respond){
                        // 既存TBLを検索
                        $analysis = \Model_Questionnaire_Analysis::findById($previous_day, $questionnaire["store_id"], $respond["questionnaire_id"], $respond["question_id"], $respond["question_response"]);

                        // 登録・更新用パラム設定
                        $params = self::setParams($previous_day, $questionnaire, $respond);
                        if(empty($analysis)){
                            // 新規登録処理
                            \Model_Questionnaire_Analysis::insertQuestionnaireAnalysis($params);
                            \Additional_Log::info('【QUESTIONNAIRE ANALYSIS BATCH】---- INSERT[STORE_ID='.$questionnaire["store_id"].'/question_id='.$respond["question_id"].']');
                        }else{
                            // 更新処理
                            \Model_Questionnaire_Analysis::updateQuestionnaireAnalysis($analysis, $params);
                            \Additional_Log::info('【QUESTIONNAIRE ANALYSIS BATCH】---- UPDATE[STORE_ID='.$questionnaire["store_id"].'/question_id='.$respond["question_id"].']');
                        }
                    }
                }
//                print_r(var_dump($delivery_info));die();

                $date_from = date('Y-m-d H:i:s', strtotime($previous_day . '+1 day'));
            }

            \DB::commit_transaction(MASTER);
            \Additional_Log::info('【QUESTIONNAIRE ANALYSIS BATCH】:END');
        } catch (\Exception $e) {
            \Additional_Log::error("[task][run][unknown][error]{$e->getMessage()}");
            \DB::rollback_transaction(MASTER);
            throw $e;
        }
    }

    /**
     * パラム設定
     * @param $date
     * @param $questionnaire
     * @param $respond
     * @return array
     */
    private static function setParams($date, $questionnaire, $respond)
    {
        $param = array();
        $param["date"] = $date;
        $param["store_id"] = $questionnaire["store_id"];
        $param["questionnaire_id"] = $respond["questionnaire_id"];
        $param["question_id"] = $respond["question_id"];
        $param["question_response"] = $respond["question_response"];
        $param["question_response_count"] = $respond["respond_count"];

        return $param;
    }

    /**
     * アンケート回答集計
     * @param $questionnaires_id
     * @param $date_from
     * @param $date_to
     * @return mixed
     */
    private static function getAggregation($questionnaires_id, $date_from, $date_to)
    {
        $query = \DB::select(
                    'questionnaire_id'
                    ,'question_id'
                    ,'question_response'
                    ,\DB::expr('COUNT(question_response) as respond_count')
                )->from('member_questionnaire_responds');
        $query->where('questionnaire_id', $questionnaires_id);
        $query->and_where('updated_at', '>=', $date_from);
        $query->and_where('updated_at', '<', $date_to);
        $query->group_by('questionnaire_id', 'question_id', 'question_response');
        $result = $query->execute(SLAVE);

        return $result;
    }

    /**
     * 期間内アンケート情報返却
     * @param $date_from
     * @return mixed
     */
    private static function getQuestionnaireInfo($date_from)
    {
        $query = \DB::select('id','company_id','brand_id','store_id')->from('questionnaires');
        $query->where('questionnaire_release_flg', DELIVERY_RELEASE_FLG_PUBLISHED);
        $query->and_where('questionnaire_deleted_flg', DELETION_OFF);
        $query->and_where('questionnaire_limit', '>=', $date_from);
        $result = $query->execute(SLAVE);

        return $result;
    }

}