<?php
namespace Media;

class Controller_Information_List extends \Controller_Media
{

	private $infomation_list;

	/**
	 * 前処理
	 */
	public function before()
	{
		parent::before();
		\Additional_Log::debug("start.");

		// 相対パスが崩れちゃうから....呼び出しURLが「/」で終わっていたら取り除いてリダイレクト....
		if (substr(\Input::uri(), -1) == '/')
		{
			\Response::redirect(substr(\Input::uri(), 0, -1));
		}

		// お知らせ一覧取得
		$date = \Date::forge(time())->format("%Y-%m-%d %H:%M");
		if ($this->store_id == 0)
		{
			$publisher_type = INFORMATION_PUBLISHER_TYPE_BRAND;
			$publisher_id = $this->brand_id;
		}
		else
		{
			$publisher_type = INFORMATION_PUBLISHER_TYPE_STORE;
			$publisher_id = $this->store_id;
		}

		$cond = array(
			'related' => array(
				'information_publisher' => array(
					'where' => array(
						array('publisher_type', '=', $publisher_type),
						array('publisher_id', '=', $publisher_id),
					),
				)
			),
			'order_by' => array(
				'effective_period_from' => 'desc',
				'priority' => 'desc'
			),
			'where' => array(
				array('effective_period_from', '<', $date),
				array('effective_period_to', '>', $date),
			),

		);
		$this->infomation_list = \Model_Information::find('all', $cond);
	}

	/**
	 * 後処理
	 */
	public function after($response)
	{
		$response = parent::after($response);
		return $response;
	}


	function action_index()
	{
		$this->template->set('title', $this->header_footer->sitemap_name);
		$presenter = \Presenter::forge('information/list');
		$presenter->set_safe('infomation_list', $this->infomation_list);
		$this->template->content = $presenter;
	}

}
