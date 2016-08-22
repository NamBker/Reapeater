<?php
namespace Web;

class Controller_Brand extends \Controller_Web
{
    private $label = array(
        "no" => 'No',
        "company_name" => "企業名",
        "status" => "状態",
        "brand_name" => "ブランド名",
        "brand_address" => "ブランド住所",
        "brand_phone_number" => "ブランド電話番号",
        "count_shop" => "店舗名"
    );

    function action_index()
    {
        $user = \Auth::instance()->get_user();
        $is_permission = $user->checkCompanyAvailability();
        $presenter = \Presenter::forge('web::brand/index');
        $presenter->condition = array();
        $presenter->check_error = false;
        $data_form = array();
        if (\Input::method() == "POST") {
            $data_form = array(
                'company_id' => \Input::post('company_id'),
                'brand_status' => \Input::post('brand_status'),
                'brand_id' => \Input::post('brand_id'),
                'brand_name' => \Input::post('brand_name'),
                'brand_address' => \Input::post('brand_address'),
                'phone_number' => \Input::post('phone_number')
            );

            if (!$this->checkPermission($data_form['company_id'], $user)) {
                \Session::set_flash('error', array('"管理者"権限がありません。'));
                $presenter->check_error = true;
            }
            $presenter->condition = \Model_Brand::buildQueryGetBrand(\Input::post('company_id'), \Input::post('brand_status'), \Input::post('brand_id'), \Input::post('brand_name'), \Input::post('brand_address'), \Input::post('phone_number'));
        } else {
            $presenter->condition = \Model_Brand::buildQueryGetBrand($user->company_id);
        }

        $presenter->data_form = $data_form;
        $presenter->label = $this->label;
        $presenter->is_permission = $is_permission;
        $presenter->company_id = $user->company_id;
        $this->template->title   = "ブランド一覧画面";
        $this->template->content = $presenter;
    }

    function checkPermission($company_id = '', $user) {
        if ($user->company_id != $company_id) {
            if (!$user->checkCompanyAvailability()) {
                return false;
            }
        }
        return true;
    }

    function action_create()
    {
        $user = \Auth::instance()->get_user();
        $fieldset = \Fieldset::forge()->add_model('Model_Brand');
        $presenter = \Presenter::forge("web::brand/register");
        if (\Input::method() == 'POST') {
            if ($fieldset->validation()->run() == true) {
                $brand = \Model_Brand::forge($fieldset->validated());
                $brand->company_id = $user->company->id;
                if ($brand->save()) {
                    \Session::set_flash('success', array("登録が成功しました"));
                }
            } else {
                $presenter->brand_obj = \Model_Brand::forge(\Input::post());
                \Session::set_flash('error', array($fieldset->validation()->show_errors()));
            }
        }else{

            $presenter->brand_obj = \Model_Brand::forge(array('brand_status' => STATUS_PREPARATION));
        }

        $presenter->company_name = $user->company->company_name;
        $this->template->title = "ブランド登録画面";
        $this->template->content = $presenter;
    }

    function action_edit($id)
    {
        $user = \Auth::instance()->get_user();
        $fieldset = \Fieldset::forge()->add_model('Model_Brand');
        $presenter = \Presenter::forge("web::brand/register");
        $brand_obj = \Model_Brand::find(array($id, $user->company->id));
        if (\Input::method() == 'POST') {
            if ($fieldset->validation()->run() == true) {
                $brand_obj->set($fieldset->validated());
                $brand_obj->company_id = $user->company->id;
                if ($brand_obj->save()) {
                    \Session::set_flash('success', array("更新が成功しました"));
                }
            } else {
                $brand_obj = \Model_Brand::forge(\Input::post());
                \Session::set_flash('error', array($fieldset->validation()->show_errors()));
            }
        }

        $presenter->brand_obj = $brand_obj;
        $presenter->brand_id = $id;
        $presenter->company_name = $user->company->company_name;
        $this->template->title = "ブランド更新画面";
        $this->template->content = $presenter;
    }
}