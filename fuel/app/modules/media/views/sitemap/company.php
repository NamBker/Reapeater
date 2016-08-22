<div class="companyContents clearfix">
	<h1><?php echo $sitemap_name ?></h1>
<?php if ($company_name_display) { ?>
	<dl class="clearfix"><dt><?php echo $company_name_title ?></dt><dd><?php echo $company['company_name'] ?></dd></dl>
<?php } ?>
<?php if ($company_name_display) { ?>
	<dl class="clearfix"><dt><?php echo $company_ceo_title ?></dt><dd><?php echo $company['company_ceo'] ?></dd></dl>
<?php } ?>
<?php if ($company_name_display) { ?>
	<dl class="clearfix"><dt><?php echo $company_address_title ?></dt><dd><?php echo $company['company_address'] ?></dd></dl>
<?php } ?>
<?php if ($company_name_display) { ?>
	<dl class="clearfix"><dt><?php echo $company_phone_title ?></dt><dd class="tel"><a href="tel:<?php echo $company['company_phone_no'] ?>"><?php echo $company['company_phone_no'] ?></a></dd></dl>
<?php } ?>
<?php if ($company_free) { ?>
	<?php foreach ($company_free as $free) { ?>
		<?php if ($free['display']) { ?>
			<dl class="clearfix"><dt><?php echo $free['title'] ?></dt><dd><?php echo $free['body'] ?></dd></dl>
		<?php } ?>
	<?php } ?>
<?php } ?>
</div>
