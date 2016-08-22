<?php
namespace Media;
class Presenter_Sitemap extends \Presenter_Media
{

	public function view()
	{
		\Additional_Log::debug("start.");
		parent::view();

		$this->set('sitemap_name', $this->sitemap_data->sitemap_name);
	}

}
