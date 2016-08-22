<?php

namespace Fuel\Migrations;

class Create_Coupon_Table
{
    public function up()
    {
        \DBUtil::create_table(
            'coupons',
            array(
                'id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'auto_increment' => true, 'comment' => 'クーポンID')
                ,'company_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '企業ID')
                ,'brand_id' => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => 'ブランドID')
                ,'section_id' => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => '事業部ID')
                ,'store_id' => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => '店舗ID')
                ,'coupon_release_flg' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'default' => 0, 'comment' => '公開済みフラグ(0:未公開 / 1:公開済み)')
                ,'coupon_status' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'default' => 0, 'comment' => 'クーポン状態(0:無効 / 1:有効)')
                ,'coupon_user_code_display' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'default' => 0, 'comment' => 'ユーザコード表示可否(0:非表示 / 1:表示)')
                ,'coupon_category_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'カテゴリID')
                ,'coupon_name' => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => 'クーポン名称')
                ,'coupon_title' => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => 'クーポンタイトル')
                ,'coupon_description' => array('constraint' => 64, 'type' => 'varchar', 'null' => false, 'comment' => 'クーポン内容')
                ,'coupon_limit_type' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'default' => 0, 'comment' => '有効期限タイプ(0:設定なし / 1:期限設定型 / 2:メルマガ送信型)')
                ,'coupon_limit_from' => array('type' => 'datetime', 'null' => true, 'comment' => '有効期限開始日')
                ,'coupon_limit_to' => array('type' => 'datetime', 'null' => true, 'comment' => '有効期限終了日')
                ,'coupon_limit_send_start' => array('type' => 'smallint', 'null' => true, 'unsigned' => true, 'comment' => '有効期限送信型開始日数')
                ,'coupon_limit_send_count' => array('type' => 'smallint', 'null' => true, 'unsigned' => true, 'comment' => '有効期限送信型有効日数')
                ,'coupon_two_step_flg' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'default' => 0, 'comment' => '2段階クーポンフラグ(0:無効(通常クーポン) / 1:有効(2段階クーポン))')
                ,'coupon_two_step_button_description' => array('constraint' => 256, 'type' => 'varchar', 'null' => true, 'comment' => '2段階プレクーポンボタン説明')
                ,'coupon_two_step_use_description' => array('constraint' => 256, 'type' => 'varchar', 'null' => true, 'comment' => '2段階プレクーポン使用説明')
                ,'coupon_two_step_limit_type' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'default' => 0, 'comment' => '2段階有効期限タイプ(0:設定なし / 1:期限設定型))')
                ,'coupon_two_step_limit_min' => array('type' => 'smallint', 'null' => true, 'unsigned' => true, 'comment' => '2段階有効期限(分)')
                ,'coupon_two_step_confirmation' => array('constraint' => 128, 'type' => 'varchar', 'null' => true, 'comment' => '2段階店員確認用内容')
                ,'coupon_two_step_attention' => array('constraint' => 256, 'type' => 'varchar', 'null' => true, 'comment' => '2段階説明・注意事項')
                ,'coupon_two_step_over_description' => array('constraint' => 256, 'type' => 'varchar', 'null' => true, 'comment' => '2段階使用不可時説明文')
                ,'coupon_deleted_flg' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'default' => 0, 'comment' => '削除フラグ(0:未削除 / 1:論理削除済み))')
                ,'created_at' => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時')
                ,'updated_at' => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時')
            ),
            array('id'), true, 'InnoDB', 'utf8'
        );
        \DBUtil::create_index('coupons', array('brand_id'), 'idx1_coupons');
        \DBUtil::create_index('coupons', array('section_id'), 'idx2_coupons');
    }

    public function down()
    {
        \DBUtil::drop_table('coupons');
    }
}