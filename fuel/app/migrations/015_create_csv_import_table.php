<?php

namespace Fuel\Migrations;

class Create_Csv_Import_Table
{
    public function up()
    {
        \DBUtil::create_table(
            'csv_imports',
            array(
                'id' => array('type' => 'int', 'null' => false, 'auto_increment' => true, 'comment' => 'CSVインポートID')
                ,'company_id' => array('type' => 'int', 'null' => false, 'comment' => '企業ID')
                ,'brand_id' => array('type' => 'int', 'null' => false, 'comment' => 'ブランドID')
                ,'section_id' => array('type' => 'int', 'null' => false, 'comment' => '事業部ID')
                ,'store_id' => array('type' => 'int', 'null' => false, 'comment' => '店舗ID')
                ,'status' => array('type' => 'tinyint', 'null' => false, 'comment' => '状態(0:未実行 / 1:実行中 / 2:完了 / 3:エラー発生)')
                ,'duplicate_process_type' => array('type' => 'tinyint', 'null' => false, 'comment' => '重複時処理(1:スキップ / 2:上書き)')
                ,'target_table' => array('type' => 'tinyint', 'null' => false, 'comment' => '対象TBL(1:店舗 / 2:会員)')
                ,'file_path' => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => 'ファイルパス')
                ,'mail_address' => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => '実行ユーザのメールアドレス')
                ,'overlap_count' => array('type' => 'int', 'null' => false, 'comment' => '重複数')
                ,'created_at' => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時')
                ,'updated_at' => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時')
            ),
            array('id'), true, 'InnoDB', 'utf8'
        );
        \DBUtil::create_index('csv_imports', array('status'), 'idx1_csv_imports');
    }

    public function down()
    {
        \DBUtil::drop_table('csv_imports');
    }
}