<div class="menuContents clearfix">
	<h1><?php echo $sitemap_name ?></h1>
	<div class="freeText">
		<?php echo $free_text ?>
	</div>
	<ul>
		<?php foreach ($menu as $value) { ?>
		<li class="clearfix">
			<a href="<?php echo $value['sitemap_url'] ?>" class="clearfix">
				<div class="image">
					<img src="<?php echo \Model_Picture::getPictureUrl($value['picture_id']) ?>" alt="<?php echo $value['sitemap_name'] ?>">
				</div>
				<div class="menuName">
					<?php echo $value['sitemap_name'] ?>
				</div>
			</a>
		</li>
		<?php } ?>
	</ul>
</div>
