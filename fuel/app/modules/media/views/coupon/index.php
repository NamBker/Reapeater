<div class="couponContents clearfix"><!--クーポンコンテンツ　ここから-->
	<h1><?php echo $coupon_title; ?></h1>
	<?php if ($coupon_current_status): ?>
		<div class="detail"><?php echo $coupon_description; ?></div>
		<div class="detail"><?php echo $coupon_two_step_button_description; ?></div>
		<div class="button"><?php echo \Html::anchor($coupon_issue_url_format, 'クーポンを使う', array(), \Util::isSecure()); ?></div>
	<?php else: ?>
		<div class="detail"><?php echo $coupon_two_step_over_description; ?></div>
	<?php endif; ?>
</div><!--コンテンツ終わり-->