<?php

class Model_Information_Publisher extends \Model_Standard_Model
{
    protected static $_table_name = "information_publisher";
    protected static $_properties = array(
        'id',
        'information_id' => array(
            'data_type' => 'int',
            'null' => false,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    1,
                    4294967295,
                ),
            ),
        ),
        'publisher_type' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    1,
                    3,
                ),
            ),
        ),
        'publisher_id' => array(
            'data_type' => 'int',
            'null' => false,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    1,
                    4294967295,
                ),
            ),
        ),
        'created_at' => array(
            'data_type' => 'datetime',
            'expose_type' => 'null',
        ),
        'updated_at' => array(
            'data_type' => 'datetime',
            'expose_type' => 'null',
        ),
    );

    protected static $_belongs_to = array(
        'information' => array(
            'model_to' => 'Model_Information',
            'key_from' => 'information_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );
}
