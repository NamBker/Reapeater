<?php
namespace Web;

class Controller_Home extends \Controller_Web
{
    function action_index()
    {
        $oauth_server = \Model_Oauth_Server::forge();
        $oauth_server->setUserField('id', \Auth::instance()->get_user()->id);
        $web_server = \Config::get("repeater.server_apps.web_server");
        $api_server = \Config::get("repeater.server_apps.api_server");
        $apiHost = $api_server["scheme"]."://".$api_server["host"]."/".$api_server["version"];
        $apiToken = $oauth_server->createAccessToken($web_server["client_id"], \Auth::instance()->get_user()->id);
        return \Response::forge(\View::forge("web::home", array('apiToken' => $apiToken, 'apiHost' => $apiHost)));
    }
}
