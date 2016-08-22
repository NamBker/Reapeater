<?php

namespace Imageapi;
class Controller_Image extends \Controller_Imageapi
{
    protected static $required_parameters = array(
        'index' => array(
            'picture' => true,
        ),
        'delete' => array(
            'picture' => true,
        ),
    );

    protected function index()
    {
        \Additional_Log::debug('【IMAGE API】:START');

        // 引数取得
        $params = $this->setParams();

	// フルパス情報取得
	$object_name = $this->params['picture'];
	
	// オブジェクトストレージから画像取得
        try {
            $data = \ObjectStorage::download($object_name);
        } catch (\Exception $e) {
            throw new \ProtocolException($e->getMessage(), "画像が存在していません。", \ProtocolException::RESULT_CODE_OBJECT_STORAGE_ERROR);
	    //404で返したい
        }

	// サーバに保存
	$server_config = \Fuel\Core\Config::get('repeater.server_apps');
	$path_parts = pathinfo($object_name);
	$save_path = $server_config['img_server']['root_dir'].$server_config['img_server']['display_dir'];
	$save_path .= $path_parts['dirname'];

        \Additional_Log::debug(print_r($save_path, true));

	if (!file_exists($save_path)) {
		mkdir($save_path, 0777, true);
	}
	file_put_contents($save_path.'/'.$path_parts['basename'], $data['body']);

        \Additional_Log::debug('【IMAGE API】:END');

	// localのURLへリダイレクト ポート指定はnginxのループを避けるため
	if (!strstr(\Fuel\Core\Input::protocol(), 'https')) {	
		$scheme = $server_config['img_server']['scheme_http'];
		$port = '80';
	} else {
		$scheme = $server_config['img_server']['scheme_https'];
		$port = '443';
	}
	$url = $scheme."://".$server_config['img_server']['host'].":".$port."/".$server_config['img_server']['display_dir'].$object_name;
	header("Location: {$url}", TRUE, 301);
	exit();

    }  
    protected function delete()
    {
        \Additional_Log::debug('【PICTURE DELETE IMAGE API】:START');

        // 引数取得
        $params = $this->setParams();

	// フルパス情報取得
	$object_name = $this->params['picture'];

	// サーバにから画像削除
	$server_config = \Fuel\Core\Config::get('repeater.server_apps');
	$path_parts = pathinfo($object_name);
	$save_path = $server_config['img_server']['root_dir'].$server_config['img_server']['display_dir'];
	$save_path .= $path_parts['dirname'];

	if (file_exists($save_path)) {
	    \Fuel\Core\File::delete_dir($save_path, true, true);
            \Additional_Log::debug('【PICTURE DELETE IMAGE API】:DELETED');
	}

        \Additional_Log::debug('【PICTURE DELETE IMAGE API】:END');
    }
    /**
    *  
    * パラメータ登録
    * @return array
    */
    private function setParams(){
        \Additional_Log::debug('【IMAGE API】:SET PARAM');

        // 画像情報設定
        $picture = array();
	if($this->params['picture'] !== "") {
            $picture['picture'] = $this->params['picture'];
	} else {
            throw new \ProtocolException($e->getMessage(), "サーバでエラーが発生しました", \ProtocolException::RESULT_CODE_OBJECT_STORAGE_ERROR);
	}
        return $picture;
    }
}