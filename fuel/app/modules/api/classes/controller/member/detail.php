<?php

namespace Api;
class Controller_Member_Detail extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'store_id' => true,
            'member_id' => true,
        ),
    );

    protected function index()
    {
        \Additional_Log::debug('【MEMBER PRIVATE API】:START');

        // 自ユーザ情報取得
        $user = \Model_User::find($this->user_id);
        if (empty($user)) {
            throw new \HttpForForbiddenException('無効なユーザーです');
        }

        // 引数情報取得
        $store_id = $this->params['store_id'];
        $member_id = $this->params['member_id'];

        // 権限チェック
        $user->authority(array(
            'company_id' => null,
            'brand_id' => null,
            'store_id' => $store_id,
        ));

        \Additional_Log::debug('【MEMBER PRIVATE API】:PARAM - '.$store_id."/".$member_id);

        $storeMember = \Model_Store_Member::find('first', array(
            'where' => array(
                array('store_id', $store_id),
                array('member_id', $member_id),
            )
        ));

        $result = array();
        if ($storeMember) {
            $brandMember = $storeMember->brand_member;
            $result = $brandMember->toArray(PATTERN_ALL) + $storeMember->toArray(PATTERN_ALL);
        }
        $this->response_fields['member'] = $result;

        \Additional_Log::debug('【MEMBER PRIVATE API】:END');
    }
}
