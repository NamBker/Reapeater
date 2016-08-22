<?php

namespace Api;
class Controller_Site_Map extends \Controller_Api
{

    protected static $required_parameters = array(
        'index' => array(
            'company_id' => false,
            'brand_id' => false,
            'page_type' => false,
            'pattern' => true,
        ),
        'update' => array(
            'sites' => true,
            'pattern' => false,
        ),
        'delete' => array(
            'site_free_store_ids' => true,
            'company_id' => false,
            'brand_id' => false,
        ),
    );

    protected function index()
    {
        \Additional_Log::debug('site map index/ called');
        $user = \Model_User::find($this->user_id);
        $user->authority($this->params);
        $conditions = array();
        if (!empty($this->params['company_id'])) {
            $conditions[] = array('company_id', $this->params['company_id']);
        }
        if (!empty($this->params['brand_id'])) {
            $conditions[] = array('brand_id', $this->params['brand_id']);
        }
        if (!empty($this->params['page_type'])) {
            $conditions[] = array('page_type', $this->params['page_type']);
        }
        $site_store_free = \Model_Site_Store_Free::find("all", array(
            'where' => $conditions,
            'order_by' => array('display_order' => 'ASC'),
        ));

        $rec = array();
        foreach ($site_store_free as $site_map) {
            $rec[] = $site_map->toArray($this->params['pattern']);
        }
        $this->response_fields['site_map'] = $rec;
    }

    protected function update()
    {
        \Additional_Log::debug("site map update/ called");
        $sites = $this->params['sites'];
        foreach ($sites as $site_obj) {
            $site = \Model_Site_Store_Free::find($site_obj["id"]);
            $site->display_order = $site_obj["display_order"];
            $site->save();
            $site_groups = \Model_Site_Store_Free::find("all", array(
                'where' => array(
                    array('sitemap_name', $site->sitemap_name),
                    array('sitemap_url', $site->sitemap_url),
                    array('page_type', $site->page_type),
                )
            ));
            if (count($site_groups) > 1) {
                foreach ($site_groups as $site_group_obj) {
                    $site_group = \Model_Site_Store_Free::find($site_group_obj['id']);
                    $site_group->display_order = $site_obj["display_order"];
                    $site_group->save();
                }
            }
        }
    }

    protected function delete()
    {
        \Additional_Log::debug('【SITE STORE FREE DELETE API】:START');

        // 引数取得
        $user = \Model_User::find($this->user_id);

        // 操作権限チェック
        $user->authority($this->params);
        $ids = $this->params['site_free_store_ids'];
        foreach($ids as $id)
        {
            $site_free_store = \Model_Site_Store_Free::find(array($id));
            if(!empty($site_free_store)){
                $site_free_store->delete();
            }
        }
        $this->response_fields['site_free_store_ids'] = $ids;

        \Additional_Log::debug('【SITE STORE FREE DELETE API】:END');
    }
}