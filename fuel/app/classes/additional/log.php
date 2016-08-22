<?php

class Additional_Log extends Fuel\Core\Log
{
	/**
	 * @var  int  Log warning massages and below
	 */
	const L_NOTICE = 250;
	const L_CRITICAL = 500;

	public static function _init()
	{
		$log_file = \Config::get('log_file', null);
		if (\Config::get('log_path') == APPPATH.'logs/' && empty($log_file))
		{
			\Config::set('log_file', date('Ymd').'.php');

			if (\Uri::base(false))
			{
				$tmp = preg_replace('/https?:\/\//', '', \Uri::base(false));
				$domain = preg_replace('/\/.*$/', '', $tmp);
				\Config::set('log_path', APPPATH.'logs/'.$domain.'/');
			}
			else
			{
				\Config::set('log_path', APPPATH.'logs/general/');
			}
		}

		parent::_init();
	}

	private static function _get_caller()
	{
		$trace = debug_backtrace();
		//$file = preg_replace('/^'.preg_quote(APPPATH, '/').'/', '', $trace[0]['file']);
		$class = $trace[2]['class'].$trace[2]['type'].$trace[2]['function'];
		$line = $trace[1]['line'];
		$method = $class.'('.$line.')';

		return $method;
	}

	private static function _get_params_string($params)
	{
		return preg_replace('/\n/', '', var_export($params, true));
	}

	public static function info_params($msg, $params=array())
	{
		try
		{
			$method = self::_get_caller();
			return parent::info($msg.' - '.self::_get_params_string($params), $method);
		}
		catch (Exception $e)
		{
			// ignore
		}
	}

	public static function info($msg, $method=null)
	{
		try
		{
			$method = is_null($method) ? self::_get_caller() : $method;
			return parent::info($msg, $method);
		}
		catch (Exception $e)
		{
			// ignore
		}
	}

	public static function error_params($msg, $params=array())
	{
		try
		{
			$method = self::_get_caller();
			return parent::error($msg.' - '.self::_get_params_string($params), $method);
		}
		catch (Exception $e)
		{
			// ignore
		}
	}

	public static function error($msg, $method=null)
	{
		try
		{
			$method = is_null($method) ? self::_get_caller() : $method;
			return parent::error($msg, $method);
		}
		catch (Exception $e)
		{
			// ignore
		}
	}

	public static function warning_params($msg, $params=array())
	{
		try
		{
			$method = self::_get_caller();
			return parent::warning($msg.' - '.self::_get_params_string($params), $method);
		}
		catch (Exception $e)
		{
			// ignore
		}
	}

	public static function warning($msg, $method=null)
	{
		try
		{
			$method = is_null($method) ? self::_get_caller() : $method;
			return parent::warning($msg, $method);
		}
		catch (Exception $e)
		{
			// ignore
		}
	}

	public static function debug_params($msg, $params=array())
	{
		try
		{
			$method = self::_get_caller();
			return parent::debug($msg.' - '.self::_get_params_string($params), $method);
		}
		catch (Exception $e)
		{
			// ignore
		}
	}

	public static function debug($msg, $method=null)
	{
		try
		{
			$method = is_null($method) ? self::_get_caller() : $method;
			return parent::debug($msg, $method);
		}
		catch (Exception $e)
		{
			// ignore
		}
	}

	public static function apps_error_params($msg, $params=array())
	{
		try
		{
			return parent::error('APPS - '.$msg.' - '.self::_get_params_string($params), self::_get_caller());
		}
		catch (Exception $e)
		{
			// ignore
		}
	}

	public static function apps_warning_params($msg, $params=array())
	{
		try
		{
			return parent::warning('APPS - '.$msg.' - '.self::_get_params_string($params), self::_get_caller());
		}
		catch (Exception $e)
		{
			// ignore
		}
	}

	public static function apps_notice_params($msg, $params=array())
	{
		try
		{
			return static::notice('APPS - '.$msg.' - '.self::_get_params_string($params), self::_get_caller());
		}
		catch (Exception $e)
		{
			// ignore
		}
	}

	public static function apps_critical_params($msg, $params=array())
	{
		try
		{
			return static::critical('APPS - '.$msg.' - '.self::_get_params_string($params), self::_get_caller());
		}
		catch (Exception $e)
		{
			// ignore
		}
	}

	/**
	 * Logs a message with the Warning Log Level
	 *
	 * @param   string  $msg     The log message
	 * @param   string  $method  The method that logged
	 * @return  bool    If it was successfully logged
	 */
	public static function notice($msg, $method=null)
	{
		try
		{
			$method = is_null($method) ? self::_get_caller() : $method;
			return static::write(\Additional_Log::L_NOTICE, $msg, $method);
		}
		catch (Exception $e)
		{
			// ignore
		}
	}

	public static function notice_params($msg, $params=array())
	{
		try
		{
			return static::notice($msg.' - '.self::_get_params_string($params), self::_get_caller());
		}
		catch (Exception $e)
		{
			// ignore
		}
	}

	/**
	 * Logs a message with the Warning Log Level
	 *
	 * @param   string  $msg     The log message
	 * @param   string  $method  The method that logged
	 * @return  bool    If it was successfully logged
	 */
	public static function critical($msg, $method=null)
	{
		try
		{
			$method = is_null($method) ? self::_get_caller() : $method;
			return static::write(\Additional_Log::L_CRITICAL, $msg, $method);
		}
		catch (Exception $e)
		{
			// ignore
		}
	}

	public static function critical_params($msg, $params=array())
	{
		try
		{
			return static::critical($msg.' - '.self::_get_params_string($params), self::_get_caller());
		}
		catch (Exception $e)
		{
			// ignore
		}
	}

}
