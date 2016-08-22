<?php

namespace Api;
class Controller_Member_Check extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'company_id' => true,
            'brand_id' => true,
            'store_id' => true,
            'mail_address' => true,
        ),
    );

    protected function index()
    {
        \Additional_Log::debug('【MEMBER CHECK API】:START');

        // 自ユーザ情報取得
        $token = \Input::get('token');
        $user = \Model_User::findByToken($token);

        $company_id = $this->params['company_id'];
        $brand_id = $this->params['brand_id'];
        $store_id = $this->params['store_id'];
        $mail_address = $this->params['mail_address'];

        // 権限チェック
        $user->authority(array(
            'company_id' => $company_id,
            'brand_id' => $brand_id,
            'store_id' => $store_id));

        $conditions = array(
            array('company_id', $company_id),
            array('brand_id', $brand_id),
            array('mail_address', $mail_address),
        );
        $brand_member = \Model_Brand_Member::find('first', array(
            'where' => $conditions,
        ));

        $result = array();
        $status = STORE_MEMBER_CHECK_STATUS_NOT_EXIST;
        if ($brand_member) {
            $status = STORE_MEMBER_CHECK_STATUS_EXIST_IN_OTHER_BRAND;
            foreach($brand_member->store_members as $store_member) {
                if ($store_member->store_id == $store_id) {
                    $status = STORE_MEMBER_CHECK_STATUS_ALREADY_EXIST;
                    break;
                }
            }
            if ($status == STORE_MEMBER_CHECK_STATUS_EXIST_IN_OTHER_BRAND) {
                $result = $brand_member->toArray(PATTERN_ALL);
            }
        }
        $this->response_fields['member'] = $result;
        $this->response_fields['status'] = $status;

        \Additional_Log::debug('【MEMBER CHECK API】:END');
    }
}
