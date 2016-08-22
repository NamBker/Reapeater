<?php

class Model_Site_Store_Free extends \Model_Standard_Model
{
    protected static $_primary_key = array('id');
    protected static $_table_name = "site_store_free";
    protected static $_properties = array(
        'id' => array (
            'expose_pattern' => 1,
        ),
        'company_id' => array(
            'expose_pattern' => 2,
        ),
        'brand_id' => array(
            'expose_pattern' => 2,
        ),
        'store_id' => array (
            'expose_pattern' => 2,
        ),
        'sitemap_name' => array(
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
        'sitemap_url' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'max_length' => array(
                    64,
                ),
            ),
            'expose_pattern' => 1,
        ),
        'linkage_site_id' => array(
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
        'title_picture_id' => array(
            'data_type' => 'int',
            'null' => false,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    1,
                    4294967295,
                ),
            ),
            'expose_pattern' => 2,
        ),
        'organize_type'     => array(
            'data_type' => 'tinyint',
            'null' => false,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    2,
                ),
            ),
        ),
        'page_type'         => array(
            'data_type' => 'tinyint',
            'null' => false,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    16,
                ),
            ),
            'expose_pattern' => 3,
        ),
        'organize_parts'    => array(
            'data_type' => 'text',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    65535,
                ),
            ),
            'expose_pattern' => 3,
        ),
        'free_input' => array(
            'data_type' => 'text',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    65535,
                ),
            ),
            'expose_pattern' => 2,
        ),
        'header' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    255,
                ),
            ),
            'expose_pattern' => 2,
        ),
        'footer' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    255,
                ),
            ),
        ),
        'memo' => array(
            'data_type' => 'text',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    65535,
                ),
            ),
            'expose_pattern' => 2,
        ),
        'site_hierarchy' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    255,
                ),
            ),
            'expose_pattern' => 2,
        ),
        'parents_site_id' => array(
            'data_type' => 'int',
            'null' => true,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    1,
                    4294967295,
                ),
            ),
            'expose_pattern' => 3,
        ),
        'display_flg' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    1,
                ),
            ),
            'expose_pattern' => 3,
        ),
        'display_order' => array(
            'data_type' => 'smallint',
            'null' => false,
            'default' => 0,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    32767,
                ),
            ),
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


    /**
     * 検索
     * @param $company_id
     * @param $brand_id
     * @param $store_id
     * @return \Orm\Model|\Orm\Model[]
     */
    public static function findByCompanyIdAndBrandIdAndStoreId($company_id, $brand_id, $store_id = 0, $sitemap_url = 'index')
    {
        return static::find(
            'first',
            array(
                'where' => array(
                    'company_id'  => $company_id,
                    'brand_id'    => $brand_id,
                    'store_id'    => $store_id,
                    'sitemap_url' => $sitemap_url,
                ),
            )
        );
    }

    /**
     * 検索
     * @param $company_id
     * @param $brand_id
     * @param $store_id
     * @return \Orm\Model|\Orm\Model[]
     */
    public static function findByCompanyIdAndBrandIdAndStoreIdAndPageType($company_id, $brand_id, $store_id = 0, $page_type = '1')
    {
        return static::find(
            'first',
            array(
                'where' => array(
                    'company_id'  => $company_id,
                    'brand_id'    => $brand_id,
                    'store_id'    => $store_id,
                    'sitemap_url' => $sitemap_url,
                ),
            )
        );
    }

    /**
     * 検索
     * @param $company_id
     * @param $brand_id
     * @param $store_id
     * @return \Orm\Model|\Orm\Model[]
     */
    public static function getMenuList($company_id, $brand_id, $store_id = 0)
    {
        return static::find(
            'all',
            array(
                'where' => array(
                    'company_id' => $company_id,
                    'brand_id' => $brand_id,
                    array(array('store_id', '=', $store_id), 'or' => array('store_id', '=', '0')),
                    'display_flg' => 1, # 0:非表示 / 1:表示
                ),
                'order_by' => array(
                    'display_order'
                )
            )
        );
    }

    /*
     * 店舗トップページ設定更新
     * @param $param
     * @throws ProtocolException
     */
    public static function updateSiteFreeStore($param, $site_store_free, $company_id, $brand_id, $store_id)
    {
        $site_store_free->company_id = $company_id;
        $site_store_free->brand_id = $brand_id;
        $site_store_free->store_id = $store_id;
        $site_store_free->free_input = $param['free_input'];
        $site_store_free->memo = $param['memo'];
        $site_store_free->site_hierarchy = $param['site_hierarchy'];
        $site_store_free->display_flg = $param['display_flg'];
        $site_store_free->display_order = $param['display_order'];
        $site_store_free->sitemap_name = $param['sitemap_name'];
        $site_store_free->title_picture_id = $param['title_picture_id'];
        $site_store_free->organize_type = $param['organize_type'];
        $site_store_free->page_type = $param['page_type'];
        $site_store_free->parents_site_id = isset($param['parents_site_id'])? $param['parents_site_id'] : "";
        $site_store_free->organize_parts = json_encode($param['organize_parts']);
        $site_store_free->sitemap_url = isset($param['sitemap_url'])?$param['sitemap_url']:"";
        $site_store_free->linkage_site_id = !empty($param['linkage_site_id']) ? $param['linkage_site_id']: 0;
        $site_store_free->save();
    }

}