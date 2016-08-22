<?php

namespace Web;


class Presenter_User_Create extends \Presenter_Web
{
    function view()
    {
        $options = $this->user->getOptions();
        $this->company_option = $options['company'];
        $this->brand_option   = $options['brand'];
        $this->store_option   = $options['store'];

    }
}