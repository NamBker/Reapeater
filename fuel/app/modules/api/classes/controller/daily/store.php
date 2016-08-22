<?php

namespace Api;
class Controller_Daily_Store extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'company_id' => false,
            'brand_ids' => false,
            'store_ids' => false,
            'brand_id' => false,
            'section_id' => false,
            'store_id' => false,
            'month' => false,
            'from' => false,
            'to' => false,
            'pattern' => true,
        ),
    );

    /**
     *  get daily store member register
     */
    protected function index()
    {
        \Additional_Log::debug('【DAILY STORE LIST API】:START');

        // 引数取得
        $params = $this->setParams();
        $pattern = $this->params['pattern'];
        $user = \Model_User::find($this->user_id);

        if($user->authority >=  USER_AUTHORITY_COMPANY){
                $params['company_id'] = $user->company_id;
        }

        if($user->authority >=  USER_AUTHORITY_BRAND){
                $params['brand_ids'] = [$user->brand_id];
        }

        if($user->authority >=  USER_AUTHORITY_SECTION){
                $params['section_id'] = $user->section_id;
        }

        if($user->authority >=  USER_AUTHORITY_STORE){
                $params['store_ids'] = [$user->store_id];
        }
        // 操作権限チェック
        $user->authority($params);

        // クーポン情報取得
        $conditions = \Model_Daily_Store_Info::makeConditions($params);

        $order_condition = array('date' => 'desc');

        $results = \Model_Daily_Store_Info::find('all', array(
            'where' => $conditions,
            'order_by' => $order_condition,
        ));

        $response = [];
        foreach ($results as $dailystore) {
            $rec = $dailystore->toArray($pattern);
            unset($rec['company']);
            unset($rec['brand']);
            unset($rec['store']);

            if (PATTERN_ONLY_KEY < $pattern) {
                $rec['company_name'] = isset($dailystore->company) ? $dailystore->company->company_name : null;
                $rec['brand_name'] = isset($dailystore->brand) ? $dailystore->brand->brand_name : null;
                $rec['store_name'] = isset($dailystore->store) ? $dailystore->store->store_name : null;
            }
            $response[] = $rec;
        }


        $this->response_fields['daily_store_info'] = $response;

        \Additional_Log::debug('【DAILY STORE API】:END');
    }

    /**
     * パラメータ登録
     * @return array
     */
    private function setParams(){
        \Additional_Log::debug('【DAILY STORE API】:SET PARAM');

        // クーポン情報設定
        $dailystore = array();
        $dailystore['id'] = isset($this->params['id']) ? $this->params['id'] : "";
        $dailystore['company_id'] = isset($this->params['company_id']) ? $this->params['company_id'] : "";
        $dailystore['brand_id'] = isset($this->params['brand_id']) ? $this->params['brand_id'] : "";
        $dailystore['section_id'] = isset($this->params['section_id']) ? $this->params['section_id'] : "";
        $dailystore['store_id'] = isset($this->params['store_id']) ? $this->params['store_id'] : "";
        $dailystore['register_count'] = isset($this->params['register_count']) ? $this->params['register_count'] : 0;
        $dailystore['from'] = isset($this->params['from']) ? $this->params['from'] : "";
        $dailystore['to'] = isset($this->params['to']) ? $this->params['to'] : "";
        $dailystore['date_limit_from'] = isset($this->params['date_limit_from']) ? $this->params['date_limit_from'] : "";
        $dailystore['date_limit_to'] = isset($this->params['date_limit_to']) ? $this->params['date_limit_to'] : "";
        $dailystore['brand_ids'] = isset($this->params['brand_ids']) ? $this->params['brand_ids'] : [];
        $dailystore['store_ids'] = isset($this->params['store_ids']) ? $this->params['store_ids'] : [];
        $dailystore['month'] = isset($this->params['month']) ? $this->params['month'] : [];

        return $dailystore;
    }
}

