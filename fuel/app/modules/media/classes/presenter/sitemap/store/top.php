<?php
namespace Media;
class Presenter_Sitemap_Store_Top extends Presenter_Sitemap
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
							array('publisher_type', '=', INFORMATION_PUBLISHER_TYPE_STORE),
							array('publisher_id', '=', $this->store_id),
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
		}
		if (empty($this->info))
		{
			$this->info = array();
		}

		$this->set_safe('store_postal_code', $this->store->store_postal_code);
		$this->set_safe('store_address', $this->store->store_address);
		$this->set_safe('store_access', $this->store->store_access);
		$this->set_safe('store_phone_no', $this->store->store_phone_no);
		$this->set_safe('store_regular_holiday', $this->store->store_regular_holiday);
		$this->set_safe('store_business_hours', $this->store->store_business_hours);
		\Additional_Log::debug('end.');
	}
}
