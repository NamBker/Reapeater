<div class="news clearfix">
    <h1>お知らせ</h1>
<?php if ($infomation_list)
{
?>
	<ul>
<?php foreach ($infomation_list as $infomation) { ?>
		<li><a href="information/<?php echo $infomation->id ?>"><?php echo $infomation->title ?><span><?php echo $infomation->getDispDateFull() ?></span></a></li>
<?php } ?>
	</ul>
<?php
}
/*
<!--
 	div class="pagination clearfix"><a href="#"><div class="new">NEW</div></a><div class="page">1/4</div><a href="#"><div class="old">OLD</div></a></div>
-->
*/
?>
</div>
