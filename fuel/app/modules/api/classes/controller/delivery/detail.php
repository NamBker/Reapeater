<?php

namespace Api;
class Controller_Delivery_Detail extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'delivery_id' => true,
        ),
    );

    /**
     * 質問一覧
     */
    protected function index()
    {
        \Additional_Log::debug('【DELIVERY DETAIL API】:START');

        // 実行ユーザ取得
        $user = \Model_User::find($this->user_id);

        // 引数取得
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
        $result = \Model_Delivery::find('first', array(
            'where' => $conditions,
            'related' => $relates,
        ));

        $this->response_fields['delivery'] = $result->toArray(PATTERN_ALL);
        $this->response_fields['delivery']['delivery_store_ids'] = array_values(array_map(function($store) {return $store->id;}, $result->delivery_stores));

        \Additional_Log::debug('【DELIVERY DETAIL API】:END');
    }
}

