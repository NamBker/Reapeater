<?php

namespace Api;
class Controller_Store extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'company_id' => false,
            'brand_id' => false,
            'store_status' => false,
            'store_code' => false,
            'store_name' => false,
            'page' => false,
            'per_page' => false,
            'pattern' => true,
        ),
        'create' => array(
            'company_id' => false,
            'brand_id' => false,
            'section_id' => false,
            'store_name' => true,
            'store_code' => true,
            'store_status' => true,
            'store_postal_code' => true,
            'store_prefectures' => true,
            'store_address' => true,
            'store_building' => false,
            'store_access' => false,
            'store_location' => false,
            'store_phone_no' => false,
            'store_fax_no' => false,
            'store_manager_name' => false,
            'store_business_hours_from' => false,
            'store_business_hours_to' => false,
            'store_regular_holiday' => false,
            'store_parking_lot' => false,
            'store_seat' => false,
            'store_kids_room' => false,
            'store_signature_block' => false,
            'store_terms_of_use' => false,
            'store_privacy_policy' => false,
            'store_freeword' => false,
            'store_sort_index' => false,
            'store_header_picture_id' => false,
            'store_area_L_id' => true,
            'store_area_M_id' => true,
            'store_area_S_id' => true,
            'store_seo_key1' => false,
            'store_seo_key2' => false,
            'store_seo_key3' => false,
            'twitter_access_token' => false,
            'twitter_access_token_secret' => false,
            'facebook_id' => false,
        ),
        'update' => array(
            'id' => true,
            'section_id' => false,
            'store_name' => true,
            'store_code' => true,
            'store_status' => true,
            'store_postal_code' => true,
            'store_prefectures' => true,
            'store_address' => true,
            'store_building' => false,
            'store_access' => false,
            'store_location' => false,
            'store_phone_no' => false,
            'store_fax_no' => false,
            'store_manager_name' => false,
            'store_business_hours_from' => false,
            'store_business_hours_to' => false,
            'store_regular_holiday' => false,
            'store_parking_lot' => false,
            'store_seat' => false,
            'store_kids_room' => false,
            'store_signature_block' => false,
            'store_terms_of_use' => false,
            'store_privacy_policy' => false,
            'store_freeword' => false,
            'store_sort_index' => false,
            'store_header_picture_id' => false,
            'store_area_L_id' => true,
            'store_area_M_id' => true,
            'store_area_S_id' => true,
            'store_seo_key1' => false,
            'store_seo_key2' => false,
            'store_seo_key3' => false,
            'twitter_access_token' => false,
            'twitter_access_token_secret' => false,
            'facebook_id' => false,
            'multiple_record' => false,
        ),
        'delete' => array(
            'store_ids' => true,
        ),
    );

    protected function index()
    {
        \Additional_Log::debug('【STORE LIST API】:START');

        // 引数取得
        $user = \Model_User::find($this->user_id);

        $conditions = array();
        $relates = array();

        switch ($user->authority) {
        case USER_AUTHORITY_STORE:
            $conditions[] = array('id', $user->store_id);
        case USER_AUTHORITY_SECTION:
            $conditions[] = array('section_id', $user->section_id);
        case USER_AUTHORITY_BRAND:
            $conditions[] = array('brand_id', $user->brand_id);
        case USER_AUTHORITY_COMPANY:
            $relates['brand']['where'][] = array('company_id', $user->company_id);
        }

        if ($this->is_setted_param('company_id') && $this->params['company_id'] != 0 && $user->authority < USER_AUTHORITY_COMPANY) {
            $relates['brand']['where'][] = array('company_id', $this->params['company_id']);
        }
        if ($this->is_setted_param('brand_id') && $this->params['brand_id'] && $user->authority < USER_AUTHORITY_BRAND) {
            $conditions[] = array('brand_id', $this->params['brand_id']);
        }
        if ($this->is_setted_param('store_code')) {
            $conditions[] = array('store_code', $this->params['store_code']);
        }
        if ($this->is_setted_param('store_name')) {
            $conditions[] = array('store_name', 'LIKE', "%{$this->params['store_name']}%");
        }
        if ($this->is_setted_param('store_status')) {
            $conditions[] = array('store_status', $this->params['store_status']);
        }

        $find_params = array(
            'where' => $conditions,
            'related' => $relates,
        );

        if ($this->is_setted_param('per_page') && $this->is_setted_param('page')) {
            $find_params['offset'] = ($this->params['page'] - 1) * $this->params['per_page'];
            $find_params['limit'] = $this->params['per_page'];
        }

        // 店舗情報取得
        $results = \Model_Store::find('all', $find_params);

        // 検索結果設定
        $rec = array();
        $pattern = $this->params['pattern'];
        foreach ($results as $key => $store) {
            if(empty($params['company_id']) || ($params['company_id'] == $store->brand->company_id)){
                $tmp = $store->toArray($pattern);

                unset($rec['brand']);

                if (PATTERN_ONLY_KEY < $pattern) {
                    $company = $store->brand ? $store->brand->company : null;
                    $tmp['company_name'] = $company ? $company["company_name"] : null;
                    $tmp['brand_name'] = $store->brand ? $store->brand->brand_name : null;
                    $tmp['brand_code'] = $store->brand ? $store->brand->brand_code : null;
                }
                $rec[] = $tmp;
            }
        }
        $this->response_fields['store'] = $rec;

        // 件数取得
        $count = \Model_Store::count(array('where' => $conditions, 'related' => $relates));
        $this->response_fields['count'] = $count;

        \Additional_Log::debug('【STORE LIST API】:END');
    }



    function checkPermissionCreateStore($user)
    {
        if (empty($user->company_id) || empty($user->brand_id)) {
            throw new \ProtocolException(\Lang::get('organization_not_exist'), "It does not exist company or brand information" ,
                \ProtocolException::RESULT_CODE_COMPANY_AND_BRAND_NOT_EXIST);
        }
        return true;
    }

    function checkPermissionStatus($company_status, $brand_status) {
        if (!in_array($company_status, array(COMPANY_STATUS_PREPARATION, COMPANY_STATUS_DURING_BUSINESS))) {
            throw new \ProtocolException(\Lang::get('company_is_not_open'), "Company status was deleted, closed shop" ,
                \ProtocolException::RESULT_CODE_COMPANY_STATUS_DELETED);
        }

        if (!in_array($brand_status, array(BRAND_STATUS_PREPARATION, BRAND_STATUS_DURING_BUSINESS))) {
            throw new \ProtocolException(\Lang::get('brand_is_not_open'), "Brand status was deleted, closed shop" ,
                \ProtocolException::RESULT_CODE_BRAND_STATUS_DELETED);
        }
        return true;
    }

    /**
     * 店舗登録処理
     * @throws \ProtocolException
     */
    protected function create()
    {
        \Additional_Log::debug('【STORE CREATE API】:START');

        // 引数取得
        $user = \Model_User::find($this->user_id);
        $params = $this->setParams();

        // 操作権限チェック
        $user->authority($params);

        // 店舗情報登録
        \Model_Store::insertStore($params);

        \Additional_Log::debug('【STORE CREATE API】:END');
    }

    protected function update()
    {
        \Additional_Log::debug("store/update called");
        $user = \Model_User::find($this->user_id);
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

        $stores_list = []; 
        if (!empty($this->params['multiple_record'])) {
            foreach ($this->params['multiple_record'] as $item) {
                $stores_list[] = $item;
            }
        }
        else {
            $stores_list[] = $this->params;
        }
       
        foreach($stores_list as $item) {
            if(!isset($item['id'])) {
                $item['id'] = $this->params['store_id'];
            }
            $conditions = array('id' => $item['id']);
            $store = \Model_Store::find('first', array(
                'where' => $conditions,
                'related' => $relates,
            ));
            \Additional_Log::info(print_r($store,true));
            
            if (!empty($store)) {
                if ($this->checkPermissionStatus(!empty($user->company) ? $user->company->company_status : COMPANY_STATUS_PREPARATION,!empty($user->brand) ? $user->brand->brand_status : BRAND_STATUS_PREPARATION)) {
                    $store->set($item);
                    $store->section_id = !empty($store->section_id) ? $store->section_id : 0;
                    $store->save();
                }
            } else {
                throw new \ProtocolException(\Lang::get('store_can_not_update'), "You can not change this store",
                    \ProtocolException::RESULT_CODE_STORE_NOT_FOUND);
            }
        }
    }

    /**
     * 店舗削除処理
     * @throws \Exception
     * @throws \ProtocolException
     */
    protected function delete()
    {
        \Additional_Log::debug('【STORE DELETE API】:START');

        // 引数取得
        $user = \Model_User::find($this->user_id);
        $ownInfo = $this->setOwnParam($user);

        // 操作権限チェック
        $user->authority($ownInfo);

        $ids = $this->params['store_ids'];
        foreach($ids as $id)
        {
            $store = \Model_Store::findById($id);
            if(!empty($store)){
                $store->store_status = 0;
                $store->save();
            }
        }
        $this->response_fields['store'] = $ids;

        \Additional_Log::debug('【STORE DELETE API】:END');
    }

    /**
     * アカウントユーザ情報設定
     * @param $user
     * @return array
     */
    private function setOwnParam($user){
        $ownInfo = array();
        $ownInfo['company_id'] = $user->company_id;
        $ownInfo['brand_id'] = $user->brand_id;
        $ownInfo['section_id'] = $user->section_id;
        $ownInfo['store_id'] = $user->store_id;

        return $ownInfo;
    }

    /**
     * パラメータ設定
     * @return array
     */
    private function setParams(){
        \Additional_Log::debug('【STORE API】:SET PARAM');

        $store['id'] = isset($this->params['id']) ? $this->params['id'] : "";
        $store['company_id'] = isset($this->params['company_id']) ? $this->params['company_id'] : "";
        $store['brand_id'] = isset($this->params['brand_id']) ? $this->params['brand_id'] : "";
        $store['section_id'] = isset($this->params['section_id']) ? $this->params['section_id'] : "";
        $store['store_code'] = isset($this->params['store_code']) ? $this->params['store_code'] : "";
        $store['store_name'] = isset($this->params['store_name']) ? $this->params['store_name'] : "";
        $store['store_status'] = isset($this->params['store_status']) ? $this->params['store_status'] : "";
        $store['store_postal_code'] = isset($this->params['store_postal_code']) ? $this->params['store_postal_code'] : "";
        $store['store_prefectures'] = isset($this->params['store_prefectures']) ? $this->params['store_prefectures'] : "";
        $store['store_address'] = isset($this->params['store_address']) ? $this->params['store_address'] : "";
        $store['store_building'] = isset($this->params['store_building']) ? $this->params['store_building'] : "";
        $store['store_access'] = isset($this->params['store_access']) ? $this->params['store_access'] : "";
        $store['store_location'] = isset($this->params['store_location']) ? $this->params['store_location'] : "";
        $store['store_phone_no'] = isset($this->params['store_phone_no']) ? $this->params['store_phone_no'] : "";
        $store['store_fax_no'] = isset($this->params['store_fax_no']) ? $this->params['store_fax_no'] : "";
        $store['store_manager_name'] = isset($this->params['store_manager_name']) ? $this->params['store_manager_name'] : "";
        $store['store_business_hours_from'] = isset($this->params['store_business_hours_from']) ? $this->params['store_business_hours_from'] : "";
        $store['store_business_hours_to'] = isset($this->params['store_business_hours_to']) ? $this->params['store_business_hours_to'] : "";
        $store['store_parking_lot'] = isset($this->params['store_parking_lot']) ? $this->params['store_parking_lot'] : "";
        $store['store_seat'] = isset($this->params['store_seat']) ? $this->params['store_seat'] : "";
        $store['store_kids_room'] = isset($this->params['store_kids_room']) ? $this->params['store_kids_room'] : "";
        $store['store_signature_block'] = isset($this->params['store_signature_block']) ? $this->params['store_signature_block'] : "";
        $store['store_terms_of_use'] = isset($this->params['store_terms_of_use']) ? $this->params['store_terms_of_use'] : "";
        $store['store_privacy_policy'] = isset($this->params['store_privacy_policy']) ? $this->params['store_privacy_policy'] : "";
        $store['store_freeword'] = isset($this->params['store_freeword']) ? $this->params['store_freeword'] : "";
        $store['store_header_picture_id'] = isset($this->params['store_header_picture_id']) ? $this->params['store_header_picture_id'] : "";
        $store['store_area_L_id'] = isset($this->params['store_area_L_id']) ? $this->params['store_area_L_id'] : "";
        $store['store_area_M_id'] = isset($this->params['store_area_M_id']) ? $this->params['store_area_M_id'] : "";
        $store['store_area_S_id'] = isset($this->params['store_area_S_id']) ? $this->params['store_area_S_id'] : "";
        $store['store_sort_index'] = isset($this->params['store_sort_index']) ? $this->params['store_sort_index'] : "";
        $store['store_seo_key1'] = isset($this->params['store_seo_key1']) ? $this->params['store_seo_key1'] : "";
        $store['store_seo_key2'] = isset($this->params['store_seo_key2']) ? $this->params['store_seo_key2'] : "";
        $store['store_seo_key3'] = isset($this->params['store_seo_key3']) ? $this->params['store_seo_key3'] : "";
        $store['twitter_access_token'] = isset($this->params['twitter_access_token']) ? $this->params['twitter_access_token'] : "";
        $store['twitter_access_token_secret'] = isset($this->params['twitter_access_token_secret']) ? $this->params['twitter_access_token_secret'] : "";
        $store['facebook_id'] = isset($this->params['facebook_id']) ? $this->params['facebook_id'] : "";
        $store['store_first_open_date'] = isset($this->params['store_first_open_date']) ? $this->params['store_first_open_date'] : "";
        $store['per_page'] = isset($this->params['per_page']) ? $this->params['per_page'] : 100;

        return $store;
    }
}
