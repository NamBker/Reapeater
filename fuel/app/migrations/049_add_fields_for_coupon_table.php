<?php

namespace Fuel\Migrations;

class Add_fields_for_coupon_table
{
    public function up()
    {
        \DBUtil::add_fields('coupons', array(
            'coupon_code' => array('type' => 'varchar', 'constraint' => 32, 'null' => false, 'comment' => 'クーポンコード', 'after' => 'store_id'),
        ));
        $coupons = \Model_Coupon::find('all');
        foreach($coupons as $coupon) {
            \DB::update('coupons')->where('id', $coupon->id)->value('coupon_code', uniqid())->execute();
        }
        \DBUtil::create_index('coupons', array('coupon_code'), 'unique1_coupons', 'UNIQUE');
    }

    public function down()
    {
        \DBUtil::drop_index('coupons', 'unique1_coupons');
        \DBUtil::drop_fields('coupons', array(
            'coupon_code',
        ));
    }
}
