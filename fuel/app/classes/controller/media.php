<?php

class Controller_Media extends \Controller_Template
{
	protected $company = null;
	protected $brand = null;
	protected $store = null;

	// 3Master ID
	protected $company_id = null;
	protected $brand_id = null;
	protected $store_id = null;

	// 3Master Code
	protected $brand_code = null;
	protected $store_code = null;

	protected $header_footer = null;

	protected $brand_url;
	protected $base_url;

	protected $is_featurephone;
	protected $is_original_domain;
	protected $brand_domain;

	public function before()
	{
		\Additional_Log::debug("start.");
		\Config::load('media::repeater');
		\Lang::load('media::message');

		$this->is_featurephone = \Agent::is_featurephone();

		if ($this->is_featurephone)
		{
			$this->template = 'fp/template';
		}

		parent::before();

		if ($this->is_featurephone)
		{
			Asset::add_path('assets/media/fp/img/', 'img');
		}
		else
		{
			Asset::add_path('assets/media/css/', 'css');
			Asset::add_path('assets/media/js/', 'js');
			Asset::add_path('assets/media/img/', 'img');
		}

		self::initCheckDomain();

		// 3Master情報収集(ID/Code)
		if (self::isOriginalDomain())
		{
			// ドメイン名で取得したブランド情報を元に3MasterのID,Code収集
			self::setThreeMasterIdAndCodeForDomain($this->brand_domain);
		}
		else
		{
			// URLパラメータから3MasterのID,Code収集
			self::setThreeMasterIdAndCodeForURL();
		}
		\Additional_Log::debug("3Master CID:$this->company_id BCODE:$this->brand_code SCODE:$this->store_code");

		// 3Master情報収集
		if ($this->store_code == 'b')
		{
			self::setThreeMasterDataForBrand();
		}
		else
		{
			self::setThreeMasterDataForStore();
		}

		self::setUrl();
		$this->template->set_global('base_url', $this->base_url);
		$this->template->set_global('brand_url', $this->brand_url);

		// ヘッダー・フッター取得
		$this->header_footer = \Model_Site_Headers_Footer::find(
			'first',
			array(
				'where' => array(
					'company_id' => $this->company_id,
					'brand_id'   => $this->brand_id,
					'store_id'   => $this->store_id,
				),
			)
		);
		if (is_null($this->header_footer))
		{
			\Additional_Log::error("Site_Headers_Footer none found. COMPANY:$this->company_id, BRAND:$this->brand_id, STORE:$this->store_id");
			throw new HttpServerErrorException;
		}

		# menu取得
		$menu_list = \Model_Site_Store_Free::getMenuList($this->company_id, $this->brand_id, $this->store_id);

		$this->template->set_global('menu_list', $menu_list);
		$this->template->set_global('company', $this->company);
		$this->template->set_global('brand', $this->brand);
		$this->template->set_global('store', $this->store);
		$this->template->set_global('header_footer', $this->header_footer, false);

		if ($this->is_featurephone)
		{
			$this->template->header = Presenter::Forge('header', 'view', null, 'fp/header');
			$this->template->footer = Presenter::Forge('footer', 'view', null, 'fp/footer');
		}
		else
		{
			$this->template->header = Presenter::forge('header');
			$this->template->footer = Presenter::forge('footer');
		}
		\Additional_Log::debug("end.");
	}

	/**
	 * 後処理
	 */
	public function after($response)
	{
		\Additional_Log::debug("start.");
		$response = parent::after($response);
		\Additional_Log::debug("end.");
		return $response;
	}

	/**
	 * ブランドページ判定
	 */
	protected function isBrand()
	{
		return $this->store_id == 0;
	}

	/**
	 * 店舗ページ判定
	 */
	protected function isStore()
	{
		return $this->store_id != 0;
	}

	private function setThreeMasterIdAndCodeForURL()
	{
		\Additional_Log::debug("start.");

		$this->company_id = $this->param('company_id');
		$this->brand_code = $this->param('brand_code');
		$this->store_code = $this->param('store_code');

		if (!is_numeric($this->company_id) || empty($this->brand_code) || empty($this->store_code))
		{
			\Additional_Log::debug('【MEDIA:ERROR】cid:'.$this->company_id.' bcd:'.$this->brand_code.' scd:'.$this->store_code);
			throw new \HttpNotFoundException;
		}
		\Additional_Log::debug("end.");
	}

	private function setThreeMasterIdAndCodeForRandomKey()
	{
		\Additional_Log::debug("start.");
		# code...
		\Additional_Log::debug("end.");
	}

	private function setThreeMasterIdAndCodeForDomain($brand_domain)
	{
		\Additional_Log::debug("start.");

		$this->company_id = $brand_domain['company_id'];
		$this->brand_code = $brand_domain['brand_code'];
		$this->store_code = $this->param('store_code');

		if (!is_numeric($this->company_id) || empty($this->brand_code) || empty($this->store_code))
		{
			\Additional_Log::debug('【MEDIA:ERROR】cid:'.$this->company_id.' bcd:'.$this->brand_code.' scd:'.$this->store_code);
			//\Response::redirect('/');
			throw new \HttpNotFoundException;
			//throw new HttpServerErrorException;
		}
		\Additional_Log::debug("end.");
	}

	private function setThreeMasterDataForBrand()
	{
		\Additional_Log::debug("start.");
		$this->store = null;
		$this->company = \Model_Company::find($this->company_id);
		if (is_null($this->company))
		{
			\Additional_Log::debug('company is null. company_id['.$this->company_id.']');
			throw new \HttpNotFoundException;
		}
		if ($this->company->company_status != \Model_Company::STATUS_OPEN)
		{
			\Additional_Log::debug('company_status is not STATUS_OPEN('.\Model_Company::STATUS_OPEN.'). company_status['.$this->company->company_status.']');
			throw new \HttpNotFoundException;
		}

		$this->brand = \Model_Brand::find('first', array(
			'where' => array(
				'company_id' => $this->company->id,
				'brand_code' => $this->brand_code,
			),
		));
		if (is_null($this->brand))
		{
			\Additional_Log::debug('brand is null. company_id['.$this->company_id.'], brand_code['.$this->brand_code.']');
			throw new \HttpNotFoundException;
		}
		if ($this->brand->brand_status != \Model_Brand::STATUS_OPEN)
		{
			\Additional_Log::debug('brand_status is not STATUS_OPEN('.\Model_Brand::STATUS_OPEN.'). brand_id['.$this->brand->id.'], brand_status['.$this->brand->brand_status.']');
			throw new \HttpNotFoundException;
		}

		$this->brand_id = $this->brand->id;
		$this->store_id = 0;
		\Additional_Log::debug("end.");
	}

	private function setThreeMasterDataForStore()
	{
		\Additional_Log::debug("start.");
		$this->store = \Model_Store::find('first', array(
			'where' => array(
				'store_code' => $this->store_code,
				'brand_id' => \Model_Brand::getId($this->company_id, $this->brand_code)
			),
		));

		// Store check
		if (is_null($this->store))
		{
			\Additional_Log::debug('store is null. company_id['.$this->company_id.'], brand_code['.$this->brand_code.'], store_code['.$this->store_code.']');
			\Response::redirect('media/error');
		}
		if ($this->store->store_status != \Model_Store::STATUS_OPEN)
		{
			\Additional_Log::debug('store_status is not STATUS_OPEN('.\Model_Store::STATUS_OPEN.'). store_id['.$this->store->id.'], store_status['.$this->store->store_status.']');
			throw new \HttpNotFoundException;
		}

		// Brand check
		if (is_null($this->store->brand))
		{
			\Additional_Log::debug('brand is null. company_id['.$this->company_id.'], brand_code['.$this->brand_code.']');
			throw new \HttpNotFoundException;
		}
		if ($this->store->brand->brand_status != \Model_Brand::STATUS_OPEN)
		{
			\Additional_Log::debug('brand_status is not STATUS_OPEN('.\Model_Brand::STATUS_OPEN.'). brand_id['.$this->store->brand->id.'], brand_status['.$this->store->brand->brand_status.']');
			throw new \HttpNotFoundException;
		}

		// Company check
		if (is_null($this->store->brand->company))
		{
			\Additional_Log::debug('company is null.');
			throw new \HttpNotFoundException;
		}
		if ($this->store->brand->company->company_status != \Model_Company::STATUS_OPEN)
		{
			\Additional_Log::debug('company_status is not STATUS_OPEN('.\Model_Company::STATUS_OPEN.'). company_status['.$this->store->brand->company->company_status.']');
			throw new \HttpNotFoundException;
		}

		$this->company = $this->store->brand->company;
		$this->brand = $this->store->brand;

		$this->brand_id = $this->brand->id;
		$this->store_id = $this->store->id;
		\Additional_Log::debug("end.");
	}

	private function setUrl()
	{
		\Additional_Log::debug("start.");
		if (isset($_SERVER['HTTPS']) AND $_SERVER['HTTPS'] == 'on')
		{
			$this->base_url = 'https://';
		}
		else
		{
			$this->base_url = 'http://';
		}
		$this->base_url .= $_SERVER["HTTP_HOST"];
		$this->brand_url = $this->base_url;

		// 独自ドメイン判定
		if (self::isOriginalDomain())
		{
			$this->base_url .= "/$this->store_code/";
			$this->brand_url .= "/b/";
		}
		else
		{
			$this->base_url .= "/media/$this->company_id/$this->brand_code/$this->store_code/";
			$this->brand_url .= "/media/$this->company_id/$this->brand_code/b/";
		}
		\Additional_Log::debug("end.");
	}

	protected function initCheckDomain()
	{
		// 独自ドメイン判定
		$domain_list = \Config::get('repeater.domain');
		if (!in_array($_SERVER['HTTP_HOST'], $domain_list))
		{
			// ドメイン名でブランド情報を引く
			$brands = \Model_Brand::findByDomain($_SERVER['HTTP_HOST']);
			$this->is_original_domain = count($brands) === 1;
			if ($this->is_original_domain)
			{
				$this->brand_domain = $brands[0];
			}
		}
		else
		{
			$this->is_original_domain = false;
		}
		return $this->is_original_domain;
	}

	protected function isOriginalDomain()
	{
		if (isset($this->is_original_domain)) return $this->is_original_domain;

		// 独自ドメイン判定
		$domain_list = \Config::get('repeater.domain');
		if (!in_array($_SERVER['HTTP_HOST'], $domain_list))
		{
			// ドメイン名でブランド情報を引く
			$brands = \Model_Brand::findByDomain($_SERVER['HTTP_HOST']);
			$this->is_original_domain = count($brands) === 1;
		}
		else
		{
			$this->is_original_domain = false;
		}
		return $this->is_original_domain;
	}

}
