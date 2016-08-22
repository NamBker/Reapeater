<?php

namespace Fuel\Migrations;

class Modify_Deliveries_Table_And_Create_Delivery_Relates_Table
{
    public function up()
    {
        \DBUtil::add_fields('deliveries', array(
            'delivery_sender_name' => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => '送信者名', 'after' => 'delivery_category_id'),
            'delivery_sender_address' => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => '送信者アドレス', 'after' => 'delivery_sender_name'),
        ));
        \DBUtil::create_table(
            'delivery_relates',
            array(
                'delivery_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '配信ID'),
                'coupon_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'クーポンID'),
                'questionnaire_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'アンケートID'),
                'random_coupon_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'ランダムクーポンID'),
            ),
            array('delivery_id', 'coupon_id', 'questionnaire_id', 'random_coupon_id'), true, 'InnoDB', 'utf8'
        );
    }

    public function down()
    {
        \DBUtil::drop_fields('deliveries', array(
            'delivery_sender_name',
            'delivery_sender_address',
        ));
        \DBUtil::drop_table('delivery_relates');
    }
}
