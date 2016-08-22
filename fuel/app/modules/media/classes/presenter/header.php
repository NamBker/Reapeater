<?php
namespace Media;
class Presenter_Header extends \Presenter
{

	public function view()
	{
		$this->title = (!empty($this->brand->brand_name)) ? $this->brand->brand_name : '';
	}

}
