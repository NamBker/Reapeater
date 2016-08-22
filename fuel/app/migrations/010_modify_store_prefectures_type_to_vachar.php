<?php

namespace Fuel\Migrations;

class Modify_Store_Prefectures_Type_To_Vachar
{
    public function up()
    {
        \DBUtil::modify_fields('stores', array(
            'store_prefectures' => array('name' => 'store_prefectures', 'constraint' => 2, 'type' => 'varchar', 'null' => false, 'comment' => '都道府県'),
        ));
    }

    public function down()
    {

    }
}