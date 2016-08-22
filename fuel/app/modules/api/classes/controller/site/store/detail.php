<?php

namespace Api;
class Controller_Site_Store_Detail extends \Controller_Api
{

    protected static $required_parameters = array(
        'index' => array(
            'store_id' => true,
            'pattern' => true,
        ),
    );

    protected function index()
    {
        \Additional_Log::debug('site store private info/index called');
        $user = \Model_User::find($this->user_id);
        if (empty($user)) {
            throw new \HttpForbiddenException(\Lang::get('user_is_invalid'));
        } else {
            $store = \Model_Store::find('first', array('where' => array('id' => $this->params['store_id'])));
            $data = $store->toArray($this->params['pattern']);
            $new_data = array();
            $new_data['id'] = $data['id'];
            $new_data['store_address'] = $data['store_address'];
            $new_data['store_access'] = $data['store_access'];
            $new_data['store_phone_no'] = $data['store_phone_no'];
            $new_data['store_business_hours_from'] = $data['store_business_hours_from'];
            $new_data['store_business_hours_to'] = $data['store_business_hours_to'];
            $new_data['store_regular_holiday'] = $data['store_regular_holiday'];
            $new_data['store_location'] = $data['store_location'];
            $this->response_fields['store'] = $new_data;
        }
    }
}
