<!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta http-equiv="Content-Style-Type" content="text/css">
	<meta http-equiv="Content-Script-Type" content="text/javascript">
	<?php //echo \Asset::css(array('style.css', 'error.css')) ?>
	<?php echo \Asset::css('error.css') ?>
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<title><?php echo \Lang::get('error.404.title'); ?></title>
</head>
<body>
<div id="wrapper" class="error">
    <header class="test">
		<div id="header" class="clearfix">
			<div class="logo"><img src="/assets/img/logo.png"></div>
		</div>
    </header>
	<div class="contents" class="clearfix">
		<h1>
			<?php echo \Lang::get('error.404.title'); ?>
		</h1>
		<p>
			<?php echo \Lang::get('error.404.message'); ?>
		</p>
	</div>
    <footer>
		Copyright (C) GMO Commerce, Inc All Rights Reserved
    </footer>
</div>
</body>
</html>
