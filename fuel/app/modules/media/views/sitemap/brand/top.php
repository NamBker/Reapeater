<div class="topContents" class="clearfix">
	<?php if (!empty($main_pictures)) {?>
	<ul id="image-gallery" class="gallery list-unstyled cS-hidden">
		<?php foreach ($main_pictures as $picture) { ?>
			<li data-thumb="<?php echo \Model_Picture::getPictureUrl($picture['id']) ?>"><a href="<?php echo $picture['link']; ?>"><img src="<?php echo \Model_Picture::getPictureUrl($picture['id']) ?>"></a></li>
		<?php } ?>
	</ul>
	<?php } ?>

	<h1><?php echo $sitemap_name; ?></h1>

	<div class="catchCopy">
		<?php echo $sitemap_catchcopy; ?>
	</div>

	<!-- <div class="shopSearch"><a href="shopList1.html"><img src="/assets/media/img/area.png" width="40px" height="40px" class="aligncenter">エリアから探す</a></div> -->
	<!-- <div class="coupon"><a href="userEntry.html"><img src="/assets/media/img/coupon.png" width="40px" height="40px" class="aligncenter">クーポンを取得する</a></div> -->

	<?php if (!empty($free_text)) {
		echo "<div class=\"freeText\">$free_text</div>";
	} ?>
</div>

<?php if (!empty($info_display_setting) && $info_display_setting) { ?>
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

<?php if (!empty($contents)) { ?>
<div class="usrContents clearfix">
<?php foreach($contents as $content) { ?>
	<div class="square clearfix">
		<?php if (empty($content["link"]) ) { ?>
			<img src="<?php echo \Model_Picture::getPictureUrl($content['id']) ?>"><div class="title"><?php echo $content["title"] ?></div><div class="text"><?php echo $content["text"] ?></div>
		<?php } else { ?>
			<a href="<?php echo $content["link"] ?>" class="clearfix"><img src="<?php echo \Model_Picture::getPictureUrl($content['id']) ?>"><div class="title"><?php echo $content["title"] ?></div><div class="text"><?php echo $content["text"] ?></div></a>
		<?php } ?>
	</div>
	<?php } ?>
</div>
<?php } ?>

<?php if (!empty($banner_picture_link) && !empty($banner_picture_id)) { ?>
<div class="topBanner">
	<a href="<?php echo $banner_picture_link ?>"><img src="<?php echo \Model_Picture::getPictureUrl($banner_picture_id) ?>" border="0"></a>
</div>
<?php } ?>
