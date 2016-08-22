<?php

class Model_Member_Coupon_History extends \Model_Standard_Model
{
    protected static $_primary_key = array('id');
    protected static $_properties = array(
        'id' => array(
            'data_type' => 'bigint',
            'expose_pattern' => 1,
        ),
        'coupon_id' => array(
            'expose_pattern' => 1,
        ),
        'store_id' => array(
            'expose_pattern' => 1,
        ),
        'member_id' => array(
            'expose_pattern' => 1,
        ),
        'delivery_id' => array(
            'null' => true,
            'expose_pattern' => 1,
        ),
        'member_delivery_history_id' => array(
            'data_type' => 'bigint',
            'expose_pattern' => 1
        ),
        'member_random_coupon_history_id' => array(
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
        'display_date' => array(
            'data_type' => 'datetime',
            'null' => true,
            'expose_pattern' => 2,
        ),
        'used_date' => array(
            'data_type' => 'datetime',
            'null' => true,
            'expose_pattern' => 2,
        ),
        'second_display_date' => array(
            'data_type' => 'datetime',
            'null' => true,
            'expose_pattern' => 2,
        ),
        'second_used_date' => array(
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
        'coupon' => array(
            'model_to' => 'Model_Coupon',
            'key_from' => 'coupon_id',
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
        'member_delivery_history' => array(
            'model_to' => 'Model_Member_Delivery_History',
            'key_from' => 'member_delivery_history_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'member_random_coupon_history' => array(
            'model_to' => 'Model_Member_Random_Coupon_History',
            'key_from' => 'member_random_coupon_history_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );

    protected static $_to_array_exclude = array(
        'created_at', 'updated_at', 'coupon', 'store', 'member', 'store_member', 'member_delivery_history', 'member_random_coupon_history',
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
}
