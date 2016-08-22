<?php
// Bootstrap the framework DO NOT edit this
require COREPATH.'bootstrap.php';

\Autoloader::add_classes(array(
    // Add classes you want to override here
    // Example: 'View' => APPPATH.'classes/view.php',
    'Fuel\\Core\\HttpBadRequestException' => APPPATH.'classes/httpexceptions.php',
    'Fuel\\Core\\HttpUnauthorizedException' => APPPATH.'classes/httpexceptions.php',
    'Fuel\\Core\\HttpForbiddenException' => APPPATH.'classes/httpexceptions.php',
    'Fuel\\Core\\HttpRequestTimeoutException' => APPPATH.'classes/httpexceptions.php',
    'Fuel\\Core\\HttpUpgradeRequiredException' => APPPATH.'classes/httpexceptions.php',
    'Fuel\\Core\\HttpServiceUnavailableException' => APPPATH.'classes/httpexceptions.php',
    'ProtocolException' => APPPATH.'classes/customexceptions.php',
    'Format' => APPPATH. 'classes/format.php',
    'Agent' => APPPATH.'classes/agent.php'
));

// Register the autoloader
\Autoloader::register();

/**
 * Your environment.  Can be set to any of the following:
 *
 * Fuel::DEVELOPMENT
 * Fuel::TEST
 * Fuel::STAGING
 * Fuel::PRODUCTION
 */
\Fuel::$env = \Arr::get($_SERVER, 'FUEL_ENV', \Arr::get($_ENV, 'FUEL_ENV', \Fuel::DEVELOPMENT));

// Initialize the framework with the config file.
require_once 'constants.php';

\Fuel::init('config.php');

Config::set('language', 'ja');