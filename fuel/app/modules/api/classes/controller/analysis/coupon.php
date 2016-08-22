<?php
namespace Api;

/**
 * Class Daily_Coupon
 * @package Api
 */
class Controller_Analysis_Coupon extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'company_id' => false,
            'brand_ids' => false,
            'store_ids' => false,
            'month' => true,
            'pattern' => true,
        ),
    );

    protected function index() {
        \Additional_Log::debug('daily/coupon called');

        $user = \Model_User::find($this->user_id);
        $relates = array();

        if($user->authority >=  USER_AUTHORITY_COMPANY){
            $params['company_id'] = $user->company_id;
        }
        if($user->authority >=  USER_AUTHORITY_BRAND){
            $params['brand_ids'] = [$user->brand_id];
        }
        if($user->authority >=  USER_AUTHORITY_SECTION){
            $relates['store']['where'] = array(
                array('section_id', $user->section_id),
            );
        }
        if($user->authority >=  USER_AUTHORITY_STORE){
            $params['store_ids'] = [$user->store_id];
        }

        $relates['coupon_analysis']['where'] = array(array('date', 'LIKE', $this->params['month'] . '%'));
        $conditions = \Model_Coupon::makeConditions($this->params);
        $coupons = \Model_Coupon::find('all', array('where' => $conditions, 'related' => $relates));

        $this->response_fields['daily_coupon'] = array();
        foreach ($coupons as $coupon) {
            $rec = $coupon->toArray($this->params['pattern']);
            $rec['display_coupon_count'] = $rec['used_coupon_count'] = $rec['unique_user_count'] = 0;
            foreach ($coupon->coupon_analysis as $ca) {
                $rec['display_coupon_count'] += $ca->display_coupon_count;
                $rec['used_coupon_count'] += $ca->used_coupon_count;
                $rec['unique_user_count'] += $ca->unique_user_count;
            }
            $this->response_fields['daily_coupon'][] = $rec;
        }
    }
}