<?php

namespace Fuel\Migrations;

class Add_postal_code_prefectures_buiding_sections
{
    public function up()
    {

        \DBUtil::drop_fields('sections', array(
            'section_address',
        ));

        \DBUtil::add_fields('sections', array(
            'store_postal_code' => array('type' => 'varchar', 'constraint' => 8 ,'null' => true, 'comment' => '郵便番号', 'after' => 'section_status'),
            'store_prefectures' => array('type' => 'int', 'null' => true, 'comment' => '都道府県', 'after' => 'store_postal_code'),
            'store_address' => array('type' => 'varchar', 'constraint' => 64 ,'null' => true, 'comment' => '住所', 'after' => 'store_prefectures'),
            'store_building' => array('type' => 'varchar', 'constraint' => 32 ,'null' => true, 'comment' => 'ビル名等', 'after' => 'store_address'),

        ));

    }

    public function down()
    {
        \DBUtil::drop_fields('sections', array(
            'store_postal_code',
            'store_prefectures',
            'store_address',
            'store_building',
        ));

        \DBUtil::add_fields('sections', array(
            'section_address' => array('type' => 'varchar', 'constraint' => 64 ,'null' => true, 'comment' => '住所', 'after' => 'store_status'),
        ));

    }
}
