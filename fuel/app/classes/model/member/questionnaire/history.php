<?php

class Model_Member_Questionnaire_History extends \Model_Standard_Model
{
    protected static $_primary_key = array('member_id', 'questionnaire_id');
    protected static $_properties = array(
        'member_id' => array(
            'expose_pattern' => 1,
        ),
        'questionnaire_id' => array(
            'expose_pattern' => 1,
        ),
        'member_delivery_history_id' => array(
            'data_type' => 'bigint',
            'expose_pattern' => 1
        ),
        'random_key' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    64,
                ),
            ),
            'expose_pattern' => 1,
        ),
        'questionnaire_send_date' => array(
            'data_type' => 'datetime',
            'null' => true,
            'expose_pattern' => 2,
        ),
        'questionnaire_respond_date' => array(
            'data_type' => 'datetime',
            'null' => true,
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
        'member' => array(
            'model_to' => 'Model_Member',
            'key_from' => 'member_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'questionnaire' => array(
            'model_to' => 'Model_Questionnaire',
            'key_from' => 'questionnaire_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'member_delivery_history' => array(
            'model_to' => 'Model_Member_Delivery_History',
            'key_from' => 'member_delivery_history_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );

    protected static $_has_many = array(
        'questionnaire_analysis' => array(
            'model_to' => 'Model_Questionnaire_Analysis',
            'key_from' => 'questionnaire_id',
            'key_to' => 'questionnaire_id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );

    protected static $_to_array_exclude = array(
        'created_at', 'updated_at', 'member', 'questionnaire', 'member_delivery_history',
    );

    /**
     * キー検索
     * @param $member_id
     * @param $questionnaire_id
     * @return \Orm\Model|\Orm\Model[]
     */
    public static function findByMemberIdAndQuestionnaireId($member_id, $questionnaire_id)
    {
        return static::find('first', array(
            'where' => array(
                'member_id' => $member_id,
                'questionnaire_id' => $questionnaire_id,
            ),
        ));
    }
    /**
     * キー検索
     * @param $random_key
     * @return \Orm\Model|\Orm\Model[]
     */
    public static function findByRandomKey($random_key)
    {
        return static::find('first', array(
            'where' => array(
                'random_key' => $random_key
            ),
        ));
    }
}
