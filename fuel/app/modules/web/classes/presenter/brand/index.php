<?php
namespace Web;

class Presenter_Brand_Index extends \Presenter_Web
{
    public function view()
    {
        $this->status = array('' => 'すべて', STATUS_DELETE => STATUS_DELETE_LABEL, STATUS_CLOSED => STATUS_CLOSED_LABEL, STATUS_PREPARATION => STATUS_PREPARATION_LABEL, STATUS_DURING_BUSINESS => STATUS_DURING_BUSINESS_LABEL);
        $brands = \Model_Brand::find('all', array('where' => $this->condition));
        $this->brands = array();
        if (!$this->check_error) {
            foreach ($brands as $brand) {
                if (!empty($brand->company)) {
                    if (in_array($brand->company->company_status, array(STATUS_PREPARATION, STATUS_DURING_BUSINESS))) {
                        $this->brands[] = $brand;
                    }
                }
            }
        }
        $this->list = \View::forge('web::brand/_list', array('brands' => $this->brands, 'label' => $this->label, 'status' => $this->status));
    }
}