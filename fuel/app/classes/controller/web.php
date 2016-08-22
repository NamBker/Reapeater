<?php

class Controller_Web extends \Controller_Template
{
    public function before()
    {
        parent::before();
        if (!in_array($this->request->route->action, array('login', 'reset', 'result'))) {
            if (!\Auth::check()) {
                \Response::redirect_back('web/user/login');
            }
        }
    }
}