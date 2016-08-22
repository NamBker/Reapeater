<?php

namespace Api;
class Controller_Brand_Private extends \Controller_Api
{

    protected static $required_parameters = array(
        'index' => array(
            'brand_id' => false,
            'pattern' => true,
        ),
    );

    protected function index()
    {
        \Additional_Log::debug('brand/private/index called');
        $user = \Model_User::find($this->user_id);
        if (empty($user)) {
            throw new \HttpForbiddenException(\Lang::get('user_is_invalid'));
        } else {
            $brand_id = !empty($this->params['brand_id']) ? $this->params['brand_id']: $user->brand_id;
            $brand = \Model_Brand::find('first', array('where' => array('id'=>$brand_id)));
            $this->response_fields['brand'] = $brand->toArray($this->params['pattern']);
        }
    }
}