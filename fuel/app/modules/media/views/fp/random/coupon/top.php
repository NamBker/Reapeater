<h1 style="font-size:18px;background:#a8825a;padding:10px;text-align:center;color:#ffffff;">ﾗﾝﾀﾞﾑｸｰﾎﾟﾝ抽選</h1>
<div style="padding:10px;"><?php echo $random_coupon->random_coupon_screen_free_text_top ?></div>
<center><img src="<?php echo \Model_Picture::getMbPictureUrl($random_coupon->random_coupon_screen_picture_id) ?>" class="aligncenter" style="margin:10px auto;"></center>
<div style="padding:10px;text-align:center;"><a href="random_coupon/lottery?key=<?php echo \Input::get('key') ?>" style="color:#ff7500;"><?php echo $random_coupon->random_coupon_screen_button_label ?></a></div>
<div style="padding:10px;"><?php echo $random_coupon->random_coupon_screen_free_text_bottom ?></div>

