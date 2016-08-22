<?php

namespace Api;
class Controller_Coupon extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'coupon_name' => false,
            'coupon_status' => false,
            'coupon_limit_from' =>false,
            'coupon_limit_to' => false,
            'page' => false,
            'per_page' => false,
            'pattern' => true,
        ),
        'create' => array(
            'coupon_release_flg' => true,
            'coupon_status' => true,
            'coupon_user_code_display' => true,
            'coupon_name' => true,
            'coupon_description' => true,
            'coupon_limit_type' => true,
            'coupon_two_step_limit_type' => true,
            'coupon_title' => false,
            'coupon_limit_from' => false,
            'coupon_limit_to' => false,
            'coupon_limit_send_start' => false,
            'coupon_limit_send_count' => false,
            'coupon_two_step_button_description' => false,
            'coupon_two_step_over_description' => false,
            'coupon_two_step_confirmation' => false,
            'coupon_two_step_limit_min' => false,
        ),
        'update' => array(
            'coupon_id' => true,
            'coupon_release_flg' => true,
            'coupon_status' => true,
            'coupon_user_code_display' => true,
            'coupon_name' => true,
            'coupon_description' => true,
            'coupon_limit_type' => true,
            'coupon_two_step_limit_type' => true,
            'coupon_title' => false,
            'coupon_limit_from' => false,
            'coupon_limit_to' => false,
            'coupon_limit_send_start' => false,
            'coupon_limit_send_count' => false,
            'coupon_two_step_button_description' => false,
            'coupon_two_step_over_description' => false,
            'coupon_two_step_confirmation' => false,
            'coupon_two_step_limit_min' => false,

        ),
        'delete' => array(
            'coupon_ids' => true,
        ),
    );

    /**
     * クーポン検索
     */
    protected function index()
    {
        \Additional_Log::debug('【COUPON LIST API】:START');

        // 引数取得
        $pattern = $this->params['pattern'];
        $user = \Model_User::find($this->user_id);

        $conditions = $this->makeConditionForUser($user);

        if ($this->is_setted_param('coupon_name')) {
            $conditions[] = array('coupon_name', 'LIKE', "%{$this->params['coupon_name']}%");
        }
        if ($this->is_setted_param('coupon_status')) {
            $conditions[] = array('coupon_status', $this->params['coupon_status']);
        }
        if ($this->is_setted_param('coupon_limit_from')) {
            $conditions[] = array('coupon_limit_from', '>=', $this->params['coupon_limit_from'] . ' 00:00:00');
        }
        if ($this->is_setted_param('coupon_limit_to')) {
            $conditions[] = array('coupon_limit_to', '<=', $this->params['coupon_limit_to'] . ' 23:59:59');
        }

        $find_params = array();
        if (0 < count($conditions)) {
            $find_params['where'] = $conditions;
        }
        if (!is_null($this->params['page']) && !is_null($this->params['per_page'])) {
            $find_params['offset'] = ($this->params['page'] - 1) * $this->params['per_page'];
            $find_params['limit'] = $this->params['per_page'];
        }
        // TODO ソート対応
        if (true) {
            $find_params['order_by'] = array('coupon_limit_from' => 'desc');
        }
        $results = \Model_Coupon::find('all', $find_params);
        //get count
        $count = \Model_Coupon::count(array('where' => $conditions));

        // 検索結果設定
        $response = array();
        foreach ($results as $coupon) {
            $rec = $coupon->toArray($pattern);
            if (PATTERN_ONLY_KEY < $pattern) {
                $rec['company_name'] = !empty($coupon->company) ? $coupon->company->company_name : null;
                $rec['brand_name'] = !empty($coupon->brand) ? $coupon->brand->brand_name : null;
                $rec['store_name'] = !empty($coupon->store) ? $coupon->store->store_name : null;
            }
            $response[] = $rec;
        }

        $this->response_fields['coupon'] = $response;
        $this->response_fields['count'] = $count;

        \Additional_Log::debug('【COUPON LIST API】:END');
    }

    /**
     * クーポン登録
     */
    protected function create()
    {
        \Additional_Log::debug('【COUPON CREATE API】:START');

        // 引数取得
        $user = \Model_User::find($this->user_id);

        $coupon = \Model_Coupon::forge();
        $coupon->company_id = 0;
        $coupon->brand_id = 0;
        $coupon->section_id = 0;
        $coupon->store_id = 0;
        switch ($user->authority) {
        case USER_AUTHORITY_STORE:
            $coupon->store_id = $user->store_id;
        case USER_AUTHORITY_SECTION:
            $coupon->section_id = $user->section_id;
        case USER_AUTHORITY_BRAND:
            $coupon->brand_id = $user->brand_id;
        case USER_AUTHORITY_COMPANY:
            $coupon->company = $user->company;
        }

        $coupon->coupon_code = uniqid();
        $coupon->coupon_release_flg = 0;
        $coupon->coupon_status = $this->params['coupon_status'];
        $coupon->coupon_user_code_display = $this->params['coupon_user_code_display'];
        $coupon->coupon_category_id = 0;
        $coupon->coupon_name = $this->params['coupon_name'];
        $coupon->coupon_title = $this->params['coupon_title'];
        $coupon->coupon_description = $this->params['coupon_description'];
        $coupon->coupon_limit_type = $this->params['coupon_limit_type'];
        $coupon->coupon_limit_from = $this->is_setted_param('coupon_limit_from') ? $this->params['coupon_limit_from'] : null;
        $coupon->coupon_limit_to = $this->is_setted_param('coupon_limit_to') ? $this->params['coupon_limit_to'] : null;
        $coupon->coupon_limit_send_start = $this->is_setted_param('coupon_limit_send_start') ? $this->params['coupon_limit_send_start'] : null;
        $coupon->coupon_limit_send_count = $this->is_setted_param('coupon_limit_send_count') ? $this->params['coupon_limit_send_count'] : null;
        $coupon->coupon_two_step_flg = 1;
        $coupon->coupon_two_step_button_description = $this->is_setted_param('coupon_two_step_button_description') ? $this->params['coupon_two_step_button_description'] : '';
        $coupon->coupon_two_step_limit_type = $this->params['coupon_two_step_limit_type'];
        $coupon->coupon_two_step_limit_min = $this->is_setted_param('coupon_two_step_limit_min') ? $this->params['coupon_two_step_limit_min'] : null;
        $coupon->coupon_two_step_confirmation = $this->is_setted_param('coupon_two_step_confirmation') ? $this->params['coupon_two_step_confirmation'] : '';
        $coupon->coupon_two_step_over_description = $this->is_setted_param('coupon_two_step_over_description') ? $this->params['coupon_two_step_over_description'] : '';
        $coupon->coupon_deleted_flg = 0;
        $coupon->save();

        // クーポン登録処理
        \Additional_Log::debug('【COUPON CREATE API】:END');
    }

    /**
     * クーポン更新
     */
    protected function update()
    {
        \Additional_Log::debug('【COUPON UPDATE API】:START');

        $user = \Model_User::find($this->user_id);

        $conditions = $this->makeConditionForUser($user);
        $conditions[] = array('id', $this->params['coupon_id']);

        $coupon = \Model_Coupon::find('first', array(
            'where' => $conditions,
        ));
        if ($coupon) {
            $coupon->coupon_status = $this->params['coupon_status'];
            $coupon->coupon_user_code_display = $this->params['coupon_user_code_display'];
            $coupon->coupon_name = $this->params['coupon_name'];
            $coupon->coupon_title = $this->params['coupon_title'];
            $coupon->coupon_description = $this->params['coupon_description'];
            $coupon->coupon_limit_type = $this->params['coupon_limit_type'];
            $coupon->coupon_limit_from = $this->is_setted_param('coupon_limit_from') ? $this->params['coupon_limit_from'] : null;
            $coupon->coupon_limit_to = $this->is_setted_param('coupon_limit_to') ? $this->params['coupon_limit_to'] : null;
            $coupon->coupon_limit_send_start = $this->is_setted_param('coupon_limit_send_start') ? $this->params['coupon_limit_send_start'] : null;
            $coupon->coupon_limit_send_count = $this->is_setted_param('coupon_limit_send_count') ? $this->params['coupon_limit_send_count'] : null;
            $coupon->coupon_two_step_button_description = $this->is_setted_param('coupon_two_step_button_description') ? $this->params['coupon_two_step_button_description'] : '';
            $coupon->coupon_two_step_limit_type = $this->params['coupon_two_step_limit_type'];
            $coupon->coupon_two_step_limit_min = $this->is_setted_param('coupon_two_step_limit_min') ? $this->params['coupon_two_step_limit_min'] : null;
            $coupon->coupon_two_step_confirmation = $this->is_setted_param('coupon_two_step_confirmation') ? $this->params['coupon_two_step_confirmation'] : '';
            $coupon->coupon_two_step_over_description = $this->is_setted_param('coupon_two_step_over_description') ? $this->params['coupon_two_step_over_description'] : '';
            $coupon->save();
        }

        \Additional_Log::debug('【COUPON UPDATE API】:END');
    }

    protected function delete(){
        \Additional_Log::debug('【COUPON DELETE API】:START');

        $user = \Model_User::find($this->user_id);
        $conditions = $this->makeConditionForUser($user);
        $conditions[] = array('id', 'IN', $this->params['coupon_ids']);

        $coupons = \Model_Coupon::find('all', array(
            'where' => $conditions,
        ));
        // クーポン論理削除処理
        foreach ($coupons as $coupon) {
            $coupon->coupon_deleted_flg = 1;
            $coupon->save();
        }

        \Additional_Log::debug('【COUPON DELETE API】:END');
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

