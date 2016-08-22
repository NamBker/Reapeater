<?php

namespace Fuel\Migrations;

class Create_Oauths_Table
{
    public function up()
    {
        \DBUtil::create_table(
            'oauth_clients',
            array(
                'id'            => array('type' => 'int', 'null' => false, 'auto_increment' => true, 'comment' => 'アプリケーションID'),
                'name'          => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => 'アプリケーション名'),
                'client_type'   => array('type' => 'tinyint', 'null' => false, 'comment' => '1:Web(Server) 2:ユーザーエージェントベース(JS) 3:ネイティブ'),
                'grant_type'    => array('type' => 'tinyint', 'null' => false, 'comment' => '1:認可コード 2:インプリシット 3:リソースオーナーパスワードクレデンシャル 4:クライアントクレデンシャルグラント'),
                'client_id'     => array('constraint' => 128, 'type' => 'varchar', 'null' => false, 'comment' => 'クライアントID'),
                'client_secret' => array('constraint' => 128, 'type' => 'varchar', 'null' => true, 'comment' => 'クライアントシークレット'),
                'client_origin' => array('constraint' => 128, 'type' => 'varchar', 'null' => true, 'comment' => 'クライアントのオリジン(URLの「スキーム」「ホスト」「ポート」の3つの組み合わせ)'),
                'created_at'    => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時'),
                'updated_at'    => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時'),
            ),
            array('id',), true, 'InnoDB', 'utf8'
        );

        \DBUtil::create_table(
            'oauth_access_tokens',
            array(
                'access_token' => array('constraint' => 64, 'type' => 'varchar', 'null' => false, 'comment' => 'アクセストークン'),
                'client_id'    => array('constraint' => 16, 'type' => 'varchar', 'null' => false, 'comment' => 'クライアントID'),
                'account_id'   => array('type' => 'int', 'null' => false, 'comment' => 'アカウントID'),
                'created_at'   => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時'),
                'updated_at'   => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時'),
            ),
            array('access_token'), true, 'InnoDB', 'utf8'
        );
        \DB::query("alter table oauth_access_tokens comment 'アクセストークン'")->execute();
    }

    public function down()
    {
        \DBUtil::drop_table('oauth_clients');
        \DBUtil::drop_table('oauth_access_tokens');
    }
}