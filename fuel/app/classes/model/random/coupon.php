<?php

class Model_Random_Coupon extends \Model_Standard_Model
{
    protected static $_properties = array(
        'id',
        'company_id' => array(
            'expose_pattern' => 1,
        ),
        'brand_id' => array(
            'expose_pattern' => 1,
        ),
        'section_id' => array(
            'expose_pattern' => 1,
        ),
        'store_id' => array(
            'expose_pattern' => 1,
        ),
        'random_coupon_name' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    32,
                ),
            ),
            'label' => 'ランダムクーポン名称',
            'expose_pattern' => 1,
        ),
        'random_coupon_release_flg' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'default' => 0,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    1,
                ),
            ),
            'label' => '公開済みフラグ',
            'expose_pattern' => 3,
        ),
        'random_coupon_status' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'default' => 1,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    1,
                ),
            ),
            'label' => 'ランダムクーポン状態',
            'expose_pattern' => 2,
        ),
        'random_coupon_screen_flg' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'default' => 1,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    1,
                ),
            ),
            'label' => '抽選前画面表示フラグ',
            'expose_pattern' => 3,
        ),
        'random_coupon_screen_free_text_top' => array(
            'data_type' => 'text',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    65535,
                ),
            ),
            'label' => '上部自由文',
            'expose_pattern' => 3,
        ),
        'random_coupon_screen_picture_id' => array(
            'data_type' => 'int',
            'null' => true,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    4294967295,
                ),
            ),
            'label' => '抽選前画面用画像ID',
            'expose_pattern' => 3,
        ),
        'random_coupon_screen_button_label' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    32,
                ),
            ),
            'label' => '抽選ボタン文言',
            'expose_pattern' => 3,
        ),
        'random_coupon_screen_free_text_bottom' => array(
            'data_type' => 'text',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    65535,
                ),
            ),
            'label' => '下部自由文',
            'expose_pattern' => 3,
        ),
        'random_coupon_deleted_flg' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'default' => 0,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    1,
                ),
            ),
            'label' => '削除フラグ',
            'expose_pattern' => 3,
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
        'company' => array(
            'model_to' => 'Model_Company',
            'key_from' => 'company_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'brand' => array(
            'model_to' => 'Model_Brand',
            'key_from' => 'brand_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'section' => array(
            'model_to' => 'Model_Section',
            'key_from' => 'section_id',
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
        'random_coupon_screen_picture' => array(
            'model_to' => 'Model_Picture',
            'key_from' => 'random_coupon_screen_picture_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );

    protected static $_has_many = array(
        'random_coupon_items' => array(
            'model_to' => 'Model_Random_Coupon_Item',
            'key_from' => 'id',
            'key_to' => 'random_coupon_id',
            'cascade_save' => true,
            'cascade_delete' => true,
            'conditions' => array(
                'where' => array(array('coupon_max_count', '>', 0)),
                'order_by' => array('coupon_probability' => 'asc', 'coupon_max_count' => 'asc'),
            ),
        ),
    );

    protected static $_has_one = array(
        'random_coupon_blank_item' => array(
            'model_to' => 'Model_Random_Coupon_Item',
            'key_from' => 'id',
            'key_to' => 'random_coupon_id',
            'cascade_save' => true,
            'cascade_delete' => true,
            'conditions' => array(
                'where' => array(array('coupon_max_count', '=', 0)),
            ),
        ),
    );

    protected static $_many_many = array(
        'random_coupon_coupons' => array(
            'table_through' => 'random_coupon_items',
            'key_from' => 'id',
            'key_through_from' => 'random_coupon_id',
            'key_through_to' => 'coupon_id',
            'key_to' => 'id',
            'model_to' => 'Model_Coupon',
            'cascade_save' => false,
            'cascase_delete' => false,
        ),
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

    public static function findByUserAndId($user, $id)
    {
        if (empty($user)) {
            return null;
        }
        $conditions = array();
        switch($user->authority) {
        case USER_AUTHORITY_STORE:
            $conditions[] = array('store_id', $user->store_id);
        case USER_AUTHORITY_SECTION:
            $conditions[] = array('section_id', $user->section_id);
        case USER_AUTHORITY_BRAND:
            $conditions[] = array('brand_id', $user->brand_id);
        case USER_AUTHORITY_COMPANY:
            $conditions[] = array('company_id', $user->company_id);
        }
        $conditions[] = array('id', $id);
        return static::find('first', array(
            'where' => $conditions,
        ));
    }

}
