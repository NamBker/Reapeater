<?php

namespace Api;
class Controller_User extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'user_name' => false,
            'user_company_id' => false,
            'user_brand_ids' => false,
            'user_store_ids' => false,
            'page' => true,
            'per_page' => true,
            'pattern' => true,
        ),

        'create' => array(
            'mail_address' => true,
            'password' => true,
            'authority' => true,
            'company_id' => false,
            'brand_id' => false,
            'store_id' => false,
            'name' => true,
            'address' => false,
            'phone_no' => false,
        ),

        'update' => array(
            'id' => true,
            'mail_address' => true,
            'password' => true,
            'authority' => true,
            'company_id' => false,
            'brand_id' => false,
            'store_id' => false,
            'name' => true,
            'address' => false,
            'phone_no' => false,
        ),

        'delete' => array(
            'user_ids' => true,
        ),
    );

    protected function index()
    {
        \Additional_Log::info('user/index called');

        \Additional_Log::debug(print_r($this->params, true));
        $user = \Model_User::find($this->user_id);

        $conditions = $this->makeConditionForUser($user);

        if ($this->is_setted_param('user_company_id') && $user->authority < USER_AUTHORITY_COMPANY && $this->params['user_company_id'] != 0) {
            $conditions[] = array('company_id', $this->params['user_company_id']);
        }
        if ($this->is_setted_param('user_brand_ids') && $user->authority < USER_AUTHORITY_BRAND) {
            $conditions[] = array('brand_id', 'IN', $this->params['user_brand_ids']);
        }
        if ($this->is_setted_param('user_store_ids')) {
            $conditions[] = array('store_id', 'IN', $this->params['user_store_ids']);
        }
        if ($this->is_setted_param('user_name')) {
            $conditions[] = array('name', 'LIKE', "%{$this->params['user_name']}%");
        }
        $find_params = array(
            'where' => $conditions,
        );
        if ($this->is_setted_param('per_page') && $this->is_setted_param('page')) {
            $find_params['offset'] = ($this->params['page'] - 1) * $this->params['per_page'];
            $find_params['limit'] = $this->params['per_page'];
        }

        $results = \Model_User::find('all', $find_params);
        $count = \Model_User::count(array('where' => $conditions));
        $user_list = array();
        foreach ($results as $user) {
            $user_arr['authority'] = $user->authority;
            $user_arr['company_name'] = !empty($user->company) ? $user->company->company_name : '-';
            $user_arr['brand_name']   = !empty($user->brand) ? $user->brand->brand_name : '-';
            $user_arr['store_name']   = !empty($user->store) ? $user->store->store_name : '-';
            $user_arr['id']           = $user->id;
            $user_arr['name']         = $user->name;
            $user_list[] = $user_arr;
        }
        $this->response_fields['user'] = $user_list;
        $this->response_fields['count'] = $count;
    }

    protected function create()
    {
        \Additional_Log::debug('user/create called');
        if (\Model_User::checkCreateUserIllegal($this->params['company_id'], $this->params['brand_id'], $this->params['store_id'])) {
            try {
                $user = \Auth::create_user(
                    $this->params['mail_address'],
                    $this->params['password'],
                    $this->params['name'],
                    $this->params['authority'],
                    array(
                        'company_id' => empty($this->params['company_id']) ? null : $this->params['company_id'],
                        'brand_id'   => empty($this->params['brand_id']) ? null : $this->params['brand_id'],
                        'store_id'   => empty($this->params['store_id']) ? null : $this->params['store_id'],
                        'address'    => empty($this->params['address']) ? null : $this->params['address'],
                        'phone_no'   => empty($this->params['phone_no']) ? null : $this->params['phone_no'],
                    )
                );
                $this->response_fields['user'] = $user->toArray();
            } catch (\Exception $e) {
                throw new \ProtocolException($e->getMessage(), "Can't create user.", \ProtocolException::RESULT_CODE_CREATE_USER_INVALID);
            }
        }
    }

    protected function update()
    {
        \Additional_Log::debug('user/update called');
        if (\Model_User::checkCreateUserIllegal($this->params['company_id'], $this->params['brand_id'], $this->params['store_id'])) {
            $user = \Model_User::find($this->params['id'], array(), \ProtocolException::RESULT_CODE_USER_NOT_FOUND);
            $user->mail_address = $this->params['mail_address'];
            $user->password     = $user->password == $this->params['password'] ? $user->password : \Auth::hash_password($this->params['password']);;
            $user->authority    = $this->params['authority'];
            $user->company_id   = empty($this->params['company_id']) ? null: $this->params['company_id'];
            $user->brand_id     = empty($this->params['brand_id']) ? null: $this->params['brand_id'];
            $user->store_id     = empty($this->params['store_id']) ? null: $this->params['store_id'];
            $user->name         = $this->params['name'];
            $user->address      = $this->params['address'];
            $user->phone_no     = $this->params['phone_no'];
            $user->save();
            $this->response_fields['user'] = $user->toArray();
        }
    }

    protected function delete() {
        \Additional_Log::debug('USERS DELETE API】:START');
        $user = \Model_User::find($this->user_id);

        $conditions = $this->makeConditionForUser($user);
        $conditions[] = array('id', 'IN', $this->params['user_ids']);
        $targets = \Model_User::find('all', array(
            'where' => $conditions,
        ));
        foreach ($targets as $target) {
            $target->delete();
        }
         \Additional_Log::debug('【USERS DELETE API】:END');
    }

    private function makeConditionForUser($user)
    {
        $conditions = array();
        switch ($user->authority) {
        case USER_AUTHORITY_STORE:
        case USER_AUTHORITY_SECTION:
            throw new \ProtocolException(\Lang::get('authority_error'), "You don't have permission to access.", \ProtocolException::RESULT_CODE_EXECUTE_AUTHORITY);
        case USER_AUTHORITY_BRAND:
            $conditions[] = array('brand_id', $user->brand_id);
        case USER_AUTHORITY_COMPANY:
            $conditions[] = array('company_id', $user->company_id);
        }
        return $conditions;
    }
}
