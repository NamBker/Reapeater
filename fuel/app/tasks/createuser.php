<?php

namespace Fuel\Tasks;

class CreateUser
{
    public static function run($email, $password, $username)
    {
        print "{$email}\n";
        print "{$username}\n";
        print "{$password}\n";
        \Auth::create_user($email,$password,$username,1);
    }
}