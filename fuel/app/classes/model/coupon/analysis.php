<?php

class Model_Coupon_Analysis extends \Model_Standard_Model
{
    protected static $_table_name = "coupon_analysis";
    protected static $_primary_key = array('date', 'store_id', 'coupon_id', 'distribute_type');
    protected static $_properties = array(
        'date' => array(
            'data_type' => 'string',
            'label' => '対象日',
            'expose_pattern' => 1,
        ),
        'store_id' => array(
            'label' => '店舗ID',
            'expose_pattern' => 1,
        ),
        'coupon_id' => array(
            'label' => 'クーポンID',
            'expose_pattern' => 1,
        ),
        'distribute_type' => array(
            'data_type' => 'tinyint',
            'label' => '配布タイプ',
            'expose_pattern' => 1,
        ),
        'display_coupon_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'is_numeric',
            ),
            'label' => 'クーポン表示数',
            'expose_pattern' => 1,
        ),
        'used_coupon_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'is_numeric',
            ),
            'label' => 'クーポン利用数',
            'expose_pattern' => 1,
        ),
        'unique_user_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'is_numeric',
            ),
            'label' => 'ユニークユーザ数',
            'expose_pattern' => 1,
        ),
        'display_two_step_coupon_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'is_numeric',
            ),
            'label' => '2段階クーポン表示数',
            'expose_pattern' => 1,
        ),
        'used_two_step_coupon_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'is_numeric',
            ),
            'label' => '2段階クーポン利用数',
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
        'coupon' => array(
            'model_to' => 'Model_Coupon',
            'key_from' => 'coupon_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );

    /**
     * キー情報からレコードを取得
     * @param $date
     * @param $store_id
     * @param $coupon_id
     * @param $distribute_type
     * @return \Orm\Model|\Orm\Model[]
     */
    public static function findById($date, $store_id, $coupon_id, $distribute_type)
    {
        $target = date('Y-m-d', strtotime($date));

        return static::find('first', array(
            'where' => array(
                'date' => $target,
                'store_id' => $store_id,
                'coupon_id' => $coupon_id,
                'distribute_type' => $distribute_type,
            ),
        ));
    }

    /**
     * クーポン利用集計情報登録
     * @param $param
     */
    public static function insertCouponAnalysis($param)
    {
        $couponAnalysis = static::forge(array(
            'date' => $param['date']
            ,'store_id' => $param['store_id']
            ,'coupon_id' => $param['coupon_id']
            ,'distribute_type' => $param['distribute_type']
            ,'display_coupon_count' => $param['display_coupon_count']
            ,'used_coupon_count' => $param['used_coupon_count']
            ,'display_two_step_coupon_count' => $param['display_two_step_coupon_count']
            ,'used_two_step_coupon_count' => $param['used_two_step_coupon_count']
            ,'unique_user_count' => $param['unique_user_count']
        ));
        $couponAnalysis->save();
    }

    /**
     * クーポン利用集計情報更新
     * @param $original_coupon_analysis
     * @param $new_coupon_analysis
     */
    public static function updateCouponAnalysis($original_coupon_analysis, $new_coupon_analysis)
    {
        if(!empty($original_coupon_analysis)){
//            $original_coupon_analysis->date = $new_coupon_analysis["date"];
//            $original_coupon_analysis->store_id = $new_coupon_analysis["store_id"];
//            $original_coupon_analysis->coupon_id = $new_coupon_analysis["coupon_id"];
//            $original_coupon_analysis->distribute_type = $new_coupon_analysis["distribute_type"];
            $original_coupon_analysis->display_coupon_count = $new_coupon_analysis["display_coupon_count"];
            $original_coupon_analysis->used_coupon_count = $new_coupon_analysis["used_coupon_count"];
            $original_coupon_analysis->display_two_step_coupon_count = $new_coupon_analysis["display_two_step_coupon_count"];
            $original_coupon_analysis->used_two_step_coupon_count = $new_coupon_analysis["used_two_step_coupon_count"];
            $original_coupon_analysis->unique_user_count = $new_coupon_analysis["unique_user_count"];

            $original_coupon_analysis->save();
        }else{
            \Additional_Log::debug('【COUPON ANALYSIS BATCH】-- NO COUPON ANALYSIS INFO. SKIP THE PROCESS.');
        }
    }

}
