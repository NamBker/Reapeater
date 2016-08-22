<?php

namespace Fuel\Migrations;

class Create_Random_Coupons_Table_And_Random_Coupon_Items_Table
{
    public function up()
    {
        \DBUtil::create_table(
            'random_coupons',
            array(
                'id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'auto_increment' => true, 'comment' => 'ランダムクーポンID'),
                'company_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '企業ID'),
                'brand_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'ブランドID'),
                'store_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '店舗ID'),
                'random_coupon_name' => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => 'ランダムクーポン名称'),
                'random_coupon_release_flg' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'default' => 0, 'comment' => '公開済みフラグ(0:未公開 / 1:公開済み) ※配信済みのランダムクーポンは変更不可'),
                'random_coupon_status' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'default' => 1, 'comment' => 'ランダムクーポン状態(0:無効 / 1:有効)'),
                'random_coupon_deleted_flg' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'default' => 0, 'comment' => '削除フラグ(0:未削除 / 1:論理削除済み)'),
                'created_at' => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時'),
                'updated_at' => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時'),
            ),
            array('id'), true, 'InnoDB', 'utf8'
        );
        \DBUtil::create_index('random_coupons', array('brand_id'), 'idx1_random_coupons');
        \DBUtil::create_index('random_coupons', array('store_id'), 'idx2_random_coupons');
        \DBUtil::create_table(
            'random_coupon_items',
            array(
                'id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'auto_increment' => true, 'comment' => 'ランダム表示クーポンID'),
                'random_coupon_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'ランダムクーポンID'),
                'coupon_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'クーポンID'),
                'coupon_probability' => array('type' => 'smallint', 'null' => false, 'unsigned' => true, 'comment' => '表示確率'),
                'coupon_max_count' => array('type' => 'smallint', 'null' => false, 'unsigned' => true, 'default' => 0, 'comment' => '最大表示回数("0"の場合は、制限なし)'),
                'created_at' => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時'),
                'updated_at' => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時'),
            ),
            array('id', 'random_coupon_id', 'coupon_id'), true, 'InnoDB', 'utf8'
        );
    }

    public function down()
    {
        \DBUtil::drop_table('random_coupons');
        \DBUtil::drop_table('random_coupon_items');
    }
}
