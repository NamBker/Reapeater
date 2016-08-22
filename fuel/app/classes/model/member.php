<?php

class Model_Member extends \Model_Standard_Model
{
    protected static $_primary_key = array('id');
    protected static $_properties = array(
        'id',
        'delete_flg' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'default' => 0,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    1,
                ),
            ),
            'label' => '削除フラグ',
            'expose_type' => 'null'
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

    protected static $_has_many = array(
        'brand_members' => array(
            'model_to' => 'Model_Brand_Member',
            'key_from' => 'id',
            'key_to' => 'member_id',
            'cascade_save' => true,
            'cascade_delete' => false,
        ),
        'store_members' => array(
            'model_to' => 'Model_Store_Member',
            'key_from' => 'id',
            'key_to' => 'member_id',
            'cascade_save' => true,
            'cascade_delete' => false,
        ),
    );

    protected static $_to_array_exclude = array(
        'created_at', 'updated_at',
    );

    public static function insertMember($delete_flg)
    {
        $member = static::forge(compact(
            'delete_flg'
        ));
        $member->save();

        return $member->id;
    }
}
