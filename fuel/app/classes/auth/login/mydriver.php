<?php

class Auth_Login_Mydriver extends \Auth\Auth_Login_Driver
{

    /**
     * @var  Database_Result  when login succeeded
     */
    protected $user = null;

    /**
     * Perform the actual login check
     *
     * @return  bool
     */
    protected function perform_check()
    {
        $email = \Session::get('email');
        if (!empty($email)) {
            if (is_null($this->user) || $this->user->username != $email) {
                $this->user = Model_User::find('first', array('where' => array(array('mail_address' => $email))));
            }
            if (!empty($this->user)) {
                return true;
            }
        } elseif (static::$remember_me and $user_id = static::$remember_me->get('user_id', null)) {
            return $this->force_login($user_id);
        }

        $this->user = false;
        \Session::delete('email');

        return false;
    }

    /**
     * Perform the actual login check
     *
     * @return  bool
     */
    public function validate_user($email = '', $password = '')
    {
        $email = trim($email) ?: trim(\Input::post('email'));
        $password = trim($password) ?: trim(\Input::post('password'));

        if (empty($email) or empty($password)) {
            $this->user = false;

            return false;
        }

        $password = $this->hash_password($password);
        $user = \Model_User::find('first', array(
            'where' => array(
                array('mail_address', $email),
                array('password' => $password)
            )
        ));

        return empty($user) ? false : $user;
    }

    /**
     * Login method
     *
     * @return  bool  whether login succeeded
     */
    public function login($email = '', $password = '')
    {
        if (!($this->user = $this->validate_user($email, $password))) {
            $this->user = false;
            \Session::delete('email');

            return false;
        }
        Auth::_register_verified($this);

        \Session::set('email', $this->user->mail_address);
        \Session::instance()->rotate();

        return true;
    }

    /**
     * Force login user
     *
     * @param   string
     * @return  bool
     */
    public function force_login($user_id = '')
    {
        if (empty($user_id)) {
            return false;
        }

        $user = Model_User::find($user_id);

        if (empty($user)) {
            $this->user = false;
            \Session::delete('email');
            return false;
        }

        \Session::set('email', $this->user->email);

        \Session::instance()->rotate();

        Auth::_register_verified($this);

        return true;
    }

    /**
     * Logout method
     */
    public function logout()
    {
        $this->user = false;
        \Session::delete('email');
        return true;
    }

    /**
     * Create new user
     *
     * @param   string
     * @param   string
     * @param   string  must contain valid email address
     * @param   int     group id
     * @param   Array
     * @return  bool
     */
    public function create_user($email, $password, $name, $group = 1, $other_fields = array())
    {
        $password = trim($password);
        $email = filter_var(trim($email), FILTER_VALIDATE_EMAIL);

        if (empty($name) or empty($password) or empty($email)) {
            throw new \SimpleUserUpdateException('メールアドレス、ユーザー名やパスワードが与えられていない、またはメールアドレスが無効です。');
        }

        $same_user = Model_User::find('first', array('where' => array(array('mail_address' => $email))));
        if (!empty($same_user)) {
            throw new \SimpleUserUpdateException('メールアドレスはすでに存在しています。');
        }

        $user = \Model_User::forge(array_merge(array(
            'mail_address' => $email,
            'password'     => $this->hash_password((string)$password),
            'authority'        => (int)$group,
            'name'         => $name
        ), $other_fields));
        $user->save();
        return $user;
    }

    /**
     * Update a user's properties
     * Note: Username cannot be updated, to update password the old password must be passed as old_password
     *
     * @param   Array  properties to be updated including profile fields
     * @param   string
     * @return  bool
     */
    public function update_user($values, $email = null)
    {
        $email = $email ?: $this->user->mail_address;

        $user = Model_User::find('first', array('where' => array(array('mail_address' => $email))));

        if (empty($user)) {
            throw new \SimpleUserUpdateException('Username not found', 4);
        }

        if (array_key_exists('password', $values)) {
            if (empty($values['old_password'])
                or $user->password != $this->hash_password(trim($values['old_password']))
            ) {
                throw new \SimpleUserWrongPassword('Old password is invalid');
            }

            $password = trim(strval($values['password']));
            if ($password === '') {
                throw new \SimpleUserUpdateException('Password can\'t be empty.');
            }
            $user->password = $this->hash_password($password);
            unset($values['password']);
        }
        if (array_key_exists('old_password', $values)) {
            unset($values['old_password']);
        }
        if (array_key_exists('mail_address', $values)) {
            $new_email = filter_var(trim($values['mail_address']), FILTER_VALIDATE_EMAIL);
            if (!$new_email) {
                throw new \SimpleUserUpdateException('Email address is not valid');
            }
            $matcher = Model_User::find('first',
                array(
                    'where' => array(
                        array('mail_address' => $new_email),
                        array('id', '<>', $user->id)
                    )
                ));
            if (!empty($matcher)) {
                throw new \SimpleUserUpdateException('メールアドレスは既に使用されています。');
            }
            $user->mail_address = $new_email;
            unset($values['email']);
        }
        if (array_key_exists('authority', $values)) {
            if (is_numeric($values['authority'])) {
                $user->authority = (int)$values['authority'];
            }
            unset($values['authority']);
        }
        if (!empty($values)) {
            if (!empty($values)) {
                foreach ($values as $key => $val) {
                    $user->{$key} = $val;
                }
            }
        }

        $is_saved = $user->save();
        if ($this->user->email == $email) {
            $this->user = $user;
        }

        return $is_saved;
    }

    /**
     * Change a user's password
     *
     * @param   string
     * @param   string
     * @param   string  username or null for current user
     * @return  bool
     */
    public function change_password($old_password, $new_password, $email = null)
    {
        try {
            return (bool)$this->update_user(array('old_password' => $old_password, 'password' => $new_password), $email);
        } catch (SimpleUserWrongPassword $e) {
            return false;
        }
    }

    /**
     * Generates new random password, sets it for the given username and returns the new password.
     * To be used for resetting a user's forgotten password, should be emailed afterwards.
     *
     * @param   string $username
     * @return  string
     */
    public function reset_password($email)
    {
        $new_password = \Str::random('alnum', 10);
        $password_hash = $this->hash_password($new_password);

        $user = Model_User::find('first', array('where' => array(array('mail_address' => $email))));
        if (empty($user)) {
            throw new \SimpleUserUpdateException('パスワードをリセットできませんでした、メールアドレスが無効でした。');
        }

        $user->password = $password_hash;
        $user->save();

        return $new_password;
    }

    /**
     * Deletes a given user
     *
     * @param   string
     * @return  bool
     */
    public function delete_user($email)
    {
        if (empty($email)) {
            throw new \SimpleUserUpdateException('Cannot delete user with empty email');
        }
        $user = Model_User::find('first', array('where' => array(array('mail_address' => $email))));

        if (empty($user)) {
            return false;
        }
        $user->delete();

        return true > 0;
    }

    /**
     * Get User Groups of the current logged in user
     * in the form: array(array(driver_id, group_id), array(driver_id, group_id), etc)
     *
     * @return  array
     */
    public function get_groups()
    {
        if (empty($this->user)) {
            return false;
        }

        return array(array('Simplegroup', $this->user->authority));
    }

    /**
     * Get User Identifier of the current logged in user
     * in the form: array(driver_id, user_id)
     *
     * @return  array
     */
    public function get_user_id()
    {
        if (empty($this->user)) {
            return false;
        }

        return array($this->id, (int)$this->user->id);
    }

    /**
     * Get emailaddress of the current logged in user
     *
     * @return  string
     */
    public function get_email()
    {
        return $this->get('email', false);
    }

    /**
     * Get screen name of the current logged in user
     *
     * @return  string
     */
    public function get_screen_name()
    {
        if (empty($this->user)) {
            return false;
        }

        return $this->user->name;
    }

    /**
     * Getter for user data
     *
     * @param  string  name of the user field to return
     * @param  mixed  value to return if the field requested does not exist
     *
     * @return  mixed
     */
    public function get($field, $default = null)
    {
        if (isset($this->user->$field)) {
            return $this->user->$field;
        }

        return $default;
    }

    public function get_user()
    {
        return $this->user;
    }
}