<?php
namespace Web;

class Presenter_User_Index extends \Presenter_Web
{
    function view()
    {
        $lable = array(
            'no'           => 'No',
            'authority'    => '権限',
            'company_name' => '企業名',
            'brand_name'   => 'ブランド名',
            'store_name'   => '店舗名',
            'id'           => 'ユーザID',
            'name'         => 'ユーザ名',
            'address'      => 'ユーザ住所',
            'phone_no'     => 'ユーザ電話番号',
        );

        $this->authorities = array(
            ''                     => '',
            USER_AUTHORITY_ADMIN   => '管理',
            USER_AUTHORITY_COMPANY => '企業',
            USER_AUTHORITY_BRAND   => 'ブランド',
            USER_AUTHORITY_SECTION => '事業部',
            USER_AUTHORITY_STORE   => '店舗'
        );
        $users = \Model_User::find('all', array(
            'where'    => $this->condition,
            'related'  => $this->relate,
            'order_by' => array('authority' => 'desc')
        ));
        $user_list = array();
        if (!empty($users)) {
            $row = 1;
            foreach ($users as $user) {
                $user_arr['no']           = $row++;
                $user_arr['authority']    = $this->authorities[$user->authority];
                $user_arr['company_name'] = !empty($user->company) ? $user->company->company_name : '-';
                $user_arr['brand_name']   = !empty($user->brand) ? $user->brand->brand_name : '-';
                $user_arr['store_name']   = !empty($user->store) ? $user->store->store_name : '-';
                $user_arr['id']           = $user->id;
                $user_arr['name']         = $user->name;
                $user_arr['address']      = $user->address;
                $user_arr['phone_no']     = $user->phone_no;
                $user_list[] = $user_arr;
                \Additional_Log::debug($user_arr['company_name']);
            }
        }
        $this->search = \View::forge("web::user/index/_search", array('authorities' => $this->authorities, 'data_from' => $this->data_form));
        $this->table  = \View::forge("web::user/index/_table", array('users' => $user_list, 'lable' => $lable));
    }
}