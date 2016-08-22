<?php

namespace Fuel\Migrations;

class Add_fields_for_send_mail
{
    public function up()
    {
        \DBUtil::add_fields('brands', array(
            'brand_domain' => array('type' => 'varchar', 'constraint' => 64, 'null' => true, 'comment' => '独自ドメイン', 'after' => 'brand_name'),
        ));
        \DBUtil::add_fields('member_delivery_histories', array(
            'random_key' => array('type' => 'varchar', 'constraint' => 64 ,'null' => true, 'comment' => '配信ランダムキー', 'after' => 'id'),
            'open_mail_date' => array('type' => 'datetime', 'null' => true, 'comment' => '開封日時', 'after' => 'delivery_date'),
            'test_address' => array('type' => 'varchar', 'constraint' => 32, 'null' => true, 'comment' => 'テスト送信先', 'after' => 'member_id'),
        ));
        \DBUtil::create_index('member_delivery_histories', array('random_key'), 'unique1_member_delivery_histories', 'UNIQUE');
        \DBUtil::add_fields('member_questionnaire_histories', array(
            'member_delivery_history_id' => array('type' => 'bigint', 'null' => false, 'comment' => '配信履歴ID', 'after' => 'questionnaire_id'),
            'random_key' => array('type' => 'varchar', 'constraint' => 64 ,'null' => true, 'comment' => '配信ランダムキー', 'after' => 'member_delivery_history_id'),
        ));
        \DBUtil::modify_fields('member_questionnaire_histories', array(
            'questionnaire_send_date' => array('type' => 'datetime', 'null' => true, 'comment' => '送信日'),
            'questionnaire_respond_date' => array('type' => 'datetime', 'null' => true, 'comment' => '回答日'),
        ));
        \DBUtil::create_index('member_questionnaire_histories', array('random_key'), 'unique1_member_questionnaire_histories', 'UNIQUE');
        \DBUtil::add_fields('member_coupon_histories', array(
            'member_delivery_history_id' => array('type' => 'bigint', 'null' => false, 'comment' => '配信履歴ID', 'after' => 'delivery_id'),
            'random_key' => array('type' => 'varchar', 'constraint' => 64 ,'null' => true, 'comment' => '配信ランダムキー', 'after' => 'member_delivery_history_id'),
        ));
        \DBUtil::create_index('member_coupon_histories', array('random_key'), 'unique1_member_coupon_histories', 'UNIQUE');
    }

    public function down()
    {
        \DBUtil::drop_fields('brands', array(
            'brand_domain',
        ));
        \DBUtil::drop_index('member_delivery_histories', 'unique1_member_delivery_histories');
        \DBUtil::drop_fields('member_delivery_histories', array(
            'random_key', 'open_mail_date', 'test_address',
        ));
        \DBUtil::drop_index('member_questionnaire_histories', 'unique1_member_questionnaire_histories');
        \DBUtil::drop_fields('member_questionnaire_histories', array(
            'member_delivery_history_id', 'random_key',
        ));
        \DBUtil::modify_fields('member_questionnaire_histories', array(
            'questionnaire_send_date' => array('type' => 'datetime', 'null' => false, 'comment' => '送信日'),
            'questionnaire_respond_date' => array('type' => 'datetime', 'null' => false, 'comment' => '回答日'),
        ));
        \DBUtil::drop_index('member_coupon_histories', 'unique1_member_coupon_histories');
        \DBUtil::drop_fields('member_coupon_histories', array(
            'member_delivery_history_id', 'random_key',
        ));
    }
}
