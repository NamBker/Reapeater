<h1 style="font-size:18px;background:#a8825a;padding:10px;text-align:center;color:#ffffff;">ﾗﾝﾀﾞﾑｸｰﾎﾟﾝ結果</h1>
<div style="padding:10px;"><?php echo $random_coupon_item->coupon_screen_free_text_top ?></div>
<h2 style="font-size:18px;background:#e0dcc5;padding:10px;text-align:center;color:#705941;"><?php echo $random_coupon_item->coupon_ad_slogan ?></h2>
<center><img src="<?php echo \Model_Picture::getMbPictureUrl($random_coupon_item->coupon_screen_picture_id) ?>" class="aligncenter" style="margin:10px auto;max-width:100%;height:auto;"></center>
<div style="padding:10px;text-align:center;"><a href="../coupon?key=<?php echo $menber_coupon_history->random_key ?>" style="color:#ff7500;"><?php echo $random_coupon_item->coupon_screen_button_label ?></a></div>
<div style="padding:10px;"><?php echo $header_footer->sitemap_free_text ?></div>

