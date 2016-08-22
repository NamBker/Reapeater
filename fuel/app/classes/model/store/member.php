<?php

class Model_Store_Member extends \Model_Standard_Model
{
    protected static $_primary_key = array('brand_id', 'store_id', 'member_id');
    protected static $_properties = array(
        'brand_id' => array(
            'expose_pattern' => 2,
        ),
        'store_id' => array(
            'expose_pattern' => 2,
        ),
        'member_id' => array(
            'expose_pattern' => 2,
        ),
        'store_member_status' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'default' => 1,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    1,
                    2,
                ),
            ),
            'label' => '状態',
            'expose_pattern' => 2,
        ),
        'member_registration_date' => array(
            'data_type' => 'datetime',
            'null' => false,
            'label' => '会員登録日',
            'expose_pattern' => 2,
        ),
        'member_leave_date' => array(
            'data_type' => 'datetime',
            'null' => false,
            'default' => '0000-00-00',
            'label' => '会員退会日',
            'expose_pattern' => 3,
        ),
        'rank_point' => array(
            'data_type' => 'int',
            'null' => false,
            'default' => 0,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    4294967295,
                ),
            ),
            'label' => 'ランクポイント',
            'expose_pattern' => 3,
        ),
        'visit_count' => array(
            'data_type' => 'int',
            'null' => false,
            'default' => 0,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    4294967295,
                ),
            ),
            'label' => '来店回数',
            'expose_pattern' => 3,
        ),
        'last_visit_date' => array(
            'data_type' => 'datetime',
            'null' => false,
            'label' => '最終来店日',
            'expose_pattern' => 3,
        ),
        'mail_reception' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'default' => 0,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    1,
                ),
            ),
            'label' => 'メルマガ受信可否',
            'expose_pattern' => 2,
        ),
        'mail_delivery_status' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'default' => 1,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    1,
                ),
            ),
            'label' => 'メルマガ配信状態',
            'expose_pattern' => 2,
        ),
        'visit_alert_push' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'default' => 0,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    1,
                ),
            ),
            'label' => '来店アラート(PUSH通知)',
            'expose_pattern' => 3,
        ),
        'visit_alert_mail' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'default' => 0,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    1,
                ),
            ),
            'label' => '来店アラート(メール)',
            'expose_pattern' => 3,
        ),
        'other' => array(
            'data_type' => 'text',
            'null' => false,
            'label' => 'その他',
            'expose_pattern' => 3,
        ),
        'created_at' => array(
            'data_type' => 'datetime',
            'expose_type' => 'null',
        ),
        'updated_at' => array(
            'data_type' => 'datetime',
            'expose_type' => 'null',
        ),
    );

    protected static $_belongs_to = array(
        'brand' => array(
            'model_to' => 'Model_Brand',
            'key_from' => 'brand_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'store' => array(
            'model_to' => 'Model_Store',
            'key_from' => 'store_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'member' => array(
            'model_to' => 'Model_Member',
            'key_from' => 'member_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'brand_member' => array(
            'model_to' => 'Model_Brand_Member',
            'key_from' => array('brand_id', 'member_id'),
            'key_to' => array('brand_id', 'member_id'),
            'cascade_save' => false,
            'cascade_delete' => false,
        )
    );

    protected static $_to_array_exclude = array(
        'brand', 'store', 'member', 'brand_member', 'created_at', 'updated_at',
    );

    public static function findById($brand_id, $store_id, $member_id)
    {
        return static::find('first', array(
                'where' => array(
                    'brand_id' => $brand_id,
                    'store_id' => $store_id,
                    'member_id' => $member_id
                ),
            ));
    }

    /**
     * 対象会員一覧返却
     * @param $brand_id
     * @param $store_id
     * @param null $segments
     * @return \Orm\Model|\Orm\Model[]
     * @throws ProtocolException
     */
    public static function findActiveMember($brand_id, $store_id, $segments = null)
    {
        // 関連条件設定
        $relates = static::makeRelation($segments);

        // 条件設定
        $conditions = static::makeCondition(
            $brand_id,
            $store_id,
            0,
            STORE_MEMBER_STATUS_ACTIVE,
            STORE_MEMBER_MAIL_RECEPTION_CLEAR,
            STORE_MEMBER_MAIL_DELIVERY_STATUS_NORMAL,
            $segments
        );

        // 検索実行
        $results = static::find('all', array(
            'where' => $conditions,
            'related' => $relates
        ));

        return $results;
    }

    /**
     * 登録処理
     *
     * @param $param
     */
    public static function insertStoreMember($param)
    {
        $set_params = self::setStoreMemberParams($param);

        static::forge(array(
            'brand_id' => $set_params['brand_id']
            ,'store_id' => $set_params['store_id']
            ,'member_id' => $set_params['member_id']
            ,'store_member_status' => $set_params['store_member_status']
            ,'member_registration_date' => $set_params['member_registration_date']
            ,'rank_point' => $set_params['rank_point']
            ,'visit_count' => $set_params['visit_count']
            ,'last_visit_date' => $set_params['last_visit_date']
            ,'mail_reception' => $set_params['mail_reception']
            ,'visit_alert_push' => $set_params['visit_alert_push']
            ,'visit_alert_mail' => $set_params['visit_alert_mail']
            ,'other' => $set_params['other']
        ))->save();
    }

    /**
     * 店舗会員情報更新
     * @param $param
     * @param null $store_member
     * @throws ProtocolException
     */
    public static function updateStoreMember($param, $store_member = null)
    {
        if(empty($store_member)){
            $store_member = self::findById($param['brand_id'],$param['store_id'],$param['member_id']);
        }

        if(!empty($store_member)){
            if(isset($param['store_member_status'])){$store_member->store_member_status = $param['store_member_status'];}
            if(isset($param['member_registration_date'])){$store_member->member_registration_date = $param['member_registration_date'];}
            if(isset($param['member_leave_date'])){$store_member->member_leave_date = $param['member_leave_date'];}
            if(isset($param['rank_point'])){$store_member->rank_point = $param['rank_point'];}
            if(isset($param['visit_count'])){$store_member->visit_count = $param['visit_count'];}
            if(isset($param['last_visit_date'])){$store_member->last_visit_date = $param['last_visit_date'];}
            if(isset($param['mail_reception'])){$store_member->mail_reception = $param['mail_reception'];}
            if(isset($param['mail_delivery_status'])){$store_member->mail_delivery_status = $param['mail_delivery_status'];}
            if(isset($param['visit_alert_push'])){$store_member->visit_alert_push = $param['visit_alert_push'];}
            if(isset($param['visit_alert_mail'])){$store_member->visit_alert_mail = $param['visit_alert_mail'];}
            if(isset($param['other'])){$store_member->other = $param['other'];}

            $store_member->save();
        }else{
            throw new \ProtocolException(\Lang::get('store_member_is_not_registration'), "Member is not exist.", \ProtocolException::RESULT_CODE_STORE_MEMBER_NOT_FOUND);
        }
    }

    /**
     * 店舗メンバー用項目設定（初期値型）
     * @param $params
     * @return array
     */
    private static function setStoreMemberParams($params)
    {
        $set_default = array();

        $set_default['brand_id'] = isset($params['brand_id']) ? $params['brand_id'] : "";
        $set_default['store_id'] = isset($params['store_id']) ? $params['store_id'] : "";
        $set_default['member_id'] = isset($params['member_id']) ? $params['member_id'] : "";
        $set_default['store_member_status'] = isset($params['store_member_status']) ? $params['store_member_status'] : 1;
        $set_default['member_registration_date'] = isset($params['member_registration_date']) ? $params['member_registration_date'] : "";
        $set_default['member_leave_date'] = isset($params['member_leave_date']) ? $params['member_leave_date'] : "";
        $set_default['rank_point'] = isset($params['rank_point']) ? $params['rank_point'] : 0;
        $set_default['visit_count'] = isset($params['visit_count']) ? $params['visit_count'] : 0;
        $set_default['last_visit_date'] = isset($params['last_visit_date']) ? $params['last_visit_date'] : "";
        $set_default['mail_reception'] = isset($params['mail_reception']) ? $params['mail_reception'] : 1;
        $set_default['mail_delivery_status'] = isset($params['mail_delivery_status']) ? $params['mail_delivery_status'] : 1;
        $set_default['visit_alert_push'] = isset($params['visit_alert_push']) ? $params['visit_alert_push'] : 1;
        $set_default['visit_alert_mail'] = isset($params['visit_alert_mail']) ? $params['visit_alert_mail'] : 1;
        $set_default['other'] = isset($params['other']) ? $params['other'] : "";

        return $set_default;
    }

    /**
     * 条件設定
     * @param int $brand_id
     * @param int $store_id
     * @param int $member_id
     * @param int $store_member_status
     * @param int $mail_reception
     * @param int $mail_delivery_status
     * @param null $segments_param
     * @return array
     */
    public static function makeCondition($brand_id = 0, $store_id = 0, $member_id = 0, $store_member_status = 0, $mail_reception = 1, $mail_delivery_status = 1, $segments_param = null)
    {
        $condition = array();
        if (!empty($brand_id)) {
            $condition[] = array("brand_id", $brand_id);
        }

        if (!empty($store_id)) {
            $condition[] = array("store_id", $store_id);
        }

        if (!empty($member_id)) {
            $condition[] = array("member_id", $member_id);
        }

        if (!empty($store_member_status)) {
            $condition[] = array("store_member_status", $store_member_status);
        }

        if (!empty($mail_reception)) {
            $condition[] = array("mail_reception", $mail_reception);
        }

        if (!empty($mail_delivery_status)) {
            $condition[] = array("mail_delivery_status", $mail_delivery_status);
        }

        if (!empty($segments_param->memberRegisterDay->from)) {
            $condition[] = array('member_registration_date', '>=', $segments_param->memberRegisterDay->from);
        }

        if(!empty($segments_param->memberRegisterDay->to)){
            $condition[] = array('member_registration_date', '<', $segments_param->memberRegisterDay->to . " 23:59:59");
        }

        return $condition;
    }

    /**
     * 関連条件設定
     * @param $segments_param
     * @return array
     */
    public static function makeRelation($segments_param){
        $relates = array();

        // 性別条件
        if (!empty($segments_param->gender)) {
            $relates['brand_member']['where'][] = array(array('gender', 'IN', $segments_param->gender));
        }
        // 誕生日
        if (!empty($segments_param->birthday)) {
            // 指定
            if(!empty($segments_param->birthday->target->year)){
                $relates['brand_member']['where'][] = array(array(DB::expr("date_format(birthday,'%Y')"), $segments_param->birthday->target->year));
            }
            if(!empty($segments_param->birthday->target->month)){
                $relates['brand_member']['where'][] = array(array(DB::expr("date_format(birthday,'%m')"), sprintf("%02d", $segments_param->birthday->target->month)));
            }
            if(!empty($segments_param->birthday->target->day)){
                $relates['brand_member']['where'][] = array(array(DB::expr("date_format(birthday,'%d')"), sprintf("%02d", $segments_param->birthday->target->day)));
            }

            // 期間
            if(!empty($segments_param->birthday->range->from)){
                $relates['brand_member']['where'][] = array(array('birthday', '>=', $segments_param->birthday->range->from));
            }
            if(!empty($segments_param->birthday->range->to)){
                $relates['brand_member']['where'][] = array(array('birthday', '<', $segments_param->birthday->range->to));
            }
        }

        return $relates;
    }

    public static function getMembersByParams($user, $params) {
        if (empty($user)) {
            return array();
        }

        $conditions = array();
        $relates = array();
        // 企業ID
        $company_id = $user->authority == USER_AUTHORITY_ADMIN ? (isset($params['member_company_id']) ? $params['member_company_id'] : null) : $user->company_id;
        if ($company_id) {
            $relates['brand_member']['where'] = array(array('company_id', '=', $company_id));
        }
        // ブランドID
        $brand_ids = $user->authority <= USER_AUTHORITY_COMPANY ? (isset($params['member_brand_ids']) ? $params['member_brand_ids'] : null) : array($user->brand_id);
        if (0 < count($brand_ids)) {
            $conditions[] = array('brand_id', 'IN', $brand_ids);
        }
        // 事業部ID
        $section_id = $user->authority <= USER_AUTHORITY_BRAND ? null : $user->section_id;
        if ($section_id) {
            $relates['store']['where'] = array(array('section_id', '=', $section_id));
        }
        // 店舗ID
        $store_ids = $user->authority <= USER_AUTHORITY_SECTION ? (isset($params['member_store_id']) ? $params['member_store_ids'] : null) : array($user->store_id);
        if (0 < count($store_ids)) {
            $conditions[] = array('store_id', 'IN', $store_ids);
        }
        // メールアドレス
        if (isset($params['member_mail_address']) && $params['member_mail_address']) {
            $mail_address = $params['member_mail_address'];
            $relates['brand_member']['where'][] = array('mail_address', 'LIKE', "%{$mail_address}%");
        }
        if (isset($params['member_registration_date_from']) && $params['member_registration_date_from']) {
            $conditions[] = array('member_registration_date', '>=', $params['member_registration_date_from']);
        }
        if (isset($params['member_registration_date_to']) && $params['member_registration_date_to']) {
            $conditions[] = array('member_registration_date', '<=', $params['member_registration_date_to']." 23:59:59");
        }
        if (isset($params['store_member_statuses']) && $params['store_member_statuses'] && 0 < count($params['store_member_statuses'])) {
            $conditions[] = array('store_member_status', 'IN', $params['store_member_statuses']);
        }
        if (isset($params['mail_receptions']) && $params['mail_receptions'] && 0 < count($params['mail_receptions'])) {
            $conditions[] = array('mail_reception', 'IN', $params['mail_receptions']);
        }
        if (isset($params['mail_delivery_statuses']) && $params['mail_delivery_statuses'] && 0 < count($params['mail_delivery_statuses'])) {
            $conditions[] = array('mail_delivery_status', 'IN', $params['mail_delivery_statuses']);
        }
        if (isset($params['genders']) && $params['genders'] && 0 < count($params['genders'])) {
            $relates['brand_member']['where'][] = array('gender', 'IN', $params['genders']);
        }
        if (isset($params['birthday_from']) && $params['birthday_from']) {
            $relates['brand_member']['where'][] = array('birthday', '>=', $params['birthday_from']);
        }
        if (isset($params['name']) && $params['name']) {
            $relates['brand_member']['where'][] = array('name', 'LIKE', "%{$params['name']}%");
        }
        if (isset($params['prefectures']) && $params['prefectures'] && 0 < count($params['prefectures'])) {
            $relates['brand_member']['where'][] = array('prefecture', 'IN', $params['prefectures']);
        }
        if (isset($params['jobs']) && $params['jobs'] && 0 < count($params['jobs'])) {
            $relates['brand_member']['where'][] = array('job', 'IN', $params['jobs']);
        }
        $relates['member']['where'][] = array('delete_flg', '=', 0);

        $find_params = array();
        $find_params['where'] = $conditions;
        $find_params['related'] = $relates;
        if (isset($params['page']) && isset($params['per_page']) && $params['page'] && $params['per_page']) {
            $find_params['rows_offset'] = ($params['page'] - 1) * $params['per_page'];
            $find_params['rows_limit'] = $params['per_page'];
        }
        // そーと条件を設定 TODO
        if (true) {
            $find_params['order_by'] = array('member_registration_date' => 'desc');
        }
        $results = \Model_Store_Member::find('all', $find_params);
        // 総件数取得
        $query = \DB::select(\DB::expr('COUNT(*)'));
        $query->from('store_members');
        $query->join('brand_members', 'INNER')->on('brand_members.member_id', '=', 'store_members.member_id')->and_on('brand_members.brand_id', '=', 'store_members.brand_id');
        $query->join('stores', 'INNER')->on('stores.id', '=', 'store_members.store_id');
        $query->join('members', 'INNER')->on('members.id', '=', 'store_members.member_id');
        $query->where('store_members.member_id', '>', 0);
        foreach ($conditions as $where) {
            $query->and_where('store_members.'.$where[0], $where[1], $where[2]);
        }
        foreach ($relates as $table => $condition) {
            foreach ($condition['where'] as $where) {
                $query->and_where($table.'s.'.$where[0], $where[1], $where[2]);
            }
        }
        $res = $query->execute()->current();
        $total_count = reset($res);
        return array('members' => $results, 'count' => $total_count);
    }
}
