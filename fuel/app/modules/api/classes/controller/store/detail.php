<?php

namespace Api;
class Controller_Store_Detail extends \Controller_Api
{
    protected function index()
    {
        \Additional_Log::info('store detail/index called');
        $user = \Model_User::find($this->user_id);
        if (!$user->checkPermissionForUser()) {
            throw new \ProtocolException(\Lang::get('store_can_not_update'), "You can not change this store",
                \ProtocolException::RESULT_CODE_STORE_NOT_FOUND);
        }
        $conditions = array();
        $relates = array();

        switch ($user->authority) {
        case USER_AUTHORITY_ADMIN:
            break;
        case USER_AUTHORITY_STORE:
            $conditions[] = array('id' => $user->store_id);
        case USER_AUTHORITY_SECTION:
            $conditions[] = array('section_id' => $user->section_id);
        case USER_AUTHORITY_BRAND:
            $conditions[] = array('brand_id' => $user->brand_id);
        case USER_AUTHORITY_COMPANY:
            $relates['brand']['where'][] = array('company_id' => $user->company_id);
            break;
        }
        $conditions[] = array('id' => $this->params['store_id']);

        $store = \Model_Store::find('first', array(
            'where' => $conditions,
            'related' => $relates,
        ));
        $this->response_fields['store'] = $store->toArray(PATTERN_ALL);
        if ($store->brand) {
            if ($store->brand->company) {
                $this->response_fields['store']['company_id'] = $store->brand->company->id;
                $this->response_fields['store']['company_name'] = $store->brand->company->company_name;
            }
            $this->response_fields['store']['brand_name'] = $store->brand->brand_name;
        }
        $this->response_fields['store']['store_header_picture_name'] = $this->response_fields['store']['store_header_picture_url'] = "";
        if (!empty($store->header_picture)) {
            $this->response_fields['store']['store_header_picture_name'] = $store->header_picture->picture_file_name;
            $this->response_fields['store']['store_header_picture_url'] = \Model_Picture::makePictureUrl($store->header_picture)['url'];
        }
        \Additional_Log::info('store detail/index called');
    }
}
