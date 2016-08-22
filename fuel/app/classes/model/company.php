<?php

class Model_Company extends \Model_Standard_Model
{
	const STATUS_DELETE      = 0;
	const STATUS_CLOSE       = 1;
	const STATUS_PREPARATION = 2;
	const STATUS_OPEN        = 3;

    protected static $_table_name = "companies";
    protected static $_properties = array(
        'id' => array(
            'data_type' => 'int',
        ),
        'company_status' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'default' => 2,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    0,
                    3,
                ),
            ),
            'expose_pattern' => 2,
        ),
        'company_name' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    32,
                ),
            ),
            'expose_pattern' => 1,
        ),
        'company_ceo' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    32,
                ),
            ),
            'expose_pattern' => 3,
        ),
        'company_address' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    64,
                ),
            ),
            'expose_pattern' => 2,
        ),
        'company_phone_no' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    16,
                ),
            ),
            'expose_pattern' => 2,
        ),
        'company_regular_holiday' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    16,
                ),
            ),
            'expose_pattern' => 3,
        ),
        'company_signature_block' => array(
            'data_type' => 'text',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    65535,
                ),
            ),
            'expose_pattern' => 3,
        ),
        'company_terms_of_use' => array(
            'data_type' => 'text',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    65535,
                ),
            ),
            'expose_pattern' => 3,
        ),
        'company_privacy_policy' => array(
            'data_type' => 'text',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    65535,
                ),
            ),
            'expose_pattern' => 3,
        ),
        'company_freeword' => array(
            'data_type' => 'text',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    65535,
                ),
            ),
            'expose_pattern' => 3,
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

    protected static $_has_many = array(
        'brands' => array(
            'key_from' => 'id',
            'model_to' => 'Model_brand',
            'key_to' => 'company_id',
            'cascade_save' => true,
            'cascade_delete' => false,
        ),
    );

    public function getBrandStoreOptions(&$brand_options, &$store_options) {
        foreach ($this->brands as $brand) {
            $brand_options[$this->company_name][$brand->id] = $brand->brand_name;
            $brand->getStoreOptions($store_options);
        }
    }

    public function findBrand($brand_id)
    {
        foreach ($this->brands as $brand) {
            if ($brand->id == $brand_id) {
                return $brand;
            }
        }
        return null;
    }

    public function getBrands($user, $authority)
    {
        $brands = array();
        foreach ($this->brands as $brand) {
            if ($authority < USER_AUTHORITY_BRAND || $brand->id == $user->brand_id) {
                $brand_arr = array('id' => $brand->id, 'brand_name' => $brand->brand_name);
                $brand_arr['stores'] = $brand->getStores($user, $authority);
                $brands[] = $brand_arr;
            }
        }

        return $brands;
    }

    public static function findById($id)
    {
        return self::find($id, array());
    }
}
