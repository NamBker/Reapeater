<?php

class Model_Oauth_Access_Token extends \Model_Standard_Model
{
    protected static $_primary_key = array('access_token');
    protected static $_properties = array(
        'access_token',
        'client_id' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    128,
                ),
            ),
        ),
        'account_id' => array(
            'data_type' => 'int',
            'null' => false,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    1,
                    2147483647,
                ),
            ),
        ),
        'created_at' => array(
            'data_type' => 'datetime',
            'expose_type' => 'null',
        ),
        'updated_at' => array(
            'data_type' => 'datetime',
            'expose_type' => 'null',
        ),
    );

    protected static $_has_one = array(
        'user' => array(
            'model_to' => 'Model_User',
            'key_from' => 'account_id',
            'key_to' => 'id',
            'cascade_save' => true,
            'cascade_delete' => false
        ),
        'client' => array(
            'model_to' => 'Model_Oauth_Client',
            'key_from' => 'client_id',
            'key_to' => 'client_id',
            'cascade_save' => false,
            'cascade_delete' => false
        ),
    );

    public function checkAccessToken(\Response $response)
    {
        $oauth_client = \Model_Oauth_Client::find('first', array('where' => array('client_id' => $this->client_id)));
        if (isset($oauth_client)) {
            if ($oauth_client->client_type == OAUTH_CLIENT_CLIENT_TYPE_USER_AGENT_BASE) {
                $client_origin = \Input::server('HTTP_ORIGIN');
                if ($oauth_client->client_origin == $client_origin) {
                    $response->set_header('Access-Control-Allow-Origin', $oauth_client->client_origin, true);
                    return true;
                } else {
                    \Additional_Log::warning("Invalid origin. input origin:{$client_origin}, client origin:{$oauth_client->client_origin}.");
                    return false;
                }
            } else {
                return true;
            }
        } else {
            \Additional_Log::info("Invalid token. input client:{$this->client_id}.");
            return false;
        }
    }
}
