
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta charset="utf-8">
    <title>GMOリピーター</title>
    <meta name="description" content="">
    <meta name="author" content="GMOコマース">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php echo \Asset::css(array('reset.css', 'style.css', 'balloon.min.css', 'react-select.css', 'datepicker.css', 'react-toggle.css', 'style2.css')) ?>
    <!--[if lt IE 9]>
    <script src="js/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="js/respond.js/1.4.2/respond.min.js"></script>
    <script src="/assets/js/flexibility.js"></script>

    <![endif]-->
    <link rel="shortcut icon" href="/assets/img/favicon/favicon.ico" type="image/vnd.microsoft.icon">
    <link rel="icon" href="/assets/img/favicon/favicon.ico" type="image/vnd.microsoft.icon">
    <link rel="apple-touch-icon" sizes="57x57" href="/assets/img/favicon/apple-touch-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="/assets/img/favicon/apple-touch-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/assets/img/favicon/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/assets/img/favicon/apple-touch-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/assets/img/favicon/apple-touch-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/assets/img/favicon/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/assets/img/favicon/apple-touch-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/assets/img/favicon/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/img/favicon/apple-touch-icon-180x180.png">
    <link rel="icon" type="image/png" href="/assets/img/favicon/android-chrome-192x192.png" sizes="192x192">
    <link rel="icon" type="image/png" href="/assets/img/favicon/favicon-48x48.png" sizes="48x48">
    <link rel="icon" type="image/png" href="/assets/img/favicon/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/png" href="/assets/img/favicon/favicon-16x16.png" sizes="16x16">
    <link rel="icon" type="image/png" href="/assets/img/favicon/favicon-32x32.png" sizes="32x32">
    <link rel="manifest" href="/assets/img/favicon/manifest.json">
    <meta name="msapplication-TileColor" content="#2d88ef">
    <meta name="msapplication-TileImage" content="img/favicon/mstile-144x144.png">

    <script src="/assets/js/jquery-2.2.4.min.js"></script>
    <script src="/assets/js/globalize.js"></script>
</head>
<script>
    var apiHost = '<?php echo $apiHost ?>';
    var accessToken = '<?php echo $apiToken ?>'
</script>
<body class="dashboard">
<div class="container">
    <div class="main" id="main">
    </div>
    <?php
        if (\Fuel::$env == \Fuel::PRODUCTION) {
            echo '<script src="//'.Config::get('repeater.server_apps.api_server.host').'/assets/js/repeater/bundle.min.js"></script>';
        } else {
            echo '<script src="//'.Config::get('repeater.server_apps.api_server.host').'/assets/js/repeater/bundle.js"></script>';
        }
    ?>
</div>
<!-- SCRIPTS -->
<script src="/assets/js/retina.min.js"></script>
</body>
</html>
