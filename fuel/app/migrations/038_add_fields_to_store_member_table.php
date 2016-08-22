<?php

namespace Fuel\Migrations;

class Add_fields_to_store_member_table
{
    public function up()
    {
        \DBUtil::add_fields('store_members', array(
            'mail_delivery_status' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'default' => 1, 'comment' => 'メールマガ配信状態', 'after' => 'mail_reception'),
        ));
    }

    public function down()
    {
        \DBUtil::drop_fields('store_members', array(
            'mail_delivery_status',
        ));
    }
}
