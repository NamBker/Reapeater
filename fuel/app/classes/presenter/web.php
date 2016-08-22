<?php

class Presenter_Web extends \Presenter
{
    public function __toString()
    {
        try {
            return $this->render();
        } catch (\Exception $e) {
            return '<pre>' . $e->getTraceAsString() . '</pre>';
        }
    }
}