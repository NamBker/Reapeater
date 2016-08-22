<?php

namespace Fuel\Migrations;

class Modify_Fields_Of_Stores_Table
{
    public function up()
    {
        \DBUtil::drop_index('stores', 'idx1_stores');
        \DBUtil::create_index('stores', array('brand_id'), 'idx1_stores');
        \DBUtil::drop_fields('stores', array(
            'company_id', 'store_latitude', 'store_longitude', 'store_area_L', 'store_area_M', 'store_area_S',
        ));
        \DBUtil::modify_fields('stores', array(
            'store_address' => array('constraint' => 64, 'type' => 'varchar', 'null' => false, 'comment' => '住所'),
        ));
        \DBUtil::add_fields('stores', array(
            'store_code' => array('constraint' => 16, 'type' => 'varchar', 'null' => false, 'comment' => '店舗コード', 'after' => 'section_id'),
            'store_location' => array('constraint' => 128, 'type' => 'varchar', 'null' => false, 'comment' => '位置情報 longitue, latitude, zoomをキーで持つJSONデータ', 'after' => 'store_access'),
            'store_header_picture_id' => array('type' => 'int', 'null' => true, 'comment' => '店舗ヘッダ画像', 'after' => 'store_freeword'),
            'store_area_L_id' => array('type' => 'int', 'null' => false, 'comment' => 'エリア(大分類)ID', 'after' => 'store_header_picture_id'),
            'store_area_M_id' => array('type' => 'int', 'null' => false, 'comment' => 'エリア(中分類)ID', 'after' => 'store_area_L_id'),
            'store_area_S_id' => array('type' => 'int', 'null' => false, 'comment' => 'エリア(小分類)ID', 'after' => 'store_area_M_id'),
            'store_sort_index' => array('type' => 'int', 'null' => false, 'comment' => 'ソート順', 'after' => 'store_area_S_id'),
        ));
        \DBUtil::create_index('stores', array('brand_id', 'store_code'), 'unique1_stores', 'unique');
        \DBUtil::create_index('stores', array('store_sort_index'), 'idx3_stores');
    }

    public function down()
    {
        \DBUtil::drop_index('stores', 'idx1_stores');
        \DBUtil::drop_index('stores', 'unique1_stores');
        \DBUtil::drop_index('stores', 'idx3_stores');
        \DBUtil::drop_fields('stores', array(
            'store_code', 'store_location', 'store_header_picture_id', 'store_area_L_id', 'store_area_M_id', 'store_area_S_id', 'store_sort_index',
        ));
        \DBUtil::modify_fields('stores', array(
            'store_address' => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => '住所'),
        ));
        \DBUtil::add_fields('stores', array(
            'company_id'    => array('type' => 'int', 'null' => false, 'comment' => '企業ID'),
            'store_latitude' => array('constraint' => [9, 7], 'type' => 'double', 'null' => true, 'comment' => '緯度'),
            'store_longitude' => array('constraint' => [10, 7], 'type' => 'double', 'null' => true, 'comment' => '経度'),
            'store_area_L' => array('constraint' => 16, 'type' => 'varchar', 'null' => true, 'comment' => 'エリア(大分類)'),
            'store_area_M' => array('constraint' => 16, 'type' => 'varchar', 'null' => true, 'comment' => 'エリア(中分類)'),
            'store_area_S' => array('constraint' => 16, 'type' => 'varchar', 'null' => true, 'comment' => 'エリア(小分類)'),
        ));
        \DBUtil::create_index('stores', array('company_id', 'brand_id'), 'idx1_stores');
    }
}
