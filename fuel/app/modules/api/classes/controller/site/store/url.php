<?php

namespace Api;

class Controller_Site_Store_Url extends \Controller_Api
{

    protected static $required_parameters = array(
        'index' => array(
            'pattern'  => true,
            'per_page' => false,
            'page' => false,
            'page_type' => false,
        )
    );

    protected function index()
    {
        \Additional_Log::debug('【SITE_STORE_FREE URL GET API】:START');
        \Additional_Log::debug(print_r($this->params,true));
        $brand = \Model_Brand::find($this->params['brand_id']);
        if (empty($brand)) {
            throw new \ProtocolException(\Lang::get('brand_or_store_is_not_exist'), "Brand or store is not exist", \ProtocolException::RESULT_CODE_SITE_BRAND_OR_STORE_IS_NOT_EXIST);
        }

        $page = !empty($this->params['page']) ? $this->params['page'] : 1;

        $conditions = array();
        if(!empty($this->params['page_type'])){
            $conditions[] = array('page_type', $this->params['page_type']);
        }
        if(!empty($this->params['brand_id'])){
            $conditions[] = array('brand_id', $this->params['brand_id']);
        }

        $results = \Model_Site_Store_Free::find('all', array(
            'where' => $conditions,
            'offset' => ($page-1) * $this->params['per_page'],
            'limit' => $this->params['per_page']
        ));

        $count = \Model_Site_Store_Free::count(array('where' => $conditions));
        

        $response = array();
        foreach ($results as $site) {
            $rec = $site->toArray($this->params['pattern']);
            $response[] = $rec;
        }

        
        $this->response_fields['site_store_free_url'] = !empty($response) ? $response : null;
        $this->response_fields['count'] = !empty($count) ? $count : 0;

        \Additional_Log::debug('【SITE_STORE_FREE URL GET API】:END');
    }
}