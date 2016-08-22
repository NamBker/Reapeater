<?php
namespace Api;

/**
 * Class Detail
 * @package Api
 */
class Controller_Questionnaire_Detail extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'questionnaire_id' => true,
        ),
    );

    protected function index()
    {
        \Additional_Log::debug('questionnaire/private called');
        $user = \Model_User::find($this->user_id);

        $conditions = $this->makeConditionForUser($user);
        $conditions[] = array('id', $this->params['questionnaire_id']);
        $questionnaire = \Model_Questionnaire::find('first', array(
            'where' => $conditions,
        ));
        $pattern = PATTERN_ALL;
        $questionnaire_arr = $questionnaire->toArray($pattern);
        $questionnaire_arr['questionnaire_responds'] = array();
        foreach ($questionnaire->questionnaire_responds as $respond) {
            $tmp = $respond->toArray($pattern);
            $tmp['question'] = $respond->question->toArray($pattern);
            $questionnaire_arr['questionnaire_responds'][] = $tmp;
        }
        $this->response_fields['questionnaire'] = $questionnaire_arr;
    }

    private function makeConditionForUser($user)
    {
        $conditions = array();
        switch($user->authority) {
            case USER_AUTHORITY_STORE:
                $conditions[] = array('store_id', 'IN', $user->store_id);
            case USER_AUTHORITY_SECTION:
                $conditions[] = array('section_id', $user->section_id);
            case USER_AUTHORITY_BRAND:
                $conditions[] = array('brand_id', $user->brand_id);
            case USER_AUTHORITY_COMPANY:
                $conditions[] = array('company_id', $user->company_id);
                break;
        }
        $conditions[] = array('questionnaire_deleted_flg', 0);
        return $conditions;
    }
}
