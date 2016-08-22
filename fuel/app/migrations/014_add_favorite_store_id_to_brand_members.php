<?php

namespace Fuel\Migrations;

class Add_favorite_store_id_to_brand_members
{
    public function up()
    {
        \DBUtil::add_fields('brand_members', array(
            'favorite_store_id' => array('type' => 'int', 'null' => true, 'comment' => 'よく行く店舗', 'after' => 'allergy_recommendation'),
        ));
    }

    public function down()
    {
        \DBUtil::drop_fields('brand_members', array(
            'favorite_store_id',
        ));
    }
}
