<?php
namespace Media;

class Controller_Random_Coupon extends \Controller_Media
{
	private $member_random_coupon_history = null;
	private $random_coupon = null;

	private $is_test = false;

	public function before()
	{
		\Additional_Log::debug("start.");

		$this->is_featurephone = \Agent::is_featurephone();

		if ($this->is_featurephone)
		{
			$this->template = 'fp/template';
		}

		// 親の before() は呼ばないでおこう（URLパラメータなど来ないから共通処理が使えない）
		\Controller_Template::before();

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
		\Additional_Log::debug('$random_key: '.$random_key);
		if (is_null($random_key))
		{
			\Additional_Log::error('media: "key" is null');
			throw new \HttpNotFoundException;
		}

		// クーポン履歴
		$this->member_random_coupon_history = \Model_Member_Random_Coupon_History::findByRandomKey($random_key);
		if (is_null($this->member_random_coupon_history))
		{
			\Additional_Log::error('media: "member_coupon_history" is null. key:'.$random_key);
			throw new \HttpNotFoundException;
		}
		\Additional_Log::debug('member_random_coupon_history->member_id:'.$this->member_random_coupon_history->member_id);
		$this->is_test = $this->member_random_coupon_history->member_id == 0;
		\Additional_Log::debug('is_test:'.$this->is_test);

		$this->random_coupon = \Model_Random_Coupon::findById($this->member_random_coupon_history->random_coupon_id);

		$this->company_id = $this->random_coupon->company_id;
		$this->brand_id = $this->random_coupon->brand_id;
		$this->store_id = $this->random_coupon->store_id;

		$this->company = $this->random_coupon->company;
		$this->brand = $this->random_coupon->brand;
		$this->store = $this->random_coupon->store;

		$this->header_footer = \Model_Site_Headers_Footer::find('first', array(
			'where' => array(
				'company_id' => $this->company_id,
				'brand_id'   => $this->brand_id,
				'store_id'   => $this->store_id,
			),
		));

		$this->template->set_global('company', $this->company);
		$this->template->set_global('brand', $this->brand);
		$this->template->set_global('store', $this->store);
		$this->template->set_global('header_footer', $this->header_footer, false);

		$this->template->header = \Presenter::forge('header', 'view', null, 'header_simple');
		$this->template->footer = \Presenter::forge('footer', 'view', null, 'footer_simple');

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
		//auの場合、SJISに変更
		if (\Agent::is_aufeaturephone())
		{
			$this-> template = mb_convert_encoding($this-> template, "SJIS", "UTF-8");
		}
		$response = parent::after($response);
		return $response;
	}

	/**
	 * ランダムクーポントップページ
	 */
	function action_index()
	{
		\Additional_Log::debug("start.");

		// 抽選前画面表示フラグチェック
		if ($this->random_coupon->random_coupon_screen_flg)
		{
			\Additional_Log::debug("抽選前画面表示する");

			if ($this->is_featurephone)
			{
				$presenter = \Presenter::forge('random/coupon/top', 'view', null, 'fp/random/coupon/top');
			}
			else
			{
				$presenter = \Presenter::forge('random/coupon/top');
			}
			$presenter->set_safe('random_coupon', $this->random_coupon);
			$this->template->title = 'ランダムクーポン抽選';
			$this->template->set_safe('content', $presenter);
		}
		else
		{
			\Additional_Log::debug("抽選前画面表示しない");
			self::view_coupon();
		}
	}

	/**
	 * ランダムクーポン抽選結果ページ
	 */
	function action_lottery()
	{
		\Additional_Log::debug("start.");

		// 抽選済み？
		if ($this->is_test) {
			\Additional_Log::debug("テスト送信からの表示");
			$coupon_id = self::lottery_coupon();
		}
		if ($this->member_random_coupon_history->coupon_id == 0)
		{
			\Additional_Log::debug("未抽選判定");
			$coupon_id = self::lottery_coupon();
		}
		else
		{
			\Additional_Log::debug("抽選済み判定");
			$coupon_id = $this->member_random_coupon_history->coupon_id;
		}

		//
		$random_coupon_item = \Model_Random_Coupon_item::find(
			'first',
			array(
				'where' => array(
					'random_coupon_id' => $this->random_coupon->id,
					'coupon_id'   => $coupon_id,
				)
			)
		);

		$menber_coupon_history = \Model_Member_Coupon_History::find(
			'first',
			array(
				'where' => array(
					'coupon_id' => $coupon_id,
					'store_id' => $this->member_random_coupon_history->store_id,
					'member_id' => $this->member_random_coupon_history->member_id,
					'delivery_id' => 0,
					'member_delivery_history_id' => 0,
					'member_random_coupon_history_id' => $this->member_random_coupon_history->id,
				)
			)
		);

		if ($this->is_featurephone)
		{
			$presenter = \Presenter::forge('random/coupon/lottory', 'view', null, 'fp/random/coupon/lottory');
		}
		else
		{
			$presenter = \Presenter::forge('random/coupon/lottory');
		}

		$presenter->set_safe('random_coupon_item', $random_coupon_item);
		$presenter->set_safe('menber_coupon_history', $menber_coupon_history);
		$this->template->title = 'ランダムクーポン結果';
		$this->template->set_safe('content', $presenter);
	}

	private function view_coupon()
	{
		// 抽選済み？
		if ($this->is_test) {
			\Additional_Log::debug("テスト送信からの表示");
			$coupon_id = self::lottery_coupon();
		}
		if ($this->member_random_coupon_history->coupon_id == 0)
		{
			\Additional_Log::debug("未抽選判定");
			$coupon_id = self::lottery_coupon();
		}
		else
		{
			\Additional_Log::debug("抽選済み判定");
			$coupon_id = $this->member_random_coupon_history->coupon_id;
		}

		$menber_coupon_history = \Model_Member_Coupon_History::find(
			'first',
			array(
				'where' => array(
					'coupon_id' => $coupon_id,
					'store_id' => $this->member_random_coupon_history->store_id,
					'member_id' => $this->member_random_coupon_history->member_id,
					'delivery_id' => 0,
					'member_delivery_history_id' => 0,
					'member_random_coupon_history_id' => $this->member_random_coupon_history->id,
				)
			)
		);

		\Response::redirect('media/coupon?key='.$menber_coupon_history->random_key);
	}

	/**
	 * 抽選処理
	 * @return 当選したクーポンID
	 */
	private function lottery_coupon()
	{
		\Additional_Log::debug('start.');
		$lotto_coupon_id = 0;

		try
		{
			$db = \Database_Connection::instance();
			$db->start_transaction();

			$sub_query =
			\DB::select(
				'coupon_id',
				array(\DB::expr('count(`coupon_id`)'), 'count')
			)
			->from('member_random_coupon_histories')
			->where('random_coupon_id', '=',  \DB::expr($this->random_coupon->id))
			->where('coupon_id', '<>', 0)
			->where('member_id', '<>', 0)
			->group_by('coupon_id')
			->compile();
			$sub_query = "($sub_query) AS cnt";

			\Additional_Log::debug($sub_query);

			$random_coupon_item_list = \DB::select('rci.*')
			->from(array('random_coupon_items', 'rci'))
			->join(\DB::expr($sub_query), 'left')
			->on('rci.coupon_id','=','cnt.coupon_id')
			->where('rci.random_coupon_id', '=', \DB::expr($this->random_coupon->id))
			->where_open()
			->where('rci.coupon_max_count', '>', \DB::expr('`cnt`.`count`'))
			->or_where('rci.coupon_max_count', '=', 0)
			->or_where('cnt.count', '=', null)
			->where_close()
			->execute();

			// 抽選しまっせ
			$total = 0; // 確率合計
			foreach ($random_coupon_item_list as $random_coupon_item)
			{
				$total += $random_coupon_item['coupon_probability'];
			}

			$lotto = rand(1, $total); // くじ引き
			foreach ($random_coupon_item_list as $random_coupon_item)
			{
				if (($total -= $random_coupon_item['coupon_probability']) < $lotto)
				{
					$lotto_coupon_id = $random_coupon_item['coupon_id'];
					break;
				}
			}

			// 抽選結果反映
			$this->member_random_coupon_history->coupon_id = $lotto_coupon_id;
			$this->member_random_coupon_history->save();

			$member_coupon_history = \Model_Member_Coupon_History::forge();
			$member_coupon_history->coupon_id = $lotto_coupon_id;
			$member_coupon_history->store_id = $this->member_random_coupon_history->store_id;
			$member_coupon_history->member_id = $this->member_random_coupon_history->member_id;
			$member_coupon_history->delivery_id = 0;
			$member_coupon_history->member_delivery_history_id = 0;
			$member_coupon_history->member_random_coupon_history_id = $this->member_random_coupon_history->id;
			$member_coupon_history->random_key = uniqid();
			$member_coupon_history->save();

			$db->commit_transaction();
		}
		catch (Exception $e)
		{
			$db->rollback_transaction();
			$lotto_coupon_id = 0;
		}
		return $lotto_coupon_id;
	}

}
