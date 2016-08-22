<?php

namespace Fuel\Migrations;

class Add_fields_for_random_coupon_and_questionnaire_table
{
    public function up()
    {
        \DBUtil::add_fields('random_coupons', array(
            'section_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '事業部ID', 'after' => 'brand_id'),
        ));
        \DBUtil::create_index('random_coupons', array('section_id'), 'idx3_random_coupons');
        \DBUtil::add_fields('questionnaires', array(
            'section_id' => array('type' => 'int', 'null' => false, 'unsigned' => true, 'comment' => '事業部ID', 'after' => 'brand_id'),
        ));
        \DBUtil::create_index('questionnaires', array('section_id'), 'idx3_questionnaires');
    }

    public function down()
    {
        \DBUtil::drop_index('random_coupons', 'idx3_random_coupons');
        \DBUtil::drop_fields('random_coupons', array(
            'section_id',
        ));
        \DBUtil::drop_index('questionnaires', 'idx3_questionnaires');
        \DBUtil::drop_fields('questionnaires', array(
            'section_id',
        ));
    }
}
