<?php
namespace Api;

/**
 * Class Token
 * @package Api
 */
class Controller_Oauth_Token extends \Controller_Api
{
    protected static $required_parameters = array(
        'create' => array(
            'client_id' => true,
            'client_secret' => false,
            'username' => true,
            'password' => true,
        ),
    );

    protected $is_access_token_ignore_request = true;

    protected function create()
    {
        \Additional_Log::debug('oauth/access_token called');
        $server = \Model_Oauth_Server::forge();

        if ($server->login($this->params['username'], $this->params['password']) &&
            $oauth_client = \Model_Oauth_Client::checkOauthClient($this->params['client_id'], $this->params['client_secret'])) {
            $token = $server->createAccessToken($this->params['client_id'], $server->getUserField('id'));
            $user = \Model_User::find($server->getUserField('id'));
            $user->save();
            $this->response_fields['token'] = $token;
        }
    }
}