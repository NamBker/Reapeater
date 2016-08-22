<?php

namespace Fuel\Migrations;

class Create_Site_Headers_Footers_Table
{
    public function up()
    {
        \DBUtil::create_table(
            'site_headers_footers',
            array(
                'id'                      => array('type' => 'int', 'null' => false, 'unsigned' => true, 'auto_increment' => true, 'comment' => 'サイトID'),
                'company_id'              => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '企業ID'),
                'brand_id'                => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'ブランドID'),
                'store_id'                => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '店舗ID'),
                'sitemap_name'            => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => '(ヘッダ)サイトマップ名称'),
                'sitemap_catchcopy'       => array('type' => 'text', 'null' => true, 'comment' => '(ヘッダ)キャッチコピー'),
                'sitemap_picture_id'      => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => '(ヘッダ)ロゴ画像バナーID'),
                'sitemap_free_text'       => array('type' => 'text', 'null' => true, 'comment' => '(フッタ)フリーテキスト'),
                'sitemap_copyright'       => array('type' => 'text', 'null' => true, 'comment' => '(ヘッダ)コピーライト'),
                'sitemap_contents_title'  => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => '(ヘッダ)コンテンツメニュータイトル'),
                'memo'                    => array('type' => 'text', 'null' => true, 'comment' => 'メモ枠'),
                'created_at'              => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時'),
                'updated_at'              => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時'),
            ),
            array('id', 'company_id', 'brand_id' ,'store_id'), true, 'InnoDB', 'utf8'
        );
    }

    public function down()
    {
        \DBUtil::drop_table('site_headers_footers');
    }
}