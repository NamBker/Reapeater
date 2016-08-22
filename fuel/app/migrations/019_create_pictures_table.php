<?php

namespace Fuel\Migrations;

class Create_Pictures_Table
{
    public function up()
    {
        \DBUtil::create_table(
            'pictures',
            array(
                'id'                      => array('type' => 'int', 'null' => false, 'unsigned' => true, 'auto_increment' => true, 'comment' => '画像ID'),
                'company_id'              => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '企業ID'),
                'brand_id'                => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'ブランドID'),
                'store_id'                => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '店舗ID'),
                'picture_path'            => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => '画像パス'),
                'picture_file_name'       => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => '画像ファイル名'),
                'file_size'               => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'ファイルサイズ'),
                'vertically_horizontally' => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => '縦横サイズ'),
                'created_at'              => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時'),
                'updated_at'              => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時'),
            ),
            array('id',), true, 'InnoDB', 'utf8'
        );
        \DBUtil::create_index('pictures', array('brand_id', 'store_id'), 'idx1_pictures');
    }

    public function down()
    {
        \DBUtil::drop_table('pictures');
    }
}