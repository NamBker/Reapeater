<?php

class Model_Delivery extends \Model_Standard_Model
{
    protected static $_primary_key = array('id');
    protected static $_properties = array(
        'id' => array(
            'expose_pattern' => 1
        ),
        'company_id' => array(
            'expose_pattern' => 2,
        ),
        'brand_id' => array(
            'expose_pattern' => 2,
        ),
        'store_id' => array(
            'expose_pattern' => 2,
        ),
        'delivery_status' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'default' => 0,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    4,
                ),
            ),
            'label' => '配信状況',
            'expose_pattern' => 2,
        ),
        'delivery_type' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    1,
                    5,
                ),
            ),
            'label' => '配信タイプ',
            'expose_pattern' => 2,
        ),
        'delivery_category_id' => array(
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
        'delivery_sender_name' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    32,
                ),
            ),
            'label' => '送信者名',
            'expose_pattern' => 3,
        ),
        'delivery_sender_address' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    32,
                ),
            ),
            'label' => '送信者アドレス',
            'expose_pattern' => 3,
        ),
        'delivery_title' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    32,
                ),
            ),
            'label' => 'タイトル',
            'expose_pattern' => 1,
        ),
        'delivery_html_body' => array(
            'data_type' => 'longtext',
            'null' => false,
            'validation' => array(
                'required',
            ),
            'label' => '本文(HTML)',
            'expose_pattern' => 3,
        ),
        'delivery_text_body' => array(
            'data_type' => 'longtext',
            'null' => false,
            'validation' => array(
                'required',
            ),
            'label' => '本文(テキスト)',
            'expose_pattern' => 3,
        ),
        'delivery_schedule' => array(
            'data_type' => 'datetime',
            'null' => false,
            'label' => '配信予定時刻',
            'expose_pattern' => 1,
        ),
        'delivery_area' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'max_length' => array(
                    32,
                ),
            ),
            'label' => '配信エリア',
            'expose_pattern' => 3,
        ),
        'delivery_period_start' => array(
            'data_type' => 'datetime',
            'null' => true,
            'label' => '配信期間開始日時',
            'expose_pattern' => 3,
        ),
        'delivery_period_end' => array(
            'data_type' => 'datetime',
            'null' => true,
            'label' => '配信期間終了日時',
            'expose_pattern' => 3,
        ),
        'delivery_device' => array(
            'data_type' => 'tinyint',
            'null' => true,
            'default' => 0,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    1,
                    3,
                ),
            ),
            'label' => '配信対象',
            'expose_pattern' => 3,
        ),
        'delivery_segment' => array(
            'data_type' => 'text',
            'null' => false,
            'validation' => array(
                'required',
            ),
            'label' => '配信セグメント',
            'expose_pattern' => 3,
        ),
        'repica_deliver_id' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    16,
                ),
            ),
            'label' => 'レピカ配信ID',
            'expose_pattern' => 3,
        ),
        'repica_deliver_status' => array(
            'data_type' => 'tinyint',
            'null' => true,
            'default' => 0,
            'label' => 'レピカ配信チェック日時',
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
        'store' => array(
            'model_to' => 'Model_Store',
            'key_from' => 'store_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        )
    );

    protected static $_many_many = array(
        'delivery_stores' => array(
            'table_through' => 'deliveries_stores',
            'key_from' => 'id',
            'key_through_from' => 'delivery_id',
            'key_through_to' => 'store_id',
            'key_to' => 'id',
            'model_to' => 'Model_Store',
            'cascade_save' => false,
            'cascase_delete' => false,
        ),
        'delivery_coupons' => array(
            'table_through' => 'delivery_relates',
            'key_from' => 'id',
            'key_through_from' => 'delivery_id',
            'key_through_to' => 'coupon_id',
            'key_to' => 'id',
            'model_to' => 'Model_Coupon',
            'cascade_save' => false,
            'cascase_delete' => false,
        ),
        'delivery_questionnaires' => array(
            'table_through' => 'delivery_relates',
            'key_from' => 'id',
            'key_through_from' => 'delivery_id',
            'key_through_to' => 'questionnaire_id',
            'key_to' => 'id',
            'model_to' => 'Model_Questionnaire',
            'cascade_save' => false,
            'cascase_delete' => false,
        ),
        'delivery_random_coupons' => array(
            'table_through' => 'delivery_relates',
            'key_from' => 'id',
            'key_through_from' => 'delivery_id',
            'key_through_to' => 'random_coupon_id',
            'key_to' => 'id',
            'model_to' => 'Model_Random_Coupon',
            'cascade_save' => false,
            'cascase_delete' => false,
        ),
    );

    protected static $_has_many = array(
        'delivery_failure_histories' => array(
            'model_to' => 'Model_Member_Delivery_History',
            'key_from' => 'id',
            'key_to' => 'delivery_id',
            'cascade_save' => true,
            'cascade_delete' => false,
            'conditions' => array(
                'where' => array(array('site_reference', SITE_REFERENCE_DELIVERY_FAILURE))
            )
        ),
        'unreferenced_histories' => array(
            'model_to' => 'Model_Member_Delivery_History',
            'key_from' => 'id',
            'key_to' => 'delivery_id',
            'cascade_save' => true,
            'cascade_delete' => false,
            'conditions' => array(
                'where' => array(array('site_reference', SITE_REFERENCE_UNREFERENCED))
            )
        ),
        'referenced_histories' => array(
            'model_to' => 'Model_Member_Delivery_History',
            'key_from' => 'id',
            'key_to' => 'delivery_id',
            'cascade_save' => true,
            'cascade_delete' => false,
            'conditions' => array(
                'where' => array(array('site_reference', SITE_REFERENCE_REFERENCED))
            )
        ),
    );

    protected static $_to_array_exclude = array(
        'created_at', 'updated_at', 'company', 'brand', 'store', 'delivery_stores', 'delivery_coupons', 'delivery_questionnaires', 'delivery_random_coupons',
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
     * 配信情報更新処理
     * @param $param
     * @throws ProtocolException
     */
    public static function updateDelivery($param){
        $delivery = self::findById($param['id']);

        if(!empty($delivery)){
            $delivery->delivery_status = $param['delivery_status'];
            $delivery->delivery_type = $param['delivery_type'];
            $delivery->delivery_category_id = $param['delivery_category_id'];
            $delivery->delivery_title = $param['delivery_title'];
            $delivery->delivery_html_body = $param['delivery_html_body'];
            $delivery->delivery_text_body = $param['delivery_text_body'];
            $delivery->delivery_schedule = $param['delivery_schedule'];
            $delivery->delivery_area = $param['delivery_area'];
            $delivery->delivery_period_start = $param['delivery_period_start'];
            $delivery->delivery_period_end = $param['delivery_period_end'];
            $delivery->delivery_device = $param['delivery_device'];
            $delivery->delivery_segment = $param['delivery_segment'];
            $delivery->save();
        }else{
            throw new \ProtocolException(\Lang::get('delivery_information_not_exist'), "Delivery information is not exist.", \ProtocolException::RESULT_CODE_DELIVERY_NOT_FOUND);
        }
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

    /**
     * 配信処理未実行の最も古いレコードを返却
     * @return \Orm\Model|\Orm\Model[]
     * @throws ProtocolException
     */
    public static function getUnExecutedRecord()
    {
        $conditions[] = array('delivery_status', DELIVERY_STATUS_UNDELIVERED);
        $conditions[] = array('delivery_schedule', '<=', \DB::expr('now()'));

        return static::find('first', array(
            'where' => array(
                $conditions
            ),
            'order_by' => array(
                'created_at' => 'asc'
            )
        ));
    }

    /**
     * レピカ配信チェック対象レコード取得
     * @param $interval
     * @return \Orm\Model|\Orm\Model[]
     * @throws ProtocolException
     */
    public static function getUnCheckedRecord($interval)
    {
        $conditions[] = array('delivery_status', DELIVERY_STATUS_DELIVERED);
        $conditions[] = array('repica_deliver_status', DELIVERY_REPICA_STATUS_UNCHECKED);
        $conditions[] = array('delivery_schedule', '<=', \DB::expr('now()-INTERVAL '.$interval.' DAY'));
        \Additional_Log::debug('【SEND MAIL RESULT BATCH】:GET TARGET RECORD['.$interval.' DAYS BEFORE]');

        return static::find('first', array(
            'where' => array(
                $conditions
            ),
            'order_by' => array(
                'delivery_schedule' => 'asc'
            )
        ));
    }

    /**
     * 配信処理状況更新
     * @param $id
     * @param $status
     * @throws Exception
     */
    public static function updateStatus($id, $status)
    {
        $delivery = self::findById($id);

        if(!empty($delivery)){
            $delivery->delivery_status = $status;
            $delivery->save();
        }else{
            \Additional_Log::error('【SEND MAIL BATCH】DELIVERY ID NOT FOUND.['.$id.']');
        }
    }

    /**
     * レピカ用項目更新
     * @param $id
     * @param null $repica_deliver_id
     * @param null $repica_deliver_status
     * @throws Exception
     */
    public static function updateRepicaInfo($id, $repica_deliver_id = null, $repica_deliver_status = null)
    {
        $delivery = self::findById($id);
        if(!empty($delivery) && (!empty($repica_deliver_id) || !empty($repica_deliver_status))){
            if(!empty($repica_deliver_id)){
                $delivery->repica_deliver_id = $repica_deliver_id;
            }
            if(!empty($repica_deliver_status)){
                $delivery->repica_deliver_status = $repica_deliver_status;
            }
            $delivery->save();
        }else{
            \Additional_Log::error('【SEND MAIL BATCH】DELIVERY ID NOT FOUND.['.$id.']');
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
        if(!empty($params['brand_id'])){
            $conditions[] = array('brand_id', $params['brand_id']);
        }
        if(!empty($params['store_id'])){
            $conditions[] = array('store_id', $params['store_id']);
        }
        if(!empty($params['delivery_status'])){
            $conditions[] = array('delivery_status', $params['delivery_status']);
        }
        if(!empty($params['delivery_type'])){
            $conditions[] = array('delivery_type', $params['delivery_type']);
        }
        if(!empty($params['delivery_category_id'])){
            $conditions[] = array('delivery_category_id', $params['delivery_category_id']);
        }
        if(!empty($params['delivery_title'])){
            $tmp = $params['delivery_title'];
            $conditions[] = array('delivery_title', 'like', "%$tmp%");
        }
        if(!empty($params['delivery_html_body'])){
            $tmp = $params['delivery_html_body'];
            $conditions[] = array('delivery_html_body', 'like', "%$tmp%");
        }
        if(!empty($params['delivery_text_body'])){
            $tmp = $params['delivery_text_body'];
            $conditions[] = array('delivery_text_body', 'like', "%$tmp%");
        }
        if(!empty($params['delivery_schedule'])){
            $conditions[] = array('delivery_schedule', '>=', $params['delivery_schedule']);
            $conditions[] = array('delivery_schedule', '<=', $params['delivery_schedule']);
        }
        if(!empty($params['delivery_area'])){
            $tmp = $params['delivery_area'];
            $conditions[] = array('delivery_area', 'like', "%$tmp%");
        }
        if(!empty($params['delivery_period_start'])){
            $conditions[] = array('delivery_period_start', '>=', $params['delivery_period_start']);
        }
        if(!empty($params['delivery_period_end'])){
            $conditions[] = array('delivery_period_end', '<=', $params['delivery_period_end']);
        }
        if(!empty($params['delivery_device'])){
            $conditions[] = array('delivery_device', $params['delivery_device']);
        }

        return $conditions;
    }
}
