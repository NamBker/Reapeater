<?php

namespace Fuel\Migrations;

class Modify_areasort_fields_of_store_table
{
    public function up()
    {
        \DBUtil::add_fields('stores', array(
            'store_area_L_sort_index' => array('type' => 'int', 'null' => true, 'comment' => 'エリア(大分類)ソート順', 'after' => 'store_area_S_id'),
			'store_area_M_sort_index' => array('type' => 'int', 'null' => true, 'comment' => 'エリア(中分類)ソート順', 'after' => 'store_area_L_sort_index'),
			'store_area_S_sort_index' => array('type' => 'int', 'null' => true, 'comment' => 'エリア(小分類)ソート順', 'after' => 'store_area_M_sort_index'),
        ));
    }

    public function down()
    {
        \DBUtil::drop_fields('stores', array(
			'store_area_L_sort_index',
			'store_area_M_sort_index',
			'store_area_S_sort_index',
        ));
    }
}
