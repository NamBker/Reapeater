<div class="oracleContents clearfix">
	<h1>ランダムクーポン結果</h1>
	<div class="note3"><?php echo $random_coupon_item->coupon_screen_free_text_top ?></div>
	<h2><?php echo $random_coupon_item->coupon_ad_slogan ?></h2>
	<div class="image2"><img src="<?php echo \Model_Picture::getPictureUrl($random_coupon_item->coupon_screen_picture_id) ?>" alt="当選画像" class="aligncenter"></div>
	<div class="exp"><?php echo $random_coupon_item->coupon_screen_free_text_bottom ?></div>
	<div class="button"><a href="../coupon?key=<?php echo $menber_coupon_history->random_key ?>"><?php echo $random_coupon_item->coupon_screen_button_label ?></a></div>
	<div class="note4"><?php echo $header_footer->sitemap_free_text ?></div>
</div>
