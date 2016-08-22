<?php

class Model_Oauth_Client extends \Model_Standard_Model
{

    protected static $_properties = array(
        'id',
        'name' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    32,
                ),
            ),
        ),
        'client_type' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    127,
                ),
            ),
        ),
        'grant_type' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    127,
                ),
            ),
        ),
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
        'client_secret' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    128,
                ),
            ),
        ),
        'client_origin' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    128,
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

    public static function checkOauthClient($client_id, $client_secret)
    {
        return static::find('first',
            array('where' => array(
                array('client_id', $client_id),
                array('client_secret', $client_secret)
            )), \ProtocolException::RESULT_CODE_OAUTH_CLIENT_NOT_FOUND, \Lang::get('client_invalid'), "The client credentials are invalid."
        );
    }
}