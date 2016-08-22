<?php

class Model_Questionnaire extends \Model_Standard_Model
{
    protected static $_primary_key = array('id');
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
        'questionnaire_code' => array(
            'expose_pattern' => 1,
        ),
        'questionnaire_release_flg' => array(
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
            'label' => '公開済みフラグ',
            'expose_pattern' => 2,
        ),
        'questionnaire_type' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    1,
                    2,
                ),
            ),
            'label' => '種別タイプ',
            'expose_pattern' => 2,
        ),
        'questionnaire_category_id' => array(
            'data_type' => 'int',
            'null' => true,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    4294967295,
                ),
            ),
            'label' => 'カテゴリID',
            'expose_pattern' => 3,
        ),
        'questionnaire_name' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    32,
                ),
            ),
            'label' => 'アンケート名',
            'expose_pattern' => 1,
        ),
        'questionnaire_limit' => array(
            'data_type' => 'date',
            'null' => false,
            'validation' => array(
                'max_length' => array(
                    19,
                ),
            ),
            'label' => '回答期限',
            'expose_pattern' => 2,
        ),
        'questionnaire_text' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'max_length' => array(
                    64,
                ),
            ),
            'label' => '回答ページ冒頭文言',
            'expose_pattern' => 3,
        ),
        'questionnaire_agreement' => array(
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
            'label' => '規約・ポリシー表示フラグ',
            'expose_pattern' => 3,
        ),
        'questionnaire_thank_text' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'max_length' => array(
                    64,
                ),
            ),
            'label' => '回答後のお礼文言',
            'expose_pattern' => 3,
        ),
        'questionnaire_deleted_flg' => array(
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
            'key_from' => 'company_id',
            'model_to' => 'Model_Company',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'brand' => array(
            'key_from' => 'brand_id',
            'model_to' => 'Model_Brand',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'section' => array(
            'key_from' => 'section_id',
            'model_to' => 'Model_Section',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'store' => array(
            'key_from' => 'store_id',
            'model_to' => 'Model_Store',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );

    protected static $_has_many = array(
        'questionnaire_responds' => array(
            'key_from' => 'id',
            'model_to' => 'Model_Questionnaire_Respond',
            'key_to' => 'questionnaire_id',
            'cascade_save' => true,
            'cascade_delete' => true,
        ),
        'questionnaire_coupons' => array(
            'key_from' => 'id',
            'model_to' => 'Model_Questionnaire_Coupon',
            'key_to' => 'questionnaire_id',
            'cascade_save' => true,
            'cascade_delete' => true,
        ),
        'questionnaire_analysis' => array(
            'key_from' => 'id',
            'model_to' => 'Model_Questionnaire_Analysis',
            'key_to' => 'questionnaire_id',
            'cascade_save' => true,
            'cascade_delete' => true,
        ),
        'histories' => array(
            'key_from' => 'id',
            'model_to' => 'Model_Member_Questionnaire_History',
            'key_to' => 'questionnaire_id',
            'cascade_save' => true,
            'cascade_delete' => true,
        ),
        'answered_histories' => array(
            'key_from' => 'id',
            'model_to' => 'Model_Member_Questionnaire_History',
            'key_to' => 'questionnaire_id',
            'cascade_save' => true,
            'cascade_delete' => true,
            'conditions' => array(
                'where' => array(array('questionnaire_respond_date', 'IS NOT', null))
            )
        ),
    );

    protected static $_many_many = array(
        'questionnaire_questions' => array(
            'table_through' => 'questionnaire_responds',
            'key_from' => 'id',
            'key_through_from' => 'questionnaire_id',
            'key_through_to' => 'coupon_id',
            'key_to' => 'id',
            'model_to' => 'Model_Coupon',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );



    protected static $_to_array_exclude = array(
        'created_at', 'updated_at',
    );

    /**
     * キー情報からレコードを取得
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
     * 条件設定
     *
     * @param $params
     * @return array
     */
    public static function makeConditions($params)
    {
        $conditions = array();
        if(!empty($params['company_id'])){
            $conditions[] = array('company_id', $params['company_id']);
        }
        if(!empty($params['brand_ids'])){
            $conditions[] = array('brand_id', 'IN' ,$params['brand_ids']);
        }
        if(!empty($params['store_ids'])){
            $conditions[] = array('store_id', 'IN' , $params['store_ids']);
        }
        if(!empty($params['questionnaire_release_flg'])){
            $conditions[] = array('questionnaire_release_flg', $params['questionnaire_release_flg']);
        }
        if(!empty($params['questionnaire_type'])){
            $conditions[] = array('questionnaire_type', $params['questionnaire_type']);
        }
        if(!empty($params['questionnaire_category_id'])){
            $conditions[] = array('questionnaire_category_id', $params['questionnaire_category_id']);
        }
        if(!empty($params['questionnaire_name'])){
            $tmp = $params['questionnaire_name'];
            $conditions[] = array('questionnaire_name', 'like', "%$tmp%");
        }
        if(!empty($params['questionnaire_limit'])){
            $conditions[] = array('questionnaire_limit', $params['questionnaire_limit']);
        }
        if(!empty($params['questionnaire_text'])){
            $tmp = $params['questionnaire_text'];
            $conditions[] = array('questionnaire_text', 'like', "%$tmp%");
        }
        if(!empty($params['questionnaire_agreement'])){
            $conditions[] = array('questionnaire_agreement', $params['questionnaire_agreement']);
        }
        if(!empty($params['questionnaire_thank_text'])){
            $tmp = $params['questionnaire_thank_text'];
            $conditions[] = array('questionnaire_thank_text', 'like', "%$tmp%");
        }
        if(!empty($params['questionnaire_deleted_flg'])){
            $conditions[] = array('questionnaire_deleted_flg', $params['questionnaire_deleted_flg']);
        }

        return $conditions;
    }

    public function getQuestionAnalysis() {
        foreach ($this->questionnaire_responds as $respond) {

        }
    }
}
