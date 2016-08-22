<?php

namespace Api;
class Controller_Coupon_Detail extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'coupon_id' => true,
        ),
    );

    protected function index()
    {
        \Additional_Log::debug('coupon info/index called');
        $user = \Model_User::find($this->user_id);
        if (empty($user)) {
            throw new \HttpForbiddenException(\Lang::get('user_is_invalid'));
        } else {
            $conditions = $this->makeConditionForUser($user);
            $conditions[] = array('id', $this->params['coupon_id']);

            $coupon = \Model_Coupon::find('first', array('where' => $conditions));
            $response = $coupon->toArray(PATTERN_ALL);
            if (!empty($coupon)) {
                $response['company_name'] = !empty($coupon->company) ? $coupon->company->company_name : "";
                $response['brand_name'] = !empty($coupon->brand) ? $coupon->brand->brand_name : "";
                $response['store_name'] = !empty($coupon->store) ? $coupon->store->store_name : "";
            }
            $this->response_fields['coupon'] = $response;
        }
    }

    private function makeConditionForUser($user)
    {
        $conditions = array();
        switch($user->authority) {
            case USER_AUTHORITY_STORE:
                $conditions[] = array('store_id', 'IN', $user->store_id);
            case USER_AUTHORITY_SECTION:
                $conditions[] = array('section_id', $user->section_id);
            case USER_AUTHORITY_BRAND:
                $conditions[] = array('brand_id', $user->brand_id);
            case USER_AUTHORITY_COMPANY:
                $conditions[] = array('company_id', $user->company_id);
                break;
        }
        $conditions[] = array('coupon_deleted_flg', 0);
        return $conditions;
    }
}
