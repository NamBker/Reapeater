<?php

class ObjectStorage
{
    public static function upload($object_name, $content)
    {
        $swift_config = Config::get('repeater.object_storage');
        $token = self::_get_token();
        $url = "{$swift_config['storage_endpoint']}/{$swift_config['container']}/{$object_name}";
    	$handle = fopen($content, "r");
        $client = new \GuzzleHttp\Client(['base_url' => $url]);
        $response = $client->put($url, [
            'headers' => ['X-Auth-Token' => $token],
            'body' => $handle,
        ]);
    }

    public static function download($object)
    {
        $swift_config = Config::get('repeater.object_storage');
        $token = self::_get_token();

        $url = "{$swift_config['storage_endpoint']}/{$swift_config['container']}/{$object}";
        $client = new \GuzzleHttp\Client(['base_url' => $url]);
        $response = $client->get($url, [
            'headers' => ['X-Auth-Token' => $token],
        ]);
        $data = array();
        $data['content_type'] = $response->getHeader('Content-Type');
        $data['body'] = $response->getBody();
        return $data;
    }

    public static function delete($object)
    {
        $swift_config = Config::get('repeater.object_storage');
        $token = self::_get_token();
        $url = "{$swift_config['storage_endpoint']}/{$swift_config['container']}/{$object}";
        $client = new \GuzzleHttp\Client(['base_url' => $url]);
        $response = $client->delete($url, [
            'headers' => ['X-Auth-Token' => $token],
        ]);
        $data = array();
        $data['content_type'] = $response->getHeader('Content-Type');
        $data['body'] = $response->getBody();
        return $data;
    }

    private static function _get_token()
    {
	try {
        $url = \Config::get('repeater.object_storage.identify_endpoint').'tokens';
        $client = new \GuzzleHttp\Client(['base_url' => $url]);
        $response = $client->post($url, [
            'headers' => ['Content-Type' => 'applicatoin/json', 'Accept' => 'application/json'],
            'body' => json_encode(self::_create_params()),
        ]);

		$status = $response->getStatusCode();
		$body   = (string)$response->getBody();
	
	} catch (Exception $ex) {
		\Additional_Log::warning_params('create token curl error', $e->getMessage());
		return;
	}

	if ($status == 200)
	{
	    $body_arr = \Format::forge($body, 'json')->to_array();
	    $token = $body_arr['access']['token']['id'];
	    return $token;
	}
	else
	{
	    \Additional_Log::warning_params('cannot create objectstrage token', $body);
	}
    }

    private static function _create_params()
    {
    	$params = array(
    	    'auth'	=> array(
    	        'passwordCredentials'    => array(
    	            'username'    => \Config::get('repeater.object_storage.user'),
    	            'password'    => \Config::get('repeater.object_storage.pass'),
    	        ),
    	        'tenantId'    => \Config::get('repeater.object_storage.tenant_id'),
    	    ),
    	);
    	return $params;
    }
}
