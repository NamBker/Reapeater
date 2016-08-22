<?php
namespace Web;
class Presenter_Store_Register extends \Presenter
{

    public function view()
    {
        $this->status = array('' => 'すべて', STORE_STATUS_DELETE => STATUS_DELETE_LABEL, STORE_STATUS_CLOSED => STATUS_CLOSED_LABEL, STORE_STATUS_PREPARATION => STATUS_PREPARATION_LABEL, STORE_STATUS_DURING_BUSINESS => STATUS_DURING_BUSINESS_LABEL);
    }
}