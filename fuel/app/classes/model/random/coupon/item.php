<?php

class Model_Random_Coupon_Item extends \Model_Standard_Model
{
    protected static $_properties = array(
        'id' => array(
            'expose_pattern' => 3,
        ),
        'random_coupon_id' => array(
            'expose_pattern' => 3,
        ),
        'coupon_id' => array(
            'expose_pattern' => 3,
        ),
        'coupon_ad_slogan' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'max_length' => array(
                    128,
                ),
            ),
            'label' => 'キャッチコピー',
            'expose_pattern' => 3,
        ),
        'coupon_probability' => array(
            'data_type' => 'smallint',
            'null' => false,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    100,
                ),
            ),
            'label' => '表示確率',
            'expose_pattern' => 3,
        ),
        'coupon_max_count' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'default' => 0,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    65535,
                ),
            ),
            'label' => '最大表示回数',
            'expose_pattern' => 3,
        ),
        'coupon_screen_free_text_top' => array(
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
        'coupon_screen_picture_id' => array(
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
        'coupon_screen_button_label' => array(
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
        'coupon_screen_free_text_bottom' => array(
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
        'random_coupon' => array(
            'model_to' => 'Model_Random_Coupon',
            'key_from' => 'random_coupon_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'coupon' => array(
            'model_to' => 'Model_Coupon',
            'key_from' => 'coupon_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'coupon_screen_picture' => array(
            'model_to' => 'Model_Picture',
            'key_from' => 'coupon_screen_picture_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );
}
