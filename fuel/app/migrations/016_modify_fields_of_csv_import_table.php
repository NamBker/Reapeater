<?php

namespace Fuel\Migrations;

class Modify_Fields_Of_Csv_Import_Table
{
    public function up()
    {
        \DBUtil::modify_fields('csv_imports', array(
            'company_id' => array('type' => 'int', 'null' => true, 'comment' => '企業ID'),
            'brand_id' => array('type' => 'int', 'null' => true, 'comment' => 'ブランドID'),
            'section_id' => array('type' => 'int', 'null' => true, 'comment' => '事業部ID'),
            'store_id' => array('type' => 'int', 'null' => true, 'comment' => '店舗ID'),
            'file_path' => array('constraint' => 64, 'type' => 'varchar', 'null' => false, 'comment' => 'ファイルパス'),
        ));
        \DBUtil::add_fields('csv_imports', array(
            'upload_filename' => array('constraint' => 64, 'type' => 'varchar', 'null' => false, 'comment' => 'アップロードファイル名', 'after' => 'file_path'),
        ));
    }

    public function down()
    {
        \DBUtil::drop_fields('csv_imports', array(
            'upload_filename',
        ));
        \DBUtil::modify_fields('csv_imports', array(
            'company_id' => array('type' => 'int', 'null' => false, 'comment' => '企業ID'),
            'brand_id' => array('type' => 'int', 'null' => false, 'comment' => 'ブランドID'),
            'section_id' => array('type' => 'int', 'null' => false, 'comment' => '事業部ID'),
            'store_id' => array('type' => 'int', 'null' => false, 'comment' => '店舗ID'),
            'file_path' => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => 'ファイルパス'),
        ));
    }
}
