<?php

class Model_Information extends \Model_Standard_Model
{
    protected static $_table_name = "information";
    protected static $_properties = array(
        'id',
        'company_id' => array(
            'data_type' => 'int',
            'expose_pattern' => 1,
        ),
        'brand_id' => array(
            'data_type' => 'int',
            'expose_pattern' => 1,
        ),
        'store_id' => array(
            'data_type' => 'int',
            'expose_pattern' => 1,
        ),
        'priority' => array(
            'data_type' => 'smallint',
            'null' => false,
            'default' => 0,
            'validation' => array(
                'required',
                'is_numeric'
            ),
            'label' => '優先度',
            'expose_pattern' => 2,
        ),
        'title' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    32,
                ),
            ),
            'label' => 'タイトル',
            'expose_pattern' => 2,
        ),
        'body' => array(
            'data_type' => 'text',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    65535,
                ),
            ),
            'label' => '本文',
            'expose_pattern' => 3,
        ),
        'picture_id' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'max_length' => array(
                    32,
                ),
            ),
            'label' => '画像ID',
            'default' => 0,
            'expose_pattern' => 3,
        ),
        'status' => array(
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
            'label' => '状態',
            'expose_pattern' => 2,
        ),
        'effective_period_from' => array(
            'data_type' => 'datetime',
            'null' => false,
            'label' => '表示開始日時',
            'expose_pattern' => 2,
        ),
        'effective_period_to' => array(
            'data_type' => 'datetime',
            'null' => false,
            'label' => '表示終了日時',
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
        'store' => array(
            'model_to' => 'Model_Store',
            'key_from' => 'store_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        )
    );

    protected static $_has_one = array(
        'picture' => array(
            'model_to' => 'Model_Picture',
            'key_from' => 'picture_id',
            'key_to' => 'id',
            'cascade_save' => true,
            'cascade_delete' => true,
        ),
        'publisher_company' => array(
            'model_to' => 'Model_Information_Publisher',
            'key_from' => 'id',
            'key_to' => 'information_id',
            'cascade_save' => true,
            'cascade_delete' => true,
            'conditions' => array(
                'where' => array(array('publisher_type', INFORMATION_PUBLISHER_TYPE_COMPANY))
            )
        )
    );

    protected static $_has_many = array(
        'publisher_brands' => array(
            'model_to' => 'Model_Information_Publisher',
            'key_from' => 'id',
            'key_to' => 'information_id',
            'cascade_save' => true,
            'cascade_delete' => true,
            'conditions' => array(
                'where' => array(array('publisher_type', INFORMATION_PUBLISHER_TYPE_BRAND))
            )
        ),
        'publisher_stores' => array(
            'model_to' => 'Model_Information_Publisher',
            'key_from' => 'id',
            'key_to' => 'information_id',
            'cascade_save' => true,
            'cascade_delete' => true,
            'conditions' => array(
                'where' => array(array('publisher_type', INFORMATION_PUBLISHER_TYPE_STORE))
            )
        ),
        'information_publisher' => array(
            'model_to' => 'Model_Information_Publisher',
            'key_from' => 'id',
            'key_to' => 'information_id',
            'cascade_save' => true,
            'cascade_delete' => true,
        )
    );

    protected static $_to_array_exclude = array(
        'company', 'brand', 'store', 'picture', 'publisher_company', 'publisher_brands', 'publisher_stores',
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
     * お知らせ登録
     * @param $param
     */
    public static function makeNewInformationFromParam($param, $user)
    {
        $information = static::forge(array(
            'company_id' => $user->company_id
            ,'brand_id' => $user->brand_id
            ,'store_id' => $user->store_id
            ,'title' => $param['title']
            ,'picture_id' => $param['picture_id']
            ,'body' => $param['body']
            ,'status' => $param['status']
            ,'effective_period_from' => $param['effective_period_from']
            ,'effective_period_to' => $param['effective_period_to']
        ));
        $information->setPublisherFromIds([$param['publisher_company_id']], INFORMATION_PUBLISHER_TYPE_COMPANY);
        $information->setPublisherFromIds($param['publisher_brand_ids'], INFORMATION_PUBLISHER_TYPE_BRAND);
        $information->setPublisherFromIds($param['publisher_store_ids'], INFORMATION_PUBLISHER_TYPE_STORE);

        return $information;
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
        if(!empty($params['type'])){
            $conditions[] = array('type', $params['type']);
        }
        if(!empty($params['priority'])){
            $conditions[] = array('priority', $params['priority']);
        }
        if(!empty($params['title'])){
            $tmp = $params['title'];
            $conditions[] = array('title', 'like', "%$tmp%");
        }
        if(!empty($params['body'])){
            $tmp = $params['body'];
            $conditions[] = array('body', 'like', "%$tmp%");
        }
        if(!empty($params['picture_id'])){
            $conditions[] = array('picture_id', $params['picture_id']);
        }
        if(isset($params['status']) && $params['status'] != ""){
            $conditions[] = array('status', $params['status']);
        }
        if(!empty($params['effective_period_from'])){
            $conditions[] = array('effective_period_from', '>=', $params['effective_period_from']);
        }
        if(!empty($params['effective_period_to'])){
            $conditions[] = array('effective_period_to', '<=', $params['effective_period_to']." 23:59:59");
        }

        return $conditions;
    }

    public function setPublisherFromIds($publisher_ids, $publisher_type)
    {
        if ($publisher_type == INFORMATION_PUBLISHER_TYPE_COMPANY) {
            if ($this->publisher_company) {
                if ($this->publisher_company->publisher_id == $publisher_ids[0]) {
                    return;
                }
                $this->pulisher_company->delete();
            }
            $this->publisher_company = \Model_Information_Publisher::forge(
                array(
                    'publisher_type' => $publisher_type,
                    'publisher_id' => $publisher_ids[0],
                )
            );
            return;
        }
        $cur_publisher_ids = array();
        foreach (($publisher_type == INFORMATION_PUBLISHER_TYPE_BRAND ? $this->publisher_brands : $this->publisher_stores) as $key => $publisher) {
            if (in_array($publisher->publisher_id, $publisher_ids)) {
                $cur_publisher_ids[] = $publisher->publisher_id;
            } else {
                $publisher->delete();
                switch ($publisher_type) {
                case INFORMATION_PUBLISHER_TYPE_BRAND:
                    unset($this->publisher_brands[$key]);
                    break;
                case INFORMATION_PUBLISHER_TYPE_STORE:
                    unset($this->publisher_stores[$key]);
                    break;
                }
            }
        }

        \Additional_Log::debug('cur publisher ids=>'.implode(",", $cur_publisher_ids));
        foreach (array_diff($publisher_ids, $cur_publisher_ids) as $new_publisher_id) {
            \Additional_Log::debug('add publisher_id=>'.$new_publisher_id);
            $new_publisher = \Model_Information_Publisher::forge(
                array(
                    'publisher_type' => $publisher_type,
                    'publisher_id' => $new_publisher_id,
                )
            );
            switch ($publisher_type) {
            case INFORMATION_PUBLISHER_TYPE_BRAND:
                $this->publisher_brands[] = $new_publisher;
                break;
            case INFORMATION_PUBLISHER_TYPE_STORE:
                $this->publisher_stores[] = $new_publisher;
                break;
            }
        }
    }

    public function getPublisherIds($publisher_type) {
        if ($publisher_type == INFORMATION_PUBLISHER_TYPE_COMPANY) {
            return $this->publisher_company ? [$this->publisher_company->publisher_id] : [];
        }
        $publishers = $publisher_type == INFORMATION_PUBLISHER_TYPE_BRAND ? $this->publisher_brands : $this->publisher_stores;
        return array_values(array_map(function($publisher) { return $publisher->publisher_id;}, $publishers));
    }

    public function isAccessibleUser($user) {
        switch ($user->authority) {
        case USER_AUTHORITY_ADMIN:
            return true;
        case USER_AUTHORITY_COMPANY:
            return $user->company_id == $this->company_id;
        case USER_AUTHORITY_BRAND:
            return $user->brand_id == $this->brand_id;
        case USER_AUTHORITY_SECTION:
            return $this->store && $user->section_id == $this->store->section_id;
        case USER_AUTHORITY_STORE:
            return $user->store_id == $this->store_id;
        }
    }

    public function getDelivery() {
        $res = "";
        if ($this->publisher_brands) {
            $first = reset($this->publisher_brands);
            $res = \Model_Brand::findById($first->publisher_id)->brand_name;

            $brand_count = count($this->publisher_brands);
            if (1 < $brand_count) {
                $res .= " 他".($brand_count - 1)."ブランド";
                return $res;
            }
        }

        if ($this->publisher_stores) {
            if (strlen($res) < 1) {
                $first = reset($this->publisher_stores);
                $res = \Model_Store::findById($first->publisher_id)->store_name;
            }
            $store_count = count($this->publisher_stores);
            if (1 < $store_count) {
                $res .= " 他".($store_count - 1)."店舗";
            }
        }
        return $res;
    }


    /**
     * キー検索
     * @param $limit 取得件数
     * @param $company_id
     * @param $brand_id
     * @param $store_id
     * @return \Orm\Model|\Orm\Model[]
     */
    public static function findByCompanyIdAndBrandId($company_id = 0, $brand_id = 0, $store_id = 0, $limit = 0)
    {
        $date = \Date::forge(time())->format("%Y-%m-%d %H:%M");

		$cond = array(
            'where' => array(
                array('company_id', $company_id),
                array('brand_id', $brand_id),
                array('store_id', $store_id),
                array('status', 1),
                array('effective_period_from', '<', $date),
                array('effective_period_to', '>', $date),
            ),
			'order_by' => array('effective_period_from' => 'desc'),
			'order_by' => array('priority' => 'desc'),
        );
		if ($limit > 0)
		{
			$cond['limit'] = $limit;
		}

        return static::find('all', $cond);
    }

    public function getDispDate() {
        return date("m.d", strtotime($this->effective_period_from));
    }

	public function getDispDateFull() {
        return date("Y/m/d H:i", strtotime($this->effective_period_from));
    }

    public function getDispNewMark() {
        return ((time() - (3 * 24 * 60 * 60)) < strtotime($this->effective_period_from)) ? "new_on" : "new_off";
    }
}
