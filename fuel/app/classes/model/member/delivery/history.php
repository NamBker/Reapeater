<?php

class Model_Member_Delivery_History extends \Model_Standard_Model
{
    protected static $_primary_key = array('id');
    protected static $_properties = array(
        'id' => array(
            'data_type' => 'bigint',
            'expose_pattern' => 1,
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
        'delivery_date' => array(
            'expose_pattern' => 2,
        ),
        'open_mail_date' => array(
            'data_type' => 'datetime',
            'null' => true,
            'expose_pattern' => 2,
        ),
        'delivery_id' => array(
            'expose_pattern' => 2,
        ),
        'store_id' => array(
            'expose_pattern' => 2,
        ),
        'member_id' => array(
            'expose_pattern' => 2,
        ),
        'test_address' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'max_length' => array(
                    32,
                ),
            ),
            'label' => 'テスト送信先',
            'expose_pattern' => 2,
        ),
        'site_reference' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'default' => 0,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2,
                ),
            ),
            'label' => '配信状況',
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
        'delivery' => array(
            'model_to' => 'Model_Delivery',
            'key_from' => 'delivery_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'store' => array(
            'model_to' => 'Model_Store',
            'key_from' => 'store_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'member' => array(
            'model_to' => 'Model_Member',
            'key_from' => 'member_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'store_member' => array(
            'model_to' => 'Model_Store_Member',
            'key_from' => array('member_id', 'store_id'),
            'key_to' => array('member_id', 'store_id'),
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );

    protected static $_has_many = array(
        'member_questionnaire_histories' => array(
            'model_to' => 'Model_Member_Questionnaire_History',
            'key_from' => 'id',
            'key_to' => 'member_delivery_history_id',
            'cascade_save' => true,
            'cascade_delete' => true,
        ),
        'member_coupon_histories' => array(
            'model_to' => 'Model_Member_Coupon_History',
            'key_from' => 'id',
            'key_to' => 'member_delivery_history_id',
            'cascade_save' => true,
            'cascade_delete' => true,
        ),
    );

    protected static $_to_array_exclude = array(
        'created_at', 'updated_at', 'delivery', 'store', 'member', 'store_member', 'member_questionnaire_histories', 'member_coupon_histories',
    );

    /**
     * キー検索
     * @param $id
     * @return \Orm\Model|\Orm\Model[]
     */
    public static function findById($id)
    {
        return static::find('first', array(
            'where' => array(
                'id' => $id
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

    /**
     * 最終メール送信ユーザ情報返却
     * @param $params
     * @return \Orm\Model|\Orm\Model[]
     * @throws ProtocolException
     */
    public static function getLastSendMailUsers($params)
    {
        $conditions = static::makeCondition($params);

        return static::find('all', array(
            'select' => 'member_id',
            'where' => $conditions,
            'group_by' => array('member_id')
        ));
    }

    /**
     * 条件に適合するユーザ情報を返却
     * @param $params
     * @return \Orm\Model|\Orm\Model[]
     * @throws ProtocolException
     */
    public static function getSendMailUsers($params)
    {
        $conditions = static::makeCondition($params);

        return static::find('first', array(
            'where' => $conditions
        ));
    }

    /**
     * メール開封日時設定
     * @param $random_key
     * @throws Exception
     */
    public static function updateOpenMailDate($random_key)
    {
        $history = self::findByRandomKey($random_key);
        if(!empty($history) && empty($history->open_mail_date)){
            $history->open_mail_date = date('Y-m-d H:i:s');
            $history->save();
        }else{
            \Additional_Log::warning('【MAIL OPEN】:SKIP UPDATE OPEN MAIL DATE.['.$random_key.']');
        }
    }

    /**
     * 条件設定
     * @param $params
     * @return array
     */
    public static function makeCondition($params)
    {
        $condition = array();

        if (!empty($params["store_id"])) {
            $condition[] = array('store_id', $params["store_id"]);
        }

        if (!empty($params["delivery_id"])) {
            $condition[] = array('delivery_id', $params["delivery_id"]);
        }

        if (!empty($params["member_id"])) {
            $condition[] = array('member_id', $params["member_id"]);
        }

        if (!empty($params["lastMailSentDayFrom"])) {
            $condition[] = array('delivery_date', '>=', $params["lastMailSentDayFrom"]);
        }

        if(!empty($params["lastMailSentDayTo"])){
            $condition[] = array('delivery_date', '<', $params["lastMailSentDayTo"]);
        }

        return $condition;
    }
}
