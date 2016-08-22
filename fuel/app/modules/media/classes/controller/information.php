<?php
namespace Media;

class Controller_Information extends \Controller_Media
{
	private $information_list_url;

	/**
	 * 前処理
	 */
	public function before()
	{
		parent::before();
		\Additional_Log::debug("start.");
		$information_id = $this->param('information_id');

		 if (empty($information_id) || !is_numeric($information_id))
		 {
			 \Additional_Log::debug("information_idが数値じゃない。ID[$information_id]");
			 throw new HttpNotFoundException;
		 }
		$this->infomation = \Model_Information::find($information_id);
		if (empty($this->infomation))
		{
			\Additional_Log::debug("お知らせが存在しない。ID[$information_id]");
			throw new HttpNotFoundException;
		}
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
		$presenter = \Presenter::forge('information/detail');
		$presenter->set_safe('infomation', $this->infomation);
		$this->template->content = $presenter;
	}

}
