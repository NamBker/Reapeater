<?php
namespace Web;
class Presenter_Store_Index extends \Presenter_Web
{

    public function view()
    {
        $this->stores = array();
        $this->status = array('' => 'すべて', STATUS_DELETE => STATUS_DELETE_LABEL, STATUS_CLOSED => STATUS_CLOSED_LABEL, STATUS_PREPARATION => STATUS_PREPARATION_LABEL, STATUS_DURING_BUSINESS => STATUS_DURING_BUSINESS_LABEL);
        if (!empty($this->conditions)) {
            $stores = \Model_Store::find('all', array('where' => array($this->conditions)));
            foreach($stores as $store)
            {
                if(!empty($store->company) && !empty($store->brand))
                {
                    if (in_array($store->company->company_status, array(STATUS_PREPARATION, STATUS_DURING_BUSINESS))
                        && in_array($store->brand->brand_status, array(STATUS_PREPARATION, STATUS_DURING_BUSINESS))) {

                        $store->store_prefectures = $store->store_prefectures < 10? '0'.$store->store_prefectures : $store->store_prefectures;
                        $this->stores[] = $store;
                    }
                }
            }
        }
    }
}