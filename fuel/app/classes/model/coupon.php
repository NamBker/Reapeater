<?php

class Model_Coupon extends \Model_Standard_Model
{
    protected static $_properties = array(
        'id',
        'company_id' => array(
            'expose_pattern' => 1,
        ),
        'brand_id' => array(
            'expose_pattern' => 1,
        ),
        'section_id' => array(
            'expose_pattern' => 1,
        ),
        'store_id' => array(
            'expose_pattern' => 1,
        ),
        'coupon_code' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    32,
                ),
            ),
            'label' => 'クーポンコード',
            'expose_pattern' => 2,
        ),
        'coupon_release_flg' => array(
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
            'label' => '公開済みフラグ',
            'expose_pattern' => 2,
        ),
        'coupon_status' => array(
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
            'label' => 'クーポン状態',
            'expose_pattern' => 2,
        ),
        'coupon_user_code_display' => array(
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
            'label' => 'ユーザコード表示可否',
            'expose_pattern' => 3,
        ),
        'coupon_category_id' => array(
            'data_type' => 'int',
            'default' => 0,
            'validation' => array(
                'is_numeric',
            ),
            'label' => 'カテゴリID',
            'expose_pattern' => 3,
        ),
        'coupon_name' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    32,
                ),
            ),
            'label' => 'クーポン名称',
            'expose_pattern' => 1,
        ),
        'coupon_title' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'max_length' => array(
                    32,
                ),
            ),
            'label' => 'クーポンタイトル',
            'expose_pattern' => 3,
        ),
        'coupon_description' => array(
            'data_type' => 'text',
            'null' => false,
            'validation' => array(
                'required',
            ),
            'label' => 'クーポン内容',
            'expose_pattern' => 3,
        ),
        'coupon_limit_type' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'default' => 0,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2,
                ),
            ),
            'label' => '有効期限タイプ',
            'expose_pattern' => 2,
        ),
        'coupon_limit_from' => array(
            'data_type' => 'datetime',
            'null' => true,
            'label' => '有効期限開始日',
            'expose_pattern' => 2,
        ),
        'coupon_limit_to' => array(
            'data_type' => 'datetime',
            'null' => true,
            'label' => '有効期限終了日',
            'expose_pattern' => 2,
        ),
        'coupon_limit_send_start' => array(
            'data_type' => 'smallint',
            'null' => false,
            'default' => 0,
            'label' => '有効期限送信型開始日数',
            'expose_pattern' => 2,
        ),
        'coupon_limit_send_count' => array(
            'data_type' => 'smallint',
            'null' => false,
            'default' => 0,
            'label' => '有効期限送信型有効日数',
            'expose_pattern' => 2,
        ),
        'coupon_two_step_flg' => array(
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
            'label' => '2段階クーポンフラグ',
            'expose_pattern' => 3,
        ),
        'coupon_two_step_button_description' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    256,
                ),
            ),
            'label' => '2段階プレクーポンボタン説明',
            'expose_pattern' => 3,
        ),
        'coupon_two_step_use_description' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    256,
                ),
            ),
            'label' => '2段階プレクーポン使用説明',
            'expose_pattern' => 3,
        ),
        'coupon_two_step_limit_type' => array(
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
            'label' => '2段階有効期限タイプ',
            'expose_pattern' => 3,
        ),
        'coupon_two_step_limit_min' => array(
            'data_type' => 'smallint',
            'null' => true,
            'default' => 0,
            'label' => '2段階有効期限(分)',
            'expose_pattern' => 3,
        ),
        'coupon_two_step_confirmation' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    128,
                ),
            ),
            'label' => '2段階店員確認用内容',
            'expose_pattern' => 3,
        ),
        'coupon_two_step_attention' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    256,
                ),
            ),
            'label' => '2段階説明・注意事項',
            'expose_pattern' => 3,
        ),
        'coupon_two_step_over_description' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    256,
                ),
            ),
            'label' => '2段階使用不可時説明文',
            'expose_pattern' => 3,
        ),
        'coupon_deleted_flg' => array(
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
            'label' => '削除フラグ',
            'expose_pattern' => 1,
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
        'company' => array(
            'model_to' => 'Model_Company',
            'key_from' => 'company_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'brand' => array(
            'model_to' => 'Model_Brand',
            'key_from' => 'brand_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'section' => array(
            'model_to' => 'Model_Section',
            'key_from' => 'section_id',
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
        )
    );

    protected static $_has_many = array(
        'histories' => array(
            'model_to' => 'Model_Member_Coupon_History',
            'key_from' => 'id',
            'key_to' => 'coupon_id',
            'cascade_save' => true,
            'cascade_delete' => true,
        ),
        'coupon_analysis' => array(
            'model_to' => 'Model_Coupon_Analysis',
            'key_from' => array('store_id', 'id'),
            'key_to' => array('store_id', 'coupon_id'),
            'cascade_save' => true,
            'cascade_delete' => true,
        ),
    );

    protected static $_to_array_exclude = array(
        'company', 'brand', 'section', 'store',
    );

    /**
     * キー検索
     * @param $id
     * @return \Orm\Model|\Orm\Model[]
     */
    public static function findById($id)
    {
        return static::find('first', array(
            'where' => array(
                'id' => $id
            ),
        ));
    }

    public static function findByUserAndId($user, $id)
    {
        if (empty($user)) {
            return null;
        }
        $conditions = array();
        switch($user->authority) {
        case USER_AUTHORITY_STORE:
            $conditions[] = array('store_id', $user->store_id);
        case USER_AUTHORITY_SECTION:
            $conditions[] = array('section_id', $user->section_id);
        case USER_AUTHORITY_BRAND:
            $conditions[] = array('brand_id', $user->brand_id);
        case USER_AUTHORITY_COMPANY:
            $conditions[] = array('company_id', $user->company_id);
        }
        $conditions[] = array('id', $id);
        return static::find('first', array(
            'where' => $conditions,
        ));
    }

    /**
     * ユニークキー検索
     * @param $company_id
     * @param $brand_id
     * @param $store_id
     * @return \Orm\Model|\Orm\Model[]
     */
    public static function findByCompanyIdAndBrandIdAndStoreId($company_id, $brand_id, $store_id)
    {
        // return self::findByCompanyIdAndBrandIdAndStoreId($company_id, $brand_id, $store_id);
        return static::find('first', array(
            'where' => array(
                'company_id' => $company_id,
                'brand_id'   => $brand_id,
                'store_id'   => $store_id,
            ),
        ));
    }

    /**
     * クーポン登録
     * @param $param
     */
    public static function insertCoupon($param, $store_id)
    {
        $coupon = static::forge(array(
            'company_id' => $param['company_id']
            ,'brand_id' => $param['brand_id']
            ,'section_id' => $param['section_id']
            ,'store_id' => $store_id
            ,'coupon_release_flg' => $param['coupon_release_flg']
            ,'coupon_status' => $param['coupon_status']
            ,'coupon_user_code_display' => $param['coupon_user_code_display']
            ,'coupon_category_id' => $param['coupon_category_id']
            ,'coupon_name' => $param['coupon_name']
            ,'coupon_title' => $param['coupon_title']
            ,'coupon_description' => $param['coupon_description']
            ,'coupon_limit_type' => $param['coupon_limit_type']
            ,'coupon_limit_from' => $param['coupon_limit_from']
            ,'coupon_limit_to' => $param['coupon_limit_to']
            ,'coupon_limit_send_start' => $param['coupon_limit_send_start']
            ,'coupon_limit_send_count' => $param['coupon_limit_send_count']
            ,'coupon_two_step_flg' => $param['coupon_two_step_flg']
            ,'coupon_two_step_button_description' => $param['coupon_two_step_button_description']
            ,'coupon_two_step_use_description' => $param['coupon_two_step_use_description']
            ,'coupon_two_step_limit_type' => $param['coupon_two_step_limit_type']
            ,'coupon_two_step_limit_min' => $param['coupon_two_step_limit_min']
            ,'coupon_two_step_confirmation' => $param['coupon_two_step_confirmation']
            ,'coupon_two_step_attention' => $param['coupon_two_step_attention']
            ,'coupon_two_step_over_description' => $param['coupon_two_step_over_description']
            ,'coupon_deleted_flg' => $param['coupon_deleted_flg']
        ));
        $coupon->save();
    }

    /**
     * クーポン更新
     * @param $param
     * @throws ProtocolException
     */
    public static function updateCoupon($param)
    {
        $coupon = self::findById($param['id']);

        // 公開済み可否チェック
        if($coupon->coupon_release_flg == RELEASED){
            throw new \ProtocolException(\Lang::get('coupon_already_released'), "Coupon is already released. You can not change the coupon data.", \ProtocolException::RESULT_CODE_COUPON_RELEASED);
        }

        if(!empty($coupon)){
            $coupon->coupon_release_flg = $param['coupon_release_flg'];
            $coupon->coupon_status = $param['coupon_status'];
            $coupon->coupon_user_code_display = $param['coupon_user_code_display'];
            $coupon->coupon_category_id = $param['coupon_category_id'];
            $coupon->coupon_name = $param['coupon_name'];
            $coupon->coupon_title = $param['coupon_title'];
            $coupon->coupon_description = $param['coupon_description'];
            $coupon->coupon_limit_type = $param['coupon_limit_type'];
            $coupon->coupon_limit_from = $param['coupon_limit_from'];
            $coupon->coupon_limit_to = $param['coupon_limit_to'];
            $coupon->coupon_limit_send_start = $param['coupon_limit_send_start'];
            $coupon->coupon_limit_send_count = $param['coupon_limit_send_count'];
            $coupon->coupon_two_step_flg = $param['coupon_two_step_flg'];
            $coupon->coupon_two_step_button_description = $param['coupon_two_step_button_description'];
            $coupon->coupon_two_step_use_description = $param['coupon_two_step_use_description'];
            $coupon->coupon_two_step_limit_type = $param['coupon_two_step_limit_type'];
            $coupon->coupon_two_step_limit_min = $param['coupon_two_step_limit_min'];
            $coupon->coupon_two_step_confirmation = $param['coupon_two_step_confirmation'];
            $coupon->coupon_two_step_attention = $param['coupon_two_step_attention'];
            $coupon->coupon_two_step_over_description = $param['coupon_two_step_over_description'];
            $coupon->coupon_deleted_flg = $param['coupon_deleted_flg'];

            $coupon->save();
        }else{
            throw new \ProtocolException(\Lang::get('coupon_is_not_registration'), "Coupon is not exist.", \ProtocolException::RESULT_CODE_COUPON_NOT_FOUND);
        }
    }

    /**
     * 削除フラグを論理削除に更新
     * @param $id
     * @throws ProtocolException
     */
    public static function deleteCoupon($id){
        $coupon = self::findById($id);

        if(!empty($coupon)){
            $coupon->coupon_deleted_flg = 1;
            $coupon->save();
        }else{
            throw new \ProtocolException(\Lang::get('coupon_is_not_registration'), "Coupon is not exist.", \ProtocolException::RESULT_CODE_COUPON_NOT_FOUND);
        }
    }

    /**
     * 条件設定
     *
     * @param $params
     * @return array
     */
    public static function makeConditions($params)
    {
        $conditions = array();
        if(!empty($params['id'])){
            $conditions[] = array('id', $params['id']);
        }
        if(!empty($params['company_id'])){
            $conditions[] = array('company_id', $params['company_id']);
        }
        if(!empty($params['brand_ids'])){
            $conditions[] = array('brand_id', 'IN', $params['brand_ids']);
        }
        if(!empty($params['store_ids'])){
            $conditions[] = array('store_id', 'IN', $params['store_ids']);
        }
        if(!empty($params['coupon_release_flg'])){
            $conditions[] = array('coupon_release_flg', $params['coupon_release_flg']);
        }
        if(!empty($params['coupon_status'])){
            $conditions[] = array('coupon_status', $params['coupon_status']);
        }
        if(!empty($params['coupon_user_code_display'])){
            $conditions[] = array('coupon_user_code_display', $params['coupon_user_code_display']);
        }
        if(!empty($params['coupon_category_id'])){
            $conditions[] = array('coupon_category_id', $params['coupon_category_id']);
        }
        if(!empty($params['coupon_name'])){
            $tmp = $params['coupon_name'];
            $conditions[] = array('coupon_name', 'like', "%$tmp%");
        }
        if(!empty($params['coupon_title'])){
            $tmp = $params['coupon_title'];
            $conditions[] = array('coupon_title', 'like', "%$tmp%");
        }
        if(!empty($params['coupon_description'])){
            $tmp = $params['coupon_description'];
            $conditions[] = array('coupon_description', 'like', "%$tmp%");
        }
        if(!empty($params['coupon_limit_type'])){
            $conditions[] = array('coupon_limit_type', $params['coupon_limit_type']);
        }
        if(!empty($params['coupon_limit_from'])){
            $conditions[] = array('coupon_limit_from', '>=', $params['coupon_limit_from']);
        }
        if(!empty($params['coupon_limit_to'])){
            $conditions[] = array('coupon_limit_to', '<=', $params['coupon_limit_to']);
        }
        if(!empty($params['coupon_limit_send_start'])){
            $conditions[] = array('coupon_limit_send_start', $params['coupon_limit_send_start']);
        }
        if(!empty($params['coupon_limit_send_count'])){
            $conditions[] = array('coupon_limit_send_count', $params['coupon_limit_send_count']);
        }
        if(!empty($params['coupon_two_step_flg'])){
            $conditions[] = array('coupon_two_step_flg', $params['coupon_two_step_flg']);
        }
        if(!empty($params['coupon_two_step_button_description'])){
            $tmp = $params['coupon_two_step_button_description'];
            $conditions[] = array('coupon_two_step_button_description', 'like', "%$tmp%");
        }
        if(!empty($params['coupon_two_step_use_description'])){
            $tmp = $params['coupon_two_step_use_description'];
            $conditions[] = array('coupon_two_step_use_description', 'like', "%$tmp%");
        }
        if(!empty($params['coupon_two_step_limit_type'])){
            $conditions[] = array('coupon_two_step_limit_type', $params['coupon_two_step_limit_type']);
        }
        if(!empty($params['coupon_two_step_limit_min'])){
            $conditions[] = array('coupon_two_step_limit_min', $params['coupon_two_step_limit_min']);
        }
        if(!empty($params['coupon_two_step_confirmation'])){
            $tmp = $params['coupon_two_step_confirmation'];
            $conditions[] = array('coupon_two_step_confirmation', 'like', "%$tmp%");
        }
        if(!empty($params['coupon_two_step_attention'])){
            $tmp = $params['coupon_two_step_attention'];
            $conditions[] = array('coupon_two_step_attention', 'like', "%$tmp%");
        }
        if(!empty($params['coupon_two_step_over_description'])){
            $tmp = $params['coupon_two_step_over_description'];
            $conditions[] = array('coupon_two_step_over_description', 'like', "%$tmp%");
        }
        if(!empty($params['coupon_deleted_flg'])){
            $conditions[] = array('coupon_deleted_flg', $params['coupon_deleted_flg']);
        }

        return $conditions;
    }

}
