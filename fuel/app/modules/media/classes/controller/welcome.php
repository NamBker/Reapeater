<?php
namespace Media;

class Controller_Welcome extends \Controller
{

	/**
	 * 前処理
	 */
	public function before()
	{
		\Additional_Log::debug("start.");
		\Lang::load('message');
		parent::before();
	}


	function action_index()
	{
		\Additional_Log::debug("start.");
		return \Response::forge(\View::forge('welcome/index'));
	}

	function action_404()
	{
		\Additional_Log::debug("start.");
		$is_featurephone = \Agent::is_featurephone();
		// HTTP 404 出力ヘッダを設定する
		if ($is_featurephone){
			return \Response::forge(\View::forge('fp/welcome/404'), 404);
		}else{
			return \Response::forge(\View::forge('welcome/404'), 404);
		}
	}

	function action_500()
	{
		\Additional_Log::debug("start.");
		$is_featurephone = \Agent::is_featurephone();
		// HTTP 500 出力ヘッダを設定する
		if ($is_featurephone){
			return \Response::forge(\View::forge('fp/welcome/500'), 500);
		}else{
			return \Response::forge(\View::forge('welcome/500'), 500);
		}
	}

}
