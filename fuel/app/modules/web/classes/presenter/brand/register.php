<?php
namespace Web;
class Presenter_Brand_Register extends \Presenter
{

    public function view()
    {
        // brand status
        $this->status = array('' => 'すべて', STATUS_DELETE => STATUS_DELETE_LABEL, STATUS_CLOSED => STATUS_CLOSED_LABEL, STATUS_PREPARATION => STATUS_PREPARATION_LABEL, STATUS_DURING_BUSINESS => STATUS_DURING_BUSINESS_LABEL);
    }
}