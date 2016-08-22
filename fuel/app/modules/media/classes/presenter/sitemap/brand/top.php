<?php
namespace Media;
class Presenter_Sitemap_Brand_Top extends Presenter_Sitemap
{

	public function view()
	{
		\Additional_Log::debug("start.");
		parent::view();

		if (!empty($this->info_display_setting) && $this->info_display_setting) {
			\Additional_Log::debug("お知らせ取得.");

			$date = \Date::forge(time())->format("%Y-%m-%d %H:%M");
			$limit = !empty($this->info_display_number) ? $this->info_display_number : 5;

			$cond = array(
				'related' => array(
					'information_publisher' => array(
						'where' => array(
							array('publisher_type', '=', INFORMATION_PUBLISHER_TYPE_BRAND),
							array('publisher_id', '=', $this->brand_id),
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

			if ($limit > 0)
			{
				$cond['limit'] = $limit;
			}

			$this->info = \Model_Information::find('all', $cond);
			\Additional_Log::debug("count ".count($this->info));

			if (empty($this->info))
			{
				$this->info = array();
			}
		}
		\Additional_Log::debug('end.');
	}
}
