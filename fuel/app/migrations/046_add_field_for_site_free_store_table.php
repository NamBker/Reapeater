<?php

namespace Fuel\Migrations;

class Add_field_for_site_free_store_table
{
    public function up()
    {
        \DBUtil::add_fields('site_store_free', array(
            'linkage_site_id' => array('type' => 'int', 'null' => false, 'unsigned' => true ,'comment' => '連動サイトID', 'after' => 'sitemap_url'),
        ));
    }

    public function down()
    {
        \DBUtil::drop_fields('site_store_free', array(
            'linkage_site_id',
        ));
    }
}
