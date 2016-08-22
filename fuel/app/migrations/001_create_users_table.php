<?php

namespace Fuel\Migrations;

class Create_Users_Table
{
    public function up()
    {
        \DBUtil::create_table(
            'users',
            array(
                'id'           => array('type' => 'int', 'null' => false, 'unsigned' => true, 'auto_increment' => true, 'comment' => 'ユーザID'),
                'mail_address' => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => 'メ－ルアドレス'),
                'password'     => array('constraint' => 255, 'type' => 'varchar', 'null' => false, 'comment' => 'パスワード'),
                'authority'    => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => '権限'),
                'company_id'   => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => '企業ID'),
                'brand_id'     => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => 'ブランドID'),
                'section_id'   => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => '事業部ID'),
                'store_id'     => array('type' => 'int', 'null' => true, 'unsigned' => true, 'comment' => '店舗ID'),
                'name'         => array('constraint' => 16, 'type' => 'varchar', 'null' => false, 'comment' => '名前'),
                'address'      => array('constraint' => 64, 'type' => 'varchar', 'null' => true, 'comment' => '住所'),
                'phone_no'     => array('constraint' => 16, 'type' => 'varchar', 'null' => true, 'comment' => '電話番号'),
                'created_at'   => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時'),
                'updated_at'   => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時'),
            ),
            array('id',), true, 'InnoDB', 'utf8'
        );
    }

    public function down()
    {
        \DBUtil::drop_table('users');
    }
}