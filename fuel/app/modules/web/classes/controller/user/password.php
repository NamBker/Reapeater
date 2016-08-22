<?php
namespace Web;

class Controller_User_Password extends \Controller_Web
{
    function action_reset()
    {
        if (\Auth::check()) {
            \Response::redirect_back('web/user/login');
        }

        if (\Input::method() == "POST") {
            $email = \Input::post('email');
            if (isset($email)) {
                $user = \Model_User::findByEmail($email);
                if (!empty($user)) {
                    \DB::start_transaction();
                    $new_password = \Auth::reset_password($email);
                    $sender = \Email::forge();
                    $sender->from(\Config::get('repeater.email_key.from'));
                    $sender->to($email);
                    $sender->subject('【GMOリピーター】PW初期化のご連絡');
                    $sender->body('ハッシュ化前の"' . $new_password . '"');
                    try {
                        $sender->send();
                        \DB::commit_transaction();
//                        \Response::redirect_back('web/user/password/result');
                        \Session::set_flash('error', array('パスワードリマインダが完了しました。<a href="/web/user/login">ログイン画面</a>から新パスワードでログインしてください。'));
                    } catch (\EmailValidationFailedException $e) {
                        \DB::rollback_transaction();
                        \Session::set_flash(current($email->get_to())['email'] . 'が見つかりません。');
                        \Additional_Log::debug("\n Cannot send to your e-mail address not found " . current($email->get_to())['email'] . "\n");
                    } catch (\EmailSendingFailedException $e) {
                        \DB::rollback_transaction();
                        \Session::set_flash(current($email->get_to())['email'] . 'に送信できません。');
                        \Additional_Log::debug("\n Cannot send to your e-mail address " . current($email->get_to())['email'] . "\n");
                    }
                } else {
                    \Session::set_flash('error', array("メールアドレスが存在していません。"));
                }
            } else {
                \Session::set_flash('error', array("メールアドレスが入力されていません。"));
            }
        }

        $this->template->title = "";
        $this->template->content = \View::forge("web::user/password/reset");
    }

    function action_result()
    {
        $this->template->title = "パスワードリマインダ完了";
        $this->template->content = \View::forge("web::user/password/result");
    }
}