<div class="shopContents clearfix">
	<h1><?php echo $sitemap_name ?></h1>
	<img src="<?php echo \Model_Picture::getPictureUrl($main_picuture_id) ?>" class="shopHeaderImg">
	<div class="catchCopy"><?php echo $sitemap_catchcopy ?></div>
	<h2>店舗情報</h2>
	<?php if ($address_display_setting) { ?>
		<dl class="clearfix"><dt>住所</dt><dd>〒<?php echo $store_postal_code ?><br><?php echo $store_address ?></dd></dl>
	<?php } ?>
	<?php if ($access_display_setting) { ?>
		<dl class="clearfix"><dt>アクセス</dt><dd><?php echo $store_access ?></dd></dl>
	<?php } ?>
	<?php if ($phone_display_setting) { ?>
		<dl class="clearfix"><dt>電話</dt><dd class="tel"><a href="tel:<?php echo $store_phone_no ?>"><?php echo $store_phone_no ?></a></dd></dl>
	<?php } ?>
	<?php if ($business_hours_display_setting) { ?>
		<dl class="clearfix"><dt>営業時間</dt><dd><?php echo $store_business_hours ?></dd></dl>
	<?php } ?>
	<?php if ($regular_holiday_display_setting) { ?>
		<dl class="clearfix"><dt>定休日</dt><dd><?php echo $store_regular_holiday ?></dd></dl>
	<?php } ?>
	<div class="freeText"><?php echo $free_text ?></div>
	<div class="shopTopImg1"><img src="<?php echo \Model_Picture::getPictureUrl($left_picture_id) ?>" class="aligncenter"></div>
	<div class="shopTopImg2"><img src="<?php echo \Model_Picture::getPictureUrl($right_picture_id) ?>" class="aligncenter"></div>
	<?php if($info_display_setting) { ?>
	<div class="news clearfix">
		<h2>お知らせ</h2>
		<ul>
			<?php foreach ($info as $value) { ?>
				<li><a href="information/<?php echo $value->id; ?>"><span class="date"><?php echo $value->getDispDate(); ?></span><span class="<?php echo $value->getDispNewMark(); ?>"></span><span class="title"><?php echo $value->title ?></span></a></li>
			<?php } ?>
		</ul>
		<div class="readMore"><a href="information_list">もっと見る</a></div>
	</div>
	<?php } ?>
	</div>
	<?php foreach ($content as $value) { ?>
	<h2><?php echo $value['title'] ?></h2>
	<div class="freeText">
		<?php echo $value['body'] ?>
	</div>
	<?php } ?>
