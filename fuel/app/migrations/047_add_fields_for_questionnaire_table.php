<?php

namespace Fuel\Migrations;

class Add_fields_for_questionnaire_table
{
    public function up()
    {
        \DBUtil::add_fields('questionnaires', array(
            'questionnaire_code' => array('type' => 'varchar', 'constraint' => 32, 'null' => false, 'comment' => 'アンケートコード', 'after' => 'store_id'),
        ));
        $questionnaires = \Model_Questionnaire::find('all');
        foreach($questionnaires as $questionnaire) {
            \DB::update('questionnaires')->where('id', $questionnaire->id)->value('questionnaire_code', uniqid())->execute();
        }
        \DBUtil::create_index('questionnaires', array('questionnaire_code'), 'unique1_questionnaires', 'UNIQUE');
    }

    public function down()
    {
        \DBUtil::drop_index('questionnaires', 'unique1_questionnaires');
        \DBUtil::drop_fields('questionnaires', array(
            'questionnaire_code',
        ));
    }
}
