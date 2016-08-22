<?php
namespace Api;

class Controller_Area extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'company_id' => false,
            'brand_id' => false,
            'area_type' => false,
            'page' => false,
            'per_page' => false,
            'pattern' => false,
            'area_name' => false,
        ),
        'create' => array(
            'company_id' => true,
            'brand_id' => true,
            'status' => true,
            'area_name' => true,
        ),
        'update' => array(
            'id' => true,
        ),
        'delete' => array(
            'area_ids' => true,
        ),
    );

    /**
     * エリア一覧
     */
    protected function index()
    {
        \Additional_Log::debug('【AREA LIST API】:START');
        // 引数取得
        $user = \Model_User::find($this->user_id);

        $conditions = $this->makeConditionForUser($user);
        if ($this->is_setted_param('company_id') && $this->params['company_id'] != 0 && $user->authority < USER_AUTHORITY_COMPANY) {
            $conditions[] = array('company_id', $this->params['company_id']);
        }
        if ($this->is_setted_param('brand_id') && $this->params['brand_id'] && $user->authority < USER_AUTHORITY_BRAND) {
            $conditions[] = array('brand_id', $this->params['brand_id']);
        }
        if ($this->is_setted_param('area_type')) {
            $conditions[] = array('area_type', $this->params['area_type']);
        }

        $find_params = array(
            'where' => $conditions,
        );

        if ($this->is_setted_param('per_page') && $this->is_setted_param('page')) {
            $find_params['offset'] = ($this->params['page'] - 1) * $this->params['per_page'];
            $find_params['limit'] = $this->params['per_page'];
        }

        // エリア情報取得
        $results = \Model_Area::find('all', $find_params);

        // 検索結果設定
        $rec = array();
        $pattern = $this->params['pattern'];
        foreach ($results as $key => $area) {
            $tmp = $area->toArray($pattern);

            if (PATTERN_ONLY_KEY < $pattern) {
                $tmp['company_name'] = $area->company ? $area->company->company_name : null;
                $tmp['brand_name'] = $area->brand ? $area->brand->brand_name : null;
            }
            $rec[] = $tmp;
        }
        $this->response_fields['area'] = $rec;

        // 件数取得
        $count = \Model_Area::count(array('where' => $conditions));
        $this->response_fields['count'] = $count;
        \Additional_Log::debug('【AREA LIST API】:END');
    }

    /**
     * エリア登録
     */
    protected function create()
    {
        \Additional_Log::debug('【AREA CREATE API】:START');

        // 引数取得
        $user = \Model_User::find($this->user_id);
        $params = $this->setParams($user);

        // 操作権限チェック
        $user->authority($params);

        // エリア情報登録
        $area_id = \Model_Area::insertArea($params);

        \Additional_Log::debug('【AREA CREATE API】:END');

        $this->response_fields['area'] = $area_id;
    }

    /**
     * エリア更新
     */
    protected function update()
    {
        \Additional_Log::debug('【AREA UPDATE API】:START');

        // 引数取得
        $user = \Model_User::find($this->user_id);
        $params = $this->setParams($user);

        // 操作権限チェック
        $user->authority($params);

        // エリア更新処理
        \Model_Area::updateArea($params);

        \Additional_Log::debug('【AREA UPDATE API】:END');
    }

    protected function delete()
    {
        \Additional_Log::debug('【AREA DELETE API】:START');

        // 引数取得
        $user = \Model_User::find($this->user_id);

        $conditions = $this->makeConditionForUser($user);
        $conditions[] = array('id', 'IN', $this->params['area_ids']);

        $targets = \Model_Area::find('all', array(
            'where' => $conditions,
        ));
        foreach($targets as $target) {
            $target->delete();
        }

        \Additional_Log::debug('【AREA DELETE API】:END');
    }

    private function makeConditionForUser($user)
    {
        $conditions = array();
        switch ($user->authority) {
        case USER_AUTHORITY_STORE:
        case USER_AUTHORITY_SECTION:
        case USER_AUTHORITY_BRAND:
            $conditions[] = array('brand_id', $user->brand_id);
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
        \Additional_Log::debug('【AREA API】:SET PARAM');

        $area = array();
        if(empty($this->params['company_id'])){
            // 初期処理
            $area['company_id'] = $user->company_id;
            $area['brand_id'] = $user->brand_id;
            $area['store_id'] = $user->store_id;
        }else{
            // 後続処理
            $area['company_id'] = isset($this->params['company_id']) ? $this->params['company_id'] : "";
            $area['brand_id'] = isset($this->params['brand_id']) ? $this->params['brand_id'] : "";
            $area['store_id'] = isset($this->params['store_id']) ? $this->params['store_id'] : "";
        }

        $area['id'] = isset($this->params['id']) ? $this->params['id'] : "";
        $area['area_type'] = isset($this->params['status']) ? $this->params['status'] : "";
        $area['area_name'] = isset($this->params['area_name']) ? $this->params['area_name'] : "";
        $area['area_ids'] = isset($this->params['area_ids']) ? $this->params['area_ids'] : "";
        $area['per_page'] = isset($this->params['per_page']) ? $this->params['per_page'] : 100;


        return $area;
    }
}
