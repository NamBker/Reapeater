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
		'hostname' => '192.168.33.50',
		'port' => '3306',
		'database' => 'repeater',
		'username'   => 'gmoc',
		'password'   => 'gmoc',
	),
	'charset'        => 'utf8',
);

$slave = array(
	'type' => 'mysqli',
	'table_prefix'=>'',
	'connection'  => array(
		'hostname' => '192.168.33.50',
		'port' => '3306',
		'database' => 'repeater',
		'username'   => 'gmoc',
		'password'   => 'gmoc',
	),
	'charset'        => 'utf8',
);


return array(
	'active' => 'master',
	'master' => $master,
	'slave' => $slave,
);
