<?php
namespace Media;
class Presenter_Sitemap_Menu_Detail extends Presenter_Sitemap
{

	public function view()
	{
		\Additional_Log::debug("start.");

		if ($this->menu_display == 1)
		{
			$menu_list = \Model_Site_Store_Free::find('all', array(
				'where' => array(
					'company_id' => $this->company_id,
					'brand_id'   => $this->brand_id,
					'store_id'   => $this->store_id,
					'page_type'  => 5,
				),
				'order_by' => array('display_order')
			));
			$this->set_safe('menu_list', $menu_list, false);
		}

		parent::view();
	}
}
