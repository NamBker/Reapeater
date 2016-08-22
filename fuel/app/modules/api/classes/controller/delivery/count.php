<?php

namespace Api;
class Controller_Delivery_Count extends \Controller_Api
{
    /**
     * 質問一覧
     */
    protected function index()
    {
        \Additional_Log::debug('【DELIVERY COUNT API】:START');

        // 実行ユーザ取得
        $user = \Model_User::find($this->user_id);

        $selects = array();
        $conditions = array();
        $relates = array();

        $selects[] = array('delivery_status');
        $selects[] = array(\DB::expr('COUNT(*)'), 'count');

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
        $conditions[] = array('delivery_status', 'IN', [DELIVERY_STATUS_DRAFT, DELIVERY_STATUS_UNDELIVERED, DELIVERY_STATUS_DELIVERING]);

        // 検索開始
        $results = \Model_Delivery::find('all', array(
            'select' => $selects,
            'where' => $conditions,
            'related' => $relates,
            'group_by' => array('delivery_status'),
        ));

        // 検索結果設定
        $recs = array();
        foreach ($results as $count) {
            $recs[$count['delivery_status']] = $count['count'];
        }
        $this->response_fields['delivery_counts'] = $recs;

        \Additional_Log::debug('【DELIVERY COUNT API】:END');
    }
}

