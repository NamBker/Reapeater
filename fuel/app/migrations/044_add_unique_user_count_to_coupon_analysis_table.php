<?php

namespace Fuel\Migrations;

class Add_Unique_User_Count_To_Coupon_Analysis_Table
{
    public function up()
    {
        \DBUtil::add_fields('coupon_analysis', array(
            'unique_user_count' => array('type' => 'int', 'null' => true, 'unsigned' => true, 'default' => 0, 'comment' => 'ユニークユーザ数', 'after' => 'used_coupon_count'),
        ));
    }

    public function down()
    {
        \DBUtil::drop_fields('coupon_analysis', array('unique_user_count'));
    }
}