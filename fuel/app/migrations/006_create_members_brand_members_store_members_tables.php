<?php

namespace Fuel\Migrations;

class Create_Members_Brand_Members_Store_Members_Tables
{
    public function up()
    {
        \DBUtil::create_table(
            'members',
            array(
                'id'            => array('type' => 'int', 'null' => false, 'auto_increment' => true, 'comment' => '会員ID'),
                'delete_flg'    => array('type' => 'tinyint', 'null' => false, 'default' => 0, 'comment' => '削除フラグ 0:未削除 / 1:論理削除済み'),
                'created_at'    => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時'),
                'updated_at'    => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時'),
            ),
            array('id'), true, 'InnoDB', 'utf8'
        );

        \DBUtil::create_table(
            'brand_members',
            array(
                'company_id'    => array('type' => 'int', 'null' => false, 'comment' => '企業ID'),
                'brand_id'      => array('type' => 'int', 'null' => false, 'comment' => 'ブランドID'),
                'member_id'     => array('type' => 'int', 'null' => false, 'comment' => '会員ID'),
                'mail_address'  => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => 'メールアドレス'),
                'password'      => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => 'パスワード'),
                'status'        => array('type' => 'tinyint', 'null' => false, 'default' => 0, 'comment' => '状態 0:仮登録 / 1:登録済'),
                'name'          => array('constraint' => 32, 'type' => 'varchar', 'null' => false, 'comment' => '名前'),
                'tel_no'        => array('constraint' => 16, 'type' => 'varchar', 'null' => false, 'comment' => '電話番号'),
                'birthday'      => array('constraint' => 8, 'type' => 'varchar', 'null' => false, 'comment' => '生年月日'),
                'gender'        => array('type' => 'tinyint', 'null' => true, 'comment' => '性別 1:男性 / 2:女性'),
                'job'           => array('type' => 'tinyint', 'null' => true, 'comment' => '職業 1:公務員 / 2:会社役員 / 3:会社員（正社員） / 4:会社員（契約社員／派遣社員） / 5:自営業・自由業 / 6:高校生 / 7:大学生・大学院生 / 8:パート・アルバイト / 9:主婦 / 10:無職 / 11:その他'),
                'prefecture'    => array('type' => 'smallint', 'null' => true, 'comment' => '都道府県 http://www.mhlw.go.jp/topics/2007/07/dl/tp0727-1d.pdf'),
                'allergy_responsibility' => array('constraint' => 128, 'type' => 'varchar', 'null' => true, 'comment' => 'アレルギー義務表示'),
                'allergy_recommendation' => array('constraint' => 128, 'type' => 'varchar', 'null' => true, 'comment' => 'アレルギー推奨表示'),
                'facebook_hash' => array('constraint' => 64, 'type' => 'varchar', 'null' => true, 'comment' => 'facebook情報'),
                'twitter_hash'  => array('constraint' => 64, 'type' => 'varchar', 'null' => true, 'comment' => 'twitter情報'),
                'line_hash'     => array('constraint' => 64, 'type' => 'varchar', 'null' => true, 'comment' => 'line情報'),
                'created_at'    => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時'),
                'updated_at'    => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時'),
            ),
            array('company_id', 'brand_id', 'member_id'), true, 'InnoDB', 'utf8'
        );

        \DBUtil::create_table(
            'store_members',
            array(
                'brand_id'      => array('type' => 'int', 'null' => false, 'comment' => 'ブランドID'),
                'store_id'      => array('type' => 'int', 'null' => false, 'comment' => '店舗ID'),
                'member_id'     => array('type' => 'int', 'null' => false, 'comment' => '会員ID'),
                'store_member_status' => array('type' => 'tinyint', 'null' => false, 'default' => 1, 'comment' => '状態 1:会員 / 2:退会済み'),
                'member_registration_date' => array('type' => 'datetime', 'null' => false, 'comment' => '会員登録日'),
                'rank_point'    => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => 'ランクポイント'),
                'visit_count'   => array('type' => 'int', 'null' => false, 'default' => 0, 'comment' => '来店回数'),
                'last_visit_date' => array('type' => 'datetime', 'null' => false, 'comment' => '最終来店日'),
                'mail_reception' => array('type' => 'tinyint', 'null' => false, 'default' => 0, 'comment' => 'メルマガ受信可否 0:受信不可 / 1:受信可'),
                'visit_alert_push' => array('type' => 'tinyint', 'null' => false, 'default' => 0, 'comment' => '来店アラート(PUSH通知) 0:受信不可 / 1:受信可'),
                'visit_alert_mail' => array('type' => 'tinyint', 'null' => false, 'default' => 0, 'comment' => '来店アラート(メール) 0:受信不可 / 1:受信可'),
                'other'         => array('type' => 'text', 'null' => false, 'comment' => 'その他'),
                'created_at'    => array('type' => 'datetime', 'null' => false, 'comment' => '作成日時'),
                'updated_at'    => array('type' => 'datetime', 'null' => false, 'comment' => '更新日時'),
            ),
            array('brand_id', 'store_id', 'member_id'), true, 'InnoDB', 'utf8'
        );
        \DB::query("alter table oauth_access_tokens comment 'アクセストークン'")->execute();
    }

    public function down()
    {
        \DBUtil::drop_table('members');
        \DBUtil::drop_table('brand_members');
        \DBUtil::drop_table('store_members');
    }
}
