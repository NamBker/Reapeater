<?php 

class Model_Test extends \Model_Standard_Model{
 	protected static $_properties = array(
        'id' => array('data_type'  => 'int'),
        'name' => array(
            'data_type'  => 'varchar',
            'null'       => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    32,
                ),
             )
           )
        );

	public static function addTest(abc){


	}
}

 ?>