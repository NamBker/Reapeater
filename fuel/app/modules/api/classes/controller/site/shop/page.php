<?php

namespace Api;

class Controller_Site_Shop_Page extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'pattern'  => true,
            'page_type'  => false,
        ),
        'update' => array(
            'site' => true,
        )
    );

    protected function index()
    {
        if(self::checkExistedBrandStore()){
            $conditions = array();
            $brand_id = $this->params['brand_id'];
            $page_type = $this->params['page_type'];
            $conditions[] = array('brand_id', $brand_id);
            if (!empty($page_type)) {
                $conditions[] = array('page_type', $page_type);
            }
            $results = \Model_Site_Store_Free::find("all", array(
                'where' => $conditions
            ));
            $response = array();
            foreach ($results as $site) {
                $rec = $site->toArray($this->params['pattern']);
                $response[] = $rec;
            }
            $this->response_fields['site_store_free'] = !empty($response) ? $response : null;
        }
    }

    protected function update()
    {
        \Additional_Log::debug('【SITE_STORE_FREE UPDATE MULTIPLE API】:START');
        if (count($this->params['site']) > 0) {
            foreach ($this->params['site'] as $key => $site) {
                $brand = \Model_Brand::find($site['brand_id']);
                $site_store_free = \Model_Site_Store_Free::find("first", array(
                    'where' => array(
                        array('brand_id', $site['brand_id']),
                        array('store_id', $site['store_id']),
                        array('page_type', $site['page_type']),
                    )
                ));
                if (empty($site_store_free)) {
                    $site_store_free = \Model_Site_Store_Free::forge(array(
                        "company_id" => $brand->company->id,
                        "brand_id" => $site['brand_id'],
                        "store_id" => $site['store_id'],
                    ));
                }
                \Model_Site_Store_Free::updateSiteFreeStore($site, $site_store_free, $brand->company->id, $site['brand_id'], $site['store_id']);
            }
        }
        \Additional_Log::debug('【SITE_STORE_FREE UPDATE MULTIPLE API】:END');
    }

    private function checkExistedBrandStore(){
        \Additional_Log::debug('【SITE_STORE_FREE GET API】:START');
        $brand_id = isset($this->params['brand_id']) ? $this->params['brand_id'] : 0;
        $store_id = isset($this->params['store_id']) ? $this->params['store_id'] : 0;
        $site_id = isset($this->params['site_id']) ? $this->params['site_id'] : 0;

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