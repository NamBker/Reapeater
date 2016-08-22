<?php

namespace Api;
class Controller_Site_Headers_Footer extends \Controller_Api
{

    protected static $required_parameters = array(
        'index' => array(
            'pattern' => true
        ),
        'update' => array(
            'company_id' => false,
            'brand_id' => false,
            'store_id' => false,
            'sitemap_name' => true,
            'sitemap_catchcopy' => false,
            'sitemap_picture_id' => false,
            'sitemap_free_text' => false,
            'sitemap_copyright' => false,
            'sitemap_contents_title' => true,
            'memo' => false
        )
    );

    protected function index()
    {
        \Additional_Log::debug('【SITE_HEADERS_FOOTERS GET API】:START');

        $user = \Model_User::find($this->user_id);
        $conditions = self::setCondition($user);

        $result = \Model_Site_Headers_Footer::find('first', array(
            'where' => $conditions,
        ));

        $response = !empty($result) ? $result->toArray($this->params['pattern']) : null;
        $this->response_fields['site_headers_footers'] = $response;
        \Additional_Log::debug('【SITE_HEADERS_FOOTERS GET API】:END');
    }

    protected function update()
    {
        \Additional_Log::debug('【SITE_HEADERS_FOOTERS UPDATE API】:START');
        // 引数取得
        $params = $this->params;
        $user = \Model_User::find($this->user_id);

        // 操作権限チェック
        $user->authority($params);


        $conditions = self::setCondition($user);
        $site_headers_footer_obj = \Model_Site_Headers_Footer::find('first', array(
            'where' => $conditions,
        ));

        if (empty($site_headers_footer_obj)) {
            $site_headers_footer_obj = \Model_Site_Headers_Footer::forge(array(
                "company_id" => !empty($user->company_id) ? $user->company_id : 0,
                "brand_id" => !empty($user->brand_id) ? $user->brand_id : 0,
                "store_id" => 0
            ));
        }

        \Model_Site_Headers_Footer::updateSiteHeaderFooter($params, $site_headers_footer_obj, $user);
        \Additional_Log::debug('【SITE_HEADERS_FOOTERS UPDATE API】:END');
    }

    /**
     * 条件設定
     * @param $user
     * @return array
     */
    private static function setCondition($user)
    {
        $conditions[] = array('company_id', $user->company_id);
        $conditions[] = array('brand_id', $user->brand_id);
        $conditions[] = array('store_id', 0);

        return $conditions;
    }
}