<?php

namespace Api;
class Controller_Delivery extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'delivery_title' => false,
            'delivery_company_id' => false,
            'delivery_brand_ids' => false,
            'delivery_store_ids' => false,
            'delivery_schedule_from' => false,
            'delivery_schedule_to' => false,
            'delivery_status' => true,
            'page' => true,
            'per_page' => true,
            'pattern' => true,
        ),
        'create' => array(
            'delivery_store_ids' => true,
            'delivery_status' => true,
            'delivery_segment' => true,
            'delivery_sender_name' => true,
            'delivery_sender_address' => true,
            'delivery_title' => true,
            'delivery_html_body' => true,
            'delivery_text_body' => true,
            'delivery_type' => true,
            'delivery_device' => true,
            'delivery_schedule' => false,
        ),
        'update' => array(
            'id' => true,
            'delivery_status' => true,
            'delivery_segment' => true,
            'delivery_sender_name' => true,
            'delivery_sender_address' => true,
            'delivery_title' => true,
            'delivery_html_body' => true,
            'delivery_text_body' => true,
            'delivery_type' => true,
            'delivery_device' => true,
            'delivery_schedule' => false,
        ),
        'delete' => array(
            'delivery_ids' => true,
        ),
    );

    /**
     * 質問一覧
     */
    protected function index()
    {
        \Additional_Log::debug('【DELIVERY LIST API】:START');

        // 実行ユーザ取得
        $user = \Model_User::find($this->user_id);

        // 引数取得
        $pattern = $this->params['pattern'];
        $delivery_title = $this->params['delivery_title'];
        $delivery_company_id = $this->params['delivery_company_id'];
        $delivery_brand_ids = $this->params['delivery_brand_ids'];
        $delivery_store_ids = $this->params['delivery_store_ids'];
        $delivery_schedule_from = $this->params['delivery_schedule_from'];
        $delivery_schedule_to = $this->params['delivery_schedule_to'];
        $delivery_status = $this->params['delivery_status'];
        $page = $this->params['page'];
        $per_page = $this->params['per_page'];

        // 操作権限チェック
        if (!$user->checkAuthority($delivery_company_id, $delivery_brand_ids, $delivery_store_ids)) {
            throw new \ProtocolException(\Lang::get('user_authority_error'), "user does not have authority for operation.", \ProtocolException::RESULT_CODE_USER_OPERATION_AUTHORITY_ERROR);
        }

        $conditions = array();
        $relates = array();

        // 検索条件設定
        switch ($user->authority) {
        case USER_AUTHORITY_STORE:
            $conditions[] = array('store_id', $user->store_id);
            break;
        case USER_AUTHORITY_SECTION:
            $relates['store']['where'] = array(
                array('section_id', $user->section_id),
            );
            break;
        case USER_AUTHORITY_BRAND:
            $conditions[] = array('brand_id', $user->brand_id);
            break;
        case USER_AUTHORITY_COMPANY:
            $conditions[] = array('company_id', $user->company_id);
            break;
        case USER_AUTHORITY_ADMIN:
            break;
        }
        if ($delivery_title) {
            $conditions[] = array('delivery_title', 'LIKE', "%$delivery_title%");
        }
        if ($delivery_company_id) {
            $relates['delivery_stores']['related']['brand']['where'] = array(
                array('company_id', $delivery_company_id),
            );
        }
        if ($delivery_brand_ids) {
            $relates['delivery_stores']['where'][] = array('brand_id', 'IN', $delivery_brand_ids);
        }
        if ($delivery_store_ids) {
            $relates['delivery_stores']['where'][] = array('id', 'IN', $delivery_store_ids);
        }
        if ($delivery_schedule_from) {
            $conditions[] = array('delivery_schedule', '>=', $delivery_schedule_from);
        }
        if ($delivery_schedule_to) {
            $conditions[] = array('delivery_schedule', '<=', $delivery_schedule_to.' 23:59:59');
        }
        $conditions[] = array('delivery_status', 'IN', $delivery_status);

        // ソート条件を設定 TODO
        $order_conditions = array('delivery_schedule' => 'desc');

        // 検索開始
        $results = \Model_Delivery::find('all', array(
            'where' => $conditions,
            'related' => $relates,
            'order_by' => $order_conditions,
            'offset' => ($page - 1) * $per_page,
            'limit' => $per_page,
        ));

        // 総件数の取得
        $count = \Model_Delivery::count(array('where' => $conditions, 'related' => $relates));

        // 検索結果設定
        $recs = array();
        foreach ($results as $delivery) {
            $recs[] = $delivery->toArray($pattern);
        }

        $this->response_fields['delivery'] = $recs;
        $this->response_fields['count'] = $count;
        \Additional_Log::debug('【DELIVERY LIST API】:SET RESULT');

        \Additional_Log::debug('【DELIVERY LIST API】:END');
    }

    /**
     * 質問作成
     */
    protected function create()
    {
        \Additional_Log::debug('【DELIVERY CREATE API】:START');

        // ユーザー取得
        $user = \Model_User::find($this->user_id);

        // 引数取得
        $delivery_store_ids = $this->params['delivery_store_ids'];
        $delivery_status = $this->params['delivery_status'];
        $delivery_segment = $this->params['delivery_segment'];
        $delivery_sender_name = $this->params['delivery_sender_name'];
        $delivery_sender_address = $this->params['delivery_sender_address'];
        $delivery_title = $this->params['delivery_title'];
        $delivery_schedule = $this->params['delivery_schedule'];
        if ($delivery_schedule == 'now') {
            $delivery_schedule = date('Y-m-d H:i');
        }
        $delivery_html_body = $this->params['delivery_html_body'];
        $delivery_text_body = $this->params['delivery_text_body'];
        $delivery_type = $this->params['delivery_type'];
        $delivery_device = $this->params['delivery_device'];

        // 操作権限チェック
        if (!$user->checkAuthority(null, null, $delivery_store_ids)) {
            throw new \ProtocolException(\Lang::get('user_authority_error'), "user does not have authority for operation.", \ProtocolException::RESULT_CODE_USER_OPERATION_AUTHORITY_ERROR);
        }

        $delivery = \Model_Delivery::forge();
        $delivery->company_id = $user->company_id;
        $delivery->brand_id = $user->brand_id;
        $delivery->store_id = $user->store_id;
        $delivery->delivery_status = $delivery_status;
        $delivery->delivery_type = $delivery_type;
        $delivery->delivery_category_id = 0;
        $delivery->delivery_sender_name = $delivery_sender_name;
        $delivery->delivery_sender_address = $delivery_sender_address;
        $delivery->delivery_title = $delivery_title;
        $delivery->delivery_html_body = $delivery_html_body;
        $delivery->delivery_text_body = $delivery_text_body;
        $delivery->delivery_schedule = $delivery_schedule;
        $delivery->delivery_device = $delivery_device;
        $delivery->delivery_segment = $delivery_segment;

        // 配信対象店舗登録
        $delivery->delivery_stores = \Model_Store::find('all', array(
            'where' => array(array('id', 'IN', $delivery_store_ids)),
        ));

        $delivery->save();

        \Additional_Log::debug('【DELIVERY CREATE API】:END');
    }

    /**
     * 質問更新
     * 　=>論理削除のみ
     */
    protected function update()
    {
        \Additional_Log::debug('【DELIVERY UPDATE API】:START');

        $user = \Model_User::find($this->user_id);

        $id = $this->params['delivery_id'];

        $conditions = array();
        $relates = array();

        // 検索条件設定
        switch ($user->authority) {
        case USER_AUTHORITY_STORE:
            $conditions[] = array('store_id', $user->store_id);
            break;
        case USER_AUTHORITY_SECTION:
            $relates['store']['where'] = array(
                array('section_id', $user->section_id),
            );
            break;
        case USER_AUTHORITY_BRAND:
            $conditions[] = array('brand_id', $user->brand_id);
            break;
        case USER_AUTHORITY_COMPANY:
            $conditions[] = array('company_id', $user->company_id);
            break;
        case USER_AUTHORITY_ADMIN:
            break;
        }
        $conditions[] = array('id', $id);
        // 検索開始
        $delivery = \Model_Delivery::find('first', array(
            'where' => $conditions,
            'related' => $relates,
        ));

        if ($delivery == null) {
            throw new \ProtocolException(\Lang::get('user_authority_error'), "user does not have authority for operation.", \ProtocolException::RESULT_CODE_USER_OPERATION_AUTHORITY_ERROR);
        }

        $delivery_status = $this->params['delivery_status'];
        $delivery_segment = $this->params['delivery_segment'];
        $delivery_sender_name = $this->params['delivery_sender_name'];
        $delivery_sender_address = $this->params['delivery_sender_address'];
        $delivery_title = $this->params['delivery_title'];
        $delivery_schedule = $this->params['delivery_schedule'];
        $delivery_html_body = $this->params['delivery_html_body'];
        $delivery_text_body = $this->params['delivery_text_body'];
        $delivery_type = $this->params['delivery_type'];
        $delivery_device = $this->params['delivery_device'];

        $delivery->company_id = $user->company_id;
        $delivery->brand_id = $user->brand_id;
        $delivery->store_id = $user->store_id;
        $delivery->delivery_status = $delivery_status;
        $delivery->delivery_type = $delivery_type;
        $delivery->delivery_category_id = 0;
        $delivery->delivery_sender_name = $delivery_sender_name;
        $delivery->delivery_sender_address = $delivery_sender_address;
        $delivery->delivery_title = $delivery_title;
        $delivery->delivery_html_body = $delivery_html_body;
        $delivery->delivery_text_body = $delivery_text_body;
        $delivery->delivery_schedule = $delivery_schedule;
        $delivery->delivery_device = $delivery_device;
        $delivery->delivery_segment = $delivery_segment;

        $delivery->save();

        \Additional_Log::debug('【DELIVERY UPDATE API】:END');
    }

    protected function delete()
    {
        \Additional_Log::debug('【DELIVERY DELETE API】:START');

        // ユーザー取得
        $user = \Model_User::find($this->user_id);
        // パラメータ取得
        $delivery_ids = $this->params['delivery_ids'];
        if (!is_array($delivery_ids) || count($delivery_ids) < 1) {
            throw new \ProtocolException(\Lang::get('illegal_parameter'), "illegal parameter delivery_ids.", \ProtocolException::RESULT_CODE_ILLEGAL_PARAMETER);
        }

        $conditions = array();
        $relates = array();
        switch ($user->authority) {
        case USER_AUTHORITY_STORE:
            $conditions[] = array('store_id', $user->store_id);
            break;
        case USER_AUTHORITY_SECTION:
            $relates['store']['where'] = array(
                array('section_id', $user->section_id),
            );
            break;
        case USER_AUTHORITY_BRAND:
            $conditions[] = array('brand_id', $user->brand_id);
            break;
        case USER_AUTHORITY_COMPANY:
            $conditions[] = array('company_id', $user->company_id);
            break;
        case USER_AUTHORITY_ADMIN:
            break;
        }
        $conditions[] = array('id', 'IN', $delivery_ids);
        $targets = \Model_Delivery::find('all', array(
            'where' => $conditions,
            'related' => $relates,
        ));
        foreach ($targets as $target) {
            $target->delete();
        }
        \Additional_Log::debug('【DELIVERY DELETE API】:END');
    }
}

