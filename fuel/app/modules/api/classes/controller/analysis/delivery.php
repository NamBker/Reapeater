<?php
namespace Api;

/**
 * Class Daily_Delivery
 * @package Api
 */
class Controller_Analysis_Delivery extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'company_id' => false,
            'brand_ids' => false,
            'store_ids' => false,
            'month' => false,
            'pattern' => true,
        ),
    );

    protected function index() {
        \Additional_Log::debug('daily/delivery called');

        $user = \Model_User::find($this->user_id);
        $relates = array();
        $params = $this->params;
        if($user->authority >=  USER_AUTHORITY_COMPANY){
            $params['company_id'] = $user->company_id;
        }

        if($user->authority >=  USER_AUTHORITY_BRAND){
            $params['brand_ids'] = [$user->brand_id];
        }

        if($user->authority >=  USER_AUTHORITY_SECTION){
            $relates['store']['where'] = array(
                array('section_id', $user->section_id),
            );
        }

        if($user->authority >=  USER_AUTHORITY_STORE){
            $params['store_ids'] = [$user->store_id];
        }
        $conditions = \Model_Daily_Delivery_Info::makeConditions($this->params);

        if (empty($this->params['month'])) {
            $daily_deliveries = array(\Model_Daily_Delivery_Info::find('first', array('where' => empty($conditions) ? array() : array($conditions), 'related' => $relates, 'order_by' => array('delivery_date' => 'DESC'))));
        } else {
            $daily_deliveries = \Model_Daily_Delivery_Info::find('all', array('where' => array($conditions), 'related' => $relates));
        }
        $this->response_fields['daily_delivery'] = array();
        foreach ($daily_deliveries as $daily_delivery) {
            if(!empty($daily_delivery) && !empty($daily_delivery->delivery)){
                $rec = $daily_delivery->toArray($this->params['pattern']);
                $rec['delivery'] = $daily_delivery->delivery->toArray($this->params['pattern']);
                $this->response_fields['daily_delivery'][] = $rec;
            }
        }
    }
}