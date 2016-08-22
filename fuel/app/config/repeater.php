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
            'scheme' => 'http',
            'host' => '192.168.33.50',
            'version' => '1',
        ),
        'web_server' => array(
            'scheme' => 'http',
            'host' => '192.168.33.50',
            'client_id' => 'test',
        ),
        'img_server' => array(
            'scheme_http' => 'http',
            'scheme_https' => 'https',
            'host' => '192.168.33.50',
            'port' => '80',
            'version' => '1',
        //    'root_dir' => '/var/www/local.gmorepeater.jp/public', //開発環境に合わせて変更をお願いします。
            'root_dir' => '/vagrant/mastermaster/repeater-web-app/public',
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
    ),
);
