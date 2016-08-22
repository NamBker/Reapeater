<?php

class Model_Questionnaire_Respond extends \Model_Standard_Model
{
    protected static $_properties = array(
        'id' => array(
            'expose_pattern' => 1,
            'data_type'  => 'int',
        ),
        'questionnaire_id' => array(
            'expose_pattern' => 1,
            'data_type'  => 'int',
        ),
        'questionnaire_id' => array(
            'expose_pattern' => 1,
            'data_type'  => 'int',
        ),
        'question_id' => array(
            'expose_pattern' => 1,
            'data_type'  => 'int',
        ),
        'questionnaire_required' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    1,
                ),
            ),
            'label' => '必須可否',
            'expose_pattern' => 2,
        ),
        'questionnaire_order' => array(
            'data_type' => 'smallint',
            'null' => true,
            'default' => 0,
            'validation' => array(
                'is_numeric'
            ),
            'label' => '表示順',
            'expose_pattern' => 2,
        ),
        'question_status' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    1,
                ),
            ),
            'label' => '状態',
            'expose_pattern' => 2,
        ),
        'update_flg' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    1,
                ),
            ),
            'label' => '更新不可フラグ',
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

    protected static $_belongs_to = array(
        'questionnaire' => array(
            'model_to' => 'Model_Questionnaire',
            'key_from' => 'questionnaire_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'question' => array(
            'model_to' => 'Model_Question',
            'key_from' => 'question_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );

    protected static $_has_many = array(
        'questionnaire_analysis' => array(
            'key_from' => array('questionnaire_id', 'question_id'),
            'model_to' => 'Model_Questionnaire_Analysis',
            'key_to' => array('questionnaire_id', 'question_id'),
            'cascade_save' => true,
            'cascade_delete' => true,
        ),
    );

    protected static $_to_array_exclude = array(
        'created_at', 'updated_at',
    );

    /**
     * キー情報からレコードを取得
     * @param $questionnaire_id
     * @param $question_id
     * @return \Orm\Model|\Orm\Model[]
     */
    public static function findById($questionnaire_id, $question_id)
    {
        return static::find('first', array(
            'where' => array(
                'questionnaire_id' => $questionnaire_id,
                'question_id' => $question_id
            ),
        ));
    }

    /**
     * 登録処理
     * @param null $id
     * @param $param
     * @throws ProtocolException
     */
    public static function insertQuestionnaireRespond($param, $id = null)
    {
        $questionnaire_id = isset($id) ? $id : $param['questionnaire_id'];
        // 存在チェック
        $respond = self::findById($questionnaire_id, $param['question_id']);
        if(empty($respond)){
            $questionnaire_respond = static::forge(array(
                'questionnaire_id' => $questionnaire_id
                ,'question_id' => $param['question_id']
                ,'questionnaire_required' => $param['questionnaire_required']
                ,'questionnaire_order' => $param['questionnaire_order']
                ,'question_status' => $param['question_status']
                ,'update_flg' => $param['update_flg']
            ));
            $questionnaire_respond->save();

            \Additional_Log::debug('【QUESTIONNAIRE CREATE API】: ADD QUESTIONNAIRE RESPOND RECORD : '. $questionnaire_id. " / ".$param['question_id']);
        }else{
            throw new \ProtocolException(\Lang::get('question_already_registration').'['.$questionnaire_id." / ".$param['question_id'], "Questionnaire_respond is exist.", \ProtocolException::RESULT_CODE_QUESTIONNAIRES_RESPOND_RECORD_IS_ALREADY_EXIST);
        }
    }

    /**
     * 更新処理
     * @param $param
     * @throws ProtocolException
     */
    public static function updateQuestionnaireRespond($param)
    {
        $respond = self::findById($param["questionnaire_id"], $param['question_id']);
        if(!empty($respond)){
            // 更新 or 削除(除外)処理判定
            if($param["del_flg"] != QUESTIONNAIRES_DO_DELETE){
                // 更新処理
                $respond->questionnaire_required = $param['questionnaire_required'];
                $respond->questionnaire_order = $param['questionnaire_order'];
                $respond->question_status = $param['question_status'];
                $respond->update_flg = $param['update_flg'];
                $respond->save();

                \Additional_Log::debug('【QUESTIONNAIRE UPDATE API】:'.$param["questionnaire_id"]." / ".$param['question_id']);
            }else{
                // 削除処理実施
                self::deleteQuestionnaireRespond($respond);
                \Additional_Log::debug('【QUESTIONNAIRE UPDATE API】: DELETE QUESTIONNAIRE RESPOND RECORD : '. $param["questionnaire_id"]. " / ".$param['question_id']);
            }
        }else{
            throw new \ProtocolException(\Lang::get('question_is_not_registration'), "Questionnaire respond is not exist.", \ProtocolException::RESULT_CODE_QUESTIONNAIRES_RESPOND_NOT_FOUND);
        }
    }

    /**
     * 削除処理（アンケートからの除外）
     * @param $respond
     */
    public static function deleteQuestionnaireRespond($respond)
    {
        $respond->delete();
    }
}
