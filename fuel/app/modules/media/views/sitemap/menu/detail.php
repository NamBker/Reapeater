<div class="menuDetail clearfix">
	<h1><?php echo $sitemap_name ?></h1>
	<ul>
		<?php foreach ($menu_items as $item) { ?>
		<li class="clearfix">
			<img src="<?php echo \Model_Picture::getPictureUrl($item['picture_id']) ?>" alt="<?php echo $item['item_name'] ?>">
			<b><?php echo $item['item_name'] ?></b>
			<span class="price"><?php echo $item['price'] ?></span>
			<span class="detail"><?php echo $item['description'] ?></span>
		</li>
		<?php } ?>
	</ul>
	<?php if ($menu_display) { ?>
		<h2>その他のメニュー</h2>
		<ul class="otherMenus">
			<?php foreach ($menu_list as $menu) { ?>
			<li><a href="<?php echo $menu['sitemap_url'] ?>"><?php echo $menu['sitemap_name'] ?></a></li>
			<?php } ?>
		</ul>
	<?php } ?>
</div>
