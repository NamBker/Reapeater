<?php

namespace Fuel\Migrations;

class Modify_Authority_Users_Table
{
    public function up()
    {
        \DBUtil::modify_fields('users', array(
            'authority'    => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '権限'),
        ));
    }

    public function down()
    {
        \DBUtil::modify_fields('users', array(
            'authority'    => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => '権限'),
        ));
    }
}
