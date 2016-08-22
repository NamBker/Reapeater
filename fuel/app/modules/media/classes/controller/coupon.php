<?php
namespace Media;

class Controller_Coupon extends \Controller_Media
{
	protected $member_coupon_history = null;

	public function before()
	{
		$this->is_featurephone = \Agent::is_featurephone();
		
		if ($this->is_featurephone)
		{
			$this->template = 'fp/template';
		}

		// 親のbeforeを呼ばない
		\Controller_Template::before();
		\Additional_Log::debug("【COUPON】 start.");

		if ($this->is_featurephone)
		{
			\Asset::add_path('assets/media/fp/img/', 'img');
		}
		else
		{
			\Asset::add_path('assets/media/css/', 'css');
			\Asset::add_path('assets/media/js/', 'js');
			\Asset::add_path('assets/media/img/', 'img');
		}

		\Config::load('media::repeater');

		// 会員ユーザを特定するためのキー
		$random_key = \Input::get('key');
		if (is_null($random_key))
		{
			\Additional_Log::error('media: "key" is null');
			throw new \HttpNotFoundException;
		}

		// クーポン履歴
		$this->member_coupon_history = \Model_Member_Coupon_History::findByRandomKey($random_key);

		if (is_null($this->member_coupon_history))
		{
			\Additional_Log::error('media: "member_coupon_history" is null. key:'.$random_key);
			throw new \HttpNotFoundException;
		}

		// クーポン状態 0:無効 / 1:有効
		if ($this->member_coupon_history->coupon->coupon_status === 0)
		{
			\Additional_Log::debug('media: "coupon_status" クーポン状態 無効');
			throw new \HttpNotFoundException;
		}

		// 会員状態 テストメール(member_id==0:)でない場合
		if ($this->member_coupon_history->member_id != 0){
			// 会員が存在しない
			if (is_null($this->member_coupon_history->store_member))
			{
				\Additional_Log::debug('media: "store_member" is null.');
				throw new \HttpNotFoundException;
			}
			
			// 会員状態 1:会員 / 2:退会済み 
			if ($this->member_coupon_history->store_member->store_member_status === STORE_MEMBER_STATUS_WITHDRAWAL)
			{
				\Additional_Log::debug('media: "store_member_status" 会員状態 退会済み');
				throw new \HttpNotFoundException;
			}
		}

		$company_id = $this->member_coupon_history->coupon->company_id;
		$brand_id = $this->member_coupon_history->coupon->brand_id;
		$store_id = $this->member_coupon_history->coupon->store_id;
		\Additional_Log::debug("【MEDIA】 $company_id/$brand_id/$store_id");

		if (!is_numeric($company_id) || empty($brand_id) || empty($store_id))
		{
			\Additional_Log::debug("【MEDIA:ERROR】cid:${company_id} bcd:${brand_id} scd:${store_id}");
			throw new \HttpNotFoundException;
		}

		$this->store = \Model_Store::find('first', array(
			'where' => array(
				'id' => $store_id,
				'brand_id' => $brand_id
			),
		));
		if (is_null($this->store) || is_null($this->store->brand) || is_null($this->store->brand->company))
		{
			throw new \HttpNotFoundException;
		}
		$this->company = $this->store->brand->company;
		$this->brand = $this->store->brand;

		$this->brand_id = $brand_id;
		$this->store_id = $store_id;

		$this->header_footer = \Model_Site_Headers_Footer::find('first', array(
			'where' => array(
				'company_id' => $company_id,
				'brand_id'   => $this->brand_id,
				'store_id'   => $this->store_id,
			),
		));

		$brand_code = $this->brand->brand_code;
		$store_code = $this->store->store_code;
		
		// 独自ドメインの処理は現在不要のためコメントアウト
//		# 基本となるURL
//		$base_url;
//		$brand_url;
//
//		if (isset($_SERVER['HTTPS']) AND $_SERVER['HTTPS'] == 'on')
//		{
//			$base_url = 'https://';
//		}
//		else
//		{
//			$base_url = 'http://';
//		}
//		$base_url .= $_SERVER["HTTP_HOST"];
//		$brand_url = $base_url;
//		$config_host = \Config::get('repeater.server_apps.web_server.host');
//
//		# FIXME : 独自ドメイン判定
//		if (!strpos($base_url, $config_host))
//		{
//			$base_url .= "/$store_code/";
//			$brand_url .= "/b/";
//		}
//		else
//		{
//			$base_url .= "/media/$company_id/$brand_code/$store_code/";
//			$brand_url .= "/media/$company_id/$brand_code/b/";
//		}
//		$this->template->set_global('base_url', $base_url);
//		$this->template->set_global('brand_url', $brand_url);

		//メニューも現在の仕様では不要のためコメントアウト
//		# menu取得
//		$menu_list = \Model_Site_Store_Free::getMenuList($company_id, $this->brand_id, $this->store_id);

//		$this->template->set_global('menu_list', $menu_list);
		$this->template->set_global('company', $this->company);
		$this->template->set_global('brand', $this->brand);
		$this->template->set_global('store', $this->store);
		$this->template->set_global('header_footer', $this->header_footer, false);

		if ($this->is_featurephone)
		{
			$this->template->header = \Presenter::Forge('media::header', 'view', null, 'media::fp/header');
			$this->template->footer = \Presenter::Forge('media::footer', 'view', null, 'media::fp/footer');
		}
		else
		{
			$this->template->header = \Presenter::forge('header', 'view', null, 'header_simple');
			$this->template->footer = \Presenter::forge('footer', 'view', null, 'footer_simple');
		}
	}

	public function after($response)
	{
		if (\Agent::is_aufeaturephone())
		{
			$this-> template = mb_convert_encoding($this-> template, "SJIS", "UTF-8");
		}
		$response = parent::after($response);
		return $response;
	}


	function action_index()
	{
		// 表示した日時を更新
		if (is_null($this->member_coupon_history->second_display_date))
		{
			$this->member_coupon_history->second_display_date = date('Y-m-d H:i:s', \Date::time()->get_timestamp());
			$this->member_coupon_history->save();
		}

		if (\Agent::is_featurephone())
		{
			$presenter = \Presenter::forge('media::coupon/index', 'view', null, 'media::fp/coupon/index');
		}
		else
		{
			$presenter = \Presenter::forge('media::coupon/index');
		}
		$presenter->coupon = $this->member_coupon_history->coupon;
		$presenter->store = $this->member_coupon_history->store;
		$presenter->member = $this->member_coupon_history->member;
		$presenter->store_member = $this->member_coupon_history->store_member;
		$presenter->member_delivery_history = $this->member_coupon_history->member_delivery_history;
		$presenter->member_coupon_history = $this->member_coupon_history;
		$this->template->title = 'クーポン';
		$this->template->content = $presenter;
	}

	function action_issue()
	{
		// 発行した日時を更新
		if (is_null($this->member_coupon_history->second_used_date))
		{
			$this->member_coupon_history->second_used_date = date('Y-m-d H:i:s', \Date::time()->get_timestamp());
			$this->member_coupon_history->save();
		}

		if ($this->is_featurephone)
		{
			$presenter = \Presenter::forge('media::coupon/issue', 'view', null, 'media::fp/coupon/issue');
		}
		else
		{
			$presenter = \Presenter::forge('media::coupon/issue');
		}
		$presenter->coupon = $this->member_coupon_history->coupon;
		$presenter->store = $this->member_coupon_history->store;
		$presenter->member = $this->member_coupon_history->member;
		$presenter->store_member = $this->member_coupon_history->store_member;
		$presenter->member_delivery_history = $this->member_coupon_history->member_delivery_history;
		$presenter->member_coupon_history = $this->member_coupon_history;
		$this->template->title = 'クーポン発行画面';
		$this->template->content = $presenter;
	}

}
