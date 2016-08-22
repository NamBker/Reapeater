<?php

namespace Api;
class Controller_Section extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'company_id' => false,
            'brand_id' => false,
            'section_name' => false,
            'page' => false,
            'per_page' => true,
            'pattern' => true,
        ),
        'create' => array(
            'company_id' => true,
            'brand_id' => true,
            'section_name' => true,
            'section_status' => true,
            'store_ids' => false,
        ),
        'update' => array(
            'id' => true,
            'company_id' => true,
            'brand_id' => true,
            'section_name' => true,
            'section_status' => true,
            'store_ids' => false,
        ),
        'delete' => array(
            'section_ids' => true,
        ),
    );

    protected function index()
    {
        \Additional_Log::debug('section/index called');

        // 引数取得
        $params = $this->setParams();
        $user = \Model_User::find($this->user_id);

        // 操作権限チェック
        $user->authority($params);

        if (empty($user)) {
            throw new \HttpForbiddenException('無効なユーザです');
        } else {
            $conditions = \Model_Section::makeConditions($params);
            $page = !empty($this->params['page']) ? $this->params['page'] : 1;
            $results = \Model_Section::find('all', array(
                'where' => $conditions,
                'offset' => ($page-1) * $this->params['per_page'],
                'limit'  => $this->params['per_page']
            ));

            //get count
            $count = \Model_Section::count(array('where' => $conditions));


            $section_arr = array();
            foreach($results as $section) {
                $section_arr_tmp = $section->toArray($this->params['pattern']);
                if($this->params['pattern'] > PATTERN_ONLY_KEY ){
                    $section_arr_tmp['store_names'] = $section->getStoreNames($section->stores);
                }

                $section_arr[] = $section_arr_tmp;
            }

            $this->response_fields['section'] = $section_arr;
            $this->response_fields['count'] = $count;
        }
    }

    protected function create()
    {
        \Additional_Log::debug('【SECTION CREATE API】:START');

        $params = $this->setParams();
        \Additional_Log::debug('【SECTION CREATE API】:PARAM - company_id:'. $params['company_id']."/ brand_id:".$params['brand_id']."/ section_id:".$params['id']);
        $user = \Model_User::find($this->user_id);

        // 操作権限チェック
        $user->authority($params);

        // 事業部登録処理
        \Model_Section::insertSection($params);

        \Additional_Log::debug('【SECTION CREATE API】:END');
    }

    protected function update()
    {
        \Additional_Log::debug('【SECTION UPDATE API】:START');

        // 引数取得
        $params = $this->setParams();
        \Additional_Log::debug('【SECTION CREATE API】:PARAM - company_id:'. $params['company_id']."/ brand_id:".$params['brand_id']."/ section_id:".$params['id']);
        $user = \Model_User::find($this->user_id);

        // 操作権限チェック
        $user->authority($params);

        // 事業部更新処理
        \Model_Section::updateSection($params);
        \Additional_Log::debug('【SECTION UPDATE API】:SECTION TBL UPDATED');

        \Additional_Log::debug('【SECTION UPDATE API】:END');
    }

    protected function delete()
    {
        \Additional_Log::debug('【SECTION DELETE API】:START');

        $user = \Model_User::find($this->user_id);

        $conditions = array();
        switch($user->authority) {
        case USER_AUTHORITY_STORE:
        case USER_AUTHORITY_SECTION:
            throw new \ProtocolException(\Lang::get('authority_error'), "You don't have permission to access.", \ProtocolException::RESULT_CODE_EXECUTE_AUTHORITY);
            return;
        case USER_AUTHORITY_BRAND:
            $conditions[] = array('brand_id', $user->brand_id);
        case USER_AUTHORITY_COMPANY:
            $conditions[] = array('company_id', $user->company_id);
        }
        $conditions[] = array('id', 'IN', $this->params['section_ids']);

        $targets = \Model_Section::find('all', array(
            'where' => $conditions,
        ));

        foreach($targets as $section) {
            $section->section_status = 0;
            $section->save();
        }
        \Additional_Log::debug('【SECTION DELETE API】:END');
    }

    /**
     * パラメータ設定
     * @return array
     */
    private function setParams(){
        \Additional_Log::debug('【SECTION API】:SET PARAM');

        // 事業部情報設定
        $section = array();
        $section['id'] = isset($this->params['id']) ? $this->params['id'] : "";
        $section['company_id'] = isset($this->params['company_id']) ? $this->params['company_id'] : "";
        $section['brand_id'] = isset($this->params['brand_id']) ? $this->params['brand_id'] : "";
        $section['store_id'] = isset($this->params['store_id']) ? $this->params['store_id'] : "";
        $section['section_name'] = isset($this->params['section_name']) ? $this->params['section_name'] : "";
        $section['section_status'] = isset($this->params['section_status']) ? $this->params['section_status'] : 2;
        $section['store_postal_code'] = isset($this->params['store_postal_code']) ? $this->params['store_postal_code'] : "";
        $section['store_prefectures'] = isset($this->params['store_prefectures']) ? $this->params['store_prefectures'] : "";
        $section['store_address'] = isset($this->params['store_address']) ? $this->params['store_address'] : "";
        $section['store_building'] = isset($this->params['store_building']) ? $this->params['store_building'] : "";
        $section['section_phone_no'] = isset($this->params['section_phone_no']) ? $this->params['section_phone_no'] : null;
        $section['section_id'] = isset($this->params['section_id']) ? $this->params['section_id'] : "";
        $section['section_ids'] = isset($this->params['section_ids']) ? $this->params['section_ids'] : null;
        $section['store_ids'] = isset($this->params['store_ids']) ? $this->params['store_ids'] : null;

        return $section;
    }
}

