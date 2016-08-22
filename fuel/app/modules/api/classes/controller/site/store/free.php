<?php

namespace Api;
use Fuel\Tasks\monthly_store_info;

class Controller_Site_Store_Free extends \Controller_Api
{

    protected static $required_parameters = array(
        'index' => array(
            'pattern'  => true,
            'page_type'  => true,
            'site_id' => false,
            'organize_type' => false,
            'site_hierarchy' => false
        ),
        'create' => array(
            'site' => true,
            'linkage_site_id' => true,
        ),
        'update' => array(
            'company_id' => false,
            "sitemap_name" => true,
            "title_picture_id" => true,
            "organize_type" => true,
            "page_type" => true,
            "organize_parts" => true,
            "free_input" => true,
            "memo" => true,
            "site_hierarchy" => true,
            "parents_site_id" => false,
            "display_flg" => true,
            "display_order" => true,
            'site_id' => false
        )
    );

    protected function index()
    {
        if(self::checkExistedBrandStore()){

            $conditions = array();
            if(!empty($this->params['page_type'])){
                $conditions[] = array('page_type', $this->params['page_type']);
            }
            if(!empty($this->params['brand_id'])){
                $conditions[] = array('brand_id', $this->params['brand_id']);
            }
            if(!empty($this->params['store_id'])){
                $conditions[] = array('store_id', $this->params['store_id']);
            }
            if(!empty($this->params['site_id'])){
                $conditions[] = array('id', $this->params['site_id']);
            }
            if(!empty($this->params['organize_type'])){
                $conditions[] = array('organize_type', $this->params['organize_type']);
            }
            if(!empty($this->params['site_hierarchy'])){
                $conditions[] = array('site_hierarchy', $this->params['site_hierarchy']);
            }

            $result = \Model_Site_Store_Free::find('first', array(
                'where' => $conditions
            ));

            $response = !empty($result) ? $result->toArray($this->params['pattern']) : null;
            $response['organize_parts'] = json_decode($response['organize_parts']);
            if (empty($response['organize_parts'])) {
                unset($response['organize_parts']);
            }
            $this->response_fields['site_store_free'] = !empty($response) ? $response : null;
            \Additional_Log::debug('【SITE_STORE_FREE GET API】:END');
        }

    }

    protected function create() {

        $linkage_site_id =  !empty($this->params['linkage_site_id']) ? $this->params['linkage_site_id'] : 0;
        foreach ($this->params['site'] as $site) {
            $site_obj = \Model_Site_Store_Free::find("first", array(
               'where' => array(
                   array("brand_id", $site["brand_id"]),
                   array("store_id", $site["store_id"]),
                   array("page_type", $site["page_type"]),
                   array("linkage_site_id", $linkage_site_id)
               )
            ));
            if (count($site_obj) > 0) {
                \Model_Site_Store_Free::updateSiteFreeStore($site, $site_obj, $site["company_id"], $site["brand_id"], $site["store_id"]);
            } else {
                $site_store_free = \Model_Site_Store_Free::forge(array($site));
                \Model_Site_Store_Free::updateSiteFreeStore($site, $site_store_free, $site["company_id"], $site["brand_id"], $site["store_id"]);
            }
        }
    }

    protected function update()
    {
        if(self::checkExistedBrandStore()) {
            $params = $this->params;
            $brand = \Model_Brand::find($this->params['brand_id']);

            $conditions = array();
            if(!empty($this->params['page_type'])){
                $conditions[] = array('page_type', $this->params['page_type']);
            }
            if(!empty($this->params['brand_id'])){
                $conditions[] = array('brand_id', $this->params['brand_id']);
            }
            if(!empty($this->params['store_id'])){
                $conditions[] = array('store_id', $this->params['store_id']);
            }
            if(!empty($this->params['id'])){
                $conditions[] = array('id', $this->params['id']);
            }

            $site_store_free = \Model_Site_Store_Free::find("first", array(
                'where' => $conditions
            ));

            $pageTypeArr = array(PAGE_TYPE_MENU_DETAIL, PAGE_TYPE_NO_LAYOUT, PAGE_TYPE_NO_MEMNU_LAYOUT);
            if ((empty($this->params['id']) && in_array($this->params['page_type'], $pageTypeArr)) || empty($site_store_free)) {
                $site_store_free = \Model_Site_Store_Free::forge(array(
                    "company_id" => $brand->company->id,
                    "brand_id" => $this->params['brand_id'],
                    "store_id" => $this->params['store_id'],
                ));
            }
            \Model_Site_Store_Free::updateSiteFreeStore($params, $site_store_free, $brand->company->id, $this->params['brand_id'], $this->params['store_id']);
            \Additional_Log::debug('【SITE_STORE_FREE UPDATE API】:END');
        }
    }

    private function checkExistedBrandStore(){
        \Additional_Log::debug('【SITE_STORE_FREE GET API】:START');
        $brand_id = isset($this->params['brand_id']) ? $this->params['brand_id'] : 0;
        $store_id = isset($this->params['store_id']) ? $this->params['store_id'] : 0;
        $site_id = isset($this->params['site_id']) ? $this->params['site_id'] : 0;

        \Additional_Log::info(print_r($this->params,true));

        $brand = \Model_Brand::find($brand_id);
        $is_existed = false;
        if (empty($brand)) {
            $is_existed = true;
        } else if ($store_id != 0) {
            $store = \Model_Store::find($store_id);
            if (empty($store)) {
                $is_existed = true;
            }
        }

        if ($is_existed) {
            throw new \ProtocolException(\Lang::get('brand_or_store_is_not_exist'), "Brand or store is not exist", \ProtocolException::RESULT_CODE_SITE_BRAND_OR_STORE_IS_NOT_EXIST);
        } else if($site_id != 0){
            $site = \Model_Site_Store_Free::find("first",array(
                'where' => array(
                    array('brand_id', $this->params['brand_id']),
                    array('store_id', $this->params['store_id']),
                    array('id', $this->params['site_id']),
                    array('page_type', $this->params['page_type']),
                    array('organize_type', $this->params['organize_type']),
                    array('site_hierarchy', $this->params['site_hierarchy'])
                )));
            if (empty($site)) {
                throw new \ProtocolException(\Lang::get('site_store_free_is_not_exist'), "Site is not exist", \ProtocolException::RESULT_CODE_SITE_STORE_FREE_IS_NOT_EXIST);
            }
        }

        return true;
    }
}