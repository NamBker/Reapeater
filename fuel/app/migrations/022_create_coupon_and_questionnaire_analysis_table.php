<?php

namespace Fuel\Migrations;

class Create_Coupon_And_Questionnaire_Analysis_Table
{
    public function up()
    {
        // クーポン利用集計
        \DBUtil::create_table(
            'coupon_analysis',
            array(
                'date' => array('constraint' => 10, 'type' => 'varchar', 'null' => true, 'comment' => '対象日')
                ,'store_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '店舗ID')
                ,'coupon_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'クーポンID')
                ,'distribute_type' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '配布タイプ(1:配信 / 2:その他)')
                ,'display_coupon_count' => array('type' => 'int', 'null' => true, 'unsigned' => true, 'default' => 0, 'comment' => 'クーポン表示数')
                ,'used_coupon_count' => array('type' => 'int', 'null' => true, 'unsigned' => true, 'default' => 0, 'comment' => 'クーポン利用数')
                ,'display_two_step_coupon_count' => array('type' => 'int', 'null' => true, 'unsigned' => true, 'default' => 0, 'comment' => '2段階クーポン表示数')
                ,'used_two_step_coupon_count' => array('type' => 'int', 'null' => true, 'unsigned' => true, 'default' => 0, 'comment' => '2段階クーポン利用数')
                ,'created_at' => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時')
                ,'updated_at' => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時')
            ),
            array('date', 'store_id','coupon_id','distribute_type'), true, 'InnoDB', 'utf8'
        );

        // クーポン履歴
        \DBUtil::create_table(
            'member_coupon_histories',
            array(
                'id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'auto_increment' => true, 'comment' => 'クーポン履歴ID')
                ,'coupon_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'クーポンID')
                ,'store_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '店舗ID')
                ,'member_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '会員ID')
                ,'delivery_id' => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => '配信ID')
                ,'display_date' => array('type' => 'datetime', 'null' => true, 'comment' => '表示日時')
                ,'used_date' => array('type' => 'datetime', 'null' => true, 'comment' => '使用日時')
                ,'second_display_date' => array('type' => 'datetime', 'null' => true, 'comment' => '2段階表示日時')
                ,'second_used_date' => array('type' => 'datetime', 'null' => true, 'comment' => '2段階使用日時')
                ,'created_at' => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時')
                ,'updated_at' => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時')
            ),
            array('id'), true, 'InnoDB', 'utf8'
        );
        \DBUtil::create_index('member_coupon_histories', array('coupon_id'), 'idx1_member_coupon_histories');

        // アンケート回答集計
        \DBUtil::create_table(
            'questionnaire_analysis',
            array(
                'date' => array('constraint' => 10, 'type' => 'varchar', 'null' => true, 'comment' => '対象日')
                ,'store_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '店舗ID')
                ,'questionnaire_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'アンケートID')
                ,'question_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '質問ID')
                ,'question_response' => array('constraint' => 64, 'type' => 'varchar', 'null' => false, 'comment' => 'アンケート回答')
                ,'question_response_count' => array('type' => 'int', 'null' => true, 'unsigned' => true, 'default' => 0, 'comment' => '回答数')
                ,'created_at' => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時')
                ,'updated_at' => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時')
            ),
            array('date','questionnaire_id','question_id','question_response'), true, 'InnoDB', 'utf8'
        );

        // アンケート履歴
        \DBUtil::create_table(
            'member_questionnaire_histories',
            array(
                'member_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '会員ID')
                ,'questionnaire_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'アンケートID')
                ,'questionnaire_send_date' => array('type' => 'datetime', 'null' => false, 'comment' => '送信日')
                ,'questionnaire_respond_date' => array('type' => 'datetime', 'null' => false, 'comment' => '回答日')
                ,'created_at' => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時')
                ,'updated_at' => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時')
            ),
            array('member_id', 'questionnaire_id'), true, 'InnoDB', 'utf8'
        );

        // アンケート回答履歴
        \DBUtil::create_table(
            'member_questionnaire_responds',
            array(
                'member_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '会員ID')
                ,'questionnaire_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'アンケートID')
                ,'question_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '質問ID')
                ,'question_response' => array('constraint' => 64, 'type' => 'varchar', 'null' => false, 'comment' => 'アンケート回答')
                ,'created_at' => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時')
                ,'updated_at' => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時')
            ),
            array('member_id', 'questionnaire_id', 'question_id'), true, 'InnoDB', 'utf8'
        );

        \DBUtil::add_fields('coupons', array(
            'coupon_delivery_date' => array('type' => 'datetime', 'null' => true, 'comment' => '配信実行日時', 'after' => 'coupon_limit_send_count'),
        ));
     }

    public function down()
    {
        \DBUtil::drop_table('coupon_analysis');
        \DBUtil::drop_table('member_coupon_histories');
        \DBUtil::drop_table('questionnaire_analysis');
        \DBUtil::drop_table('member_questionnaire_histories');
        \DBUtil::drop_table('member_questionnaire_responds');

        \DBUtil::drop_fields('coupons', array(
            'coupon_delivery_date',
        ));
    }
}
