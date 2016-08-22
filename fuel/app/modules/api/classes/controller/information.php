<?php

namespace Api;
class Controller_Information extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'status' => false,
            'company_id' => false,
            'brand_ids' => false,
            'store_ids' => false,
            'effective_period_from' => false,
            'effective_period_to' => false,
            'title' => false,
            'page' => false,
            'per_page' => true,
            'pattern' => true,
        ),
        'create' => array(
            'title' => true,
            'body' => true,
            'publisher_company_id' => true,
            'publisher_brand_ids' => true,
            'publisher_store_ids' => true,
            'picture_id' => false,
            'status' => true,
            'effective_period_from' => true,
            'effective_period_to' => true,
        ),
        'update' => array(
            'id' => true,
            'title' => true,
            'body' => true,
            'effective_period_from' => true,
            'effective_period_to' => true,
        ),
        'delete' => array(
            'information_ids' => true
        ),
    );

    /**
     * お知らせ検索
     */
    protected function index()
    {
        \Additional_Log::debug('【INFORMATION LIST API】:START');

        // 引数取得
        $params = $this->setParams();
        $pattern = $this->params['pattern'];
        $user = \Model_User::find($this->user_id);

        // お知らせ情報取得
        $company_id = $this->params['company_id'];
        $brand_ids = $this->params['brand_ids'];
        $store_ids = $this->params['store_ids'];
        $relates = array();
        if (!$user->checkAuthority($company_id, $brand_ids, $store_ids)) {
            throw new \ProtocolException(\Lang::get('user_authority_error'), "user does not have authority for operation.", \ProtocolException::RESULT_CODE_USER_OPERATION_AUTHORITY_ERROR);
        }

        if($user->authority >=  USER_AUTHORITY_COMPANY){
            $params['company_id'] = $user->company_id;
        }

        if($user->authority >=  USER_AUTHORITY_BRAND){
            $params['brand_ids'] = [$user->brand_id];
        }

        if($user->authority >=  USER_AUTHORITY_SECTION){
            $relates['store']['where'] = array(
                array('section_id', $user->section_id),
            );
        }

        if($user->authority >=  USER_AUTHORITY_STORE){
            $params['store_ids'] = [$user->store_id];
        }

        $conditions = \Model_Information::makeConditions($params);

        // TODO ソート条件をQuery paramから設定
        $order_condition = array('effective_period_from' => 'desc');

        $page = !empty($this->params['page']) ? $this->params['page'] : 1;
        $results = \Model_Information::find('all', array(
            'where' => $conditions,
            'related' => $relates,
            'order_by' => $order_condition,
            'offset' => ($page-1) * $this->params['per_page'],
            'limit' => $this->params['per_page']
        ));

        //get count
        $count = \Model_Information::count(array('where' => $conditions, 'related' => $relates));

        // 検索結果設定
        $new_information_arr = array();
        foreach ($results as $information) {
            $rec = $information->toArray($pattern);

            if (PATTERN_ONLY_KEY < $pattern) {
                $rec['delivery'] = $information->getDelivery();
            }
            $new_information_arr[] = $rec;
        }

        $this->response_fields['informations'] = $new_information_arr;
        $this->response_fields['count'] = $count;

        \Additional_Log::debug('【INFORMATION LIST API】:END');
    }

    /**
     * お知らせ登録
     */
    protected function create()
    {
        \Additional_Log::debug('【INFORMATION CREATE API】:START');

        // 引数取得
        $params = $this->params;
        $user = \Model_User::find($this->user_id);

        // 操作権限チェック
        $publisher_company_id = $this->params['publisher_company_id'];
        $publisher_brand_ids = $this->params['publisher_brand_ids'];
        $publisher_store_ids = $this->params['publisher_store_ids'];
        if (!$user->checkAuthority($publisher_company_id, $publisher_brand_ids, $publisher_store_ids)) {
            throw new \ProtocolException(\Lang::get('user_authority_error'), "user does not have authority for operation.", \ProtocolException::RESULT_CODE_USER_OPERATION_AUTHORITY_ERROR);
        }

        // お知らせ登録処理
        $information = \Model_Information::makeNewInformationFromParam($params, $user);
        $information->company_id = empty($user->company_id) ? 0 : $user->company_id;
        $information->brand_id = empty($user->brand_id) ? 0 : $user->brand_id;
        $information->store_id = empty($user->store_id) ? 0 : $user->store_id;
        $information->save();

        \Additional_Log::debug('【INFORMATION CREATE API】:END');
    }

    /**
     * お知らせ更新
     */
    protected function update()
    {
        \Additional_Log::debug('【INFORMATION UPDATE API】:START');

        $user = \Model_User::find($this->user_id);
        // データ取得
        $information = \Model_Information::findById($this->params['id']);
        if (!$information) {
            throw new \ProtocolException(\Lang::get('information_is_not_registration'), "Information is not exist.", \ProtocolException::RESULT_CODE_INFORMATION_NOT_FOUND);
        }
        // 操作権限チェック
        $publisher_brand_ids = $this->params['publisher_brand_ids'];
        $publisher_store_ids = $this->params['publisher_store_ids'];
        if (!$user->checkAuthority(null, $publisher_brand_ids, $publisher_store_ids)) {
            throw new \ProtocolException(\Lang::get('user_authority_error'), "user does not have authority for operation.", \ProtocolException::RESULT_CODE_USER_OPERATION_AUTHORITY_ERROR);
        }
        if (!$information->isAccessibleUser($user)) {
            throw new \ProtocolException(\Lang::get('user_authority_error'), "user does not have authority for operation.", \ProtocolException::RESULT_CODE_USER_OPERATION_AUTHORITY_ERROR);
        }
        // データ設定
        $information->priority = $this->params['priority'];
        $information->title = $this->params['title'];
        $information->body = $this->params['body'];
        $information->picture_id = $this->params['picture_id'];
        $information->setPublisherFromIds($this->params['publisher_brand_ids'], INFORMATION_PUBLISHER_TYPE_BRAND);
        $information->setPublisherFromIds($this->params['publisher_store_ids'], INFORMATION_PUBLISHER_TYPE_STORE);
        $information->status = $this->params['status'];
        $information->effective_period_from = $this->params['effective_period_from'];
        $information->effective_period_to = $this->params['effective_period_to'];
        $information->save();

        // お知らせ更新処理
        \Additional_Log::debug('【INFORMATION UPDATE API】:INFORMATION TBL UPDATED');

        \Additional_Log::debug('【INFORMATION UPDATE API】:END');
    }

    /**
     * パラメータ登録
     * @return array
     */
    private function setParams(){
        \Additional_Log::debug('【INFORMATION API】:SET PARAM');
        return $this->params;
    }

    public function delete()
    {
        \Additional_Log::debug('【INFORMATION API】:DELETE');
        $params = $this->setParams();
        $information_Ids = $this->params['information_ids'];
        $user = \Model_User::find($this->user_id);
        $user->authority($params);
        foreach ($information_Ids as $info_id) {
            $information = \Model_Information::find($info_id);
            if (!empty($information)) {
                $information->delete();
            }
        }
    }
}

