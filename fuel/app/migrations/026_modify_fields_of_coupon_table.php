<?php

namespace Fuel\Migrations;

class Modify_Fields_Of_Coupon_Table
{
    public function up()
    {
        \DBUtil::modify_fields('coupons', array(
            'coupon_description' => array('type' => 'text', 'null' => false, 'comment' => 'クーポン内容'),
        ));
    }

    public function down()
    {
        \DBUtil::modify_fields('coupons', array(
            'coupon_description' => array('constraint' => 64, 'type' => 'varchar', 'null' => false, 'comment' => 'クーポン内容')
        ));
    }
}
