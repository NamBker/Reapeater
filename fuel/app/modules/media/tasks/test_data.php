<?php
namespace Fuel\Tasks;
class Test_Data
{
	public static function run()
	{
// http://local.gmorepeater.jp/media/1/tokujyuan/coupon/1
// http://local.gmorepeater.jp/media/1/tokujyuan/a/coupon/1


		// $params = array(
		// 	'id'                  => 1,
		// 	'company_id'          => 1,
		// 	'brand_id'            => 1,
		// 	'section_id'          => 1,
		// 	'store_id'            => 1,
		// 	'coupon_name'         => 'はじめてクーポン',
		// 	'coupon_title'        => 'はじめてご来店のお客様限定のお得なクーポンです。',
		// 	'coupon_description'  => 'ドリンク10％OFFクーポンをプレゼント!!<br>この画面をお会計時にご提示ください。',
		// 	'coupon_limit_from'   => '2016-06-13 00:00:00',
		// 	'coupon_limit_to'     => '2016-06-30 00:00:00',
		// );
		// $coupon = \Model_Coupon::forge($params);
		// $coupon->save();

		// $coupon = \Model_Coupon::forge();
		$coupon = \Model_Coupon::find('first', array(
			'where' => array(
				'id' => 1,
			),
		));
		$coupon->coupon_name         = 'わくわくクーポン';
		$coupon->coupon_title        = 'ドリンク10%OFF!!';
		$coupon->coupon_description  = 'クーポン内容<br>クーポンを使用する場合、以下の「クーポンを使う」ボタンを会計時に押してください。<br>使用の確認後に表示された画面を提示してください。<br>';
		$coupon->coupon_limit_from   = '2016-06-13 00:00:00';
		$coupon->coupon_limit_to     = '2016-07-30 00:00:00';
		$coupon->coupon_release_flg  = 1;
		$coupon->coupon_status       = 1;
		$coupon->coupon_two_step_flg = 1;
		$coupon->coupon_two_step_limit_min = 600;
		$coupon->coupon_two_step_button_description = 'クーポンを使うの説明<br>クーポンを使用します。よろしいですか？<br>クーポンの有効時間は以下のボタンを押してから'.$coupon->coupon_two_step_limit_min.'分間です。<br>';
		$coupon->coupon_two_step_use_description = 'こちらの画面を店員にお見せください。<br>上記の有効期限を過ぎるとクーポンは無効になります。<br>';
                $coupon->coupon_two_step_over_description = 'このクーポンは使用期限を過ぎています';
                $coupon->coupon_two_step_confirmation = 'こちらの画面を店員にお見せください。';
                $coupon->coupon_limit_type = 1;
                $coupon->coupon_two_step_limit_type = 1;
                $coupon->coupon_limit_send_start = 60;


		$site_headers_footer = \Model_Site_Headers_Footer::forge();
		$site_headers_footer = \Model_Site_Headers_Footer::find('first', array(
			'where' => array(
				'id' => 1,
			),
		));
		// $site_headers_footer->id = 1;
		$site_headers_footer->company_id = 1;
		$site_headers_footer->brand_id = 1;
		$site_headers_footer->store_id = 1;
		$site_headers_footer->sitemap_name = '料亭ダイニング徳樹庵';
		$site_headers_footer->sitemap_catchcopy = '街の喧騒を離れた静けさの中、料亭並みの雰囲気とお料理とお酒をリーズナブルな価格で｡';
		$site_headers_footer->sitemap_picture_id = 1;
		$site_headers_footer->sitemap_free_text = '共通フッタフリーテキストhtml入力可能';
		$site_headers_footer->sitemap_copyright = '© 2016 徳樹庵 All Rights Reserved.';
		$site_headers_footer->sitemap_contents_title = 'コンテンツメニュー タイトル';
		$site_headers_footer->memo = 'NULL';
		$site_headers_footer->save();

		exit();
	}

}