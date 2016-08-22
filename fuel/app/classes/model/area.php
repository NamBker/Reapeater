<?php

class Model_Area extends \Model_Standard_Model
{
	const AREA_TYPE_L = 1;
	const AREA_TYPE_M = 2;
	const AREA_TYPE_S = 3;

    protected static $_properties = array(
        'id',
        'company_id' => array(
            'data_type' => 'int',
            'null' => false,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    4294967295,
                ),
            ),
            'expose_pattern' => 2,
        ),
        'brand_id' => array(
            'data_type' => 'int',
            'null' => false,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    4294967295,
                ),
            ),
            'expose_pattern' => 2,
        ),
        'area_type' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    1,
                    3,
                ),
            ),
            'expose_pattern' => 1,
        ),
        'area_name' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    16,
                ),
            ),
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
     * エリア情報登録
     * @param $param
     * @return mixed
     * @throws Exception
     */
    public static function insertArea($param)
    {
        // 存在チェック
        self::checkName($param);

        $area = static::forge(array(
            'company_id' => $param['company_id']
            ,'brand_id' => $param['brand_id']
            ,'area_type' => $param['area_type']
            ,'area_name' => $param['area_name']
        ));
        $area->save();

        \Additional_Log::debug('【AREA CREATE API】:'.$area->id);

        return $area->id;
    }

    /**
     * エリア情報更新
     * @param $param
     * @throws ProtocolException
     */
    public static function updateArea($param)
    {
        $area = self::findById($param['id']);

        if(!empty($area)){
            $area->area_name = $param['area_name'];
            $area->save();
        }else{
            throw new \ProtocolException(\Lang::get('area_is_not_registration'), "Area is not exist.", \ProtocolException::RESULT_CODE_AREA_NOT_FOUND);
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
        if(!empty($params['company_id'])){
            $conditions[] = array('company_id', $params['company_id']);
        }
        if(!empty($params['brand_id'])){
            $conditions[] = array('brand_id', $params['brand_id']);
        }
        if(!empty($params['area_type'])){
            $conditions[] = array('area_type', $params['area_type']);
        }
        if(!empty($params['area_name'])){
            $tmp = $params['area_name'];
            $conditions[] = array('area_name', 'like', "%$tmp%");
        }

        return $conditions;
    }

    /**
     * 存在チェック
     * @param $param
     * @throws ProtocolException
     */
    private static function checkName($param){
        $area = static::find('first', array(
            'where' => array(
                'company_id' => $param['company_id'],
                'brand_id' => $param['brand_id'],
                'area_type' => $param['area_type'],
                'area_name' => $param['area_name']
            ),
        ));

        // 存在チェック
        if($area){
            throw new \ProtocolException(\Lang::get('area_name_is_duplicate'), "Area name is already registered.", \ProtocolException::RESULT_CODE_AREA_IS_ALREADY_EXIST);
        }
    }
}
