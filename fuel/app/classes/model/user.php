<?php

class Model_User extends \Model_Standard_Model
{

    protected static $_properties = array(
        'id' => array('data_type'  => 'int'),
        'mail_address' => array(
            'data_type'  => 'varchar',
            'null'       => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    32,
                ),
            ),
            'label'      => 'メ－ルアドレス',
        ),
        'password'     => array(
            'data_type'  => 'varchar',
            'null'       => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    255,
                ),
            ),
            'label'      => 'パスワード',
            'expose_type' => 'null',
        ),
        'authority'    => array(
            'data_type'  => 'int',
            'null'       => false,
            'validation' => array(
                'required',
                'numeric_between' => array(
                    1,
                    5,
                ),
            ),
            'label'      => '権限',
        ),
        'company_id'   => array(
            'data_type'  => 'int',
            'null'       => true,
            'validation' => array(
                'numeric_between' => array(
                    1,
                    2147483647,
                ),
            ),
            'label'      => '企業ID',
        ),
        'brand_id'     => array(
            'data_type'  => 'int',
            'null'       => true,
            'validation' => array(
                'numeric_between' => array(
                    1,
                    2147483647,
                ),
            ),
            'label'      => 'ブランドID',
        ),
        'section_id'   => array(
            'data_type'  => 'int',
            'null'       => true,
            'validation' => array(
                'numeric_between' => array(
                    1,
                    2147483647,
                ),
            ),
            'label'      => '事業部ID',
        ),
        'store_id'     => array(
            'data_type'  => 'int',
            'null'       => true,
            'validation' => array(
                'numeric_between' => array(
                    1,
                    2147483647,
                ),
            ),
            'label'      => '店舗ID',
        ),
        'name'         => array(
            'data_type'  => 'varchar',
            'null'       => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    16,
                ),
            ),
            'label'      => '名前',
        ),
        'address'      => array(
            'data_type'  => 'varchar',
            'null'       => true,
            'validation' => array(
                'max_length' => array(
                    64,
                ),
            ),
            'label'      => '住所',
        ),
        'phone_no'     => array(
            'data_type'  => 'varchar',
            'null'       => true,
            'validation' => array(
                'max_length' => array(
                    16,
                ),
            ),
            'label'      => '電話番号',
        ),
        'created_at'   => array(
            'data_type'   => 'datetime',
            'expose_type' => 'null',
        ),
        'updated_at'   => array(
            'data_type'   => 'datetime',
            'expose_type' => 'null',
        ),
    );

    protected static $_belongs_to = array(
        'company' => array(
            'model_to' => 'Model_Company',
            'key_from' => 'company_id',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'brand' => array(
            'model_to' => 'Model_Brand',
            'key_from' => array('company_id', 'brand_id'),
            'key_to' => array('company_id', 'id'),
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'section' => array(
            'model_to' => 'Model_Section',
            'key_from' => array('company_id', 'brand_id', 'section_id'),
            'key_to' => array('company_id', 'brand_id', 'id'),
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'store' => array(
            'model_to' => 'Model_Store',
            'key_from' => array('brand_id', 'section_id', 'store_id'),
            'key_to' => array('brand_id', 'section_id', 'id'),
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );

    protected static $_has_many = array(
        'companies' => array(
            'model_to'       => 'Model_Company',
            'key_from'       => null,
            'key_to'         => null,
            'cascade_save'   => false,
            'cascade_delete' => false,
            'expose_type'    => 'null',
        )

    );

    public static function findByToken($token)
    {
        $auth_token = \Model_Oauth_Access_Token::find('first', array(
            'where' => array(
                'access_token' => $token
            )
        ), \ProtocolException::RESULT_CODE_OAUTH_ACCESS_TOKEN_NOT_FOUND);

        return $auth_token->user;
    }

    public function checkCompanyAvailability()
    {
        return $this->authority < USER_AUTHORITY_COMPANY;
    }

    public static function findByEmail($email)
    {
        return static::find('first', array('where' => array(array('mail_address', $email))));
    }

    public function buildConditionGetUser(
        $authority,
        $user_id, $user_name, $user_address, $user_phone_no
    )
    {
        $condition = array();
        switch ($this->authority) {
            case USER_AUTHORITY_STORE:
                $condition[] = array('store_id', $this->store_id);
            case USER_AUTHORITY_SECTION:
                $condition[] = array('section_id', $this->section_id);
            case USER_AUTHORITY_BRAND:
                $condition[] = array('brand_id', $this->brand_id);
            case USER_AUTHORITY_COMPANY:
                $condition[] = array('company_id', $this->company_id);
        }

        if (!empty($authority) || $authority === "" . USER_AUTHORITY_ADMIN) {
            $condition[] = array('authority', $authority);
        }

        if (!empty($user_id)) {
            $condition[] = array('id', $user_id);
        }

        if (!empty($user_name)) {
            $condition[] = array('name', 'LIKE', "%$user_name%");
        }

        if (!empty($user_address)) {
            $condition[] = array('address', 'LIKE', "%$user_address%");
        }

        if (!empty($user_phone_no)) {
            $condition[] = array('phone_no', $user_phone_no);
        }

        return $condition;
    }

    public static function buildRelationShip($to_object, $id, $name, $address, $phone_no)
    {
        $relate = array();
        if (!empty($id) || !empty($name) || !empty($address) || !empty($phone_no)) {
            if (!empty($id)) {
                $relate[] = array('id', $id);
            }

            if (!empty($name)) {
                $relate[] = array($to_object . '_name', 'LIKE', "%$name%");
            }

            if (!empty($address)) {
                $relate[] = array($to_object . '_address', 'LIKE', "%$address%");
            }

            if (!empty($phone_no)) {
                $relate[] = array($to_object . '_phone_no', $phone_no);
            }
        }

        return $relate;
    }

    public function checkBrandAvailability()
    {
        return $this->authority < USER_AUTHORITY_BRAND;

    }

    public function getOptions()
    {
        $company_options = $brand_options = $store_options = array('' => '');
        if ($this->authority < USER_AUTHORITY_COMPANY) {
            foreach ($this->companies as $company) {
                $company_options[$company->id] = $company->company_name;
                $company->getBrandStoreOptions($brand_options, $store_options);
            }
            return array('company' => $company_options, 'brand' => $brand_options, 'store' => $store_options);
        }


        if (!empty($this->company)) {
            $company_options = array($this->company_id => $this->company->company_name);;
            if ($this->authority < USER_AUTHORITY_BRAND) {
                $this->company->getBrandStoreOptions($brand_options, $store_options);
            } else {
                if (!empty($this->brand)) {
                    $brand_options = array($this->brand_id => $this->brand->brand_name);
                    if ($this->authority < USER_AUTHORITY_STORE) {
                        $this->brand->getStoreOptions($store_options);
                    } else {
                        if (!empty($this->store)) {
                            $store_options = array($this->store_id =>$this->store->store_name);
                        }
                    }
                }
            }
        }

        return array('company' => $company_options, 'brand' => $brand_options, 'store' => $store_options);
    }

    public function getLabel($field_name)
    {
        return static::property($field_name)['label'];
    }

    public function getAuthorityOptions()
    {
        $options = array('' => '');
        switch ($this->authority) {
            case USER_AUTHORITY_ADMIN:
                $options[USER_AUTHORITY_ADMIN] = '管理';
            case USER_AUTHORITY_COMPANY:
                $options[USER_AUTHORITY_COMPANY] = '企業';
            case USER_AUTHORITY_BRAND:
                $options[USER_AUTHORITY_BRAND] = 'ブランド';
            case USER_AUTHORITY_SECTION:
                $options[USER_AUTHORITY_SECTION] = '事業部';
            case USER_AUTHORITY_STORE:
                $options[USER_AUTHORITY_STORE] = '店舗';
        }
        return $options;
    }

    public static function checkCreateUserIllegal($company_id, $brand_id, $store_id)
    {
        if (empty($company_id) && (!empty($brand_id) || !empty($store_id))) {
            throw new \ProtocolException(\Lang::get('company_choice'), "Company_id is empty.", \ProtocolException::RESULT_CODE_CREATE_USER_INVALID);
        }
        if (empty($brand_id) && !empty($store_id)) {
            throw new \ProtocolException(\Lang::get('brand_choice'), "brand_id is empty.", \ProtocolException::RESULT_CODE_CREATE_USER_INVALID);
        }

        if (!empty($company_id) && !empty($brand_id)) {
            $company = \Model_Company::find($company_id);
            $brand = $company->findBrand($brand_id);
            if (empty($brand)) {
                throw new \ProtocolException(\Lang::get('brand_is_not_relate'), "Brand is not relate to company", \ProtocolException::RESULT_CODE_CREATE_USER_INVALID);
            }
        } else {
            return true;
        }

        if (!empty($store_id)) {
            $store = $brand->findStore($store_id);
            if (empty($store)) {
                throw new \ProtocolException(\Lang::get('store_is_not_relate'), "Store is not relate to brand", \ProtocolException::RESULT_CODE_CREATE_USER_INVALID);
            }
        }
        return true;
    }

    public function getCompanies()
    {
        $companies = array();
        if ($this->authority >= USER_AUTHORITY_COMPANY) {
            $company_arr = array('id' => $this->company_id, 'company_name' => $this->company->company_name);
            $company_arr['brands'] = $this->company->getBrands($this, $this->authority);
            $companies[] = $company_arr;
        } else {
            foreach ($this->companies as $company) {
                $company_arr = array('id' => $company->id, 'company_name' => $company->company_name);
                $company_arr['brands'] = $company->getBrands($this, $this->authority);
                $companies[] = $company_arr;
            }
        }
        return $companies;
    }

    /**
     * 利用者権限チェック
     * @param $params
     * @throws \ProtocolException
     */
    public function authority($params)
    {
        // 対象店舗ID持替え
        if(!empty($params['store_id'])){
            $store_ids = array($params['store_id']);
        }else{
            if(!empty($params['store_ids'])){
                $store_ids = $params['store_ids'];
            }else{
                $store_ids = "";
            }
        }

        // 対象ブランドID持替え
        if(!empty($params['brand_id'])){
            $brand_ids = array($params['brand_id']);
        }else{
            if(!empty($params['brand_id'])){
                $brand_ids = $params['brand_id'];
            }else{
                $brand_ids = "";
            }
        }

        // 操作権限チェック
        $authority = $this->checkAuthority($params['company_id'], $brand_ids, $store_ids);
        if(!$authority){
            throw new \ProtocolException(\Lang::get('user_authority_error'), "user does not have authority for operation.", \ProtocolException::RESULT_CODE_USER_OPERATION_AUTHORITY_ERROR);
        }
    }

    /**
     * 自アカウントの画面操作チェック
     *
     * @param $company_id
     * @param $brand_ids
     * @param $store_ids
     * @return bool
     */
    public function checkAuthority($company_id, $brand_ids, $store_ids)
    {
        \Additional_Log::debug('【USER AUTHORITY CHECK】');
        if ($company_id && !$this->checkAuthorityCompanyId($company_id)) {
            return false;
        }
        if ($brand_ids && !$this->checkAuthorityBrandIds($brand_ids)) {
            return false;
        }
        if ($store_ids && !$this->checkAuthorityStoreIds($store_ids)) {
            return false;
        }
        return true;
    }

    public function checkAuthorityCompanyId($company_id)
    {
        \Additional_Log::debug('【USER AUTHORITY CHECK - COMPANY_ID】');
        if ($this->authority == USER_AUTHORITY_ADMIN) {
            return true;
        }
        return $this->company_id == $company_id;
    }

    public function checkAuthorityBrandIds($brand_ids)
    {
        \Additional_Log::debug('【USER AUTHORITY CHECK - BRAND_IDS】');
        if (count($brand_ids) < 1) {
            return false;
        }
        switch ($this->authority) {
            case USER_AUTHORITY_ADMIN:
                return true;
            case USER_AUTHORITY_COMPANY:
                $tmp = \DB::select('company_id')
                    ->from('brands')
                    ->where('id', 'IN', $brand_ids)
                    ->and_where('company_id', '!=', $this->company_id)
                    ->execute();
                return count($tmp) < 1;
            case USER_AUTHORITY_BRAND:
            default:
                return $brand_ids == [$this->brand_id];
        }
    }

    public function checkAuthorityStoreIds($store_ids)
    {
        \Additional_Log::debug('【USER AUTHORITY CHECK - STORE_IDS】');
        if (count($store_ids) < 1) {
            return false;
        }
        switch ($this->authority) {
            case USER_AUTHORITY_ADMIN:
                return true;
            case USER_AUTHORITY_COMPANY:
                $tmp = \DB::select('brand_id')
                    ->from('stores')
                    ->join('brands')->on('brands.id', '=', 'stores.brand_id')
                    ->where('stores.id', 'IN', $store_ids)
                    ->and_where('brands.company_id', '!=', $this->company_id)
                    ->execute();
                return count($tmp) < 1;
            case USER_AUTHORITY_BRAND:
                $tmp = \DB::select('brand_id')
                    ->from('stores')
                    ->where('id', 'IN', $store_ids)
                    ->and_where('brand_id', '!=', $this->brand_id)
                    ->execute();
                return count($tmp) < 1;
            case USER_AUTHORITY_SECTION:
                // 対象店舗に自ユーザ管轄外の店舗IDが含まれ無いかチャック
                $tmp = \DB::select('section_id')
                    ->from('stores')
                    ->where('id', 'IN', $store_ids)
                    ->and_where('section_id', '!=', $this->section_id)
                    ->execute();
                return count($tmp) < 1;
            case USER_AUTHORITY_STORE:
                return $store_ids == [$this->store_id];
        }
    }

    public function checkPermissionForUser()
    {
        // 企業権限はブランド以下の情報を保持しない可能性があるので、存在チェックは企業IDのみ
        if ($this->authority == USER_AUTHORITY_COMPANY) {
            if (empty($this->company_id)) {
                throw new \ProtocolException(\Lang::get('company_not_exist'), "It does not exist company information" ,
                    \ProtocolException::RESULT_CODE_COMPANY_NOT_EXIST);
            }
        }

        // ブランド権限は店舗以下の情報を保持しない可能性があるので、存在チェックは企業IDとブランドIDのみ
        if ($this->authority == USER_AUTHORITY_BRAND) {
            if (empty($this->company_id) || empty($this->brand_id)) {
                throw new \ProtocolException(\Lang::get('organization_not_exist'), "It does not exist company or brand information" ,
                    \ProtocolException::RESULT_CODE_COMPANY_AND_BRAND_NOT_EXIST);
            }
        }

        return true;
    }

}
