<?php
namespace Media;

class Controller_Sitemap extends \Controller_Media
{
	private $redirect_url;

	/**
	 * 前処理
	 */
	public function before()
	{
		parent::before();
		\Additional_Log::debug("start.");

		// ストアコードでURLが終わっている時に、末尾に '/' がなかったら'/'をつけてリダイレクト
		// > 相対パスが崩れるのを防ぐためです。
		$request_uri = explode('?', $_SERVER['REQUEST_URI']);
		$needle = '/'.$this->param('store_code').'/';
		\Additional_Log::debug("uri:".$_SERVER['REQUEST_URI']);
		if (strpos($request_uri[0], $needle) === false)
		{
			$request_uri[0] .= '/';
			$query = '';
			if (count($request_uri) > 1)
			{
				$query = '?' . $request_uri[1];
			}
			\Additional_Log::debug("end. redirect:". $request_uri[0] . $query);
			\Response::redirect($request_uri[0] . $query);
		}

		\Additional_Log::debug("end. fnc_name:". $this->param('function_name'));
	}


	function action_index()
	{
		\Additional_Log::debug("start. [CID:".$this->company->id."] [BID:".$this->brand_id."] [SID:".$this->store_id."] [FUNC:". $this->param('function_name'). "]");

		// サイト構成情報取得
		$sitemap_url = $this->param('function_name') ? $this->param('function_name') : 'index';
		$sitemap_data = \Model_Site_Store_Free::findByCompanyIdAndBrandIdAndStoreId($this->company->id, $this->brand_id, $this->store_id, $sitemap_url);

		if (!$sitemap_data)
		{
			\Additional_Log::debug("sitemap data 取得できませんでした. [CID:".$this->company->id."] [BID:".$this->brand_id."] [SID:".$this->store_id."] [FUNC:". $this->param('function_name'). "]");
			throw new \HttpNotFoundException;
		}

		\Additional_Log::debug("page_type:". $sitemap_data->page_type);
		$organize_parts = json_decode($sitemap_data->organize_parts, true);
		if (is_null($organize_parts))
		{
			\Additional_Log::error("organize_parts JSON decode error. id[$sitemap_data->id], json[$sitemap_data->organize_parts]");
			throw new \HttpServerErrorException;
		}

		// サイトマップ設定で、レコードが追加されたばかりの状態があり、JSONが空になることがアリエール。
		if (count($organize_parts) === 0)
		{
			\Additional_Log::error("organize_parts none data. id[$sitemap_data->id], json[$sitemap_data->organize_parts]");
			throw new \HttpServerErrorException;
		}

		switch ($sitemap_data->page_type) {
			case PAGE_TYPE_HOME_TOP:
				// 本部トップ
				$presenter = \Presenter::forge('sitemap/brand/top');
				$presenter->set_safe('sitemap_catchcopy', $this->header_footer->sitemap_catchcopy);
				$presenter->set_safe('sitemap_name', $this->header_footer->sitemap_name);
			break;

			case PAGE_TYPE_STORE_TOP:
				// 店舗トップ
				$presenter = \Presenter::forge('sitemap/store/top');
				$presenter->set('main_picuture_id', $this->header_footer->sitemap_picture_id);
			break;

			case PAGE_TYPE_STORE_LIST:
				$sub_query = \Model_Store::getAreaListQuery($this->brand_id);
				$sub_query = "($sub_query) AS a";

				if ($organize_parts['display_type'] == DISPLAY_TYPE_ALL_SHOP)
				{
					$presenter = \Presenter::forge('sitemap/store/list');
					$store_list = \DB::select('s.*', 'a.area_L_name', 'a.area_M_name', 'a.area_S_name')
					->from(array('stores', 's'))
					->join(\DB::expr($sub_query))
					->on('a.brand_id','=','s.brand_id')
					->on('a.area_L_id','=','s.store_area_L_id')
					->on('a.area_M_id','=','s.store_area_M_id')
					->on('a.area_S_id','=','s.store_area_S_id')
					->where('s.brand_id', '=', $this->brand_id)
					->order_by('s.store_area_L_sort_index')
					->order_by('s.store_area_M_sort_index')
					->order_by('s.store_area_S_sort_index')
					->order_by('s.store_sort_index')
					->execute();

					\Additional_Log::debug("$sub_query");

					$area_list = \DB::select()
					->from('areas')
					->where('brand_id', '=', $this->brand_id)
					->execute()
					->as_array('id');

					$get_param = "";

				}
				else
				{
					$presenter = \Presenter::forge('sitemap/store/area');

					$area_L_id = \Input::get('lid');
					$area_M_id = \Input::get('mid');
					$area_S_id = \Input::get('sid');

					if ($area_L_id === null)
					{
						# 大分類リスト
						$area_list = \DB::select(array('area_L_id','id'), array('area_L_name','name'))
						->from(\DB::expr($sub_query))
						->order_by('area_L_sort')
						->order_by('area_M_sort')
						->order_by('area_S_sort')
						->distinct()
						->execute();

						$store_list = array();
						$get_param = "?lid=";
					}
					else if ($area_L_id == 0)
					{
						# 大分類 そのた
						$store_list = \Model_Store::find('all', array(
							'where' => array(
								'brand_id' => $this->brand_id,
								'store_status' => 3,
								'store_area_L_id' => $area_L_id,
							),
						));

						$area_list = array();
						$get_param = "";
					}
					else if (empty($area_M_id))
					{
						# 大分類選択（中分類表示）
						$area_list = \DB::select(array('area_M_id','id'), array('area_M_name','name'))
						->from(\DB::expr($sub_query))
						->where('area_L_id', '=', $area_L_id)
						->order_by('area_L_sort')
						->order_by('area_M_sort')
						->order_by('area_S_sort')
						->distinct()
						->execute();

						$store_list = $this->store = \Model_Store::find('all', array(
							'where' => array(
								'brand_id' => $this->brand_id,
								'store_status' => 3,
								'store_area_L_id' => $area_L_id,
								'store_area_M_id' => 0,
								'store_area_S_id' => 0,
							),
						));

						$get_param = "?lid=${area_L_id}&mid=";
					}
					else if (empty($area_S_id))
					{
						# 中分類選択（小分類表示）
						$area_list = \DB::select(array('area_S_id','id'), array('area_S_name','name'))
						->from(\DB::expr($sub_query))
						->where('area_L_id', '=', $area_L_id)
						->where('area_M_id', '=', $area_M_id)
						->order_by('area_L_sort')
						->order_by('area_M_sort')
						->order_by('area_S_sort')
						->distinct()
						->execute();

						$store_list = $this->store = \Model_Store::find('all', array(
							'where' => array(
								'brand_id' => $this->brand_id,
								'store_status' => 3,
								'store_area_L_id' => $area_L_id,
								'store_area_M_id' => $area_M_id,
								'store_area_S_id' => 0,
							),
						));

						$get_param = "?lid=${area_L_id}&mid=${area_M_id}&sid=";
					}
					else if (!empty($area_S_id))
					{
						# 小分類選択（小分類店舗一覧）
						$area_list = array();

						$store_list = $this->store = \Model_Store::find('all', array(
							'where' => array(
								'brand_id' => $this->brand_id,
								'store_status' => 3,
								'store_area_L_id' => $area_L_id,
								'store_area_M_id' => $area_M_id,
								'store_area_S_id' => $area_S_id,
							),
							'order_by' => 'store_sort_index'
						));
						$get_param = "";
					}
				}
				$presenter->set_safe('area_list', $area_list);
				$presenter->set_safe('store_list', $store_list);
				$presenter->set('get_param', $get_param);
				$presenter->set('noarea_name', NOAREA_LABEL);
			break;

			case PAGE_TYPE_MENU_TOP:
				$presenter = \Presenter::forge('sitemap/menu/top');
			break;

			case PAGE_TYPE_MENU_DETAIL:
				$presenter = \Presenter::forge('sitemap/menu/detail');
			break;

			case PAGE_TYPE_COMPANY_SUMMARY:
				$presenter = \Presenter::forge('sitemap/company');
			break;

			case PAGE_TYPE_NO_LAYOUT:
				$presenter = \Presenter::forge('sitemap/plain');
			break;

			case PAGE_TYPE_NO_MEMNU_LAYOUT:
				$presenter = \Presenter::forge('sitemap/menu_plain');
			break;

			case PAGE_TYPE_MAIL_MAGAZIN_COUPON:
				$presenter = \Presenter::forge('sitemap_mail_coupon');
			break;

			default:
				\Additional_Log::error("page_type error. id[$sitemap_data->id], page_type[$sitemap_data->page_type]");
				throw new \HttpServerErrorException;
			break;
		}

		$this->template->set('title', $this->header_footer->sitemap_name);

		$presenter->setIds($this->company->id, $this->brand->id, $this->store_id);
		$presenter->set('sitemap_data', $sitemap_data);
		$presenter->set_safe($organize_parts, null);

		$this->template->content = $presenter;
		\Additional_Log::debug('end.');
	}

}
