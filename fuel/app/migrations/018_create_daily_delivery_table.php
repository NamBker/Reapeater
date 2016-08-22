<?php

namespace Fuel\Migrations;

class Create_Daily_delivery_Table
{
    public function up()
    {
        // 配信
        \DBUtil::create_table(
            'deliveries',
            array(
                'id' => array('type' => 'bigint', 'null' => false, 'unsigned' => true, 'auto_increment' => true, 'comment' => '配信ID')
                ,'company_id' => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => '企業ID')
                ,'brand_id' => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => 'ブランドID')
                ,'store_id' => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => '店舗ID')
                ,'delivery_status' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'default' => 0, 'comment' => '配信状況(0:未配信 / 1;配信済み / 2:配信中(?) / 3:配信失敗)')
                ,'delivery_type' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '配信タイプ(1:HTMLメール / 2:テキストメール / 3:PUSH通知 / 4:ジオPUSH /5:LINE＠)')
                ,'delivery_category_id' => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => 'カテゴリID')
                ,'delivery_title' => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => 'タイトル')
                ,'delivery_html_body' => array('type' => 'longtext', 'null' => false, 'comment' => '本文(HTML)')
                ,'delivery_text_body' => array('type' => 'longtext', 'null' => false, 'comment' => '本文(テキスト)')
                ,'delivery_schedule' => array('type' => 'datetime', 'null' => false, 'comment' => '配信予定時刻')
                ,'delivery_area' => array('constraint' => 32, 'type' => 'varchar', 'null' => true, 'comment' => '配信エリア(ジオpush)')
                ,'delivery_period_start' => array('type' => 'datetime', 'null' => true, 'comment' => '配信期間開始日時(ジオpush)')
                ,'delivery_period_end' => array('type' => 'datetime', 'null' => true, 'comment' => '配信期間終了日時(ジオpush)')
                ,'delivery_device' => array('type' => 'tinyint', 'null' => true, 'unsigned' => true, 'default' => 0, 'comment' => '配信対象(ジオpush)(1:全体 / 2:android / 3:ios)')
                ,'delivery_segment' => array('type' => 'text', 'null' => false, 'comment' => '配信セグメント')
                ,'created_at' => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時')
                ,'updated_at' => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時')
            ),
            array('id'), true, 'InnoDB', 'utf8'
        );
        \DBUtil::create_index('deliveries', array('brand_id'), 'idx1_deliveries');
        \DBUtil::create_index('deliveries', array('store_id'), 'idx2_deliveries');

        // 日次配信情報（分析用）
        \DBUtil::create_table(
            'daily_delivery_info',
            array(
                'delivery_date' => array('constraint' => 10, 'type' => 'varchar', 'null' => true, 'comment' => '配信日')
                ,'delivery_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '配信ID')
                ,'company_id' => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => '企業ID')
                ,'brand_id' => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => 'ブランドID')
                ,'store_id' => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => '店舗ID')
                ,'delivery_total' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'default' => 0, 'comment' => '配信数')
                ,'reach_count' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'default' => 0, 'comment' => '到達数')
                ,'open_count' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'default' => 0, 'comment' => '開封数')
                ,'visit_count' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'default' => 0, 'comment' => '来店数')
                ,'created_at' => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時')
                ,'updated_at' => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時')
            ),
            array('delivery_date','delivery_id','company_id','brand_id' ,'store_id'), true, 'InnoDB', 'utf8'
        );

        // 配信履歴
        \DBUtil::create_table(
            'member_delivery_histories',
            array(
                'id' => array('type' => 'bigint', 'null' => false, 'unsigned' => true, 'auto_increment' => true, 'comment' => '配信履歴ID')
                ,'delivery_date' => array('type' => 'datetime', 'null' => true, 'comment' => '配信日')
                ,'delivery_id' => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => '配信ID')
                ,'store_id' => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => '店舗ID')
                ,'member_id' => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => '会員ID')
                ,'site_reference' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'default' => 0, 'comment' => '配信状況(0:配信失敗 / 1:配信済み未参照 / 2:配信済み参照済み)')
                ,'created_at' => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時')
                ,'updated_at' => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時')
            ),
            array('id'), true, 'InnoDB', 'utf8'
        );
        \DBUtil::create_index('member_delivery_histories', array('delivery_date'), 'idx1_member_delivery_histories');
        \DBUtil::create_index('member_delivery_histories', array('store_id'), 'idx2_member_delivery_histories');
     }

    public function down()
    {
        \DBUtil::drop_table('daily_delivery_info');
        \DBUtil::drop_table('member_delivery_histories');
        \DBUtil::drop_table('deliveries');
    }
}
