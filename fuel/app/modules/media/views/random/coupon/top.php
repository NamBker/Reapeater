<div class="oracleContents clearfix">
	<h1>ランダムクーポン抽選</h1>
	<div class="note1"><?php echo $random_coupon->random_coupon_screen_free_text_top ?></div>
	<div class="image1"><img src="<?php echo \Model_Picture::getPictureUrl($random_coupon->random_coupon_screen_picture_id) ?>" class="aligncenter"></div>
	<div class="button"><a href="random_coupon/lottery?key=<?php echo \Input::get('key') ?>"><?php echo $random_coupon->random_coupon_screen_button_label ?></a></div>
	<div class="note2"><?php echo $random_coupon->random_coupon_screen_free_text_bottom ?></div>
</div>
