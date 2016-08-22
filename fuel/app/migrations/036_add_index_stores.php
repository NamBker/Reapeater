<?php

namespace Fuel\Migrations;

class Add_index_stores
{
    public function up()
    {
        \DBUtil::create_index(
			'stores',
			array('brand_id','store_area_L_id','store_area_M_id','store_area_S_id','store_area_L_sort_index','store_area_M_sort_index','store_area_S_sort_index'),
			'idx4_stores'
		);
    }

    public function down()
    {
        \DBUtil::drop_index('stores', 'idx4_stores');
    }
}
