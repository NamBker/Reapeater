<?php

namespace Fuel\Migrations;

class Create_Question_And_Questionnaires_Table
{
    public function up()
    {
        // 質問TBL
        \DBUtil::create_table(
            'questions',
            array(
                'id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'auto_increment' => true, 'comment' => '質問ID')
                ,'company_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '企業ID')
                ,'brand_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'ブランドID')
                ,'store_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '店舗ID')
                ,'questionnaire_type' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '種別タイプ(1:登録初期アンケート / 2:その他)')
                ,'question_type' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '回答タイプ(1:フリーテキスト(半角英数字) / 2:フリーテキスト(全角) / 3:テキストエリア(全角) / 4:単一選択形式(ラジオボタン) / 5:単一選択形式(セレクトボックス) / 6:複数選択形式)')
                ,'question_title' => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => '項目名')
                ,'question_body' => array('constraint' => 64, 'type' => 'varchar', 'null' => false, 'comment' => '質問本文')
                ,'question_char_limit' => array('type' => 'smallint', 'null' => false, 'unsigned' => true, 'default' => 0, 'comment' => '文字数制限')
                ,'question_nos' => array('constraint' => 128, 'type' => 'varchar', 'null' => true, 'comment' => '回答NOs')
                ,'question_deleted_flg' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '削除フラグ(0:未削除 / 1:論理削除)')
                ,'created_at' => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時')
                ,'updated_at' => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時')
            ),
            array('id',), true, 'InnoDB', 'utf8'
        );
        \DBUtil::create_index('questions', array('brand_id'), 'idx1_questions');
        \DBUtil::create_index('questions', array('store_id'), 'idx2_questions');

        // アンケートTBL
        \DBUtil::create_table(
            'questionnaires',
            array(
                'id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'auto_increment' => true, 'comment' => '質問ID')
                ,'company_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '企業ID')
                ,'brand_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'ブランドID')
                ,'store_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '店舗ID')
                ,'questionnaire_release_flg' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '公開済みフラグ(0:未公開 / 1:公開済み)')
                ,'questionnaire_type' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '種別タイプ(1:登録初期アンケート / 2:その他')
                ,'questionnaire_category_id' => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => 'カテゴリID')
                ,'questionnaire_name' => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => 'アンケート名')
                ,'questionnaire_limit' => array('type' => 'varchar', 'constraint' => 10, 'null' => false, 'default' => '0000-00-00', 'comment' => '回答期限(YYYY-mm-DD)')
                ,'questionnaire_text' => array('constraint' => 64, 'type' => 'varchar', 'null' => true, 'comment' => '回答ページ冒頭文言')
                ,'questionnaire_agreement' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '規約・ポリシー表示フラグ(0:表示しない / 1:表示する)')
                ,'questionnaire_thank_text' => array('constraint' => 64, 'type' => 'varchar', 'null' => true, 'comment' => '回答後のお礼文言')
                ,'questionnaire_deleted_flg' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '削除フラグ(0:未削除 / 1:論理削除)')
                ,'created_at' => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時')
                ,'updated_at' => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時')
            ),
            array('id',), true, 'InnoDB', 'utf8'
        );
        \DBUtil::create_index('questionnaires', array('brand_id'), 'idx1_questionnaires');
        \DBUtil::create_index('questionnaires', array('store_id'), 'idx2_questionnaires');

        // アンケート質問TBL
        \DBUtil::create_table(
            'questionnaire_responds',
            array(
                'questionnaire_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'アンケートID')
                ,'question_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '質問ID')
                ,'questionnaire_required' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '必須可否(1:必須回答 / 2:任意回答')
                ,'questionnaire_order' => array('type' => 'smallint', 'null' => true, 'unsigned' => true, 'comment' => '表示順')
                ,'question_status' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '状態(0:未使用 / 1:使用中')
                ,'update_flg' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '更新不可フラグ(0:再回答可能 / 1:最初の1回のみ回答可能')
                ,'created_at' => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時')
                ,'updated_at' => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時')
            ),
            array('questionnaire_id','question_id',), true, 'InnoDB', 'utf8'
        );

        // アンケートクーポンTBL
        \DBUtil::create_table(
            'questionnaire_coupons',
            array(
                'questionnaire_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'アンケートID')
                ,'count' => array('type' => 'smallint', 'null' => true, 'unsigned' => true, 'comment' => '回答数')
                ,'coupon_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'クーポンID')
                ,'created_at' => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時')
                ,'updated_at' => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時')
            ),
            array('questionnaire_id','count',), true, 'InnoDB', 'utf8'
        );
    }

    public function down()
    {
        \DBUtil::drop_table('questions');
        \DBUtil::drop_table('questionnaires');
        \DBUtil::drop_table('questionnaire_responds');
        \DBUtil::drop_table('questionnaire_coupons');
    }
}