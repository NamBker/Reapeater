<?php

namespace Fuel\Migrations;

class Add_Fields_To_Stores_Table
{
    public function up()
    {
        \DBUtil::add_fields('stores', array(
            'store_parking_lot' => array('type' => 'varchar', 'constraint' => 16 ,'null' => true, 'comment' => '駐車場情報', 'after' => 'store_regular_holiday'),
            'store_seat' => array('type' => 'varchar', 'constraint' => 16 ,'null' => true, 'comment' => '席情報', 'after' => 'store_parking_lot'),
        ));
    }

    public function down()
    {
        \DBUtil::drop_fields('stores', array('store_parking_lot', 'store_seat'));
    }
}