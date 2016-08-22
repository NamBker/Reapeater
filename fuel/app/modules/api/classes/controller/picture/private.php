<?php

namespace Api;
class Controller_Picture_Private extends \Controller_Api
{

    protected static $required_parameters = array(
        'index' => array(
            'picture_id' => false,
            'pattern' => true,
        ),
    );

    protected function index()
    {
        \Additional_Log::debug('private picture/index called');
        $user = \Model_User::find($this->user_id);
        if (empty($user)) {
            throw new \HttpForbiddenException('無効なユーザです');
        } else {
            $picture_id = !empty($this->params['picture_id']) ? $this->params['picture_id']: $user->picture_id;
            $picture = \Model_Picture::find('first', array('where' => array('id'=>$picture_id)));

            $picture->toArray($this->params['pattern']);

	    //画像URL作成
	    $picture_urls = \Model_Picture::makePictureUrl($picture);
	    $picture['picture_url'] = $picture_urls['url'];
	    $picture['picture_thumb_url'] = $picture_urls['thumb_url'];

            $this->response_fields['picture'] = $picture;
        }
    }
}