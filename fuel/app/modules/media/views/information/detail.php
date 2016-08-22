<div class="newsDetail clearfix">
	<h1><?php echo $infomation->title ?></h1>
	<div class="date"><?php echo $infomation->getDispDateFull() ?></div>
<?php if (isset($infomation->picture_id) && !empty($infomation->picture_id)) { ?>
	<div class="image">
		<?php echo \Html::img(\Model_Picture::getPictureUrl($infomation->picture_id), array('class' => 'aligncenter')) ?>
	</div>
<?php } ?>
	<div class="newsContents clearfix">
		<?php echo Media\Helper_View::replacePicture($infomation->body) ?>
	</div>
<?php
	// <div class="pagination clearfix"><a href="#"><div class="new">女子会飲み放題3500円から</div></a><a href="#"><div class="old">父の日特別テイクアウトメニュー！特別価格でご提供中！！</div></a></div>
?>
</div>
