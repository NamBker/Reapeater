<?php

class Model_Brand_Member extends \Model_Standard_Model
{
    protected static $_primary_key = array('company_id', 'brand_id', 'member_id');
    protected static $_properties = array(
        'company_id' => array(
            'expose_pattern' => 2,
        ),
        'brand_id' => array(
            'expose_pattern' => 2,
        ),
        'member_id' => array(
            'expose_pattern' => 2,
        ),
        'mail_address' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    32,
                ),
            ),
            'label' => 'メールアドレス',
            'expose_pattern' => 1,
        ),
        'password' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'max_length' => array(
                    32,
                ),
            ),
            'label' => 'パスワード',
            'expose_type' => 'null',
        ),
        'status' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'default' => 0,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    1,
                ),
            ),
            'label' => '状態',
            'expose_pattern' => 2,
        ),
        'name' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    32,
                ),
            ),
            'label' => '名前',
            'expose_pattern' => 1,
        ),
        'tel_no' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'max_length' => array(
                    16,
                ),
            ),
            'label' => '電話番号',
            'expose_pattern' => 3,
        ),
        'birthday' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'max_length' => array(
                    8,
                ),
            ),
            'label' => '生年月日',
            'expose_pattern' => 3,
        ),
        'gender' => array(
            'data_type' => 'tinyint',
            'null' => true,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    1,
                    2,
                ),
            ),
            'label' => '性別',
            'expose_pattern' => 3,
        ),
        'job' => array(
            'data_type' => 'tinyint',
            'null' => true,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    1,
                    11,
                ),
            ),
            'label' => '職業',
            'expose_pattern' => 3,
        ),
        'prefecture' => array(
            'data_type' => 'smallint',
            'null' => true,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    1,
                    47,
                ),
            ),
            'label' => '都道府県',
            'expose_pattern' => 3,
        ),
        'allergy_responsibility' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    128,
                ),
            ),
            'label' => 'アレルギー義務表示',
            'expose_pattern' => 3,
        ),
        'allergy_recommendation' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    128,
                ),
            ),
            'label' => 'アレルギー推奨表示',
            'expose_pattern' => 3,
        ),
        'favorite_store_id' => array(
            'null' => true,
            'label' => 'よく行く店舗',
            'expose_pattern' => 3,
        ),
        'facebook_hash' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    64,
                ),
            ),
            'label' => 'facebook情報',
            'expose_pattern' => 3,
        ),
        'twitter_hash' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    64,
                ),
            ),
            'label' => 'twitter情報',
            'expose_pattern' => 3,
        ),
        'line_hash' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    64,
                ),
            ),
            'label' => 'line情報',
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
        'member' => array(
            'model_to' => 'Model_Member',
            'key_from' => 'member_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'favorite_store' => array(
            'model_to' => 'Model_Store',
            'key_from' => 'favorite_store_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );

    protected static $_has_one = array(
    );

    protected static $_has_many = array(
        'store_members' => array(
            'model_to' => 'Model_Store_Member',
            'key_from' => array('brand_id', 'member_id'),
            'key_to' => array('brand_id', 'member_id'),
            'cascade_save' => true,
            'cascade_delete' => false,
        ),
    );

    protected static $_to_array_exclude = array(
        'password', 'created_at', 'updated_at', 'store_members',
    );

    /**
     * PKを条件に検索
     *
     * @param $company_id
     * @param $brand_id
     * @param $member_id
     * @return \Orm\Model|\Orm\Model[]
     */
    public static function findById($company_id, $brand_id, $member_id)
    {
        return static::find('first', array(
            'where' => array(
                'company_id' => $company_id,
                'brand_id' => $brand_id,
                'member_id' => $member_id
            ),
        ));
    }

    /**
     * メールアドレスを条件に検索
     * @param $brand_id
     * @param $mail_address
     * @return \Orm\Model|\Orm\Model[]
     */
    public static function findByMailAddress($brand_id, $mail_address)
    {
        return static::find('first', array(
            'where' => array(
                'brand_id' => $brand_id,
                'mail_address' => $mail_address
            ),
        ));
    }

    /**
     * メンバーIDを条件に検索
     * @param $brand_id
     * @param $member_id
     * @return \Orm\Model|\Orm\Model[]
     * @throws ProtocolException
     */
    public static function findByMemberId($brand_id, $member_id){
        return static::find('first', array(
            'where' => array(
                'brand_id' => $brand_id,
                'member_id' => $member_id
            ),
        ));
    }

    /**
     * ブランド会員登録処理
     *
     * @param $param
     */
    public static function insertBrandMember($param)
    {
        $set_params = self::setBrandMemberParams($param);

        static::forge(array(
            'company_id' => $set_params['company_id']
            ,'brand_id' => $set_params['brand_id']
            ,'member_id' => $set_params['member_id']
            ,'mail_address' => $set_params['mail_address']
            ,'password' => $set_params['password']
            ,'status' => $set_params['status']
            ,'name' => $set_params['name']
            ,'tel_no' => $set_params['tel_no']
            ,'birthday' => $set_params['birthday']
            ,'gender' => $set_params['gender']
            ,'job' => $set_params['job']
            ,'prefecture' => $set_params['prefecture']
            ,'allergy_responsibility' => $set_params['allergy_responsibility']
            ,'allergy_recommendation' => $set_params['allergy_recommendation']
            ,'facebook_hash' => $set_params['facebook_hash']
            ,'twitter_hash' => $set_params['twitter_hash']
            ,'line_hash' => $set_params['line_hash']
        ))->save();
    }

    /**
     * ブランド会員更新処理
     * @param $param
     * @throws ProtocolException
     */
    public static function updateBrandMember($param)
    {
        $brand_member = self::findById($param['company_id'],$param['brand_id'],$param['member_id']);

        if(!empty($brand_member)){
            if(isset($param['mail_address'])){$brand_member->mail_address = $param['mail_address'];}
            if(isset($param['password'])){$brand_member->password = $param['password'];}
            if(isset($param['status'])){$brand_member->status = $param['status'];}
            if(isset($param['name'])){$brand_member->name = $param['name'];}
            if(isset($param['tel_no'])){$brand_member->tel_no = $param['tel_no'];}
            if(isset($param['birthday'])){$brand_member->birthday = $param['birthday'];}
            if(isset($param['gender'])){$brand_member->gender = $param['gender'];}
            if(isset($param['job'])){$brand_member->job = $param['job'];}
            if(isset($param['prefecture'])){$brand_member->prefecture = $param['prefecture'];}    //
            if(isset($param['allergy_responsibility'])){$brand_member->allergy_responsibility = $param['allergy_responsibility'];}
            if(isset($param['allergy_recommendation'])){$brand_member->allergy_recommendation = $param['allergy_recommendation'];}
            if(isset($param['favorite_store_id'])){$brand_member->favorite_store_id = $param['favorite_store_id'];}
            if(isset($param['facebook_hash'])){$brand_member->facebook_hash = $param['facebook_hash'];}
            if(isset($param['twitter_hash'])){$brand_member->twitter_hash = $param['twitter_hash'];}
            if(isset($param['line_hash'])){$brand_member->line_hash = $param['line_hash'];}

            $brand_member->save();
        }else{
            throw new \ProtocolException(\Lang::get('brand_member_is_not_registration'), "Member is not exist.", \ProtocolException::RESULT_CODE_BRAND_MEMBER_NOT_FOUND);
        }
    }

    public static function makeCondition($brand_id = 0, $mail_address = "", $company_id = 0, $member_id = 0)
    {
        $condition = array();
        if (!empty($brand_id)) {
            $condition[] = array("brand_id", $brand_id);
        }

        if (!empty($mail_address)) {
            $condition[] = array("mail_address", $mail_address);
        }

        if (!empty($company_id)) {
            $condition[] = array("company_id", $company_id);
        }

        if (!empty($member_id)) {
            $condition[] = array("member_id", $member_id);
        }

        return $condition;
    }

    /**
     * ブランドメンバー用項目設定（初期値型）
     * @param $params
     * @return array
     */
    private static function setBrandMemberParams($params)
    {
        $set_default = array();

        $set_default['company_id'] = isset($params['company_id']) ? $params['company_id'] : "";
        $set_default['brand_id'] = isset($params['brand_id']) ? $params['brand_id'] : "";
        $set_default['member_id'] = isset($params['member_id']) ? $params['member_id'] : "";
        $set_default['mail_address'] = isset($params['mail_address']) ? $params['mail_address'] : "";
        $set_default['password'] = isset($params['password']) ? $params['password'] : "";
        $set_default['status'] = isset($params['status']) ? $params['status'] : 1;
        $set_default['name'] = isset($params['name']) ? $params['name'] : "";
        $set_default['tel_no'] = isset($params['tel_no']) ? $params['tel_no'] : "";
        $set_default['birthday'] = isset($params['birthday']) ? $params['birthday'] : "";
        $set_default['gender'] = isset($params['gender']) ? $params['gender'] : "";
        $set_default['job'] = isset($params['job']) ? $params['job'] : "";
        $set_default['prefecture'] = isset($params['prefecture']) ? $params['prefecture'] : "";
        $set_default['allergy_responsibility'] = isset($params['allergy_responsibility']) ? $params['allergy_responsibility'] : "";
        $set_default['allergy_recommendation'] = isset($params['allergy_recommendation']) ? $params['allergy_recommendation'] : "";
        $set_default['favorite_store_id'] = isset($params['favorite_store_id']) ? $params['favorite_store_id'] : "";
        $set_default['facebook_hash'] = isset($params['facebook_hash']) ? $params['facebook_hash'] : "";
        $set_default['twitter_hash'] = isset($params['twitter_hash']) ? $params['twitter_hash'] : "";
        $set_default['line_hash'] = isset($params['line_hash']) ? $params['line_hash'] : "";

        return $set_default;
    }
}
