<?php
class Agent extends Fuel\Core\Agent
{
    public static function _init()
    {
        parent::_init();

        $sp_list = array(
                       'iPhone',
                       'iPod',
                       'Android',
                       'IEMobile',
                       'dream',
                       'CUPCAKE',
                       'blackberry9500',
                       'blackberry9530',
                       'blackberry9520',
                       'blackberry9550',
                       'blackberry9800',
                       'webOS',
                       'incognito',
                       'webmate'
                   );
        
        $fp_list = array(
                        'DoCoMo',
                        'KDDI',
                        'DDIPOKET',
                        'UP.Browser',
                        'J-PHONE',
                        'Vodafone',
                        'SoftBank',
                    );
		
		$au_fp_list = array(
                        'KDDI',
                        'UP.Browser',
                    );

		$pattern = '/'.implode('|', $sp_list).'/i';
		static::$properties['x_issmartphone'] = preg_match($pattern, static::$user_agent) ? true : false;
        
		$fp_pattern = '/'.implode('|', $fp_list).'/i';
		static::$properties['x_isfeaturephone'] = preg_match($fp_pattern, static::$user_agent) ? true : false;
		
		$au_fp_pattern = '/'.implode('|', $au_fp_list).'/i';
		static::$properties['x_isaufeaturephone'] = preg_match($au_fp_pattern, static::$user_agent) ? true : false;
	}

    public static function is_smartphone()
    {
        return static::$properties['x_issmartphone'];
    }
    
    public static function is_featurephone()
    {
        return static::$properties['x_isfeaturephone'];
    }
	
	public static function  is_aufeaturephone()
	{
		return static::$properties['x_isaufeaturephone'];
	}
}
