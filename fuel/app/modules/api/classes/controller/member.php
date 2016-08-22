<?php

namespace Api;
class Controller_Member extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'member_mail_address' => false,
            'member_company_id' => false,
            'member_brand_ids' => false,
            'member_store_ids' => false,
            'member_registration_date_from' => false,
            'member_registration_date_to' => false,
            'store_member_statuses' => false,
            'mail_receptions' => false,
            'mail_delivery_statuses' => false,
            'genders' => false,
            'birthday_from' => false,
            'birthday_to' => false,
            'name' => false,
            'prefectures' => false,
            'jobs' => false,
            'page' => false,
            'per_page' => false,
            'pattern' => true,
        ),
        'create' => array(
            'company_id' => true,
            'brand_id' => true,
            'store_id' => true,
            'mail_address' => true,
            'mail_reception' => true,
            'mail_delivery_status' => true,
            'store_member_status' => true,
            'member_registration_date' => true,
            'member_leave_date' => false,
            'name' => false,
            'tel_no' => false,
            'birthday' => false,
            'gender' => false,
            'prefecture' => false,
            'job' => false,
        ),
        'update' => array(
            'company_id' => true,
            'brand_id' => true,
            'store_id' => true,
            'member_id' => true,
            'update_type' => true,
            'mail_address' => true,
            'mail_reception' => true,
            'mail_delivery_status' => true,
            'store_member_status' => true,
            'member_registration_date' => true,
            'member_leave_date' => false,
            'name' => false,
            'tel_no' => false,
            'birthday' => false,
            'gender' => false,
            'prefecture' => false,
            'job' => false,
        ),
        'delete' => array(
            'delete_ids' => true,
        ),
    );

    protected function index()
    {
        \Additional_Log::info('member/index called');
        $user = \Model_User::find($this->user_id);
        if (empty($user)) {
            throw new \HttpForbiddenException('無効なユーザです');
        } else {
            $res = \Model_Store_Member::getMembersByParams($user, $this->params);
            $results = $res['members'];
            $total_count = $res['count'];

            $member_arr = array();
            $pattern = $this->params['pattern'];
            foreach ($results as $store_member) {
                $brand_member = $store_member->brand_member;
                $rec = $brand_member->toArray($pattern) + $store_member->toArray($pattern);
                if (1 < $pattern) {
                    $brand = $store_member->brand;
                    $company = !empty($brand) ? $brand->company : null;
                    $store = $store_member->store;
                    $section = !empty($store) ? $store->section : null;
                    $rec['company_name'] = isset($company) ? $company->company_name : null;
                    $rec['brand_name'] = isset($brand) ? $brand->brand_name : null;
                    $rec['store_name'] = isset($store) ? $store->store_name : null;
                }
                $rec['id'] = "{$store_member->brand_id}_{$store_member->store_id}_{$store_member->member_id}";
                $member_arr[] = $rec;
            }
            $this->response_fields['member'] = $member_arr;
            $this->response_fields['count'] = $total_count;
        }
    }

    /**
     * 会員情報登録
     */
    protected function create()
    {
        \Additional_Log::debug('【MEMBER CREATE API】:START');

        $user = \Model_User::find($this->user_id);
        if (empty($user)) {
            throw new \HttpForbiddenException('無効なユーザです');
        }
        // 引数取得
        $params = $this->setParams();

        $user->authority(array(
            'company_id' => $params['company_id'],
            'brand_id' => $params['brand_id'],
            'store_id' => $params['store_id'],
        ));

        // ブランド会員存在チェック
        $brandCondition = \Model_Brand_Member::makeCondition($params['brand_id'], $params['mail_address'],$params['company_id']);
        $brandResponse = \Model_Brand_Member::find('first', array('where' => $brandCondition));

        // TODO
        // 臨時対応（名前など必須にするか要検討）
        $params['name'] = ' ';
        $params['tel_no'] = ' ';

        \Additional_Log::debug(print_r($params, true));

        if(!empty($brandResponse)){
            // 所属会員存在チェック
            $storeCondition = \Model_Store_Member::makeCondition($params['brand_id'], $params['store_id'], $brandResponse->member_id);
            $storeResponse = \Model_Store_Member::find('first', array('where' => $storeCondition));
            if(!empty($storeResponse)){
                \Additional_Log::debug('【MEMBER CREATE API】:STORE MEMBER EXIST');
                throw new \ProtocolException('既に会員登録済みです。', "Member is already exist.", \ProtocolException::RESULT_CODE_MEMBER_IS_ALREADY_EXIST);
            }

            // 会員ID設定
            $params['member_id'] = $brandResponse->member_id;
        }else{
            // TODO ブランド会員に主な情報を保持している為、ブランド会員TBLに情報が存在しない場合は、未登録会員として新規に登録処理を実行
            // 会員TBL登録処理
            $member = \Model_Member::insertMember(0);
            \Additional_Log::debug('【MEMBER CREATE API】:NEW MEMBER ID - '. $member);

            // 会員ID設定
            $member_id = $member;
            $params['member_id'] = $member_id;

            // ブランド会員登録処理
            \Model_Brand_Member::insertBrandMember($params);
        }

        // 所属会員登録処理
        \Model_Store_Member::insertStoreMember($params);

        \Additional_Log::debug('【MEMBER CREATE API】:END');
    }

    /**
     * 会員情報更新
     */
    protected function update()
    {
        \Additional_Log::debug('【MEMBER UPDATE API】:START');

        $user = \Model_User::find($this->user_id);
        if (empty($user)) {
            throw new \HttpForbiddenException('無効なユーザです');
        }
        \Additional_Log::debug(print_r($this->params, true));
        // 引数取得
        $params = $this->setParams();
        $user->authority(array(
            'company_id' => $params['company_id'],
            'brand_id' => $params['brand_id'],
            'store_id' => $params['store_id'],
        ));
        $type = $this->params['update_type'];

        // "$type"が"1"の場合、ブランド会員TBL・店舗会員TBLの両方を更新する
        if($type == 1){
            // ブランド会員TBL更新
            \Model_Brand_Member::updateBrandMember($params);
            \Additional_Log::debug('【MEMBER UPDATE API】:BRAND MEMBER TBL UPDATED');
        }
        // 店舗会員TBL更新
        \Model_Store_Member::updateStoreMember($params);
        \Additional_Log::debug('【MEMBER UPDATE API】:STORE MEMBER TBL UPDATED');

        \Additional_Log::debug('【MEMBER UPDATE API】:END');
    }

    /**
     * 会員削除
     */
    protected function delete()
    {
        \Additional_Log::debug('【MEMBER DELETE API】:START');

        // 引数取得
        $user = \Model_User::find($this->user_id);

        $query = \Model_Store_Member::query();
        $conditions = array();
        $relates = array();
        switch($user->authority) {
        case USER_AUTHORITY_COMPANY:
            $query->related('brand_member', array('where' => array(array('company_id', $user->company_id))));
            break;
        case USER_AUTHORITY_BRAND:
            $query->where('brand_id', $user->brand_id);
            break;
        case USER_AUTHORITY_SECTION:
            $query->related('store', array('where' => array(array('section_id', $user->section_id))));
            break;
        case USER_AUTHORITY_STORE:
            $query->where('store_id', $user->store_id);
            break;
        }
        $query->related('member', array('where' => array(array('delete_flg', 0))));

        $query->and_where_open();
        $delete_ids = $this->params['delete_ids'];
        foreach($delete_ids as $delete_id) {
            list($brand_id, $store_id, $member_id) = explode('_', $delete_id, 3);
            $query->or_where_open()
                ->where('brand_id', $brand_id)
                ->where('store_id', $store_id)
                ->where('member_id', $member_id)
                ->or_where_close();
        }
        $query->and_where_close();

        $res = $query->get();
        foreach($res as $store_member) {
            $brand_member = $store_member->brand_member;
            $store_member->delete();
            if (count($brand_member->store_members) < 1) {
                $member = $brand_member->member;
                $brand_member->delete();
                if (count($member->brand_members) < 1) {
                    $member->delete_flg = 1;
                    $member->save();
                }
            }
        }

        \Additional_Log::debug('【MEMBER DELETE API】:END');
    }

    /**
     * 引数値設定
     * @return array
     */
    private function setParams()
    {
        \Additional_Log::debug('【MEMBER UPDATE API】:SET PARAM');

        $memberInfo = array();
        // 会員情報設定
        $memberInfo['company_id'] = isset($this->params['company_id']) ? $this->params['company_id'] : "";
        $memberInfo['brand_id'] = isset($this->params['brand_id']) ? $this->params['brand_id'] : "";
        $memberInfo['store_id'] = isset($this->params['store_id']) ? $this->params['store_id'] : "";
        $memberInfo['member_id'] = isset($this->params['member_id']) ? $this->params['member_id'] : "";
        $memberInfo['mail_address'] = isset($this->params['mail_address']) ? $this->params['mail_address'] : "";
        $memberInfo['password'] = isset($this->params['password']) ? $this->params['password'] : " ";
        $memberInfo['status'] = isset($this->params['status']) ? $this->params['status'] : 1;
        $memberInfo['name'] = isset($this->params['name']) ? $this->params['name'] : "";
        $memberInfo['tel_no'] = isset($this->params['tel_no']) ? $this->params['tel_no'] : "";
        $memberInfo['birthday'] = isset($this->params['birthday']) ? $this->params['birthday'] : "";
        $memberInfo['gender'] = isset($this->params['gender']) ? $this->params['gender'] : "";
        $memberInfo['job'] = isset($this->params['job']) ? $this->params['job'] : "";
        $memberInfo['prefecture'] = isset($this->params['prefecture']) ? $this->params['prefecture'] : "";
        $memberInfo['allergy_responsibility'] = isset($this->params['allergy_responsibility']) ? $this->params['allergy_responsibility'] : " ";
        $memberInfo['allergy_recommendation'] = isset($this->params['allergy_recommendation']) ? $this->params['allergy_recommendation'] : " ";
        $memberInfo['facebook_hash'] = isset($this->params['facebook_hash']) ? $this->params['facebook_hash'] : " ";
        $memberInfo['twitter_hash'] = isset($this->params['twitter_hash']) ? $this->params['twitter_hash'] : " ";
        $memberInfo['line_hash'] = isset($this->params['line_hash']) ? $this->params['line_hash'] : " ";
        $memberInfo['store_member_status'] = isset($this->params['store_member_status']) ? $this->params['store_member_status'] : 1;
        $memberInfo['member_registration_date'] = isset($this->params['member_registration_date']) ? $this->params['member_registration_date'] : date("Y-m-d H:i:s");
        $memberInfo['rank_point'] = isset($this->params['rank_point']) ? $this->params['rank_point'] : 0;
        $memberInfo['visit_count'] = isset($this->params['visit_count']) ? $this->params['visit_count'] : 0;
        $memberInfo['last_visit_date'] = isset($this->params['last_visit_date']) ? $this->params['last_visit_date'] : "";
        $memberInfo['mail_reception'] = isset($this->params['mail_reception']) ? $this->params['mail_reception'] : 1;
        $memberInfo['visit_alert_push'] = isset($this->params['visit_alert_push']) ? $this->params['visit_alert_push'] : 1;
        $memberInfo['visit_alert_mail'] = isset($this->params['visit_alert_mail']) ? $this->params['visit_alert_mail'] : 1;
        $memberInfo['other'] = isset($this->params['other']) ? $this->params['other'] : "";

        return $memberInfo;
    }

}

