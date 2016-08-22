<h1 style="font-size:18px;background:#a8825a;padding:10px;text-align:center;color:#ffffff;"><?php echo $coupon_title; ?>発行</h1>
<?php if ($coupon_current_status): ?>
	<?php if ($coupon_limit_type === 0): ?>
            <div style="padding:10px;"><?php echo $coupon_description; ?></div>
            <div style="padding:10px;"><?php echo $coupon_two_step_confirmation; ?></div>
	<?php elseif ($coupon_limit_type === 1): ?>
            <h2 style="font-size:18px;background:#e0dcc5;padding:10px;text-align:center;color:#705941;">有効期間</h2>
                <div style="color:#ff7500;background:#ffffff;border:#ff7500 1px solid;padding:20px;width:80%;margin:10px auto;text-align:center;"><?php echo $coupon_limit_from_date_format; ?>～<?php echo $coupon_limit_to_date_format; ?></div>
		<div style="padding:10px;"><?php echo $coupon_description; ?></div>
                <div style="padding:10px;"><?php echo $coupon_two_step_confirmation; ?></div>
	<?php elseif ($coupon_limit_type === 2): ?>
                <h2 style="font-size:18px;background:#e0dcc5;padding:10px;text-align:center;color:#705941;">有効期間</h2>
                <div style="color:#ff7500;background:#ffffff;border:#ff7500 1px solid;padding:20px;width:80%;margin:10px auto;text-align:center;"><?php echo $second_used_date_format; ?>～<?php echo $coupon_two_step_limit_min_date_format; ?></div>
		<div style="padding:10px;"><?php echo $coupon_description; ?></div>
                <div style="padding:10px;"><?php echo $coupon_two_step_confirmation; ?></div>
	<?php endif; ?>
<?php else: ?>
                <div style="padding:10px;"><?php echo $coupon_two_step_over_description; ?></div>
<?php endif; ?>