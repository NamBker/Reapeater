<?php

namespace Fuel\Migrations;

class Create_Company_Brand_Secsion_Store_Tables
{
    public function up()
    {
        // Company
        \DBUtil::create_table(
            'companies',
            array(
                'id'                      => array('type' => 'int', 'null' => false, 'unsigned' => true, 'auto_increment' => true, 'comment' => '企業ID'),
                'company_status'          => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'default' => 2, 'comment' => '状態'),
                'company_name'            => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => '企業名'),
                'company_ceo'             => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => '代表取締役'),
                'company_address'         => array('constraint' => 64, 'type' => 'varchar', 'null' => false, 'comment' => '住所'),
                'company_phone_no'        => array('constraint' => 16, 'type' => 'varchar', 'null' => false, 'comment' => '電話番号'),
                'company_regular_holiday' => array('constraint' => 16, 'type' => 'varchar', 'null' => true, 'comment' => '定休日'),
                'company_signature_block' => array('type' => 'text', 'null' => true, 'comment' => 'メール署名'),
                'company_terms_of_use'    => array('type' => 'text', 'null' => true, 'comment' => '利用規約'),
                'company_privacy_policy'  => array('type' => 'text', 'null' => true, 'comment' => 'プライバシーポリシー'),
                'company_freeword'        => array('type' => 'text', 'null' => true, 'comment' => 'フリーワード'),
                'created_at'              => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時'),
                'updated_at'              => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時'),
            ),
            array('id',), true, 'InnoDB', 'utf8'
        );

        // Brands
        \DBUtil::create_table(
            'brands',
            array(
                'id'                    => array('type' => 'int', 'null' => false, 'unsigned' => true, 'auto_increment' => true, 'comment' => '企業ID'),
                'company_id'            => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '企業ID'),
                'brand_name'            => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => 'ブランド名'),
                'brand_status'          => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'default' => 2, 'comment' => '状態'),
                'brand_address'         => array('constraint' => 64, 'type' => 'varchar', 'null' => false, 'comment' => '住所'),
                'brand_phone_no'        => array('constraint' => 16, 'type' => 'varchar', 'null' => false, 'comment' => '電話番号'),
                'brand_regular_holiday' => array('constraint' => 16, 'type' => 'varchar', 'null' => true, 'comment' => '定休日'),
                'brand_signature_block' => array('type' => 'text', 'null' => true, 'comment' => 'メール署名'),
                'brand_terms_of_use'    => array('type' => 'text', 'null' => true, 'comment' => '利用規約'),
                'brand_privacy_policy'  => array('type' => 'text', 'null' => true, 'comment' => 'プライバシーポリシー'),
                'brand_freeword'        => array('type' => 'text', 'null' => true, 'comment' => 'フリーワード'),
                'google_analytics_id'   => array('constraint' => 16, 'type' => 'varchar', 'null' => true, 'comment' => 'googleアナリティクスID'),
                'google_analytics_pass' => array('constraint' => 16, 'type' => 'varchar', 'null' => true, 'comment' => 'googleアナリティクスパス'),
                'brand_first_open_date' => array('type' => 'datetime', 'null' => true, 'default' => null, 'comment' => '初回公開日時'),
                'created_at'            => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時'),
                'updated_at'            => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時'),
            ),
            array('id'), true, 'InnoDB', 'utf8'
        );
        \DBUtil::create_index('brands', array('company_id'), 'idx1_company');

        // Sections
        \DBUtil::create_table(
            'sections',
            array(
                'id'               => array('type' => 'int', 'null' => false, 'unsigned' => true, 'auto_increment' => true, 'comment' => '事業部ID'),
                'company_id'       => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '企業ID'),
                'brand_id'         => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'ブランドID'),
                'section_name'     => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => '事業部名'),
                'section_status'   => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'default' => 2, 'comment' => '状態'),
                'section_address'  => array('constraint' => 64, 'type' => 'varchar', 'null' => true, 'comment' => '住所'),
                'section_phone_no' => array('constraint' => 16, 'type' => 'varchar', 'null' => true, 'comment' => '電話番号'),
                'created_at'       => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時'),
                'updated_at'       => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時'),
            ),
            array('id'), true, 'InnoDB', 'utf8'
        );
        \DBUtil::create_index('sections', array('company_id', 'brand_id'), 'idx1_sections');

        // Sections
        \DBUtil::create_table(
            'stores',
            array(
                'id'                          => array('type' => 'int', 'null' => false, 'unsigned' => true, 'auto_increment' => true, 'comment' => '事業部ID'),
                'company_id'                  => array('type' => 'int', 'null' => false, 'comment' => '企業ID'),
                'brand_id'                    => array('type' => 'int', 'null' => false, 'comment' => 'ブランドID'),
                'section_id'                  => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '事業部ID'),
                'store_name'                  => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => '店舗名'),
                'store_status'                => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'default' => 2, 'comment' => '状態'),
                'store_prefectures'           => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '都道府県'),
                'store_address'               => array('constraint' => 64, 'type' => 'varchar', 'null' => false, 'comment' => '住所'),
                'store_address'               => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => '住所'),
                'store_building'              => array('constraint' => 32, 'type' => 'varchar', 'null' => true, 'comment' => 'ビル名等'),
                'store_access'                => array('constraint' => 64, 'type' => 'varchar', 'null' => false, 'comment' => 'アクセス'),
                'store_latitude'              => array('constraint' => [9, 7], 'type' => 'double', 'null' => true, 'comment' => '緯度'),
                'store_longitude'             => array('constraint' => [10, 7], 'type' => 'double', 'null' => true, 'comment' => '経度'),
                'store_phone_no'              => array('constraint' => 16, 'type' => 'varchar', 'null' => true, 'comment' => '電話番号'),
                'store_fax_no'                => array('constraint' => 16, 'type' => 'varchar', 'null' => true, 'comment' => 'FAX'),
                'store_manager_name'          => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => '店長名'),
                'store_business_hours_from'   => array('constraint' => 8, 'type' => 'varchar', 'null' => false, 'comment' => '営業時間_開店'),
                'store_business_hours_to'     => array('constraint' => 8, 'type' => 'varchar', 'null' => false, 'comment' => '営業時間_閉店'),
                'store_regular_holiday'       => array('constraint' => 16, 'type' => 'varchar', 'null' => false, 'comment' => '定休日'),
                'store_kids_room'             => array('constraint' => 16, 'type' => 'varchar', 'null' => false, 'comment' => 'キッズルーム'),
                'store_signature_block'       => array('type' => 'text', 'null' => true, 'comment' => 'メール署名'),
                'store_terms_of_use'          => array('type' => 'text', 'null' => true, 'comment' => '利用規約'),
                'store_privacy_policy'        => array('type' => 'text', 'null' => true, 'comment' => 'プライバシーポリシー'),
                'store_freeword'              => array('type' => 'text', 'null' => true, 'comment' => 'フリーワード'),
                'store_area_L'                => array('constraint' => 16, 'type' => 'varchar', 'null' => true, 'comment' => 'エリア(大分類)'),
                'store_area_M'                => array('constraint' => 16, 'type' => 'varchar', 'null' => true, 'comment' => 'エリア(中分類)'),
                'store_area_S'                => array('constraint' => 16, 'type' => 'varchar', 'null' => true, 'comment' => 'エリア(小分類)'),
                'store_seo_key1'              => array('constraint' => 32, 'type' => 'varchar', 'null' => true, 'comment' => 'SEOキーワード1'),
                'store_seo_key2'              => array('constraint' => 32, 'type' => 'varchar', 'null' => true, 'comment' => 'SEOキーワード2'),
                'store_seo_key3'              => array('constraint' => 32, 'type' => 'varchar', 'null' => true, 'comment' => 'SEOキーワード3'),
                'twitter_access_token'        => array('constraint' => 64, 'type' => 'varchar', 'null' => true, 'comment' => 'twitterアクセストークン'),
                'twitter_access_token_secret' => array('constraint' => 64, 'type' => 'varchar', 'null' => true, 'comment' => 'twitterアクセスシークレット'),
                'facebook_id'                 => array('constraint' => 64, 'type' => 'varchar', 'null' => true, 'comment' => 'フェイスブックID'),
                'store_first_open_date'       => array('type' => 'datetime', 'null' => true, 'default' => null, 'comment' => '初回公開日時'),
                'created_at'                  => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時'),
                'updated_at'                  => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時'),
            ),
            array('id'), true, 'InnoDB', 'utf8'
        );
        \DBUtil::create_index('stores', array('company_id', 'brand_id'), 'idx1_stores');
        \DBUtil::create_index('stores', array('section_id'), 'idx2_stores');
    }

    public function down()
    {
        \DBUtil::drop_table('companies');
        \DBUtil::drop_table('brands');
        \DBUtil::drop_table('sections');
        \DBUtil::drop_table('stores');
    }
}