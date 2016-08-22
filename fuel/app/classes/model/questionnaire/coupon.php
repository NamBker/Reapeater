<?php

class Model_Questionnaire_Coupon extends \Model_Standard_Model
{
    protected static $_primary_key = array('questionnaire_id', 'count');
    protected static $_properties = array(
        'questionnaire_id' => array(
            'expose_pattern' => 1,
        ),
        'count' => array(
            'data_type' => 'smallint',
            'null' => true,
            'default' => 0,
            'validation' => array(
                'is_numeric'
            ),
            'label' => '回答数',
            'expose_pattern' => 1,
        ),
        'coupon_id' => array(
            'data_type' => 'int',
            'null' => true,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    4294967295,
                ),
            ),
            'label' => 'クーポンID',
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
    );

    protected static $_to_array_exclude = array(
        'created_at', 'updated_at',
    );

    /**
     * キー情報からレコードを取得
     * @param $questionnaire_id
     * @param $count
     * @return \Orm\Model|\Orm\Model[]
     */
    public static function findById($questionnaire_id, $count)
    {
        return static::find('first', array(
            'where' => array(
                'questionnaire_id' => $questionnaire_id,
                'count' => $count
            ),
        ));
    }

    /**
     * 登録処理
     * @param $param
     * @param null $id
     * @throws ProtocolException
     */
    public static function insertQuestionnaireCoupon($param, $id = null){
        $questionnaire_id = isset($id) ? $id : $param['questionnaire_id'];

        // 存在チェック
        $coupon = self::findById($questionnaire_id, $param['count']);
        if(empty($coupon)){
            $questionnaire_coupon = static::forge(array(
                'questionnaire_id' => $questionnaire_id
                ,'count' => $param['count']
                ,'coupon_id' => $param['coupon_id']
            ));
            $questionnaire_coupon->save();

            \Additional_Log::debug('【QUESTIONNAIRE CREATE API】: ADD QUESTIONNAIRE COUPON RECORD : '. $questionnaire_id. " / ".$param['count']);
        }else{
            throw new \ProtocolException(\Lang::get('coupon_count_is_already_registration').'['.$questionnaire_id." / ".$param['count'], "Questionnaire_coupon is exist.", \ProtocolException::RESULT_CODE_QUESTIONNAIRES_COUPON_RECORD_IS_ALREADY_EXIST);
        }
    }

    /**
     * 更新処理
     * @param $param
     * @throws ProtocolException
     */
    public static function updateQuestionnaireCoupon($param)
    {
        $coupon = self::findById($param["questionnaire_id"], $param['count']);
        if(!empty($coupon)){
            // 更新 or 削除(除外)処理判定
            if($param["del_flg"] != QUESTIONNAIRES_DO_DELETE){
                // 更新処理
                $coupon->coupon_id = $param['coupon_id'];
                $coupon->save();

                \Additional_Log::debug('【QUESTIONNAIRE UPDATE API】:'.$param["questionnaire_id"]." / ".$param['count']);
            }else{
                // 削除処理実施
                self::deleteQuestionnaireCoupon($coupon);
                \Additional_Log::debug('【QUESTIONNAIRE UPDATE API】: DELETE QUESTIONNAIRE COUPON RECORD : '. $param["questionnaire_id"]. " / ".$param['count']);
            }
        }else{
            throw new \ProtocolException(\Lang::get('questionnaires_is_not_registration'), "Questionnaire coupon is not exist.", \ProtocolException::RESULT_CODE_QUESTIONNAIRES_COUPON_NOT_FOUND);
        }
    }

    /**
     * 削除処理
     * @param $coupon
     */
    public static function deleteQuestionnaireCoupon($coupon)
    {
        $coupon->delete();
    }
}
