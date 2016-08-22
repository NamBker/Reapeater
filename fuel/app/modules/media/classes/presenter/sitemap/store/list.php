<?php
namespace Media;
class Presenter_Sitemap_Store_List extends Presenter_Sitemap
{

	public function view()
	{
		\Additional_Log::debug("start.");
		parent::view();

		$company_id = $this->sitemap_data->company_id;
		$brand_id = $this->sitemap_data->brand_id;

		# 連想配列に詰め替え
		$array = array();
		foreach ($this->store_list as $store) {
			\Additional_Log::debug("page_type:". $store['store_area_L_id'] .','. $store['store_area_M_id'] .','. $store['store_area_S_id']);
			$array[$store['store_area_L_id']][$store['store_area_M_id']][$store['store_area_S_id']][] = $store;
		};
		$this->store_list = $array;
	}
}
