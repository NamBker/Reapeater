<div class="footerFreeText">
	<?php echo $footer_free_text; ?>
</div>
<div class="footerNav clearfix">
	<h2>コンテンツメニュー</h2>
	<ul>
		<?php foreach ($menu_list as $value) { ?>
		<li class="c<?php echo $value->site_hierarchy ?>"><a href="<?php echo $brand_url . $value->sitemap_url ?>"><?php echo $value->sitemap_name ?></a></li>
		<?php } ?>
	</ul>
</div>
<p id="pageTop"><a href="#"><i class="material-icons">&#xE316;</i></a></p>
<div id="footer"><?php echo $footer_copyright; ?></div>
