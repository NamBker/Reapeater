<?php
###############################################################################
# ルートを追加したら
# 独自ドメイン用のルートを
# fuel/app/config/routes.phpにも追加する
###############################################################################

return array(
	'_root_' => 'media/welcome/index',
	'_404_' => 'media/welcome/404',
	'_500_' => 'media/welcome/500',

	# random coupon
	'media/random_coupon' => 'media/random_coupon',
	'media/random_coupon/lottery' => 'media/random_coupon/lottery',

	# coupon
	'media/coupon' => 'media/coupon',
	'media/coupon/issue' => 'media/coupon/issue',
	'media/coupon/index' => 'media/coupon/index',

	# information
	'media/(:company_id)/(:brand_code)/(:store_code)/information_list' => 'media/information_list',
	'media/(:company_id)/(:brand_code)/(:store_code)/information/(:information_id)' => 'media/information',
	'media/(:company_id)/(:brand_code)/(:store_code)/information' => 'media/information',

	# sitemap
	'media/(:company_id)/(:brand_code)/(:store_code)/(:function_name)' => 'media/sitemap',
	'media/(:company_id)/(:brand_code)/(:store_code)/(:function_name)/(:params)' => 'media/sitemap',
	'media/(:company_id)/(:brand_code)/(:store_code)' => 'media/sitemap',
);
