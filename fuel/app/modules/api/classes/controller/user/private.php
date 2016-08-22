<?php

namespace Api;
class Controller_User_Private extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'user_id' => false,
        ),
    );

    protected function index()
    {
        \Additional_Log::debug('user/index called');
        $user_id = $this->params['user_id'];
        $token = \Input::get('token');
        if ($user_id == "me") {
            $user = \Model_User::findByToken($token);
        } else {
            $user = \Model_User::find($user_id);
        }
        $this->response_fields['user'] = $user->toArray();
        $this->response_fields['user']['company_name'] = empty($user->company) ? null : $user->company->company_name;
        $this->response_fields['user']['brand_name'] = empty($user->brand) ? null : $user->brand->brand_name;
        $this->response_fields['user']['store_name'] = empty($user->store) ? null : $user->store->store_name;
        if ($user_id == "me") {
            $conditions = array();
            // 企業情報の取得
            $this->response_fields['companies'] = $this->getCompaniesForUser($user);
            $this->response_fields['brands'] = $this->getBrandsForUser($user);
            $this->response_fields['areas'] = $this->getAreasForUser($user);
            $this->response_fields['stores'] = $this->getStoresForUser($user);
        }
    }

    private function getCompaniesForUser($user)
    {
        $conditions = array();
        if (USER_AUTHORITY_ADMIN < $user->authority) {
            $conditions[] = array('id', $user->company_id);
        }
        $companies = \Model_Company::find('all', array('where' => $conditions));
        return array_values(array_map(function ($company) {
            return array('id' => $company->id,
                'company_name' => $company->company_name);
        }, $companies));
    }

    private function getBrandsForUser($user)
    {
        $conditions = array();
        if (USER_AUTHORITY_ADMIN < $user->authority) {
            $conditions[] = array('company_id', $user->company_id);
        }
        if (USER_AUTHORITY_COMPANY < $user->authority) {
            $conditions[] = array('id', $user->brand_id);
        }
        $brands = \Model_Brand::find('all', array('where' => $conditions));
        return array_values(array_map(function ($brand) {
            return array('company_id' => $brand->company_id,
                'id' => $brand->id,
                'brand_name' => $brand->brand_name);
        }, $brands));
    }

    private function getStoresForUser($user)
    {
        $conditions = array();
        $relates = array();
        switch($user->authority) {
        case USER_AUTHORITY_STORE:
            $conditions[] = array('id', $user->store_id);
            break;
        case USER_AUTHORITY_SECTION:
            $conditions[] = array('section_id', $user->section_id);
            break;
        case USER_AUTHORITY_BRAND:
            $conditions[] = array('brand_id', $user->brand_id);
            break;
        case USER_AUTHORITY_COMPANY:
            $relates['brand']['where'][] = array('company_id', $user->company_id );
            break;
        }
        $stores = \Model_Store::find('all', array('where' => $conditions, 'related' => $relates));
        return array_values(array_map(function ($store) {
            $res = $store->toArray(PATTERN_ONLY_KEY);
            $res['company_id'] = $store->brand ? $store->brand->company_id : null;
            return $res;
        }, $stores));
    }

    private function getAreasForUser($user)
    {
        $conditions = array();
        $relates = array();
        switch($user->authority) {
        case USER_AUTHORITY_BRAND:
        default:
            $conditions[] = array('brand_id', $user->brand_id);
            break;
        case USER_AUTHORITY_COMPANY:
            $relates['brand']['where'][] = array('company_id', $user->company_id);
            break;
        case USER_AUTHORITY_ADMIN:
            break;
        }
        $areas = \Model_Area::find('all', array('where' => $conditions, 'related' => $relates));
        return array_values(array_map(function ($area) {
            return array('id' => $area->id,
                'area_name' => $area->area_name,
                'area_type' => $area->area_type,
                'company_id' => $area->company ? $area->company->id : null,
                'brand_id' => $area->brand ? $area->brand->id : null,
            );
        }, $areas));
    }
}
