<?php

namespace Fuel\Migrations;

class Add_repica_param_to_deliveries
{
    public function up()
    {
        \DBUtil::add_fields('deliveries', array(
            'repica_deliver_id' => array('type' => 'varchar', 'constraint' => 16, 'null' => true, 'default' => null, 'comment' => 'レピカ配信ID', 'after' => 'delivery_segment'),
            'repica_deliver_status' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'default' => 0, 'comment' => 'レピカ配信チェック日時(0:未確認 / 1:確認中 / 2:確認済み / 3:確認エラー)', 'after' => 'repica_deliver_id'),
        ));
    }

    public function down()
    {
        \DBUtil::drop_fields('deliveries', array(
			'repica_deliver_id',
			'repica_deliver_status',
        ));
    }
}
