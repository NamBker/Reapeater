<?php

class Presenter_Media extends \Presenter
{

    protected $company_id = 0;
    protected $brand_id = 0;
    protected $store_id = 0;

    public function setIds($company_id, $brand_id = 0, $store_id = 0)
    {
		\Additional_Log::debug("start.");
        $this->company_id = $company_id;
        $this->brand_id = $brand_id;
        $this->store_id = $store_id;
		\Additional_Log::debug("end.");
    }

	public function view()
	{
		$this->set_safe('sitemap_catchcopy', (!empty($this->header_footer->sitemap_catchcopy)) ? $this->header_footer->sitemap_catchcopy : '', false);
	}

}
