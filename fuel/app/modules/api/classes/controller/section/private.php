<?php

namespace Api;
class Controller_Section_Private extends \Controller_Api
{

    protected static $required_parameters = array(
        'index' => array(
            'section_id' => false,
            'pattern' => true,
        ),
    );

    protected function index()
    {
        \Additional_Log::debug('section/index called');
        $user = \Model_User::find($this->user_id);
        if (empty($user)) {
            throw new \HttpForbiddenException(\Lang::get('user_is_invalid'));
        } else {
            $section_id = !empty($this->params['section_id']) ? $this->params['section_id']: $user->section_id;
            $section = \Model_Section::find('first', array('where' => array('id'=>$section_id)));
            $respone = $section->toArray($this->params['pattern']);

            $store_ids = array();
            if(!empty($section) && !empty($section->stores))
            {
                foreach($section->stores as $store){
                    if($store->brand_id == $section->brand_id){
                        array_push($store_ids, $store->id);
                    }
                }
            }

            $respone['store_ids'] = $store_ids;



            $this->response_fields['section'] = $respone;
        }
    }
}