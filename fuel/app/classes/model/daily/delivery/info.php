<?php

class Model_Daily_Delivery_Info extends \Model_Standard_Model
{
    protected static $_table_name = "daily_delivery_info";
    protected static $_primary_key = array('delivery_date', 'delivery_id', 'company_id', 'brand_id', 'store_id');
    protected static $_properties = array(
        'delivery_date' => array(
            'data_type' => 'string',
            'null' => false,
            'default' => '0000-00-00',
            'validation' => array(
                'required',
            ),
            'label' => '配信日',
            'expose_pattern' => 1,
        ),
        'delivery_id' => array(
            'label' => '配信ID',
            'expose_pattern' => 1,
        ),
        'company_id' => array(
            'label' => '企業ID',
            'expose_pattern' => 1,
        ),
        'brand_id' => array(
            'label' => 'ブランドID',
            'expose_pattern' => 1,
        ),
        'store_id' => array(
            'label' => '店舗ID',
            'expose_pattern' => 1,
        ),
        'delivery_total' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
            ),
            'label' => '配信数',
            'expose_pattern' => 1,
        ),
        'reach_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
            ),
            'label' => '到達数',
            'expose_pattern' => 1,
        ),
        'open_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
            ),
            'label' => '開封数',
            'expose_pattern' => 1,
        ),
        'visit_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
            ),
            'label' => '来店数',
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
        'delivery' => array(
            'model_to' => 'Model_Delivery',
            'key_from' => 'delivery_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );

    /**
     * キー情報からレコードを取得
     * @param $delivery_date
     * @param $delivery_id
     * @param $company_id
     * @param $brand_id
     * @param $store_id
     * @return \Orm\Model|\Orm\Model[]
     */
    public static function findById($delivery_date, $delivery_id, $company_id, $brand_id, $store_id)
    {
        $target = date('Y-m-d', strtotime($delivery_date));

        return static::find('first', array(
            'where' => array(
                'delivery_date' => $target,
                'company_id' => $company_id,
                'delivery_id' => $delivery_id,
                'brand_id' => $brand_id,
                'store_id' => $store_id
            ),
        ));
    }

    /**
     * 日次配信情報登録
     * @param $param
     */
    public static function insertDailyDelivery($param)
    {
        $dailyDeliveryInfo = static::forge(array(
            'delivery_date' => $param['delivery_date']
            ,'delivery_id' => $param['delivery_id']
            ,'company_id' => $param['company_id']
            ,'brand_id' => $param['brand_id']
            ,'store_id' => $param['store_id']
            ,'delivery_total' => $param['delivery_total']
            ,'reach_count' => $param['reach_count']
            ,'open_count' => $param['open_count']
            ,'visit_count' => $param['visit_count']
        ));
        $dailyDeliveryInfo->save();
    }

    /**
     * 日次配信情報更新
     * @param $original_daily_delivery_info
     * @param $new_daily_delivery_info
     */
    public static function updateDailyDelivery($original_daily_delivery_info, $new_daily_delivery_info)
    {


        if(!empty($original_daily_delivery_info)){
            $original_daily_delivery_info->delivery_total = $new_daily_delivery_info["delivery_total"];
            $original_daily_delivery_info->reach_count = $new_daily_delivery_info["reach_count"];
            $original_daily_delivery_info->open_count = $new_daily_delivery_info["open_count"];
            $original_daily_delivery_info->visit_count = $new_daily_delivery_info["visit_count"];

            $original_daily_delivery_info->save();
        }else{
            \Additional_Log::debug('【DAILY DELIVERY INFORMATION BATCH】-- NO DAILY DELIVERY INFO. SKIP THE PROCESS.');
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
        if(!empty($params['month'])){
            $conditions[] = array('delivery_date', 'LIKE', $params['month'] . '%');
        }
        return $conditions;
    }

}
