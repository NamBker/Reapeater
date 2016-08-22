<?php

namespace Fuel\Migrations;

class Add_postal_code_prefectures_building_on_brands
{
    public function up()
    {

        \DBUtil::drop_fields('brands', array(
            'brand_address',
        ));

        \DBUtil::add_fields('brands', array(
            'brand_postal_code' => array('type' => 'varchar', 'constraint' => 8 ,'null' => true, 'comment' => '郵便番号', 'after' => 'brand_status'),
            'brand_prefectures' => array('type' => 'int', 'null' => true, 'comment' => '都道府県', 'after' => 'brand_postal_code'),
            'brand_address' => array('type' => 'varchar', 'constraint' => 64 ,'null' => true, 'comment' => '住所', 'after' => 'brand_prefectures'),
            'brand_building' => array('type' => 'varchar', 'constraint' => 32 ,'null' => true, 'comment' => 'ビル名等', 'after' => 'brand_address'),

        ));

    }

    public function down()
    {
        \DBUtil::drop_fields('brands', array(
            'brand_postal_code',
            'brand_prefectures',
            'brand_address',
            'brand_building',
        ));

        \DBUtil::add_fields('brands', array(
            'brand_address' => array('type' => 'varchar', 'constraint' => 64 ,'null' => true, 'comment' => '住所', 'after' => 'brand_status'),
        ));

    }
}
