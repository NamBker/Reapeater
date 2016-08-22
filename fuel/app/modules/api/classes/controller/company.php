<?php

namespace Api;
class Controller_Company extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'company_id' => false,
            'pattern' => true,
        ),
    );

    protected function index()
    {
        \Additional_Log::debug('company/index called');
        $user = \Model_User::find($this->user_id);
        if (empty($user)) {
            throw new \HttpForbiddenException(\Lang::get('user_is_invalid'));
        } else {
            $conditions = array();

            // 企業ID
            $company_id = $user->authority == USER_AUTHORITY_ADMIN ? $this->params['company_id'] : $user->company_id;
            if ($company_id) {
                $conditions = array(array('id', $company_id));
            }

            $results = \Model_Company::find('all', array(
                'where' => $conditions,
            ));

            $company_arr = array();
            foreach($results as $company) {
                $company_arr[] = $company->toArray($this->params['pattern']);
            }

            $this->response_fields['company'] = $company_arr;
        }
    }
}

