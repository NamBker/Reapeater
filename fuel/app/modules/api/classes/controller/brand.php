<?php

namespace Api;
class Controller_Brand extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'company_id' => false,
            'brand_code' => false,
            'brand_name' => false,
            'brand_status' => false,
            'page' => false,
            'per_page' => false,
            'pattern' => true,
        ),
        'create' => array(
            'company_id' => true,
            'brand_code' => true,
            'brand_status' => true,
            'brand_name' => true,
            'brand_postal_code' => false,
            'brand_prefectures' => false,
            'brand_address' => false,
            'brand_building' => false,
            'brand_phone_no' => false,
            'brand_regular_holiday' => false,
            'brand_signature_block' => false,
            'brand_terms_of_use' => false,
            'brand_privacy_policy' => false,
            'brand_freeword' => false,
            'google_analytics_id' => false,
            'google_analytics_pass' => false,
        ),
        'update' => array(
            'id' => true,
            'company_id' => true,
            'brand_code' => true,
            'brand_status' => true,
            'brand_name' => true,
            'brand_address' => true,
            'brand_phone_no' => true,
            'brand_regular_holiday' => false,
            'brand_signature_block' => false,
            'brand_terms_of_use' => false,
            'brand_privacy_policy' => false,
            'brand_freeword' => false,
            'google_analytics_id' => false,
            'google_analytics_pass' => false,
        ),
        'delete' => array(
            'brand_ids' => true,
        ),
    );

    protected function index()
    {
        \Additional_Log::debug('【BRAND LIST API】:START');

        // 引数取得
        $user = \Model_User::find($this->user_id);

        $conditions = $this->makeConditionForUser($user);
        if ($this->is_setted_param('company_id') && $this->params['company_id'] != 0 && $user->authority < USER_AUTHORITY_COMPANY) {
            $conditions[] = array('company_id', $this->params['company_id']);
        }
        if ($this->is_setted_param('brand_code')) {
            $conditions[] = array('brand_code', $this->params['brand_code']);
        }
        if ($this->is_setted_param('brand_name')) {
            $conditions[] = array('brand_name', 'LIKE', "%{$this->params['brand_name']}%");
        }
        if ($this->is_setted_param('brand_status')) {
            $conditions[] = array('brand_status', $this->params['brand_status']);
        }

        $find_params = array(
            'where' => $conditions,
        );

        if ($this->is_setted_param('per_page') && $this->is_setted_param('page')) {
            $find_params['offset'] = ($this->params['page'] - 1) * $this->params['per_page'];
            $find_params['limit'] = $this->params['per_page'];
        }

        $results = \Model_Brand::find('all', $find_params);

        // 検索結果設定
        $rec = array();
        $pattern = $this->params['pattern'];
        foreach ($results as $key => $brand) {
            $tmp = $brand->toArray($pattern);

            unset($rec['company']);

            if (PATTERN_ONLY_KEY < $pattern) {
                $tmp['company_name'] = $brand->company ? $brand->company->company_name : null;
            }
            $rec[] = $tmp;
        }
        $this->response_fields['brand'] = $rec;

        // 件数取得
        $count = \Model_Brand::count(array('where' => $conditions));
        $this->response_fields['count'] = $count;

        \Additional_Log::debug('【BRAND LIST API】:END');
    }

    /**
     * ブランド登録処理
     * @throws \ProtocolException
     */
    protected function create()
    {
        \Additional_Log::debug('【BRAND CREATE API】:START');

        // 引数取得
        $user = \Model_User::find($this->user_id);
        $params = $this->setParams($user);

        // 操作権限チェック
        $user->authority($params);

        // ブランド情報登録
        \Model_brand::insertBrand($params);

        \Additional_Log::debug('【BRAND CREATE API】:END');
    }

    protected function update()
    {
        \Log::info('brand/update called');
        if (\Model_Brand::checkCreateBrandIllegal($this->params['company_id'])) {
            $brand = \Model_Brand::find('first', array('where' => array('id' => $this->params['id'])),
                                        array(),
                                        \ProtocolException::RESULT_CODE_BRAND_NOT_FOUND);
            $brand->brand_code                 = $this->params['brand_code'];
            $brand->brand_status               = $this->params['brand_status'];
            $brand->brand_address              = $this->params['brand_address'];
            $brand->brand_name                 = $this->params['brand_name'];
            $brand->brand_phone_no             = $this->params['brand_phone_no'];
            $brand->brand_regular_holiday      = $this->params['brand_regular_holiday'];
            $brand->brand_signature_block      = $this->params['brand_signature_block'];
            $brand->brand_terms_of_use         = $this->params['brand_terms_of_use'];
            $brand->brand_privacy_policy       = $this->params['brand_privacy_policy'];
            $brand->brand_freeword             = $this->params['brand_freeword'];
            $brand->google_analytics_id        = $this->params['google_analytics_id'];
            $brand->google_analytics_pass      = $this->params['google_analytics_pass'];
            $brand->save();
            $this->response_fields['brand'] = $brand->toArray();
        }
    }

    /**
     * ブランド削除処理
     * @throws \Exception
     * @throws \ProtocolException
     */
    protected function delete()
    {
        \Additional_Log::debug('【BRAND DELETE API】:START');

        // 引数取得
        $user = \Model_User::find($this->user_id);

        $conditions = array();
        switch($user->authority) {
        case USER_AUTHORITY_STORE:
        case USER_AUTHORITY_SECTION:
        case USER_AUTHORITY_BRAND:
            throw new \ProtocolException(\Lang::get('user_authority_error'), "user does not have authority for operation.", \ProtocolException::RESULT_CODE_USER_OPERATION_AUTHORITY_ERROR);
            return;
        case USER_AUTHORITY_COMPANY:
            $conditions[] = array('company_id', $user->company_id);
            break;
        }
        $conditions[] = array('id', 'IN', $this->params['brand_ids']);

        $targets = \Model_Brand::find('all', array(
            'where' => $conditions,
        ));
        \Additional_Log::debug(\DB::last_query());

        foreach($targets as $target) {
            $target->brand_status = 0;
            $target->save();
        }

        \Additional_Log::debug('【BRAND DELETE API】:END');
    }

    private function makeConditionForUser($user)
    {
        $conditions = array();
        switch ($user->authority) {
        case USER_AUTHORITY_STORE:
        case USER_AUTHORITY_SECTION:
        case USER_AUTHORITY_BRAND:
            $conditions[] = array('id', $user->brand_id);
        case USER_AUTHORITY_COMPANY:
            $conditions[] = array('company_id', $user->company_id);
        }
        return $conditions;
    }

    /**
     * パラメータ設定
     * @return array
     */
    private function setParams($user){
        \Additional_Log::debug('【BRAND API】:SET PARAM');

        $brand = array();
        if(!isset($this->params['company_id'])){
            $brand['company_id'] = $user->company_id;
        }else{
            $brand['company_id'] = isset($this->params['company_id']) ? $this->params['company_id'] : "";
        }

        $brand['id'] = isset($this->params['id']) ? $this->params['id'] : "";
        $brand['brand_code'] = isset($this->params['brand_code']) ? $this->params['brand_code'] : "";
        $brand['brand_name'] = isset($this->params['brand_name']) ? $this->params['brand_name'] : "";
        $brand['brand_status'] = isset($this->params['brand_status']) ? $this->params['brand_status'] : "";
        $brand['brand_postal_code'] = isset($this->params['brand_postal_code']) ? $this->params['brand_postal_code'] : "";
        $brand['brand_prefectures'] = isset($this->params['brand_prefectures']) ? $this->params['brand_prefectures'] : "";
        $brand['brand_address'] = isset($this->params['brand_address']) ? $this->params['brand_address'] : "";
        $brand['brand_building'] = isset($this->params['brand_building']) ? $this->params['brand_building'] : "";
        $brand['brand_phone_no'] = isset($this->params['brand_phone_no']) ? $this->params['brand_phone_no'] : "";
        $brand['brand_regular_holiday'] = isset($this->params['brand_regular_holiday']) ? $this->params['brand_regular_holiday'] : "";
        $brand['brand_signature_block'] = isset($this->params['brand_signature_block']) ? $this->params['brand_signature_block'] : "";
        $brand['brand_terms_of_use'] = isset($this->params['brand_terms_of_use']) ? $this->params['brand_terms_of_use'] : "";
        $brand['brand_privacy_policy'] = isset($this->params['brand_privacy_policy']) ? $this->params['brand_privacy_policy'] : "";
        $brand['brand_freeword'] = isset($this->params['brand_freeword']) ? $this->params['brand_freeword'] : "";
        $brand['store_display_type'] = isset($this->params['store_display_type']) ? $this->params['store_display_type'] : "";
        $brand['google_analytics_id'] = isset($this->params['google_analytics_id']) ? $this->params['google_analytics_id'] : "";
        $brand['google_analytics_pass'] = isset($this->params['google_analytics_pass']) ? $this->params['google_analytics_pass'] : "";
        $brand['brand_first_open_date'] = isset($this->params['brand_first_open_date']) ? $this->params['brand_first_open_date'] : "";
        $brand['member_registration_form_text_up'] = isset($this->params['member_registration_form_text_up']) ? $this->params['member_registration_form_text_up'] : "";
        $brand['member_registration_form_text_down'] = isset($this->params['member_registration_form_text_down']) ? $this->params['member_registration_form_text_down'] : "";
        $brand['per_page'] = isset($this->params['per_page']) ? $this->params['per_page'] : 100;

        return $brand;
    }
}
