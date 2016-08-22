<?php
namespace Media;
class Presenter_Sitemap_Menu_Top extends Presenter_Sitemap
{

	public function view()
	{
		\Additional_Log::debug("start.");

		$arr = array();
		foreach ($this->menu_list as $val)
		{
			$menu_detail = \Model_Site_Store_Free::find($val['menu']);
			$menu_detail['picture_id'] = $val['id'];
			$arr[] = $menu_detail;
		}
		$this->set_safe('menu', $arr, false);

		parent::view();
	}
}
