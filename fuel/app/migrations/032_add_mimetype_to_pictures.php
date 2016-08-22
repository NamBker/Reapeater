<?php

namespace Fuel\Migrations;

class Add_mimetype_to_pictures
{
    public function up()
    {
        \DBUtil::add_fields('pictures', array(
            'mimetype' => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => '画像MIMEタイプ', 'after' => 'picture_file_name'),

        ));
    }

    public function down()
    {
        \DBUtil::drop_fields('pictures', array(
            'mimetype'

        ));
    }
}
