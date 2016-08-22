<?php

namespace Fuel\Migrations;

class Add_fields_for_picture_table
{
    public function up()
    {
        \DBUtil::add_fields('pictures', array(
            'section_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '事業部ID', 'after' => 'brand_id'),
        ));
        \DBUtil::create_index('pictures', array('section_id'), 'idx3_pictures');
    }

    public function down()
    {
        \DBUtil::drop_index('pictures', 'idx3_pictures');
        \DBUtil::drop_fields('pictures', array(
            'section_id',
        ));
    }
}
