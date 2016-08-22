<?php

class Model_Oauth_Server
{
    private $user;
    public static function forge()
    {
        return new static ();
    }

    public function login($username, $password)
    {
        if ($this->user = \Auth::validate_user($username, $password)) {
            return true;
        }
        throw new \ProtocolException("ログインIDまたはパスワードが違います。ご確認ください。", "Incorrect username or password.", \ProtocolException::RESULT_CODE_LOGIN_USER_NAME_OR_PASSWORD_INCORRECT);
    }

    public function getUserField($field)
    {
        return $this->user[$field];
    }

    public function setUserField($field, $value)
    {
        $this->user[$field] = $value;
    }

    public function generateAccessToken()
    {
        if (function_exists('mcrypt_create_iv')) {
            $randomData = mcrypt_create_iv(20, MCRYPT_DEV_URANDOM);
            if ($randomData !== false && strlen($randomData) === 20) {
                return bin2hex($randomData);
            }
        }
        if (function_exists('openssl_random_pseudo_bytes')) {
            $randomData = openssl_random_pseudo_bytes(20);
            if ($randomData !== false && strlen($randomData) === 20) {
                return bin2hex($randomData);
            }
        }
        if (@file_exists('/dev/urandom')) { // Get 100 bytes of random data
            $randomData = file_get_contents('/dev/urandom', false, null, 0, 20);
            if ($randomData !== false && strlen($randomData) === 20) {
                return bin2hex($randomData);
            }
        }

        $randomData = mt_rand() . mt_rand() . mt_rand() . mt_rand() . microtime(true) . uniqid(mt_rand(), true);

        return substr(hash('sha512', $randomData), 0, 40);
    }

    public function createAccessToken($client_id, $account_id)
    {
        $access_token = \Model_Oauth_Access_Token::find('first', array('where' => array(array('client_id', $client_id), array('account_id', $account_id))));

        if (!isset($access_token)) {
            $token = $this->generateAccessToken();
            $access_token = \Model_Oauth_Access_Token::forge(array(
                'access_token' => $token,
                'client_id'    => $client_id,
                'account_id'   => $account_id,
            ));
            $access_token->save();
        }
        return $access_token->access_token;
    }


}