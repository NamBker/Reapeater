<?php

namespace Fuel\Migrations;

class Create_Site_Store_Free_Table
{
    public function up()
    {
        \DBUtil::create_table(
            'site_store_free',
            array(
                'id'                      => array('type' => 'int', 'null' => false, 'unsigned' => true, 'auto_increment' => true, 'comment' => 'サイトID'),
                'company_id'              => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '企業ID'),
                'brand_id'                => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'ブランドID'),
                'store_id'                => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '店舗ID'),
                'sitemap_name'            => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => 'サイトマップ名称'),
                'sitemap_url'             => array('constraint' => 64, 'type' => 'varchar', 'null' => false, 'comment' => 'サイトURL'),
                'title_picture_id'        => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'タイトル画像ID'),
                'organize_type'           => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '1:簡単入力 / 2:フリー入力'),
                'page_type'               => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '1:本部トップ / 2:店舗トップ / 3:店舗一覧 / 4:メニュートップ / 5:メニュー詳細 / 6:会社概要 / 7:こだわり / 8:人材募集 / 9:加盟店募集 / 10:汎用パターン1 / 11:汎用パターン2 / 12:汎用パターン3 / 13:レイアウト無し / 14:メニュー/レイアウト無し / 15:メールマガクーポン / 16:登録店舗選択'),
                'organize_parts'          => array('type' => 'text', 'null' => false, 'comment' => 'サイト構成素材'),
                'free_input'              => array('type' => 'text', 'null' => false, 'comment' => 'フリー入力'),
                'header'                  => array('constraint' => 256, 'type' => 'varchar', 'null' => true, 'comment' => 'ヘッダー'),
                'footer'                  => array('constraint' => 256, 'type' => 'varchar', 'null' => true, 'comment' => 'フッター'),
                'memo'                    => array('type' => 'text', 'null' => false, 'comment' => 'メモ'),
                'site_hierarchy'          => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '第1階層～第3階層を想定'),
                'parents_site_id'         => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => '親サイトID'),
                'display_flg'             => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '0:非表示 / 1:表示'),
                'display_order'           => array('type' => 'smallint', 'null' => false, 'default' => 0 ,'comment' => '表示順'),
                'created_at'              => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時'),
                'updated_at'              => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時'),
            ),
            array('id',), true, 'InnoDB', 'utf8'
        );
        \DBUtil::create_index('site_store_free', array('brand_id', 'store_id'), 'idx1_site_store_free');
    }

    public function down()
    {
        \DBUtil::drop_table('site_store_free');
    }
}
