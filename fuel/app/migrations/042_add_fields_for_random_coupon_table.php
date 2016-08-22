<?php

namespace Fuel\Migrations;

class Add_fields_for_random_coupon_table
{
    public function up()
    {
        \DBUtil::add_fields('random_coupons', array(
            'random_coupon_screen_flg' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'default' => 0, 'comment' => '抽選前画面表示フラグ', 'after' => 'random_coupon_status'),
            'random_coupon_screen_free_text_top' => array('type' => 'text', 'null' => true, 'comment' => '上部自由文', 'after' => 'random_coupon_screen_flg'),
            'random_coupon_screen_picture_id' => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => '抽選前画面用画像ID', 'after' => 'random_coupon_screen_free_text_top'),
            'random_coupon_screen_button_label' => array('constraint' => 32, 'type' => 'varchar', 'null' => true, 'comment' => '抽選ボタン文言', 'after' => 'random_coupon_screen_picture_id'),
            'random_coupon_screen_free_text_bottom' => array('type' => 'text', 'null' => true, 'comment' => '上部自由文', 'after' => 'random_coupon_screen_button_label'),
        ));
        \DBUtil::add_fields('random_coupon_items', array(
            'coupon_ad_slogan' => array('constraint' => 128, 'type' => 'varchar', 'null' => false, 'comment' => 'キャッチコピー', 'after' => 'coupon_id'),
            'coupon_screen_free_text_top' => array('type' => 'text', 'null' => true, 'comment' => '上部自由文', 'after' => 'coupon_max_count'),
            'coupon_screen_picture_id' => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => '抽選前画面用画像ID', 'after' => 'coupon_screen_free_text_top'),
            'coupon_screen_button_label' => array('constraint' => 32, 'type' => 'varchar', 'null' => true, 'comment' => '抽選ボタン文言', 'after' => 'coupon_screen_picture_id'),
            'coupon_screen_free_text_bottom' => array('type' => 'text', 'null' => true, 'comment' => '上部自由文', 'after' => 'coupon_screen_button_label'),
        ));
    }

    public function down()
    {
        \DBUtil::drop_fields('random_coupons', array(
            'random_coupon_screen_flg', 'random_coupon_screen_free_text_top', 'random_coupon_screen_picture_id', 'random_coupon_screen_button_label', 'random_coupon_screen_free_text_bottom',
        ));
        \DBUtil::drop_fields('random_coupon_items', array(
            'coupon_ad_slogan', 'coupon_screen_free_text_top', 'coupon_screen_picture_id', 'coupon_screen_button_label', 'coupon_screen_free_text_bottom',
        ));
    }
}
