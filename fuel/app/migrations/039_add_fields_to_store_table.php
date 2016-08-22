<?php

namespace Fuel\Migrations;

class Add_fields_to_store_table
{
    public function up()
    {
        \DBUtil::add_fields('stores', array(
            'store_business_hours' => array('type' => 'text', 'null' => false, 'default' => "", 'comment' => '営業時間', 'after' => 'store_manager_name'),
        ));
    }

    public function down()
    {
        \DBUtil::drop_fields('stores', array(
            'store_business_hours',
        ));
    }
}
