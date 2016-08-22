<?php

namespace Api;
class Controller_Site_Store_Company extends \Controller_Api
{

    protected static $required_parameters = array(
        'index' => array(
            'brand_id' => true,
            'pattern' => true,
        ),
    );

    protected function index()
    {
        \Additional_Log::debug('site store company info/index called');
        $user = \Model_User::find($this->user_id);
        if (empty($user)) {
            throw new \HttpForbiddenException(\Lang::get('user_is_invalid'));
        } else {
            $brand_id = isset($this->params['brand_id']) ? $this->params['brand_id'] : 0;
            $brand = \Model_Brand::find($brand_id, array(), "Brand not exist", \ProtocolException::RESULT_CODE_BRAND_NOT_FOUND);
            $company = \Model_Company::find($brand->company->id);
            $data = !empty($company) ? $company->toArray($this->params['pattern']) : null;
            $this->response_fields['company'] = $data;
        }
    }
}
