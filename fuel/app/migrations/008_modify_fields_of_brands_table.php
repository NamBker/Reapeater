<?php

namespace Fuel\Migrations;

class Modify_Fields_Of_Brands_Table
{
    public function up()
    {
        \DBUtil::add_fields('brands', array(
            'brand_code' => array('constraint' => 16, 'type' => 'varchar', 'null' => false, 'comment' => 'ブランドコード', 'after' => 'company_id'),
            'store_display_type' => array('type' => 'tinyint', 'null' => false, 'default' => 1, 'comment' => '店舗一覧表示タイプ', 'after' => 'brand_freeword'),
            'member_registration_form_text_up' => array('constraint' => 256, 'type' => 'varchar', 'null' => true, 'comment' => '会員登録フォームボタンの上に表示するテキスト', 'after' => 'brand_first_open_date'),
            'member_registration_form_text_down' => array('constraint' => 256, 'type' => 'varchar', 'null' => true, 'comment' => '会員登録フォームボタンの下に表示するテキスト', 'after' => 'member_registration_form_text_up'),
        ));
        \DBUtil::create_index('brands', array('company_id', 'brand_code'), 'unique1_brands', 'unique');
    }

    public function down()
    {
        \DBUtil::drop_index('brands', 'unique1_brands');
        \DBUtil::drop_fields('brands', array(
            'brand_code', 'store_display_type', 'member_registration_form_text_up', 'member_registration_form_text_down',
        ));
    }
}
