<?php

namespace Fuel\Migrations;

class Create_Areas_Table
{
    public function up()
    {
        \DBUtil::create_table(
            'areas',
            array(
                'id'         => array('type' => 'int', 'null' => false, 'unsigned' => true, 'auto_increment' => true, 'comment' => 'エリアID'),
                'company_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '企業ID'),
                'brand_id'   => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'ブランドID'),
                'area_type'  => array('type' => 'tinyint', 'unsigned' => true, 'null' => false, 'comment' => 'エリアタイプ'),
                'area_name'  => array('constraint' => 16, 'type' => 'varchar', 'null' => false, 'comment' => 'エリア名'),
                'created_at' => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時'),
                'updated_at' => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時'),
            ),
            array('id',), true, 'InnoDB', 'utf8'
        );
        \DBUtil::create_index('areas', array('brand_id', 'area_type'), 'idx1_areas');
    }

    public function down()
    {
        \DBUtil::drop_table('areas');
    }
}
