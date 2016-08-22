<?php

namespace Fuel\Migrations;

class Recreate_questionnaire_respond_table
{
    public function up()
    {
        \DBUtil::drop_table('questionnaire_responds');
        \DBUtil::create_table(
            'questionnaire_responds',
            array(
                'id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'auto_increment' => true, 'comment' => 'アンケート質問ID'),
                'questionnaire_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'アンケートID'),
                'question_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '質問ID'),
                'questionnaire_required' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '必須可否(1:必須回答 / 2:任意回答'),
                'questionnaire_order' => array('type' => 'smallint', 'null' => true, 'unsigned' => true, 'comment' => '表示順'),
                'question_status' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '状態(0:未使用 / 1:使用中'),
                'update_flg' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '更新不可フラグ(0:再回答可能 / 1:最初の1回のみ回答可能'),
                'created_at' => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時'),
                'updated_at' => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時'),
            ),
            array('id', 'questionnaire_id','question_id',), true, 'InnoDB', 'utf8'
        );
        \DBUtil::add_fields('questions', array(
            'section_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '事業部ID', 'after' => 'brand_id'),
        ));
    }

    public function down()
    {
        \DBUtil::drop_table('questionnaire_responds');
        \DBUtil::create_table(
            'questionnaire_responds',
            array(
                'questionnaire_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => 'アンケートID'),
                'question_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '質問ID'),
                'questionnaire_required' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '必須可否(1:必須回答 / 2:任意回答'),
                'questionnaire_order' => array('type' => 'smallint', 'null' => true, 'unsigned' => true, 'comment' => '表示順'),
                'question_status' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '状態(0:未使用 / 1:使用中'),
                'update_flg' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '更新不可フラグ(0:再回答可能 / 1:最初の1回のみ回答可能'),
                'created_at' => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時'),
                'updated_at' => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時'),
            ),
            array('questionnaire_id','question_id',), true, 'InnoDB', 'utf8'
        );
        \DBUtil::drop_fields('questions', array(
            'section_id',
        ));
    }
}
