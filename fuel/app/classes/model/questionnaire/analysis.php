<?php

class Model_Questionnaire_Analysis extends \Model_Standard_Model
{
    protected static $_table_name = "questionnaire_analysis";
    protected static $_primary_key = array('date', 'store_id', 'questionnaire_id', 'question_id', 'question_response');
    protected static $_properties = array(
        'date' => array(
            'data_type' => 'string',
            'label' => '対象日',
            'expose_pattern' => 1,
        ),
        'store_id' => array(
            'data_type' => 'int',
            'label' => '店舗ID',
            'expose_pattern' => 1,
        ),
        'questionnaire_id' => array(
            'data_type' => 'int',
            'label' => 'アンケートID',
            'expose_pattern' => 1,
        ),
        'question_id' => array(
            'data_type' => 'int',
            'label' => '質問ID',
            'expose_pattern' => 1,
        ),
        'question_response' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'max_length' => array(
                    64,
                ),
            ),
            'label' => 'アンケート回答',
            'expose_pattern' => 2,
        ),
        'question_response_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'is_numeric',
            ),
            'label' => '回答数',
            'expose_pattern' => 2,
        ),
        'created_at' => array(
            'data_type' => 'datetime',
            'expose_type' => 'null',
        ),
        'updated_at' => array(
            'data_type' => 'datetime',
            'expose_type' => 'null',
        ),
    );

    protected $_belongs_to = array(
        'key_from' => 'question_id',
        'model_to' => 'Model_Question',
        'key_to' => 'id',
        'cascade_save' => false,
        'cascade_delete' => false,
    );

    /**
     * キー情報からレコードを取得
     * @param $date
     * @param $store_id
     * @param $questionnaire_id
     * @param $question_id
     * @param $question_response
     * @return \Orm\Model|\Orm\Model[]
     */
    public static function findById($date, $store_id, $questionnaire_id, $question_id, $question_response)
    {
        $target = date('Y-m-d', strtotime($date));

        return static::find('first', array(
            'where' => array(
                'date' => $target,
                'store_id' => $store_id,
                'questionnaire_id' => $questionnaire_id,
                'question_id' => $question_id,
                'question_response' => $question_response,
            ),
        ));
    }

    /**
     * アンケート集計情報登録
     * @param $params
     */
    public static function insertQuestionnaireAnalysis($params)
    {
        $questionnaireAnalysis = static::forge(array(
            'date' => $params['date']
            ,'store_id' => $params['store_id']
            ,'questionnaire_id' => $params['questionnaire_id']
            ,'question_id' => $params['question_id']
            ,'question_response' => $params['question_response']
            ,'question_response_count' => $params['question_response_count']
        ));
        $questionnaireAnalysis->save();
    }

    /**
     * アンケート集計情報更新
     * @param $original_questionnaire_analysis
     * @param $new_questionnaire_analysis
     */
    public static function updateQuestionnaireAnalysis($original_questionnaire_analysis, $new_questionnaire_analysis)
    {
        if(!empty($original_questionnaire_analysis)){
            $original_questionnaire_analysis->question_response_count = $new_questionnaire_analysis["question_response_count"];

            $original_questionnaire_analysis->save();
        }else{
            \Additional_Log::debug('【QUESTIONNAIRE ANALYSIS BATCH】-- NO QUESTIONNAIRE ANALYSIS INFO. SKIP THE PROCESS.');
        }
    }

}
