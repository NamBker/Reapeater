<?php

class Model_Daily_Store_Information extends \Model_Standard_Model
{
    protected static $_table_name = "daily_store_information";
    protected static $_primary_key = array('date');
    protected static $_properties = array(
        'date' => array(
            'data_type' => 'string',
            'null' => false,
            'default' => '0000-00-00',
            'validation' => array(
                'required',
            ),
            'label' => '日付',
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
        'register_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '登録者数',
            'expose_pattern' => 1,
        ),
        'leaver_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '退会者数',
            'expose_pattern' => 1,
        ),
        'men_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '男性会員数',
            'expose_pattern' => 2,
        ),
        'women_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '女性会員数',
            'expose_pattern' => 2,
        ),
        '10s_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '10台会員数',
            'expose_pattern' => 2,
        ),
        '20s_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '20台会員数',
            'expose_pattern' => 2,
        ),
        '30s_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '30台会員数',
            'expose_pattern' => 2,
        ),
        '40s_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '40台会員数',
            'expose_pattern' => 2,
        ),
        '50s_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '50台会員数',
            'expose_pattern' => 2,
        ),
        '60s_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '60台会員数',
            'expose_pattern' => 2,
        ),
        '70s_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '70台会員数',
            'expose_pattern' => 2,
        ),
        '80s_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '80台会員数',
            'expose_pattern' => 2,
        ),
        '90s_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '90台会員数',
            'expose_pattern' => 2,
        ),
        'job1_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '職業1会員数',
            'expose_pattern' => 2,
        ),
        'job2_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '職業2会員数',
            'expose_pattern' => 2,
        ),
        'job3_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '職業3会員数',
            'expose_pattern' => 2,
        ),
        'job4_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '職業4会員数',
            'expose_pattern' => 2,
        ),
        'job5_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '職業5会員数',
            'expose_pattern' => 2,
        ),
        'job6_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '職業6会員数',
            'expose_pattern' => 2,
        ),
        'job7_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '職業7会員数',
            'expose_pattern' => 2,
        ),
        'job8_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '職業8会員数',
            'expose_pattern' => 2,
        ),
        'job9_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '職業9会員数',
            'expose_pattern' => 2,
        ),
        'job10_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '職業10会員数',
            'expose_pattern' => 2,
        ),
        'job11_count' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '職業11会員数',
            'expose_pattern' => 2,
        ),
        'prefecture01' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県01会員数',
            'expose_pattern' => 2,
        ),
        'prefecture02' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県02会員数',
            'expose_pattern' => 2,
        ),
        'prefecture03' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県03会員数',
            'expose_pattern' => 2,
        ),
        'prefecture04' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県04会員数',
            'expose_pattern' => 2,
        ),
        'prefecture05' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県05会員数',
            'expose_pattern' => 2,
        ),
        'prefecture06' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県06会員数',
            'expose_pattern' => 2,
        ),
        'prefecture07' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県07会員数',
            'expose_pattern' => 2,
        ),
        'prefecture08' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県08会員数',
            'expose_pattern' => 2,
        ),
        'prefecture09' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県09会員数',
            'expose_pattern' => 2,
        ),
        'prefecture10' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県10会員数',
            'expose_pattern' => 2,
        ),
        'prefecture11' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県11会員数',
            'expose_pattern' => 2,
        ),
        'prefecture12' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県12会員数',
            'expose_pattern' => 2,
        ),
        'prefecture13' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県13会員数',
            'expose_pattern' => 2,
        ),
        'prefecture14' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県14会員数',
            'expose_pattern' => 2,
        ),
        'prefecture15' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県15会員数',
            'expose_pattern' => 2,
        ),
        'prefecture16' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県16会員数',
            'expose_pattern' => 2,
        ),
        'prefecture17' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県17会員数',
            'expose_pattern' => 2,
        ),
        'prefecture18' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県18会員数',
            'expose_pattern' => 2,
        ),
        'prefecture19' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県19会員数',
            'expose_pattern' => 2,
        ),
        'prefecture20' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県20会員数',
            'expose_pattern' => 2,
        ),
        'prefecture21' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県21会員数',
            'expose_pattern' => 2,
        ),
        'prefecture22' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県22会員数',
            'expose_pattern' => 2,
        ),
        'prefecture23' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県23会員数',
            'expose_pattern' => 2,
        ),
        'prefecture24' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県24会員数',
            'expose_pattern' => 2,
        ),
        'prefecture25' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県25会員数',
            'expose_pattern' => 2,
        ),
        'prefecture26' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県26会員数',
            'expose_pattern' => 2,
        ),
        'prefecture27' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県27会員数',
            'expose_pattern' => 2,
        ),
        'prefecture28' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県28会員数',
            'expose_pattern' => 2,
        ),
        'prefecture29' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県29会員数',
            'expose_pattern' => 2,
        ),
        'prefecture30' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県30会員数',
            'expose_pattern' => 2,
        ),
        'prefecture31' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県31会員数',
            'expose_pattern' => 2,
        ),
        'prefecture32' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県32会員数',
            'expose_pattern' => 2,
        ),
        'prefecture33' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県33会員数',
            'expose_pattern' => 2,
        ),
        'prefecture34' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県34会員数',
            'expose_pattern' => 2,
        ),
        'prefecture35' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県35会員数',
            'expose_pattern' => 2,
        ),
        'prefecture36' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県36会員数',
            'expose_pattern' => 2,
        ),
        'prefecture37' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県37会員数',
            'expose_pattern' => 2,
        ),
        'prefecture38' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県38会員数',
            'expose_pattern' => 2,
        ),
        'prefecture39' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県39会員数',
            'expose_pattern' => 2,
        ),
        'prefecture40' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県40会員数',
            'expose_pattern' => 2,
        ),
        'prefecture41' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県41会員数',
            'expose_pattern' => 2,
        ),
        'prefecture42' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県42会員数',
            'expose_pattern' => 2,
        ),
        'prefecture43' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県43会員数',
            'expose_pattern' => 2,
        ),
        'prefecture44' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県44会員数',
            'expose_pattern' => 2,
        ),
        'prefecture45' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県45会員数',
            'expose_pattern' => 2,
        ),
        'prefecture46' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県46会員数',
            'expose_pattern' => 2,
        ),
        'prefecture47' => array(
            'data_type' => 'int',
            'default' => '0',
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2147483647,
                ),
            ),
            'label' => '都道府県47会員数',
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

    /**
     * 日次店舗情報登録
     * @param $param
     */
    public static function insertDailyStoreInfo($param)
    {
        $dailyStoreInfo = static::forge(array(
            'date' => $param['date']
            ,'company_id' => $param['company_id']
            ,'brand_id' => $param['brand_id']
            ,'store_id' => $param['store_id']
            ,'register_count' => $param['register_count']
            ,'leaver_count' => $param['leaver_count']
            ,'men_count' => $param['men_count']
            ,'women_count' => $param['women_count']
            ,'10s_count' => $param['10s_count']
            ,'20s_count' => $param['20s_count']
            ,'30s_count' => $param['30s_count']
            ,'40s_count' => $param['40s_count']
            ,'50s_count' => $param['50s_count']
            ,'60s_count' => $param['60s_count']
            ,'70s_count' => $param['70s_count']
            ,'80s_count' => $param['80s_count']
            ,'90s_count' => $param['90s_count']
            ,'job1_count' => $param['job1_count']
            ,'job2_count' => $param['job2_count']
            ,'job3_count' => $param['job3_count']
            ,'job4_count' => $param['job4_count']
            ,'job5_count' => $param['job5_count']
            ,'job6_count' => $param['job6_count']
            ,'job7_count' => $param['job7_count']
            ,'job8_count' => $param['job8_count']
            ,'job9_count' => $param['job9_count']
            ,'job10_count' => $param['job10_count']
            ,'job11_count' => $param['job11_count']
            ,'prefecture01' => $param['prefecture01']
            ,'prefecture02' => $param['prefecture02']
            ,'prefecture03' => $param['prefecture03']
            ,'prefecture04' => $param['prefecture04']
            ,'prefecture05' => $param['prefecture05']
            ,'prefecture06' => $param['prefecture06']
            ,'prefecture07' => $param['prefecture07']
            ,'prefecture08' => $param['prefecture08']
            ,'prefecture09' => $param['prefecture09']
            ,'prefecture10' => $param['prefecture10']
            ,'prefecture11' => $param['prefecture11']
            ,'prefecture12' => $param['prefecture12']
            ,'prefecture13' => $param['prefecture13']
            ,'prefecture14' => $param['prefecture14']
            ,'prefecture15' => $param['prefecture15']
            ,'prefecture16' => $param['prefecture16']
            ,'prefecture17' => $param['prefecture17']
            ,'prefecture18' => $param['prefecture18']
            ,'prefecture19' => $param['prefecture19']
            ,'prefecture20' => $param['prefecture20']
            ,'prefecture21' => $param['prefecture21']
            ,'prefecture22' => $param['prefecture22']
            ,'prefecture23' => $param['prefecture23']
            ,'prefecture24' => $param['prefecture24']
            ,'prefecture25' => $param['prefecture25']
            ,'prefecture26' => $param['prefecture26']
            ,'prefecture27' => $param['prefecture27']
            ,'prefecture28' => $param['prefecture28']
            ,'prefecture29' => $param['prefecture29']
            ,'prefecture30' => $param['prefecture30']
            ,'prefecture31' => $param['prefecture31']
            ,'prefecture32' => $param['prefecture32']
            ,'prefecture33' => $param['prefecture33']
            ,'prefecture34' => $param['prefecture34']
            ,'prefecture35' => $param['prefecture35']
            ,'prefecture36' => $param['prefecture36']
            ,'prefecture37' => $param['prefecture37']
            ,'prefecture38' => $param['prefecture38']
            ,'prefecture39' => $param['prefecture39']
            ,'prefecture40' => $param['prefecture40']
            ,'prefecture41' => $param['prefecture41']
            ,'prefecture42' => $param['prefecture42']
            ,'prefecture43' => $param['prefecture43']
            ,'prefecture44' => $param['prefecture44']
            ,'prefecture45' => $param['prefecture45']
            ,'prefecture46' => $param['prefecture46']
            ,'prefecture47' => $param['prefecture47']
        ));
        $dailyStoreInfo->save();
    }





}
