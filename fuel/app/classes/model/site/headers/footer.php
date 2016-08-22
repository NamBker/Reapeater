<?php

class Model_Site_Headers_Footer extends \Model_Standard_Model
{
    protected static $_primary_key = array('company_id', 'brand_id', 'store_id');
    protected static $_properties = array(
        'id',
        'company_id',
        'brand_id',
        'store_id',
        'sitemap_name' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    32,
                ),
            ),
        ),
        'sitemap_catchcopy' => array(
            'data_type' => 'text',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    65535,
                ),
            ),
        ),
        'sitemap_picture_id' => array(
            'data_type' => 'int',
            'null' => true,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    4294967295,
                ),
            ),
        ),
        'sitemap_free_text' => array(
            'data_type' => 'text',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    65535,
                ),
            ),
        ),
        'sitemap_copyright' => array(
            'data_type' => 'text',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    65535,
                ),
            ),
        ),
        'sitemap_contents_title' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    32,
                ),
            ),
        ),
        'memo' => array(
            'data_type' => 'text',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    65535,
                ),
            ),
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
     * サイト ヘッダ・フッタ更新
     * @param $param
     * @throws ProtocolException
     */
    public static function updateSiteHeaderFooter($param, $site_headers_footer_obj, $user)
    {
//        $site_headers_footer_obj->company_id = !empty($user->company_id) ? $user->company_id : 0;
//        $site_headers_footer_obj->brand_id = !empty($user->brand_id) ? $user->brand_id : 0;
//        $site_headers_footer_obj->store_id = !empty($user->store_id) ? $user->store_id : 0;
        $site_headers_footer_obj->sitemap_name = $param['sitemap_name'];
        $site_headers_footer_obj->sitemap_catchcopy = $param['sitemap_catchcopy'];
        $site_headers_footer_obj->sitemap_picture_id = $param['sitemap_picture_id'];
        $site_headers_footer_obj->sitemap_free_text = $param['sitemap_free_text'];
        $site_headers_footer_obj->sitemap_copyright = $param['sitemap_copyright'];
        $site_headers_footer_obj->sitemap_contents_title = $param['sitemap_contents_title'];
        $site_headers_footer_obj->save();
    }

    /**
     * 検索
     * @param $company_id
     * @param $brand_code
     * @param $store_code
     * @return \Orm\Model|\Orm\Model[]
     */
    public static function findByCompanyIdAndBrandCodeAndStoreCode($company_id, $brand_code, $store_code)
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
}
