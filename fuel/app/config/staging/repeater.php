<?php
return array(
    'email_key' => array(
        'from' => 'repeater@gmo.jp',
    ),
    'mail_service' => array(
        'url' => 'https://b015.repica.jp/tm/lpmail.php',
        'account' => array(
            'name' => 'Ur7e-01',
            'password' => 'uXr4FNMU',
            'site_id' => "163",
            'service_id' => '277',
        )
    ),
    'server_apps' => array(
        'api_server' => array(
            'scheme' => 'https',
            'host' => 'st-api.gmorepeater.jp',
            'version' => '1',
        ),
        'web_server' => array(
            'scheme' => 'https',
            'host' => 'st.gmorepeater.jp',
            'client_id' => 'test',
        ),
        'img_server' => array(
            'scheme_http' => 'http',
            'scheme_https' => 'https',
            'host' => 'st-img.gmorepeater.jp',
            'port' => '9080',
            'version' => '1',
            'root_dir' => '/var/www/st-img.gmorepeater.jp/current/public',
	    'display_dir' => '/assets/img/picture/',
        ),
    ),
    'object_storage' => array(
        'user' => 'app019860005',
        'pass' => 'hmh9uGZDRdaiMAizaFWaePWUZg5c3tHd',
        'tenant_id' => 'cb3f5896d825402492c42a34ec9e931f',
        'tenant_name' => 'app27925743356d7093a',
        'identify_endpoint' => 'https://ident-r2nd1001.app-sys.jp/v2.0/',
        'storage_endpoint' => 'https://objectstore-r2nd1001.app-sys.jp/v1/gac_cb3f5896d825402492c42a34ec9e931f',
        'region' => 'tokyo-2',
        'container' => 'repeater-picture',
    ),
	'domain' => array(
		'st.gmorepeater.jp',
		'st-img.gmorepeater.jp',
		'st-api.gmorepeater.jp',
	),
);
