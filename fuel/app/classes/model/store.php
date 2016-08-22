<?php

class Model_Store extends \Model_Standard_Model
{
	const STATUS_DELETE      = 0;
	const STATUS_CLOSE       = 1;
	const STATUS_PREPARATION = 2;
	const STATUS_OPEN        = 3;

    protected static $_primary_key = array('id');
    protected static $_properties = array(
        'id' => array(
            'data_type' => 'int',
        ),
        'brand_id' => array(
            'data_type' => 'int',
            'expose_pattern' => 1,
        ),
        'section_id' => array(
            'data_type' => 'int',
            'null' => false,
            'default' => '0',
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    4294967295,
                ),
            ),
            'label' => '事業部ID',
            'expose_pattern' => 2,
        ),
        'store_code' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    16,
                ),
            ),
            'label' => '店舗コード',
            'expose_pattern' => 1,
        ),
        'store_name' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    32,
                ),
            ),
            'label' => '店舗名',
            'expose_pattern' => 1,
        ),
        'store_status' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'default' => 2,
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
        'store_postal_code' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'max_length' => array(8),
            ),
            'label' => '郵便番号',
            'expose_pattern' => 3,
        ),
        'store_prefectures' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'max_length' => array(2),
            ),
            'label' => '都道府県',
            'expose_pattern' => 2,
        ),
        'store_address' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'max_length' => array(
                    64,
                ),
            ),
            'label' => '住所',
            'expose_pattern' => 2,
        ),
        'store_building' => array(
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
        'store_access' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    64,
                ),
            ),
            'label' => 'アクセス',
            'expose_pattern' => 3,
        ),
        'store_location' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    128,
                ),
            ),
            'label' => '位置情報 longitude, latitude, zoomをキーで持つJSONデータ',
            'expose_pattern' => 3,
        ),
        'store_phone_no' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    16,
                ),
            ),
            'label' => '電話番号',
            'expose_pattern' => 2,
        ),
        'store_fax_no' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    16,
                ),
            ),
            'label' => 'FAX',
            'expose_pattern' => 3,
        ),
        'store_manager_name' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    32,
                ),
            ),
            'label' => '店長名',
            'expose_pattern' => 2,
        ),
        'store_business_hours' => array(
            'data_type' => 'text',
            'null' => false,
            'label' => '営業時間',
            'expose_pattern' => 3,
        ),
        'store_business_hours_from' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    8,
                ),
            ),
            'label' => '営業時間_開店',
            'expose_pattern' => 3,
        ),
        'store_business_hours_to' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    8,
                ),
            ),
            'label' => '営業時間_閉店',
            'expose_pattern' => 3,
        ),
        'store_regular_holiday' => array(
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
        'store_parking_lot' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    16,
                ),
            ),
            'label' => '駐車場情報',
            'expose_pattern' => 3,
        ),
        'store_seat' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    16,
                ),
            ),
            'label' => '席情報',
            'expose_pattern' => 3,
        ),
        'store_kids_room' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    16,
                ),
            ),
            'label' => 'キッズルーム',
            'expose_pattern' => 3,
        ),
        'store_signature_block' => array(
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
        'store_terms_of_use' => array(
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
        'store_privacy_policy' => array(
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
        'store_freeword' => array(
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
		'store_header_picture_id' => array(
            'data_type' => 'int',
            'null' => true,
            'default' => '0',
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    4294967295,
                ),
            ),
        ),
        'store_area_L_id' => array(
            'data_type' => 'int',
            'null' => true,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    4294967295,
                ),
            ),
            'label' => 'エリア(大分類)',
            'expose_pattern' => 1,
        ),
        'store_area_M_id' => array(
            'data_type' => 'int',
            'null' => true,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    4294967295,
                ),
            ),
            'label' => 'エリア(中分類)',
            'expose_pattern' => 1,
        ),
        'store_area_S_id' => array(
            'data_type' => 'int',
            'null' => true,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    4294967295,
                ),
            ),
            'label' => 'エリア(小分類)',
            'expose_pattern' => 1,
        ),
        'store_area_L_sort_index' => array(
            'data_type' => 'int',
            'null' => true,
            'default' => '0',
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    4294967295,
                ),
            ),
            'expose_pattern' => 2,
        ),
        'store_area_M_sort_index' => array(
            'data_type' => 'int',
            'null' => true,
            'default' => '0',
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    4294967295,
                ),
            ),
            'expose_pattern' => 2,
        ),
        'store_area_S_sort_index' => array(
            'data_type' => 'int',
            'null' => true,
            'default' => '0',
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    4294967295,
                ),
            ),
            'expose_pattern' => 2,
        ),
        'store_sort_index' => array(
            'data_type' => 'int',
            'null' => true,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    4294967295,
                ),
            ),
            'label' => 'ソート順',
            'expose_pattern' => 2,
        ),
        'store_seo_key1' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    32,
                ),
            ),
            'label' => 'SEOキーワード1',
            'expose_pattern' => 3,
        ),
        'store_seo_key2' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    32,
                ),
            ),
            'label' => 'SEOキーワード2',
            'expose_pattern' => 3,
        ),
        'store_seo_key3' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    32,
                ),
            ),
            'label' => 'SEOキーワード3',
            'expose_pattern' => 3,
        ),
        'twitter_access_token' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    64,
                ),
            ),
            'label' => 'twitterアクセストークン',
            'expose_pattern' => 3,
        ),
        'twitter_access_token_secret' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    64,
                ),
            ),
            'label' => 'twitterアクセスシークレット',
            'expose_pattern' => 3,
        ),
        'facebook_id' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    64,
                ),
            ),
            'label' => 'フェイスブックID',
            'expose_pattern' => 3,
        ),
        'store_first_open_date' => array(
            'data_type' => 'datetime',
            'expose_type' => 'datetime',
            'label' => '初回公開日時',
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
        'section' => array(
            'model_to' => 'Model_Section',
            'key_from' => 'section_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );

    protected static $_has_one = array(
        'header_picture' => array(
            'model_to' => 'Model_Picture',
            'key_from' => 'store_header_picture_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        )
    );

    protected static $_has_many = array(
        'store_members' => array(
            'model_to' => 'Model_Store_Member',
            'key_from' => 'id',
            'key_to' => 'store_id',
            'cascade_save' => true,
            'cascade_delete' => false,
        ),
    );

    protected static $_to_array_exclude = array(
        'brand', 'section', 'created_at', 'updated_at',
    );

    public static function findById($id)
    {
        return static::find('first', array(
            'where' => array(
                'id' => $id
            ),
        ));
    }

    /**
     * ユニークキー検索
     * @param $store_code
     * @return \Orm\Model|\Orm\Model[]
     * @deprecated $brand_idもユニークに含まれる
     */
    public static function findByUnique($brand_id, $store_code)
    {
        return static::find('first', array(
            'where' => array(
                'brand_id' => $brand_id,
                'store_code' => $store_code
            ),
        ));
    }

    /**
     * ユニークキー検索
     * @param $brand_id
     * @param $store_code
     * @return \Orm\Model|\Orm\Model[]
     */
    public static function findByBrandIdAndStoreCode($brand_id, $store_code)
    {
        return static::find(
            'first',
            array(
                'where' => array(
                    'brand_id' => $brand_id,
                    'store_code' => $store_code
                ),
            )
        );
    }

    /**
     * ユニークキー検索
     * @param $company_id
     * @param $brand_code
     * @param $store_code
     * @return \Orm\Model|\Orm\Model[]
     */
    public static function findByCompanyIdAndBrandCodeAndStoreCode($company_id, $brand_code, $store_code)
    {
        $brand_id = Model_Brand::getId($company_id, $brand_code);
        return self::findByBrandIdAndStoreCode($brand_id, $store_code);
    }

    /**
     * 店舗登録処理
     * @param $param
     * @return mixed
     */
    public static function insertStore($param){

        $set_params = self::setStoreParams($param);

        $store = static::forge(array(
            'brand_id' => $set_params['brand_id']
            ,'section_id' => $set_params['section_id']
            ,'store_code' => $set_params['store_code']
            ,'store_name' => $set_params['store_name']
            ,'store_status' => $set_params['store_status']
            ,'store_postal_code' => $set_params['store_postal_code']
            ,'store_prefectures' => $set_params['store_prefectures']
            ,'store_address' => $set_params['store_address']
            ,'store_building' => $set_params['store_building']
            ,'store_access' => $set_params['store_access']
            ,'store_location' => $set_params['store_location']
            ,'store_phone_no' => $set_params['store_phone_no']
            ,'store_fax_no' => $set_params['store_fax_no']
            ,'store_manager_name' => $set_params['store_manager_name']
            ,'store_business_hours' => $set_params['store_business_hours']
            ,'store_business_hours_from' => $set_params['store_business_hours_from']
            ,'store_business_hours_to' => $set_params['store_business_hours_to']
            ,'store_regular_holiday' => $set_params['store_regular_holiday']
            ,'store_parking_lot' => $set_params['store_parking_lot']
            ,'store_seat' => $set_params['store_seat']
            ,'store_kids_room' => $set_params['store_kids_room']
            ,'store_signature_block' => $set_params['store_signature_block']
            ,'store_terms_of_use' => $set_params['store_terms_of_use']
            ,'store_privacy_policy' => $set_params['store_privacy_policy']
            ,'store_freeword' => $set_params['store_freeword']
            ,'store_header_picture_id' => $set_params['store_header_picture_id']
            ,'store_area_L_id' => $set_params['store_area_L_id']
            ,'store_area_M_id' => $set_params['store_area_M_id']
            ,'store_area_S_id' => $set_params['store_area_S_id']
            ,'store_sort_index' => $set_params['store_sort_index']
            ,'store_seo_key1' => $set_params['store_seo_key1']
            ,'store_seo_key2' => $set_params['store_seo_key2']
            ,'store_seo_key3' => $set_params['store_seo_key3']
            ,'twitter_access_token' => $set_params['twitter_access_token']
            ,'twitter_access_token_secret' => $set_params['twitter_access_token_secret']
            ,'facebook_id' => $set_params['facebook_id']
            ,'store_first_open_date' => $set_params['store_first_open_date']
        ));
        $store->save();

        return $store->id;
    }

    /**
     * 店舗更新処理
     * @param $param
     * @param null $store
     */
    public static function updateStore($param, $store = null)
    {
        if(empty($store)){
            $store = self::findByUnique($param['store_code']);
        }

        if(!empty($store)){
            if(isset($param['brand_id'])){$store->brand_id = $param['brand_id'];}
            if(isset($param['section_id'])){$store->section_id = $param['section_id'];}
            if(isset($param['store_code'])){$store->store_code = $param['store_code'];}
            if(isset($param['store_name'])){$store->store_name = $param['store_name'];}
            if(isset($param['store_status'])){$store->store_status = $param['store_status'];}
            if(isset($param['store_postal_code'])){$store->store_postal_code = $param['store_postal_code'];}
            if(isset($param['store_prefectures'])){$store->store_prefectures = $param['store_prefectures'];}
            if(isset($param['store_address'])){$store->store_address = $param['store_address'];}
            if(isset($param['store_building'])){$store->store_building = $param['store_building'];}
            if(isset($param['store_access'])){$store->store_access = $param['store_access'];}
            if(isset($param['store_location'])){$store->store_location = $param['store_location'];}
            if(isset($param['store_phone_no'])){$store->store_phone_no = $param['store_phone_no'];}
            if(isset($param['store_fax_no'])){$store->store_fax_no = $param['store_fax_no'];}
            if(isset($param['store_manager_name'])){$store->store_manager_name = $param['store_manager_name'];}
            if(isset($param['store_business_hours'])){$store->store_business_hours = $param['store_business_hours'];}
            if(isset($param['store_business_hours_from'])){$store->store_business_hours_from = $param['store_business_hours_from'];}
            if(isset($param['store_business_hours_to'])){$store->store_business_hours_to = $param['store_business_hours_to'];}
            if(isset($param['store_regular_holiday'])){$store->store_regular_holiday = $param['store_regular_holiday'];}
            if(isset($param['store_parking_lot'])){$store->store_parking_lot = $param['store_parking_lot'];}
            if(isset($param['store_seat'])){$store->store_seat = $param['store_seat'];}
            if(isset($param['store_kids_room'])){$store->store_kids_room = $param['store_kids_room'];}
            if(isset($param['store_signature_block'])){$store->store_signature_block = $param['store_signature_block'];}
            if(isset($param['store_terms_of_use'])){$store->store_terms_of_use = $param['store_terms_of_use'];}
            if(isset($param['store_privacy_policy'])){$store->store_privacy_policy = $param['store_privacy_policy'];}
            if(isset($param['store_freeword'])){$store->store_freeword = $param['store_freeword'];}
            if(isset($param['store_header_picture_id'])){$store->store_header_picture_id = $param['store_header_picture_id'];}
            if(isset($param['store_area_L_id'])){$store->store_area_L_id = $param['store_area_L_id'];}
            if(isset($param['store_area_M_id'])){$store->store_area_M_id = $param['store_area_M_id'];}
            if(isset($param['store_area_S_id'])){$store->store_area_S_id = $param['store_area_S_id'];}
            if(isset($param['store_sort_index'])){$store->store_sort_index = $param['store_sort_index'];}
            if(isset($param['store_seo_key1'])){$store->store_seo_key1 = $param['store_seo_key1'];}
            if(isset($param['store_seo_key2'])){$store->store_seo_key2 = $param['store_seo_key2'];}
            if(isset($param['store_seo_key3'])){$store->store_seo_key3 = $param['store_seo_key3'];}
            if(isset($param['twitter_access_token'])){$store->twitter_access_token = $param['twitter_access_token'];}
            if(isset($param['twitter_access_token_secret'])){$store->twitter_access_token_secret = $param['twitter_access_token_secret'];}
            if(isset($param['facebook_id'])){$store->facebook_id = $param['facebook_id'];}
            if(isset($param['store_first_open_date'])){$store->store_first_open_date = $param['store_first_open_date'];}

            $store->save();
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
        if(!empty($params['brand_id'])){
            $conditions[] = array('brand_id', $params['brand_id']);
        }
        if(!empty($params['brand_ids'])){
            $conditions[] = array('brand_id','IN', $params['brand_ids']);
        }
        if(!empty($params['store_code'])){
            $conditions[] = array('store_code', $params['store_code']);
        }
        if(!empty($params['store_name'])){
            $tmp = $params['store_name'];
            $conditions[] = array('store_name', 'like', "%$tmp%");
        }
        if($params['store_status'] != "" || !empty($params['store_status'])){
            $conditions[] = array('store_status', $params['store_status']);
        }
        return $conditions;
    }

    public static function buildConditions($brand_id, $store_status, $store_id, $store_name, $store_address, $phone_number)
    {
        $conds = array();
        if(!empty($brand_id)){
            $conds[] = array('brand_id', $brand_id);
        }

        if(!empty($store_status) || $store_status === '0'){
            $conds[] = array('store_status', $store_status);
        }

        if(!empty($store_id)){
            $conds[] = array('id', $store_id);
        }

        if(!empty($store_name)){
            $conds[] = array('store_name', 'like', "%$store_name%");
        }


        if(!empty($store_address)){
            $conds[] = array('store_address', 'like', "%$store_address%");
        }

        if(!empty($phone_number)){
            $conds[] = array('store_phone_no', $phone_number);
        }


        return $conds;
    }

    public static function getId($brand_id, $store_code)
    {
        if (empty($brand_id)) {
            return 0;
        }
        if (empty($store_code)) {
            return 0;
        }
        echo "getId($brand_id, $store_code)";

        $store = static::findByBrandIdAndStoreCode($brand_id, $store_code);
        if (empty($store)) {
            return 0;
        }

        return $store->id;
    }

	public static function getAreaListQuery($brand_id = null)
    {
		$query =
		\DB::select(
			's.brand_id',
			array('s.store_area_L_id', 'area_L_id'),
			array('a1.area_name', 'area_L_name'),
			array( 's.store_area_L_sort_index', 'area_L_sort'),
			array('s.store_area_M_id', 'area_M_id') ,
			array('a2.area_name', 'area_M_name'),
			array('s.store_area_M_sort_index', 'area_M_sort'),
			array('s.store_area_S_id', 'area_S_id'),
			array('a3.area_name', 'area_S_name'),
			array('s.store_area_S_sort_index', 'area_S_sort'))
		->distinct()
		->from(array('stores', 's'))
		->join(array('areas','a1'), 'LEFT')
		->on('s.store_area_L_id', '=', 'a1.id')
		->on('a1.area_type', '=', DB::expr(1))
		->join(array('areas','a2'), 'LEFT')
		->on('s.store_area_M_id', '=', 'a2.id')
		->on('a2.area_type', '=', DB::expr(2))
		->join(array('areas','a3'), 'LEFT')
		->on('s.store_area_S_id', '=', 'a3.id')
		->on('a3.area_type', '=', DB::expr(3));
		if ($brand_id !== null)
		{
			$query->where('s.brand_id', '=', $brand_id);
		}
		$subquery = $query->compile();
		return $subquery;
	}

    /**
     * 店舗用項目設定（初期値型）
     * @param $params
     * @return array
     */
    private static function setStoreParams($params){
        $set_default = array();

        $set_default['brand_id'] = isset($params['brand_id']) ? $params['brand_id'] : "";
        $set_default['section_id'] = isset($params['section_id'])&&$params['section_id']!="" ? $params['section_id'] : 0;
        $set_default['store_code'] = isset($params['store_code']) ? $params['store_code'] : "";
        $set_default['store_name'] = isset($params['store_name']) ? $params['store_name'] : "";
        $set_default['store_status'] = isset($params['store_status']) ? $params['store_status'] : 2;
        $set_default['store_postal_code'] = isset($params['store_postal_code']) ? $params['store_postal_code'] : "";
        $set_default['store_prefectures'] = isset($params['store_prefectures']) ? $params['store_prefectures'] : 0;
        $set_default['store_address'] = isset($params['store_address']) ? $params['store_address'] : "";
        $set_default['store_building'] = isset($params['store_building']) ? $params['store_building'] : null;
        $set_default['store_access'] = isset($params['store_access']) ? $params['store_access'] : "";
        $set_default['store_location'] = isset($params['store_location']) ? $params['store_location'] : "";
        $set_default['store_phone_no'] = isset($params['store_phone_no']) ? $params['store_phone_no'] : "";
        $set_default['store_fax_no'] = isset($params['store_fax_no']) ? $params['store_fax_no'] : "";
        $set_default['store_manager_name'] = isset($params['store_manager_name']) ? $params['store_manager_name'] : "";
        $set_default['store_business_hours'] = isset($params['store_business_hours']) ? $params['store_business_hours'] : "";
        $set_default['store_business_hours_from'] = isset($params['store_business_hours_from']) ? $params['store_business_hours_from'] : "";
        $set_default['store_business_hours_to'] = isset($params['store_business_hours_to']) ? $params['store_business_hours_to'] : "";
        $set_default['store_regular_holiday'] = isset($params['store_regular_holiday']) ? $params['store_regular_holiday'] : "";
        $set_default['store_parking_lot'] = isset($params['store_parking_lot']) ? $params['store_parking_lot'] : "";
        $set_default['store_seat'] = isset($params['store_seat']) ? $params['store_seat'] : "";
        $set_default['store_kids_room'] = isset($params['store_kids_room']) ? $params['store_kids_room'] : "";
        $set_default['store_signature_block'] = isset($params['store_signature_block']) ? $params['store_signature_block'] : null;
        $set_default['store_terms_of_use'] = isset($params['store_terms_of_use']) ? $params['store_terms_of_use'] : null;
        $set_default['store_privacy_policy'] = isset($params['store_privacy_policy']) ? $params['store_privacy_policy'] : null;
        $set_default['store_freeword'] = isset($params['store_freeword']) ? $params['store_freeword'] : null;
        $set_default['store_header_picture_id'] = isset($params['store_header_picture_id'])&&$params['store_header_picture_id']!="" ? $params['store_header_picture_id'] : 0;
        $set_default['store_area_L_id'] = isset($params['store_area_L_id']) ? $params['store_area_L_id'] : 0;
        $set_default['store_area_M_id'] = isset($params['store_area_M_id']) ? $params['store_area_M_id'] : 0;
        $set_default['store_area_S_id'] = isset($params['store_area_S_id']) ? $params['store_area_S_id'] : 0;
        $set_default['store_area_L_sort_index'] = isset($params['store_area_L_sort_index']) ? $params['store_area_L_sort_index'] : 0;
        $set_default['store_area_M_sort_index'] = isset($params['store_area_M_sort_index']) ? $params['store_area_M_sort_index'] : 0;
        $set_default['store_area_S_sort_index'] = isset($params['store_area_S_sort_index']) ? $params['store_area_S_sort_index'] : 0;
        $set_default['store_sort_index'] = isset($params['store_sort_index']) ? $params['store_sort_index'] : 0;
        $set_default['store_seo_key1'] = isset($params['store_seo_key1']) ? $params['store_seo_key1'] : null;
        $set_default['store_seo_key2'] = isset($params['store_seo_key2']) ? $params['store_seo_key2'] : null;
        $set_default['store_seo_key3'] = isset($params['store_seo_key3']) ? $params['store_seo_key3'] : null;
        $set_default['twitter_access_token'] = isset($params['twitter_access_token']) ? $params['twitter_access_token'] : null;
        $set_default['twitter_access_token_secret'] = isset($params['twitter_access_token_secret']) ? $params['twitter_access_token_secret'] : null;
        $set_default['facebook_id'] = isset($params['facebook_id']) ? $params['facebook_id'] : null;
        $set_default['store_first_open_date'] = isset($params['store_first_open_date']) ? $params['store_first_open_date'] : null;

        return $set_default;
    }

    public static function getStoresByParams($user, $params)
    {
        $user->authority($params);

        $conditions = array();
        $relates = array();

        if (!is_null($params['company_id']) && $params['company_id'] !== '' && $params['company_id'] != 0) {
            $relates['brand']['where'][] = array('company_id', $params['company_id']);
        }
        if (!is_null($params['brand_id']) && $params['brand_id'] !== '' && $params['brand_id'] != 0) {
            $conditions[] = array('brand_id', $params['brand_id']);
        }
        if (!is_null($params['store_code']) && $params['store_code'] !== '') {
            $conditions[] = array('store_code', $params['store_code']);
        }
        if (!is_null($params['store_name']) && $params['store_name'] !== '') {
            $conditions[] = array('store_name', 'LIKE', "%{$params['store_name']}%");
        }
        if (!is_null($params['store_status']) && $params['store_status'] !== '') {
            $conditions[] = array('store_status', $params['store_status']);
        }
        return self::find('all', array(
            'where' => $conditions,
            'related' => $relates,
        ));
    }
}
