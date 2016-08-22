<!doctype html>
<html>
<head>
	<?php if (\Agent::is_aufeaturephone()): ?>
		<meta http-equiv="Content-Type" content="text/html; charset=Shift_JIS">
	<?php else: ?>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<?php endif; ?>
	<meta name="viewport" content="width=device-width, initial-scale=1,user-scalable=no/>
	<title><?php echo \Lang::get('error.404.title'); ?></title>
</head>
<body style="margin:0;font-size:medium;">
	<center><img src="/assets/img/logo.png" style="margin-top:10px;max-width:80%;"><center>
	<h1>
		<center><?php echo \Lang::get('error.404.title'); ?></center>
	</h1>
	<center><?php echo \Lang::get('error.404.message'); ?></center>
	<div style="padding:20px 0;text-align:center;">
		Copyright (C) GMO Commerce, Inc All Rights Reserved</div>
</body>
</html>
