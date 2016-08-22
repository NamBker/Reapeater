<?php
$area_L_id = null;
$area_M_id = null;
$area_S_id = null;
?>
<div class="shopListAllContents clearfix">
	<h1><?php echo $sitemap_name ?></h1>
	<div class="freeText"><?php echo $free_text ?></div>
	<?php
	foreach ($store_list as $l_key => $l_store) {
		echo '<h2>' . (array_key_exists($l_key, $area_list) ? $area_list[$l_key]['area_name'] : $noarea_name) . '</h2>';
		$noarea_flag = $l_key == 0 || !array_key_exists($l_key, $area_list);
		foreach ($l_store as $m_key => $m_store) {
			if (!$noarea_flag)
			{
				echo '<h3>' . (array_key_exists($m_key, $area_list) ? $area_list[$m_key]['area_name'] : $noarea_name) . '</h3>';
				$noarea_flag = $l_key == 0 || !array_key_exists($m_key, $area_list);
			}
			foreach ($m_store as $s_key => $s_store) {
				if (!$noarea_flag)
				{
					echo '<h4>' . (array_key_exists($s_key, $area_list) ? $area_list[$s_key]['area_name'] : $noarea_name) . '</h4>';
				}
				echo '<ul>';
	 			foreach ($s_store as $store) {
	?>
	<li>
		<a href="<?php echo substr($brand_url, 0, -2). $store['store_code']. '/' ?>">
			<div class="image"><img src="<?php echo \Model_Picture::getPictureUrl($store['store_header_picture_id']) ?>" alt="<?php echo $store['store_name'] ?>"></div>
			<div class="shopInfo">
				<?php echo $store['store_name'] ?>
				<span class="time"><?php echo $store['store_business_hours'] ?></span>
				<span class="note"><?php echo $store['store_regular_holiday'] ?></span>
			</div>
		</a>
	</li>	<?php
 				}
				echo '</ul>';
				$noarea_flag = false;
			}
		}
	} ?>

</div>
