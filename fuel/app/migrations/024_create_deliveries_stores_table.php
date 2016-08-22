<?php

namespace Fuel\Migrations;

class Create_Deliveries_Stores_Table
{
    public function up()
    {
        \DBUtil::create_table(
            'deliveries_stores',
            array(
                'delivery_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '配信ID'),
                'store_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '配信ID'),
            ),
            array('delivery_id', 'store_id'), true, 'InnoDB', 'utf8'
        );
    }

    public function down()
    {
        \DBUtil::drop_table('deliveries_stores');
    }
}
