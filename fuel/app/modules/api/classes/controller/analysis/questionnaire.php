<?php
namespace Api;

/**
 * Class Daily_Coupon
 * @package Api
 */
class Controller_Analysis_Questionnaire extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'company_id' => false,
            'brand_ids' => false,
            'store_ids' => false,
            'month' => true,
            'pattern' => true,
        ),
    );

    protected function index() {
        \Additional_Log::debug('daily/coupon called');

        $user = \Model_User::find($this->user_id);
        $relates = array();

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

        $relates['questionnaire_analysis']['where'] = array(array('date', 'LIKE', $this->params['month'] . '%'));
        $conditions = \Model_Questionnaire::makeConditions($this->params);
        $questionnaires = \Model_Questionnaire::find('all', array('where' => $conditions, 'related' => $relates, 'order_by' => array('questionnaire_limit' => 'DESC')));

        $this->response_fields['daily_questionnaire'] = array();
        foreach ($questionnaires as $questionnaire) {
            unset($questionnaire->questionnaire_analysis);
            $rec = $questionnaire->toArray($this->params['pattern']);
            $rec['target_user_count'] = count($questionnaire->histories);
            $rec['answered_user_count'] = count($questionnaire->answered_histories);
            $this->response_fields['daily_questionnaire'][] = $rec;
        }
    }
}