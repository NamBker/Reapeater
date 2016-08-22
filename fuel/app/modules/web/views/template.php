<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-type" value="text/html; charset=UTF-8" />
    <title><?php echo $title; ?></title>

    <link rel="stylesheet" href="https://st.gmorepeater.jp/assets/css/style.css">
    <link rel="stylesheet" href="/assets/css/style2.css" />
    <link rel="stylesheet" href="/assets/css/bootstrap.css">

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
    <script src="/assets/js/bootstrap.min.js"></script>
    <script>
        var apiHost = '<?php echo isset($apiHost) ? $apiHost : '' ?>';
        var accessToken = '<?php echo isset($apiToken) ? $apiToken : '' ?>';
    </script>
</head>
<body>

    <nav  role="navigation">
        <div class="container-fluid">
            <!--
            <div class="navbar-header">
                <--?php echo \Html::anchor('web', 'GMOリピーター', array('class' => 'navbar-brand'), \Util::isSecure()) ?>
            </div>
            -->
            <div id="navbar" class="navbar-collapse collapse">
                <ul class="nav navbar-nav navbar-right">
                    <?php
                    if (\Auth::check()) {
                        $username = \Auth::instance()->get_screen_name();
                        if (isset($username)) {
                            echo "<li>" . \Html::anchor('web', '<span class="glyphicon glyphicon-user"></span>' . $username, array(), \Util::isSecure()) . "</li>";
                            echo "<li>" . \Html::anchor('web/user/logout', '<span class="glyphicon glyphicon-log-out"></span>ログアウト', array(), \Util::isSecure()) . "</li>";
                        } else {
                            echo "<li>" . \Html::anchor('web/user/login', '<span class="glyphicon glyphicon-log-in"></span>ログイン', array(), \Util::isSecure()) . "</li>";
                        }
                    }
                    ?>
                </ul>
            </div>
        </div>
    </nav>

    <?php if (Session::get_flash('success')): ?>
        <div class="alert alert-success alert-dismissable">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
            <p>
                <?php echo implode('</p><p>', (array)Session::get_flash('success')); ?>
            </p>
        </div>
    <?php endif; ?>
    <?php if (Session::get_flash('error')): ?>
        <div class="alert alert-danger alert-dismissable">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
            <p>
                <?php echo implode('</p><p>', (array)Session::get_flash('error')); ?>
            </p>
        </div>
    <?php endif; ?>
    <?php echo $content; ?>

</body>
</html>
