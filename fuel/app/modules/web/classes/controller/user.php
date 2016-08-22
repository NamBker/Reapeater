<?php
namespace Web;


class Controller_User extends \Controller_Web
{
    function action_index()
    {
        $user = \Auth::instance()->get_user();
        $presenter = \Presenter::forge("web::user/index");
        $presenter->condition = array();
        $presenter->relate = array();
        $presenter->data_form = array();
        if (\Input::method() == 'POST') {
            $presenter->data_form = $data_form = array(
                'authority'        => \Input::post('authority'),
                'user_id'          => \Input::post('user_id'),
                'user_name'        => \Input::post('user_name'),
                'user_address'     => \Input::post('user_address'),
                'user_phone_no'    => \Input::post('user_phone_no'),
                'company_id'       => \Input::post('company_id'),
                'company_name'     => \Input::post('company_name'),
                'company_address'  => \Input::post('company_address'),
                'company_phone_no' => \Input::post('company_phone_no'),
                'brand_id'         => \Input::post('brand_id'),
                'brand_name'       => \Input::post('brand_name'),
                'brand_address'    => \Input::post('brand_address'),
                'brand_phone_no'   => \Input::post('brand_phone_no'),
                'store_id'         => \Input::post('store_id'),
                'store_name'       => \Input::post('store_name'),
                'store_address'    => \Input::post('store_address'),
                'store_phone_no'   => \Input::post('store_phone_no'),
            );
            extract($data_form);
            $presenter->condition = $user->buildConditionGetUser(
                $authority,
                $user_id,    $user_name,    $user_address,    $user_phone_no
            );
            $relate_to_company = \Model_User::buildRelationShip('company', $company_id, $company_name, $company_address, $company_phone_no);
            $relate_to_brand   = \Model_User::buildRelationShip('brand', $brand_id, $brand_name, $brand_address, $brand_phone_no);
            $relate_to_store   = \Model_User::buildRelationShip('store', $store_id, $store_name, $store_address, $store_phone_no);
            if (!empty($relate_to_company)) {
                $presenter->relate['company']['where'] = $relate_to_company;
            }
            if (!empty($relate_to_brand)) {
                $presenter->relate['brand']['where'] = $relate_to_brand;
            }
            if (!empty($relate_to_store)) {
                $presenter->relate['store']['where'] = $relate_to_store;
            }
        }


        $this->template->title = 'アカウント一覧';
        $this->template->content = $presenter;
    }

    function action_login()
    {
        if (\Auth::check()) {
            \Response::redirect_back('web/home');
        }

        if (\Input::method() == 'POST') {
            $email = \Input::post('email');
            $password = \Input::post('password');
            if (isset($email) && isset($password)) {
                if (\Auth::instance()->login($email, $password)) {
                    \Response::redirect_back('web/home');
                } else {
                    \Session::set_flash('error', array('メールまたはパスワードが違います。'));
                }
            } else {
                \Session::set_flash('error', array('入力されていません。'));
            }
        }
        $this->template->title = 'ログイン';
        $this->template->content = \View::forge('web::user/login');
    }

    function action_logout()
    {
        \Auth::logout();
        \Response::redirect_back('web/user/login');
    }

    function action_create()
    {
        $presenter = \Presenter::forge("web::user/create");
        $presenter->user = \Auth::instance()->get_user();
        $presenter->data_form = array();
        $presenter->is_edit = false;
        if (\Input::method() == 'POST') {
            $fieldset = \Fieldset::forge()->add_model('Model_User');
            $presenter->data_form = \Input::post();
            $error_relate = \Model_User::checkCreateUserIllegal(\Input::post('company_id'), \Input::post('brand_id'), \Input::post('store_id'));
            $errors = empty($error_relate) ? array() : array($error_relate);

            if (empty($error_relate) && $fieldset->validation()->run() == true) {
                $nullable_field = $fields = $fieldset->validated();
                unset($nullable_field['mail_address'], $nullable_field['password'], $nullable_field['name'], $nullable_field['authority']);
                try {
                    \Auth::create_user($fields['mail_address'], $fields['password'], $fields['name'], $fields['authority'], $nullable_field);
                } catch(\Exception $e) {
                    $errors[] = $e->getMessage();
                }
            } else {
                $errors[] = $fieldset->validation()->show_errors();
            }
            if (count($errors) == 0) {
                \Session::set_flash('success', 'ユーザを作成しました。');
                \Response::redirect('web/user/list');
            } else {
                \Session::set_flash('error', $errors);
            }
        }

        $this->template->title = 'アカウント登録';
        $this->template->content = $presenter;
    }

    function action_delete($user_id)
    {
        $user = \Auth::instance()->get_user();
        $delete_user = \Model_User::find($user_id);
        if ($user->authority < $delete_user->authority) {
            \Response::redirect_back('web/user/list');
        }
        $delete_user->delete();
        \Session::set_flash('success', 'ユーザ【ID:' . $user_id . '】を作成しました。');
        \Response::redirect_back('web/user/list');
    }
}