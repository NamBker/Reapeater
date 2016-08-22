<?php

namespace Fuel\Migrations;

class Add_total_count_to_daily_store_info_and_monthly_store_info
{
    public function up()
    {
        \DBUtil::add_fields('daily_store_info', array(
            'total_count'    => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '合計会員数', 'after' => 'store_id'),
        ));
        \DBUtil::add_fields('monthly_store_info', array(
            'total_count'    => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '合計会員数', 'after' => 'store_id'),
        ));
    }

    public function down()
    {
        \DBUtil::drop_fields('daily_store_info', array('total_count'));
        \DBUtil::drop_fields('monthly_store_info', array('total_count'));
    }
}