<?php
namespace Media;
class Presenter_Footer extends \Presenter
{

	public function view()
	{
		$this->set_safe('footer_free_text', (!empty($this->header_footer->sitemap_free_text)) ? $this->header_footer->sitemap_free_text : '', false);
		$this->set_safe('footer_copyright', (!empty($this->header_footer->sitemap_copyright)) ? $this->header_footer->sitemap_copyright : '', false);
	}

}
