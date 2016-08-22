<?php
return array(
    'email_key' => array(
        'from' => 'repeater@gmo.jp',
    ),
    'mail_service' => array(
        'url' => 'https://b095.repica.jp/tm/lpmail.php',
        'account' => array(
            'name' => 'gmo-c-01',
            'password' => 'ZhGUwgFz',
            'site_id' => "1",
            'service_id' => '1',
        )
    ),
    'server_apps' => array(
        'api_server' => array(
            'scheme' => 'https',
            'host' => 'api.gmorepeater.jp',
            'version' => '1',
        ),
        'web_server' => array(
            'scheme' => 'https',
            'host' => 'gmorepeater.jp',
            'client_id' => 'web.gmorepeater',
        ),
        'img_server' => array(
            'scheme_http' => 'http',
            'scheme_https' => 'https',
            'host' => 'img.gmorepeater.jp',
            'port' => '9080',
            'version' => '1',
            'root_dir' => '/var/www/img.gmorepeater.jp/current/public',
	    'display_dir' => '/assets/img/picture/',
        ),
    ),
    'object_storage' => array(
        'user' => 'app019860006',
        'pass' => 'hmh9uGZDRdaiMAizaFWaePWUZfjskl89',
        'tenant_id' => 'f42e07e209fd4f1b89a7773da0065232',
        'tenant_name' => 'app2793574336d931648',
        'identify_endpoint' => 'https://ident-r2nd1001.app-sys.jp/v2.0/',
        'storage_endpoint' => 'https://objectstore-r2nd1001.app-sys.jp/v1/gac_f42e07e209fd4f1b89a7773da0065232',
        'region' => 'tokyo-2',
        'container' => 'repeater-picture',
    ),
	'domain' => array(
		'gmorepeater.jp',
		'img.gmorepeater.jp',
		'api.gmorepeater.jp',
	),
);
