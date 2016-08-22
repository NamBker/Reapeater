<?php
/**
 * Use this file to override global defaults.
 *
 * See the individual environment DB configs for specific config information.
 */

$master = array(
	'type' => 'mysqli',
	'table_prefix'=>'',
	'connection'  => array(
		'hostname' => '127.0.0.1',
		'port' => '3306',
		'database' => 'staging_repeater',
		'username'   => 'repeater_web_app',
		'password'   => '2as52ivW7mvkdPT6PmBNahkEEHzJNFH6',
	),
	'charset'        => 'utf8',
);

$slave = array(
	'type' => 'mysqli',
	'table_prefix'=>'',
	'connection'  => array(
		'hostname' => '127.0.0.1',
		'port' => '3307',
		'database' => 'staging_repeater',
		'username'   => 'repeater_web_app',
		'password'   => '2as52ivW7mvkdPT6PmBNahkEEHzJNFH6',
	),
	'charset'        => 'utf8',
);


return array(
	'active' => 'master',
	'master' => $master,
	'slave' => $slave,
);
