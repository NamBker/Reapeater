<div class="shopListContents clearfix">
	<h1>店舗一覧</h1>
	<div class="freeText"><?php echo $free_text ?></div>
<?php if (!empty($area_list)) { ?>
	<ul>
		<?php foreach ($area_list as $area) {
			$area_name = $area['name'] ? $area['name'] : $noarea_name;
		?>
		<li><a href="<?php echo $get_param.$area['id'] ?>"><?php echo $area_name ?></a></li>
		<?php } ?>
	</ul>
<?php } ?>
</div>
<?php if (!empty($store_list)) { ?>
<div class="shopListDetail clearfix">
	<h1>渋谷の店舗一覧</h1>
	<ul>
	<?php foreach ($store_list as $store) { ?>
	<li><a href="<?php echo substr($brand_url, 0, -2). $store['store_code']. '/' ?>">
		<div class="image">
			<img src="<?php echo \Model_Picture::getPictureUrl($store['store_header_picture_id']) ?>">
		</div>
		<div class="shopInfo">
			<?php echo $store['store_name'] ?>
			<span class="time"><?php echo $store['store_business_hours'] ?></span>
			<span class="note"><?php echo $store['store_regular_holiday'] ?></span>
		</div>
	</a></li>
	<?php } ?>
	</ul>
</div>
<?php } ?>
