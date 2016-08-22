<div class="couponContents clearfix"><!--クーポンコンテンツ　ここから-->
	<h1><?php echo $coupon_title; ?>発行</h1>
	<?php if ($coupon_current_status): ?>
		<?php if ($coupon_limit_type === 0): ?>
			<div class="detail"><?php echo $coupon_description; ?></div>
			<div class="note"><?php echo $coupon_two_step_confirmation; ?></div>
		<?php elseif ($coupon_limit_type === 1): ?>
			<h2>有効期間</h2>
			<div class="period"><?php echo $coupon_limit_from_date_format; ?>～<?php echo $coupon_limit_to_date_format; ?></div>
			<div class="detail"><?php echo $coupon_description; ?></div>
			<div class="note"><?php echo $coupon_two_step_confirmation; ?></div>
		<?php elseif ($coupon_limit_type === 2): ?>
			<h2>有効期間</h2>
			<div class="period"><?php echo $second_used_date_format; ?>～<?php echo $coupon_two_step_limit_min_date_format; ?></div>
			<div class="detail"><?php echo $coupon_description; ?></div>
			<div class="note"><?php echo $coupon_two_step_confirmation; ?></div>
		<?php endif; ?>
	<?php else: ?>
		<div class="detail"><?php echo $coupon_two_step_over_description; ?></div>
	<?php endif; ?>
</div><!--コンテンツ終わり-->