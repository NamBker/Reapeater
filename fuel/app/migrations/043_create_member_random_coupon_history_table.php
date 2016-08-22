<?php

namespace Fuel\Migrations;

class Create_member_random_coupon_history_table
{
    public function up()
    {
        \DBUtil::create_table(
            'member_random_coupon_histories',
            array(
                'id' => array('type' => 'bigint', 'null' => false, 'unsigned' => true, 'auto_increment' => true, 'comment' => 'ランダムクーポン履歴ID'),
                'random_coupon_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'ランダムクーポンID'),
                'store_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '店舗ID'),
                'member_id'   => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '会員ID'),
                'delivery_id'   => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => '配信ID'),
                'member_delivery_history_id'   => array('type' => 'bigint', 'null' => false, 'unsigned' => true, 'comment' => '配信履歴ID'),
                'random_key' => array('type' => 'varchar', 'constraint' => 64, 'null' => true, 'comment' => '配信ランダムキー'),
                'coupon_id'   => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'クーポンID'),
                'created_at' => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時'),
                'updated_at' => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時'),
            ),
            array('id',), true, 'InnoDB', 'utf8'
        );
        \DBUtil::create_index('member_random_coupon_histories', array('random_coupon_id'), 'idx1_member_random_coupon_histories');
        \DBUtil::create_index('member_random_coupon_histories', array('random_key'), 'unique1_member_random_coupon_histories', 'UNIQUE');
        \DBUtil::add_fields('member_coupon_histories', array(
            'member_random_coupon_history_id' => array('type' => 'bigint', 'null' => false, 'unsigned' => true, 'comment' => 'ランダムクーポン履歴ID', 'after' => 'member_delivery_history_id'),
        ));
    }

    public function down()
    {
        \DBUtil::drop_fields('member_coupon_histories', array(
            'member_random_coupon_history_id',
        ));
        \DBUtil::drop_table('member_random_coupon_histories');
    }
}
