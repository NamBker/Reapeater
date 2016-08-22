<?php

namespace Fuel\Migrations;

class Add_fields_to_question_table
{
    public function up()
    {
        \DBUtil::add_fields('questions', array(
            'question_used_flg' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'default' => 1, 'comment' => '1:未公開 / 2:公開済み', 'after' => 'question_nos')
        ));
        \DBUtil::modify_fields('questions', array(
            'question_deleted_flg' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'default' => 0, 'comment' => '削除フラグ(0:未削除 / 1:論理削除)')
            ,'question_nos' => array('constraint' => 256, 'type' => 'varchar', 'null' => true, 'comment' => '回答NOs')
        ));
    }

    public function down()
    {
        \DBUtil::drop_fields('questions', array(
            'question_used_flg',
        ));
        \DBUtil::modify_fields('questions', array(
            'question_deleted_flg' => array('type' => 'tinyint', 'null' => false, 'unsigned' => true, 'comment' => '削除フラグ(0:未削除 / 1:論理削除)')
            ,'question_nos' => array('constraint' => 128, 'type' => 'varchar', 'null' => true, 'comment' => '回答NOs')
        ));
    }
}
