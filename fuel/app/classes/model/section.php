<?php

class Model_Section extends \Model_Standard_Model
{
    protected static $_primary_key = array('id');
    protected static $_properties = array(
        'id',
        'company_id' => array(
            'expose_pattern' => 2,
        ),
        'brand_id' => array(
            'expose_pattern' => 2,
        ),
        'section_name' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    32,
                ),
            ),
            'expose_pattern' => 1,
        ),
        'section_status' => array(
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
            'expose_pattern' => 2,
        ),
        'store_postal_code' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    8,
                ),
            ),
            'expose_pattern' => 2,
        ),
        'store_prefectures' => array(
            'data_type' => 'int',
            'null' => true,
            'validation' => array(
                'numeric_between' => array(
                    1,
                    2147483647,
                ),
            ),
            'expose_pattern' => 2,
        ),
        'store_address' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    64,
                ),
            ),
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
            'expose_pattern' => 2,
        ),
        'section_phone_no' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    16,
                ),
            ),
            'expose_pattern' => 2,
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
    );

    protected static $_has_many = array(
        'stores' => array(
            'key_from' => 'id',
            'model_to' => 'Model_Store',
            'key_to' => 'section_id',
            'cascade_save' => false,
            'cascade_delete' => false,
        )
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

    /**
     * 事業部登録
     * @param $param
     */
    public static function insertSection($param)
    {
        $section = static::forge(array(
            'company_id' => $param['company_id']
            ,'brand_id' => $param['brand_id']
            ,'section_name' => $param['section_name']
            ,'section_status' => $param['section_status']
            ,'store_postal_code' => $param['store_postal_code']
            ,'store_address' => $param['store_address']
            ,'store_prefectures' => $param['store_prefectures']
            ,'store_building' => $param['store_building']
            ,'section_phone_no' => $param['section_phone_no']
        ));
        $section->save();

        $section->updateSectionForStores($param['store_ids']);

        \Additional_Log::debug('【SECTION CREATE API】:'.$section->id);
    }

    /**
     * 事業部更新
     * @param $param
     * @throws ProtocolException
     */
    public static function updateSection($param)
    {
        $section = self::findById($param['id']);

        if(!empty($section)){
            $section->company_id = $param['company_id'];
            $section->brand_id = $param['brand_id'];
            $section->section_name = $param['section_name'];
            $section->section_status = $param['section_status'];
            $section->store_postal_code = $param['store_postal_code'];
            $section->store_address = $param['store_address'];
            $section->store_prefectures = $param['store_prefectures'];
            $section->store_building = $param['store_building'];
            $section->section_phone_no = $param['section_phone_no'];
            $section->save();

            \Additional_Log::debug('【SECTION UPDATE API】:'.$section->id);

            $section->updateSectionForStores($param['store_ids']);
        }else{
            throw new \ProtocolException(\Lang::get('section_is_not_registration'), "Information is not exist.", \ProtocolException::RESULT_CODE_SECTION_NOT_FOUND);
        }
    }

    public static function getStoreNames($stores)
    {
        $store_names = array();
        foreach ($stores as $store) {
            $store_names[] = $store->store_name;
        }

        return $store_names;
    }
    public function updateSectionForStores($storeIds)
    {
        //店舗TBLへ事業部IDを保存
        if (empty($storeIds)) return;
        $stores = \Model_Store::find('all', array('where' => array(array('id', 'IN', $storeIds))));
        foreach($stores as $store){
            $store->section_id = $this->id;
            $store->save();
        }
        $removed_stores = \Model_Store::find('all', array('where' => array(array('section_id', $this->id), array('id', 'NOT IN', $storeIds))));
        foreach($removed_stores as $store){
            $store->section_id = 0;
            $store->save();
        }

        \Additional_Log::debug('【UPDATE SECTION TO STORES sectionID】:'.$this->id);
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
        if(!empty($params['brand_id'])){
            $conditions[] = array('brand_id', $params['brand_id']);
        }
        if(!empty($params['section_name'])){
            $tmp = $params['section_name'];
            $conditions[] = array('section_name', 'like', "%$tmp%");
        }

        return $conditions;
    }
}
