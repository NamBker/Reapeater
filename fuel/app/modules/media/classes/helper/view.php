<?php
namespace Media;
class Helper_View
{

	static public function replacePicture($str)
	{
		while (preg_match('/\{picture\: (?P<id>\\d+)\}/', $str, $matches)) {
			$str = preg_replace('/\{picture\: '.$matches['id'].'\}/', \Html::img(\Model_Picture::getPictureUrl($matches['id'])), $str);
		}
		return $str;
	}

}
