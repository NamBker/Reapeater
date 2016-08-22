<?php

namespace Fuel\Migrations;

class Modify_Fields_Of_Store_Table
{
    public function up()
    {
        \DBUtil::add_fields('stores', array(
            'store_postal_code' => array('constraint' => 8, 'type' => 'varchar', 'null' => false, 'comment' => '郵便番号', 'after' => 'store_status'),
        ));
        \DBUtil::modify_fields('stores', array(
            'store_access' => array('constraint' => 64, 'type' => 'varchar', 'null' => true, 'comment' => 'アクセス'),
            'store_location' => array('constraint' => 128, 'type' => 'varchar', 'null' => true, 'comment' => '位置情報 longitue, latitude, zoomをキーで持つJSONデータ'),
            'store_manager_name' => array('constraint' => 32, 'type' => 'varchar', 'null' => true, 'comment' => '店長名'),
            'store_business_hours_from' => array('constraint' => 8, 'type' => 'varchar', 'null' => true, 'comment' => '営業時間_開店'),
            'store_business_hours_to' => array('constraint' => 8, 'type' => 'varchar', 'null' => true, 'comment' => '営業時間_閉店'),
            'store_regular_holiday' => array('constraint' => 16, 'type' => 'varchar', 'null' => true, 'comment' => '定休日'),
            'store_kids_room' => array('constraint' => 16, 'type' => 'varchar', 'null' => true, 'comment' => 'キッズルーム'),
        ));
    }

    public function down()
    {
        \DBUtil::drop_fields('stores', array(
            'store_postal_code',
        ));
        \DBUtil::modify_fields('stores', array(
            'store_access' => array('constraint' => 64, 'type' => 'varchar', 'null' => false, 'comment' => 'アクセス'),
            'store_location' => array('constraint' => 128, 'type' => 'varchar', 'null' => false, 'comment' => '位置情報 longitue, latitude, zoomをキーで持つJSONデータ'),
            'store_manager_name' => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => '店長名'),
            'store_business_hours_from' => array('constraint' => 8, 'type' => 'varchar', 'null' => false, 'comment' => '営業時間_開店'),
            'store_business_hours_to' => array('constraint' => 8, 'type' => 'varchar', 'null' => false, 'comment' => '営業時間_閉店'),
            'store_regular_holiday' => array('constraint' => 16, 'type' => 'varchar', 'null' => false, 'comment' => '定休日'),
            'store_kids_room' => array('constraint' => 16, 'type' => 'varchar', 'null' => false, 'comment' => 'キッズルーム'),
        ));
    }
}
