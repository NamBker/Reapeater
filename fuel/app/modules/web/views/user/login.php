<!--コンテンツ始まり-->
    <div class="contents__container__login mt100">

        <div class="contents__container__login--content">
            <?php echo \Form::open(array('id' => 'login_form', 'class' => 'form-horizontal', 'role' => 'form')); ?>

            <img src="/assets/img/logo.svg" width="220" height="22" alt="GMOリピーター" class="login-logo">
            <?php echo \Form::input(
                'email',
                null,
                array(
                    'id' => 'email',
                    'class' => 'contents__container__input--text-large width330 mb10',
                    'type' => 'text',
                    'placeholder' => 'ログインメールアドレス',
                    'required', 'style' => 'ime-mode: inactive;'
                )
            );?>

            <?php echo \Form::password(
                'password',
                null,
                array(
                    'id' => 'password',
                    'class' => 'contents__container__input--text-large width330 mb20',
                    'type' => 'text',
                    'placeholder' => 'パスワード',
                    'required'
                )
            ); ?>

            <div class="clearfix">
                <div class="d-checkbox2 contents__container__login--check"><input type="checkbox" id="store_0"><label for="store_0"><span>ログイン情報を保存する</span></label></div>
                <div class="contents__container__login--link">
                    <?php echo \Html::anchor('/web/user/password/reset', 'パスワードを忘れた方はこちら') ?>
                </div>
            </div>
            <div class="text-center">
                <?php echo \Form::submit('login', 'ログイン', array('id' => 'btn-login', 'class' => 'btn-base mt30 btn-login')); ?>
            </div>

            <?php echo \Form::close(); ?>
        </div>
    </div>
    <footer>© 2016 GMOリピーター</footer>
<!--コンテンツ終わり-->
