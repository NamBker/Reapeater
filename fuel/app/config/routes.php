<?php
# 独自ドメインルート判定
$domain_list = \Config::get('repeater.domain');
if (isset($_SERVER['HTTP_HOST']) && !in_array($_SERVER['HTTP_HOST'], $domain_list))
{
	$brand = Model_Brand::findByDomain($_SERVER['HTTP_HOST']);
	if (count($brand) === 1)
	{
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
			'(:store_code)/information_list' => 'media/information_list',
			'(:store_code)/information/(:information_id)' => 'media/information',
			'(:store_code)/information' => 'media/information',

			# sitemap
			'(:store_code)/(:function_name)' => 'media/sitemap',
			'(:store_code)/(:function_name)/(:params)' => 'media/sitemap',
			'(:store_code)' => 'media/sitemap',
			'b' => 'media/sitemap',
		);
	}
}

return array(
	'_root_'  => 'welcome/index',  // The default route
	'_404_'   => 'welcome/404',    // The main 404 route

	'hello(/:name)?' => array('welcome/hello', 'name' => 'hello'),

	/*
	 * api router
	 */
	'(?P<api_version>[1])/oauth2/access_token' => array(
		array('POST', new Route('api/oauth/token/create')),
	),

	// アカウント
	'(?P<api_version>[1])/users' => array(
		array('GET', new Route('api/user/index')),
		array('POST', new Route('api/user/create')),
		array('PUT', new Route('api/user/update')),
		array('DELETE', new Route('api/user/delete')),
	),
	'(?P<api_version>[1])/users/(?P<user_id>\d+|me)' => array(
		array('GET', new Route('api/user/private/index')),
		//array('DELETE', new Route('api/user/delete')),
	),

    // company list
	'(?P<api_version>[1])/companies' => array(
		array('GET', new Route('api/company/index')),
	),

	// brand list
	'(?P<api_version>[1])/brands' => array(
		array('GET', new Route('api/brand/index')),
		array('POST', new Route('api/brand/create')),
		array('PUT', new Route('api/brand/update')),
		array('DELETE', new Route('api/brand/delete')),

	),
	'(?P<api_version>[1])/brands/(?P<brand_id>\d+)' => array(
		array('GET', new Route('api/brand/private/index')),
	),

    // section
	'(?P<api_version>[1])/sections' => array(
		array('GET', new Route('api/section/index')),
        array('POST', new Route('api/section/create')),
        array('PUT', new Route('api/section/update')),
		array('DELETE', new Route('api/section/delete')),
	),

	// store list
	'(?P<api_version>[1])/stores' => array(
		array('GET', new Route('api/store/index')),
		array('POST', new Route('api/store/create')),
		array('DELETE', new Route('api/store/delete')),
    ),
	'(?P<api_version>[1])/stores/csv' => array(
		array('POST', new Route('api/store/csv/create')),
	),
	'(?P<api_version>[1])/store/(?P<store_id>\d+)' => array(
		array('GET', new Route('api/store/detail/index')),
		array('PUT', new Route('api/store/update')),
	),

    // member list
	'(?P<api_version>[1])/members' => array(
		array('GET', new Route('api/member/index')),
		array('DELETE', new Route('api/member/delete')),
	),
	'(?P<api_version>[1])/members/csv' => array(
        array('POST', new Route('api/member/csv/create')),
    ),
	'(?P<api_version>[1])/member/check' => array(
        array('GET', new Route('api/member/check/index')),
    ),
	'(?P<api_version>[1])/member' => array(
        array('POST', new Route('api/member/create')),
    ),
	'(?P<api_version>[1])/store/(?P<store_id>\d+)/member/(?P<member_id>\d+)' => array(
        array('GET', new Route('api/member/detail/index')),
        array('PUT', new Route('api/member/update')),
    ),

    // information
    '(?P<api_version>[1])/information' => array(
        array('GET', new Route('api/information/index')),
        array('POST', new Route('api/information/create')),
        array('PUT', new Route('api/information/update')),
		array('DELETE', new Route('api/information/delete')),
    ),
	'(?P<api_version>[1])/information/(?P<information_id>\d+)' => array(
		array('GET', new Route('api/information/detail/index')),
	),

    // questionnaire
    '(?P<api_version>[1])/questionnaires' => array(
        array('GET', new Route('api/questionnaire/index')),
		array('DELETE', new Route('api/questionnaire/delete')),
    ),
	'(?P<api_version>[1])/questionnaire' => array(
        array('POST', new Route('api/questionnaire/create')),
    ),
	'(?P<api_version>[1])/questionnaire/(?P<questionnaire_id>\d+)' => array(
		array('GET', new Route('api/questionnaire/detail/index')),
        array('PUT', new Route('api/questionnaire/update')),
	),
    '(?P<api_version>[1])/questionnaire/analysis' => array(
        array('GET', new Route('api/analysis/questionnaire/index')),
    ),
    '(?P<api_version>[1])/questionnaire/((?P<questionnaire_id>\d+))/answer/analysis' => array(
        array('GET', new Route('api/analysis/questionnaire/answer/index')),
    ),

    // question
    '(?P<api_version>[1])/questions' => array(
        array('GET', new Route('api/question/index')),
		array('DELETE', new Route('api/question/delete')),
    ),
    '(?P<api_version>[1])/question' => array(
        array('POST', new Route('api/question/create')),
    ),
    '(?P<api_version>[1])/question/(?P<question_id>\d+)' => array(
        array('PUT', new Route('api/question/update')),
    ),

    // coupon
    '(?P<api_version>[1])/coupons' => array(
        array('GET', new Route('api/coupon/index')),
        array('DELETE', new Route('api/coupon/delete')),
    ),
    '(?P<api_version>[1])/coupon' => array(
        array('POST', new Route('api/coupon/create')),
    ),
    '(?P<api_version>[1])/coupon/(?P<coupon_id>\d+)' => array(
        array('GET', new Route('api/coupon/detail/index')),
        array('PUT', new Route('api/coupon/update')),
    ),
    '(?P<api_version>[1])/coupon/analysis' => array(
        array('GET', new Route('api/analysis/coupon/index')),
    ),

    // random coupon
	'(?P<api_version>[1])/random/coupons' => array(
		array('GET', new Route('api/random/coupon/index')),
		array('DELETE', new Route('api/random/coupon/delete')),
	),
	'(?P<api_version>[1])/random/coupon' => array(
        array('POST', new Route('api/random/coupon/create')),
    ),
	'(?P<api_version>[1])/random/coupon/(?P<random_coupon_id>\d+)' => array(
        array('GET', new Route('api/random/coupon/detail/index')),
        array('PUT', new Route('api/random/coupon/update')),
    ),

    // delivery
    '(?P<api_version>[1])/deliveries' => array(
        array('GET', new Route('api/delivery/index')),
        array('DELETE', new Route('api/delivery/delete')),
    ),
    '(?P<api_version>[1])/delivery/count' => array(
        array('GET', new Route('api/delivery/count/index')),
    ),
    '(?P<api_version>[1])/delivery' => array(
        array('POST', new Route('api/delivery/create')),
    ),
    '(?P<api_version>[1])/delivery/(?P<delivery_id>\d+)' => array(
        array('GET', new Route('api/delivery/detail/index')),
        array('PUT', new Route('api/delivery/update')),
    ),
    '(?P<api_version>[1])/delivery/analysis' => array(
        array('GET', new Route('api/analysis/delivery/index')),
    ),

	//area
	'(?P<api_version>[1])/areas' => array(
		array('GET', new Route('api/area/index')),
        array('POST', new Route('api/area/create')),
        array('PUT', new Route('api/area/update')),
		array('DELETE', new Route('api/area/delete')),
	),

	//get section info
	'(?P<api_version>[1])/sections/(?P<section_id>\d+)' => array(
		array('GET', new Route('api/section/private/index')),
	),

	//get coupon info
	'(?P<api_version>[1])/coupons/(?P<coupon_id>\d+)' => array(
		array('GET', new Route('api/coupon/private/index')),
	),

	'(?P<api_version>[1])/site/headers/footer' => array(
		array('GET', new Route('api/site/headers/footer/index')),
		array('PUT', new Route('api/site/headers/footer/update')),
	),

    // picture
    '(?P<api_version>[1])/pictures' => array(
        array('GET', new Route('api/picture/index')),
        array('POST', new Route('api/picture/create')),
        array('PUT', new Route('api/picture/update')),
        array('DELETE', new Route('api/picture/delete')),
    ),
    '(?P<api_version>[1])/pictures/(?P<picture_id>\d+)' => array(
    	array('GET', new Route('api/picture/private/index')),
    ),
    '(?P<api_version>[1])/images' => array(
    	array('GET', new Route('imageapi/image/index')),
            array('DELETE', new Route('imageapi/image/delete')),
    ),

	//get daily store info
	'(?P<api_version>[1])/dailystore' => array(
		array('GET', new Route('api/daily/store/index')),
	),

	//get monthly store info
	'(?P<api_version>[1])/monthlystore' => array(
		array('GET', new Route('api/monthly/store/index')),
	),

	// site setting
	'(?P<api_version>[1])/site/brand/(?P<brand_id>\d+)/store/(?P<store_id>\d+)' => array(
		array('GET', new Route('api/site/store/free/index')),
		array('PUT', new Route('api/site/store/free/update')),
	),

	'(?P<api_version>[1])/site/linkage' => array(
		array('POST', new Route('api/site/store/free/create')),
	),

	'(?P<api_version>[1])/site/shoppage' => array(
		array('PUT', new Route('api/site/shop/page/update')),
	),

	'(?P<api_version>[1])/site/shoppage/(?P<brand_id>\d+)' => array(
		array('GET', new Route('api/site/shop/page/index')),
	),

	'(?P<api_version>[1])/site/detail/brand/(?P<brand_id>\d+)/store/(?P<store_id>\d+)' => array(
		array('GET', new Route('api/site/store/detail/index')),
	),

	'(?P<api_version>[1])/site/url/brand/(?P<brand_id>\d+)' => array(
		array('GET', new Route('api/site/store/url/index')),
	),

	'(?P<api_version>[1])/site/companysummary/brand/(?P<brand_id>\d+)' => array(
		array('GET', new Route('api/site/store/company/index')),
	),

    // Send mail
	'(?P<api_version>[1])/mail' => array(
        array('POST', new Route('api/mail/create')),
    ),

	// メール開封
	'(?P<api_version>[1])/access' => array(
		array('GET', new Route('api/access/index')),
	),

	//site map
	'(?P<api_version>[1])/site/map' => array(
		array('GET', new Route('api/site/map/index')),
		array('PUT', new Route('api/site/map/update')),
		array('DELETE', new Route('api/site/map/delete')),
	),
);
