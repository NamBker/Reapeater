<div class="contents"><!--コンテンツ始まり-->
    <div class="contents__container__login mt20">
    <div class="cc"></div>

        <?php echo \Form::open(array('class' => 'form-horizontal')); ?>
        <div class="contents__container__login--content">
            <img src="/assets/img/logo.svg" width="220" height="22" alt="GMOリピーター" class="login-logo">
            <div class="contents__container__login--msg">
                <p class="mb20">新しいパスワードを再発行します。</p>
                <p class="mb20">メールアドレスを入力してください。<br>新しいパスワードを発行して、メールでお知らせします。</p>
            </div>
            <?php echo \Form::input('email', null, array('class' => 'contents__container__input--text-large width330', 'type' => 'text', 'placeholder' => 'メールアドレス')) ?>


            <div class="text-center">
                <button type="submit" class="btn-base mt30 btn-login">パスワードの再発行</button>
            </div>
        </div>
        <?php \Form::close(); ?>
    </div>
    <footer>© 2016 GMOリピーター</footer>
</div><!--コンテンツ終わり-->
