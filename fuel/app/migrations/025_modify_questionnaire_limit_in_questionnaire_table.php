<?php

namespace Fuel\Migrations;

class Modify_Questionnaire_Limit_In_Questionnaire_Table
{
    public function up()
    {
        \DBUtil::modify_fields('questionnaires', array(
            'questionnaire_limit' => array('type' => 'datetime', 'null' => false, 'default' => '0000-00-00', 'comment' => '回答期限'),
        ));
    }

    public function down()
    {
        \DBUtil::modify_fields('questionnaires', array(
            'questionnaire_limit' =>  array('type' => 'varchar', 'constraint' => 10, 'null' => false, 'default' => '0000-00-00', 'comment' => '回答期限(YYYY-mm-DD)')
        ));
    }
}