<?php

namespace Fuel\Migrations;

class Create_Daily_Store_info_Table
{
    public function up()
    {
        \DBUtil::create_table(
            'daily_store_info',
            array(
                'date' => array('type' => 'varchar', 'constraint' => 10, 'default' => '0000-00-00', 'comment' => '対象日(YYYY-MM-DD)')
                ,'company_id' => array('type' => 'int', 'null' => false, 'comment' => '企業ID')
                ,'brand_id' => array('type' => 'int', 'null' => false, 'comment' => 'ブランドID')
                ,'store_id' => array('type' => 'int', 'null' => false, 'comment' => '店舗ID')
                ,'register_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '登録者数')
                ,'leaver_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '退会者数')
                ,'men_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '男性会員数')
                ,'women_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '女性会員数')
                ,'10s_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '10台会員数')
                ,'20s_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '20台会員数')
                ,'30s_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '30台会員数')
                ,'40s_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '40台会員数')
                ,'50s_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '50台会員数')
                ,'60s_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '60台会員数')
                ,'70s_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '70台会員数')
                ,'80s_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '80台会員数')
                ,'90s_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '90台会員数')
                ,'job1_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '職業1会員数')
                ,'job2_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '職業2会員数')
                ,'job3_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '職業3会員数')
                ,'job4_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '職業4会員数')
                ,'job5_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '職業5会員数')
                ,'job6_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '職業6会員数')
                ,'job7_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '職業7会員数')
                ,'job8_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '職業8会員数')
                ,'job9_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '職業9会員数')
                ,'job10_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '職業10会員数')
                ,'job11_count' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '職業11会員数')
                ,'prefecture01' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県01会員数')
                ,'prefecture02' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県02会員数')
                ,'prefecture03' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県03会員数')
                ,'prefecture04' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県04会員数')
                ,'prefecture05' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県05会員数')
                ,'prefecture06' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県06会員数')
                ,'prefecture07' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県07会員数')
                ,'prefecture08' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県08会員数')
                ,'prefecture09' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県09会員数')
                ,'prefecture10' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県10会員数')
                ,'prefecture11' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県11会員数')
                ,'prefecture12' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県12会員数')
                ,'prefecture13' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県13会員数')
                ,'prefecture14' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県14会員数')
                ,'prefecture15' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県15会員数')
                ,'prefecture16' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県16会員数')
                ,'prefecture17' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県17会員数')
                ,'prefecture18' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県18会員数')
                ,'prefecture19' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県19会員数')
                ,'prefecture20' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県20会員数')
                ,'prefecture21' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県21会員数')
                ,'prefecture22' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県22会員数')
                ,'prefecture23' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県23会員数')
                ,'prefecture24' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県24会員数')
                ,'prefecture25' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県25会員数')
                ,'prefecture26' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県26会員数')
                ,'prefecture27' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県27会員数')
                ,'prefecture28' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県28会員数')
                ,'prefecture29' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県29会員数')
                ,'prefecture30' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県30会員数')
                ,'prefecture31' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県31会員数')
                ,'prefecture32' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県32会員数')
                ,'prefecture33' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県33会員数')
                ,'prefecture34' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県34会員数')
                ,'prefecture35' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県35会員数')
                ,'prefecture36' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県36会員数')
                ,'prefecture37' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県37会員数')
                ,'prefecture38' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県38会員数')
                ,'prefecture39' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県39会員数')
                ,'prefecture40' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県40会員数')
                ,'prefecture41' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県41会員数')
                ,'prefecture42' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県42会員数')
                ,'prefecture43' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県43会員数')
                ,'prefecture44' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県44会員数')
                ,'prefecture45' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県45会員数')
                ,'prefecture46' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県46会員数')
                ,'prefecture47' => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '都道府県47会員数')
                ,'created_at' => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時')
                ,'updated_at' => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時')
            ),
            array('date', 'company_id', 'brand_id', 'store_id',), true, 'InnoDB', 'utf8'
        );

        \DBUtil::add_fields('store_members', array(
            'member_leave_date' => array('type' => 'datetime','null' => false, 'default' => '0000-00-00', 'comment' => '会員退会日', 'after' => 'member_registration_date')
        ));
    }

    public function down()
    {
        \DBUtil::drop_table('daily_store_info');
        \DBUtil::drop_fields('store_members', array('member_leave_date'));
    }
}