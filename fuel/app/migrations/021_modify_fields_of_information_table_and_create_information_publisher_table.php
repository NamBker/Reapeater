<?php

namespace Fuel\Migrations;

class Modify_Fields_Of_Information_Table_And_Create_Information_Publisher_Table
{
    public function up()
    {
        \DBUtil::drop_fields('information', array('type', 'distribution_brand_ids', 'distribution_store_ids'));
        \DBUtil::create_table(
            'information_publisher',
            array(
                'id'             => array('type' => 'int', 'null' => false, 'unsigned' => true, 'auto_increment' => true, 'comment' => '掲載先ID'),
                'information_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'お知らせID'),
                'publisher_type' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '掲載先種別'),
                'publisher_id'   => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '対象先ID'),
                'created_at'     => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時'),
                'updated_at'     => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時'),
            ),
            array('id'), true, 'InnoDB', 'utf8'
        );
    }

    public function down()
    {
        \DBUtil::add_fields('information', array(
            'type'                   => array('type' => 'tinyint', 'null' => false, 'comment' => 'タイプ(1:全体 / 2:企業以下 / 3:ブランド以下 / 4:店舗以下 / 5:選択店舗のみ)', 'after' => 'store_id'),
            'distribution_brand_ids' => array('constraint' => 128, 'type' => 'varchar', 'comment' => '掲載先ブランドIDs', 'after' => 'picture_id'),
            'distribution_store_ids' => array('constraint' => 128, 'type' => 'varchar', 'comment' => '掲載先店舗IDs', 'after' => 'distribution_brand_ids'),
        ));
        \DBUtil::drop_table('information_publisher');
    }
}
