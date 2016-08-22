<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.0//EN" "http://www.wapforum.org/DTD/xhtml-mobile10.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<?php if (\Agent::is_aufeaturephone()): ?>
	<meta http-equiv="Content-Type" content="text/html; charset=Shift_JIS">
<?php else: ?>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<?php endif; ?>
<title><?php echo $title; ?></title>
</head>
<body style="margin:0;font-size:medium;">
<div style="background:#f2f0e6;max-width:480px;">
    
        <?php echo $header; ?>
    
    <?php echo $content; ?>
    
    <?php echo $footer; ?>
    
</div>
</body>
</html>
