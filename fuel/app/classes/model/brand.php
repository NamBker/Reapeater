<?php

class Model_Brand extends \Model_Standard_Model
{
	const STATUS_DELETE      = 0;
	const STATUS_CLOSE       = 1;
	const STATUS_PREPARATION = 2;
	const STATUS_OPEN        = 3;

    protected static $_properties = array(
        'id' => array(
            'data_type' => 'int',
        ),
        'company_id' => array(
            'data_type' => 'int',
            'expose_pattern' => 1,
        ),
        'brand_code' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    16,
                ),
            ),
            'label' => 'ブランドコード',
            'expose_pattern' => 1,
        ),
        'brand_name' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    32,
                ),
            ),
            'label' => 'ブランド名',
            'expose_pattern' => 1,
        ),
        'brand_domain' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'max_length' => array(
                    64,
                ),
            ),
            'label' => '独自ドメイン',
            'expose_pattern' => 2,
        ),
        'brand_status' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'default' => '2',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    3,
                ),
            ),
            'label' => '状態',
            'expose_pattern' => 2,
        ),
        'brand_postal_code' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    8,
                ),
            ),
            'label' => '郵便番号',
            'expose_pattern' => 2,
        ),
        'brand_prefectures' => array(
            'data_type' => 'int',
            'null' => true,
            'validation' => array(
                'numeric_between' => array(
                    1,
                    2147483647,
                ),
            ),
            'label' => '都道府県',
            'expose_pattern' => 2,
        ),
        'brand_address' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    64,
                ),
            ),
            'label' => '住所',
            'expose_pattern' => 2,
        ),
        'brand_building' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    32,
                ),
            ),
            'label' => 'ビル名等',
            'expose_pattern' => 2,
        ),
        'brand_phone_no' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    16,
                ),
            ),
            'label' => '電話番号',
            'expose_pattern' => 2,
        ),
        'brand_regular_holiday' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    16,
                ),
            ),
            'label' => '定休日',
            'expose_pattern' => 3,
        ),
        'brand_signature_block' => array(
            'data_type' => 'text',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    65535,
                ),
            ),
            'label' => 'メール署名',
            'expose_pattern' => 3,
        ),
        'brand_terms_of_use' => array(
            'data_type' => 'text',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    65535,
                ),
            ),
            'label' => '利用規約',
            'expose_pattern' => 3,
        ),
        'brand_privacy_policy' => array(
            'data_type' => 'text',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    65535,
                ),
            ),
            'label' => 'プライバシーポリシー',
            'expose_pattern' => 3,
        ),
        'brand_freeword' => array(
            'data_type' => 'text',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    65535,
                ),
            ),
            'label' => 'フリーワード',
            'expose_pattern' => 3,
        ),
        'store_display_type' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'default' => '1',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    1,
                    2,
                ),
            ),
            'label' => '店舗一覧表示タイプ',
            'expose_pattern' => 3,
        ),
        'google_analytics_id' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'numeric_between' => array(
                    1,
                    2147483647,
                ),
            ),
            'label' => 'googleアナリティクスID',
            'expose_pattern' => 3,
        ),
        'google_analytics_pass' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    16,
                ),
            ),
            'label' => 'googleアナリティクスパス',
            'expose_pattern' => 3,
        ),
        'brand_first_open_date' => array(
            'data_type' => 'datetime',
            'expose_type' => 'datetime',
            'expose_pattern' => 3,
        ),
        'member_registration_form_text_up' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    256,
                ),
            ),
            'label' => '会員登録フォームボタンの上に表示するテキスト',
            'expose_pattern' => 3,
        ),
        'member_registration_form_text_down' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    256,
                ),
            ),
            'label' => '会員登録フォームボタンの下に表示するテキスト',
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
        )
    );

    protected static $_has_many = array(
        'section' => array(
            'key_from' => 'id',
            'model_to' => 'Model_Section',
            'key_to' => 'brand_id',
            'cascade_save' => true,
            'cascade_delete' => false,
        ),

        'stores' => array(
            'key_from' => array('id'),
            'model_to' => 'Model_Store',
            'key_to' => array('brand_id'),
            'cascade_save' => true,
            'cascade_delete' => false,
        ),

        'brand_members' => array(
            'key_from' => 'id',
            'model_to' => 'Model_brand_Member',
            'key_to' => 'brand_id',
            'cascade_save' => true,
            'cascade_delete' => false,
        ),
    );

    protected static $_to_array_exclude = array(
        'company', 'created_at', 'updated_at',
    );

    public static function findById($id)
    {
        return static::find('first', array(
            'where' => array(
                'id' => $id
            ),
        ));
    }

    public static function insertBrand($param)
    {
        // 存在チェック
        $check = self::findByBrandCode($param["brand_code"]);

        if(empty($check)){
            $brand = static::forge(array(
                'company_id' => $param['company_id']
                ,'brand_code' => $param['brand_code']
                ,'brand_name' => $param['brand_name']
                ,'brand_status' => $param['brand_status']
                ,'brand_postal_code' => $param['brand_postal_code']
                ,'brand_prefectures' => $param['brand_prefectures']
                ,'brand_address' => $param['brand_address']
                ,'brand_building' => $param['brand_building']
                ,'brand_phone_no' => $param['brand_phone_no']
                ,'brand_regular_holiday' => $param['brand_regular_holiday']
                ,'brand_signature_block' => $param['brand_signature_block']
                ,'brand_terms_of_use' => $param['brand_terms_of_use']
                ,'brand_privacy_policy' => $param['brand_privacy_policy']
                ,'brand_freeword' => $param['brand_freeword']
                ,'store_display_type' => $param['store_display_type']
                ,'google_analytics_id' => $param['google_analytics_id']
                ,'google_analytics_pass' => $param['google_analytics_pass']
                ,'brand_first_open_date' => $param['brand_first_open_date']
                ,'member_registration_form_text_up' => $param['member_registration_form_text_up']
                ,'member_registration_form_text_down' => $param['member_registration_form_text_down']
            ));
            $brand->save();

            // 初期質問追加
            self::addInitialQuestions($brand);
        }else{
            throw new \ProtocolException(\Lang::get('brand_code_is_duplicate'), "The brand code is duplicate.", \ProtocolException::RESULT_CODE_BRAND_CODE_IS_ALREADY_EXIST);
        }
    }

    public static function buildQueryGetBrand($company_id = null, $brand_status = null, $brand_id = null, $brand_name = null, $brand_address = null, $phone_number = null)
    {
        $condition = array();

        if (!empty($brand_id)) {
            $condition[] = array("id", $brand_id);
        }

        if (!empty($company_id)) {
            $condition[] = array("company_id", $company_id);
        }

        if (!empty($brand_status) || $brand_status === '0') {
            $condition[] = array("brand_status", $brand_status);
        }

        if (!empty($brand_name)) {
            $condition[] = array("brand_name", 'like' , "%$brand_name%");
        }

        if (!empty($brand_address)) {
            $condition[] = array("brand_address", 'like' ,"%$brand_address%");
        }

        if (!empty($phone_number)) {
            $condition[] = array("brand_phone_no", $phone_number);
        }

        return $condition;
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
        if(!empty($params['brand_code'])){
            $conditions[] = array('brand_code', $params['brand_code']);
        }
        if(!empty($params['brand_name'])){
            $tmp = $params['brand_name'];
            $conditions[] = array('brand_name', 'like', "%$tmp%");
        }
        if($params['brand_status'] != "" || !empty($params['brand_status'])){
            $conditions[] = array('brand_status', $params['brand_status']);
        }

        return $conditions;
    }

    public function getStoreOptions(&$store_options)
    {
        foreach ($this->stores as $store) {
            $store_options[$this->brand_name][$store->id] = $store->store_name;
        }
    }

    public function findStore($store_id)
    {
        foreach ($this->stores as $store) {
            if ($store->id == $store_id) {
                return $store;
            }
        }
        return null;
    }

    /**
     * ユニークキー検索
     * @param $brand_code
     * @return \Orm\Model|\Orm\Model[]
     * @deprecated $company_idもユニークに含まれる
     */
    public static function findByBrandCode($brand_code)
    {
        return static::find('first', array(
            'where' => array(
                'brand_code' => $brand_code
            ),
        ));
    }

    /**
     * ユニークキー検索
     * @param $brand_code
     * @return \Orm\Model|\Orm\Model[]
     */
    public static function findByCompanyIdAndBrandCode($company_id, $brand_code)
    {
        return static::find(
            'first',
            array(
                'where' => array(
                    'company_id' => $company_id,
                    'brand_code' => $brand_code
                ),
            )
        );
    }

	/**
	 * ドメイン名からブランド情報を検索
	 * @param  $brand_domain ドメイン名
	 * @return
	 */
	public static function findByDomain($brand_domain)
	{
		$query = \DB::select()
		->from('brands')
		->where('brand_domain', '=', $brand_domain);

		return $query->execute();
	}


    public function getStores($user, $authority)
    {
        $stores = array();
        foreach ($this->stores as $store) {
            if ($authority < USER_AUTHORITY_STORE || ($store->id == $user->store_id)) {
                $store_arr = array('id' => $store->id, 'store_name' => $store->store_name);
                $stores[] = $store_arr;
            }
        }
        return $stores;
    }

    public function getStoreCount()
    {
        $store = array();
        foreach($this->section as $section)
        {
            $store[] =  count($section->stores);
        }

        return array_sum($store);
    }

    public static function checkCreateBrandIllegal($company_id)
    {
        if (empty($company_id)) {
            throw new \ProtocolException(\Lang::get('company_choice'), "Company_id is empty.", \ProtocolException::RESULT_CODE_CREATE_BRAND_INVALID);
        } else {
            $company = \Model_Company::find($company_id);
            if (empty($company)) {
                throw new \ProtocolException(\Lang::get('company_not_exist'), "", \ProtocolException::RESULT_CODE_CREATE_BRAND_INVALID);
            }
        }

        return true;
    }

    public static function getId($company_id, $brand_code)
    {
        if (empty($company_id)) {
            return 0;
        }
        if (empty($brand_code)) {
            return 0;
        }

        $brand = static::findByCompanyIdAndBrandCode($company_id, $brand_code);
        if (empty($brand)) {
            return 0;
        }

        return $brand->id;
    }

    /**
     * 初期質問登録処理
     * @param $brand
     */
    private static function addInitialQuestions($brand){
        // 初期登録質問一覧取得
        $questions = json_decode(INITIAL_QUESTION, true);

        foreach ($questions as $question) {
            $add_questions["company_id"] = $brand->company_id;
            $add_questions["brand_id"] = $brand->id;
            $add_questions["section_id"] = 0;
            $add_questions["store_id"] = 0;
            $add_questions["questionnaire_type"] = QUESTIONNAIRES_TYPE_INITIAL;
            $add_questions["question_type"] = $question["question_type"];
            $add_questions["question_body"] = $question["question_body"];
            $add_questions["question_char_limit"] = $question["question_char_limit"];
            $add_questions["question_nos"] = array($question["question_nos"]);

            \Model_Question::insertQuestion($add_questions);
        }
    }
}
