<?php

namespace Fuel\Migrations;

class Create_Information_Table
{
    public function up()
    {
        \DBUtil::create_table(
            'information',
            array(
                'id' => array('type' => 'int', 'null' => false, 'auto_increment' => true, 'comment' => 'お知らせID')
                ,'company_id' => array('type' => 'int', 'null' => false, 'comment' => '企業ID')
                ,'brand_id' => array('type' => 'int', 'null' => false, 'comment' => 'ブランドID')
                ,'store_id' => array('type' => 'int', 'null' => false, 'comment' => '店舗ID')
                ,'type' => array('type' => 'tinyint', 'null' => false, 'comment' => 'タイプ(1:全体 / 2:企業以下 / 3:ブランド以下 / 4:店舗以下 / 5:選択店舗のみ)')
                ,'priority' => array('type' => 'smallint', 'null' => false, 'comment' => '優先度')
                ,'title' => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => 'タイトル')
                ,'body' => array('type' => 'text', 'null' => false, 'comment' => '本文')
                ,'picture_id' => array('constraint' => 32, 'type' => 'varchar', 'comment' => '画像ID')
                ,'distribution_brand_ids' => array('constraint' => 128, 'type' => 'varchar', 'comment' => '掲載先ブランドIDs')
                ,'distribution_store_ids' => array('constraint' => 128, 'type' => 'varchar', 'comment' => '掲載先店舗IDs')
                ,'status' => array('type' => 'int', 'null' => false, 'comment' => '状態(0:非公開 / 1:公開 / 2:削除)')
                ,'effective_period_from' => array('type' => 'datetime', 'null' => false, 'comment' => '表示開始日時')
                ,'effective_period_to' => array('type' => 'datetime', 'null' => false, 'comment' => '表示終了日時')
                ,'created_at' => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時')
                ,'updated_at' => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時')
            ),
            array('id',), true, 'InnoDB', 'utf8'
        );
//        \DBUtil::create_index('information', array('brand_id'), 'idx1_information');
//        \DBUtil::create_index('information', array('store_id'), 'idx2_information');

    }

    public function down()
    {
        \DBUtil::drop_table('information');
    }
}