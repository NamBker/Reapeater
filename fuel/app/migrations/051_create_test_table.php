<?php

namespace Fuel\Migrations;

class Create_Test_Table
{
    public function up()
    {
        \DBUtil::create_table(
            'test',
            array(
                'id'           => array('type' => 'int', 'null' => false, 'unsigned' => true, 'auto_increment' => true, 'comment' => 'TestID'),
                'name' => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => 'Name'),                
                'created_at'   => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時'),
                'updated_at'   => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時'),
            ),
            array('id',), true, 'InnoDB', 'utf8'
        );
    }

    public function down()
    {
        \DBUtil::drop_table('test');
    }
}