<div id="header" class="clearfix">
	<div class="gblnvBox clearfix">
		<div class="logo"><a href="<?php echo $brand_url ?>"><img src="<?php echo \Model_Picture::getPictureUrl($header_footer->sitemap_picture_id) ?>"></a></div>
		<div class="nav clearfix">
			<a class="navTrigger" href="#">
				<span></span>
				<span></span>
				<span></span>
			</a>
			<span class="small">メニュー</span>
		</div>
		<!-- <div class="membership"><a href="userEntry.html">会員登録</a></div> -->
		<div class="gblnvBlock clearfix">
			<ul class="gblnvList">
				<?php foreach ($menu_list as $value) { ?>
				<li class="c<?php echo $value->site_hierarchy ?>"><a href="<?php echo $brand_url . $value->sitemap_url ?>"><?php echo $value->sitemap_name ?></a></li>
				<?php } ?>
			</ul>
		</div>
	</div>
</div>
