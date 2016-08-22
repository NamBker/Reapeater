<?php

class Model_Picture extends \Model_Standard_Model
{
	protected static $_table_name = "pictures";
	protected static $_properties = array(
		'id',
		'company_id' => array(
			'expose_pattern' => 1,
		),
		'brand_id' => array(
			'expose_pattern' => 1,
		),
		'section_id' => array(
			'expose_pattern' => 1,
		),
		'store_id' => array(
			'expose_pattern' => 1,
		),
  	'picture_path' => array(
			'data_type' => 'varchar',
			'null' => false,
			'validation' => array(
//				'required',
				'max_length' => array(
					32,
				),
			),
			'label' => '画像パス',
			'expose_pattern' => 2,
		),
	'picture_file_name' => array(
			'data_type' => 'varchar',
			'null' => false,
			'validation' => array(
				'required',
				'max_length' => array(
					32,
				),
			),
			'label' => '画像ファイル名',
			'expose_pattern' => 2,
		),
	  	'file_size' => array(
			'data_type' => 'int',
			'null' => false,
			'label' => 'ファイルサイズ',
			'expose_pattern' => 2,
		),
 	'vertically_horizontally' => array(
			'data_type' => 'varchar',
			'null' => false,
			'validation' => array(
				'required',
				'max_length' => array(
					32,
				),
			),
			'label' => '縦横サイズ',
			'expose_pattern' => 2,
		),
	'created_at' => array(
			'data_type' => 'datetime',
			'expose_type' => 'null',
		),
		'updated_at' => array(
			'data_type' => 'datetime',
			'expose_type' => '2',
		),
 	'mimetype' => array(
			'data_type' => 'varchar',
			'null' => false,
			'validation' => array(
				'required',
				'max_length' => array(
					32,
				),
			),
			'label' => 'mimeタイプ',
			'expose_pattern' => 2,
		),
	);

	protected static $_belongs_to = array(
		'company' => array(
			'model_to' => 'Model_Company',
			'key_from' => 'company_id',
			'key_to' => 'id',
			'cascade_save' => false,
			'cascade_delete' => false,
		),
		'brand' => array(
			'model_to' => 'Model_Brand',
			'key_from' => 'brand_id',
			'key_to' => 'id',
			'cascade_save' => false,
			'cascade_delete' => false,
		),
		'section' => array(
			'model_to' => 'Model_Section',
			'key_from' => 'section_id',
			'key_to' => 'id',
			'cascade_save' => false,
			'cascade_delete' => false,
		),
		'store' => array(
			'model_to' => 'Model_Store',
			'key_from' => 'store_id',
			'key_to' => 'id',
			'cascade_save' => false,
			'cascade_delete' => false,
		)
	);

	/**
	 * キー検索
	 * @param $id
	 * @return \Orm\Model|\Orm\Model[]
	 */
	public static function findById($id)
	{
		return static::find('first', array(
			'where' => array(
				'id' => $id
			),
		));
	}

    public static function findByUserAndId($user, $id)
    {
        if (empty($user)) {
            return null;
        }
        $conditions = array();
        switch($user->authority) {
        case USER_AUTHORITY_STORE:
            $conditions[] = array('store_id', $user->store_id);
        case USER_AUTHORITY_SECTION:
            $conditions[] = array('section_id', $user->section_id);
        case USER_AUTHORITY_BRAND:
            $conditions[] = array('brand_id', $user->brand_id);
        case USER_AUTHORITY_COMPANY:
            $conditions[] = array('company_id', $user->company_id);
        }
        $conditions[] = array('id', $id);
        return static::find('first', array(
            'where' => $conditions,
        ));
    }

	/**
	 * 画像登録
	 * @param $param
	 * @return id 画像ファイル名に利用
	 */
	public static function insertPicture($param)
	{
		$picture = static::forge(array(
			'company_id' => $param['company_id']
			,'brand_id' => $param['brand_id']
            ,'section_id' => $param['section_id']
			,'store_id' => $param['store_id']
			,'picture_path' => $param['picture_path']
			,'picture_file_name' => $param['picture_file_name']
			,'file_size' => $param['file_size']
			,'vertically_horizontally' => $param['vertically_horizontally']
			,'mimetype' => $param['mimetype']
		));
		try {
			$picture->save();
			//画像ファイル名用ID取得
			return $picture->id;

		} catch (Exception $ex) {
			throw new \ProtocolException($ex->getMessage(), "Can't create picture.", \ProtocolException::RESULT_CODE_CREATE_PICTURE_INVALID);
		}
	}

    public static function updatePicture($user, $param)
    {
        $picture = self::findById($param['id']);

        if(!empty($picture)){
            $picture->picture_file_name = $param['picture_file_name'];

            $picture->save();
        }else{
            throw new \ProtocolException('画像情報が未登録です。', "Picture is not exist.", \ProtocolException::RESULT_CODE_PICTURE_NOT_FOUND_NOT_FOUND);
        }
    }

	/**
	 * 条件設定
	 *
	 * @param $params
	 * @return array
	 */
	public static function makeConditions($params)
	{
		$conditions = array();
		if(!empty($params['company_id'])){
			$conditions[] = array('company_id', $params['company_id']);
		}
		if(!empty($params['brand_id'])){
			$conditions[] = array('brand_id', $params['brand_id']);
		}
		if(!empty($params['store_id'])){
			$conditions[] = array('store_id', $params['store_id']);
		}
		if(!empty($params['picture_path'])){
			$tmp = $params['picture_path'];
			$conditions[] = array('picture_path', 'like', "%$tmp%");
		}
		if(!empty($params['picture_file_name'])){
			$tmp = $params['picture_file_name'];
			$conditions[] = array('picture_file_name', 'like', "%$tmp%");
		}
		if(!empty($params['file_size'])){
			$conditions[] = array('file_size', $params['file_size']);
		}
		if(!empty($params['vertically_horizontally'])){
			$conditions[] = array('vertically_horizontally', $params['vertically_horizontally']);
		}
		if(!empty($params['mimetype'])){
			$tmp = $params['mimetype'];
			$conditions[] = array('mimetype', 'like', "%$tmp%");
		}

		return $conditions;
	}


	/**
	 * 画像ファイル判定 及び 縦横サイズ取得
	 * @param array $file アップロードファイル
	 *
	 */
	public static function getPictureSize($file)
	{
		set_error_handler("Model_Picture::errorHandler");
		try {
			$picture_size = getimagesize($file['file']);
		} catch (Exception $e) {
			throw new \ProtocolException(\Lang::get('picture_picture_fail_to_save'), '', \ProtocolException::RESULT_CODE_PICTURE_FAIL_TO_SAVE_PICTURE_FILE);
		}
		restore_error_handler();
	return $picture_size;
	}

	/**
	 * エラーハンドラー
	 * noticeをハンドリングするため
	 */
	private static function errorHandler($errno, $errstr, $errfile, $errline)
	{
		throw new \ErrorException ("サポートしていない画像形式です。", 0, $errno, $errfile, $errline);
	}

    /**
     * インサート用のレコードを作成する
     * @param array $file アップロードファイル
     * @param int $width
     * @param int $height
     * @param object $user
     */
    public static function makePictureRecord($file, $width, $height, $user)
    {
        $vertically_horizontally = null;
        if(isset($width, $height)) {
            $vertically_horizontally = "サイズ：横 ".$width."px × 縦 "."$height"."px";
        }

        $picture = array();
        $picture['company_id'] = 0;
        $picture['brand_id'] = 0;
        $picture['section_id'] = 0;
        $picture['store_id'] = 0;
        switch ($user->authority) {
        case USER_AUTHORITY_STORE:
            $picture['store_id'] = $user->store_id;
        case USER_AUTHORITY_SECTION:
            $picture['section_id'] = $user->section_id;
        case USER_AUTHORITY_BRAND:
            $picture['brand_id'] = $user->brand_id;
        case USER_AUTHORITY_COMPANY:
            $picture['company_id'] = $user->company_id;
        }
        $picture['picture_path'] = "";
        $picture['picture_file_name'] = isset($file['name']) ? $file['name'] : "";
        $picture['file_size'] = isset($file['size']) ? $file['size'] : 0;
        $picture['vertically_horizontally'] = isset($vertically_horizontally) ? $vertically_horizontally: "";
        $picture['mimetype'] = isset($file['mimetype']) ? $file['mimetype'] : 0;

        return $picture;
    }

    /**
     * 保存ファイルフルパス作成
     * @param object $user ユーザ属性
     */
    public static function makePicturePath($picture, $picture_id)
    {
        $save_path = null;
        $save_path .= is_null($picture['company_id']) ? "" : $picture['company_id'];
        $save_path .= is_null($picture['brand_id']) ? "" : '_'.$picture['brand_id'];
        $save_path .= '/'.$picture_id.'/';
	    return $save_path;
	}

	/**
	 * オブジェクトストレージ データ保存
	 * @param object $file 画像ファイルデータ
	 * @param array $container_name オブジェクトストレージ設定
	 * @param string $save_path 保存パス
	 * @param string $save_file 保存ファイル名
	 * @param string $save_mimetype 保存 MIME Type
	 *
	 */
	public static function uploadObjectStorage($file, $save_path, $save_file)
	{
		try {
		    \ObjectStorage::upload($save_path.$save_file, $file);
		} catch (\Exception $e) {
			throw new \ProtocolException($e->getMessage(), "サーバでエラーが発生しました", \ProtocolException::RESULT_CODE_OBJECT_STORAGE_ERROR);
		}
	}

	/**
	 * オブジェクトストレージ データ削除
	 * @param string $save_path 保存パス
	 * @param string $save_file 保存ファイル名
	 *
	 */
	public static function deleteObjectStorageData($save_path, $save_file)
	{
		try {
			\ObjectStorage::delete($save_path.$save_file);
		} catch (\Exception $e) {
			throw new \ProtocolException($e->getMessage(), "画像が削除できませんでした。", \ProtocolException::RESULT_CODE_OBJECT_STORAGE_ERROR);
		}
	}

	/**
	 * IMGサーバ 画像データ削除
	 * @param string $save_path 保存パス
	 * @param string $save_file 保存ファイル名
	 *
	 */
	public static function deleteImgServerData($save_path, $save_file)
	{
		$server_config = \Fuel\Core\Config::get('repeater.server_apps');
		$url = $server_config['img_server']['scheme_http']."://".$server_config['img_server']['host'].":".$server_config['img_server']['port']."/".$server_config['img_server']['version']."/";
		$token = \Input::get('token');
		$url .= 'images/?token='.$token;
		$url .= '&picture='.$save_path.$save_file;

		$curl = Request::forge($url, 'curl');
		$curl->set_method('delete');
		$result = $curl->execute();
	}

	/**
	 * 画像のサムネイルを保存する
	 * @param string $srcPath
	 * @param string $dstPath サムネイル画像用、フルパス
	 * @param int $maxWidth
	 * @param int $maxHeight
	 * @param int $originalWidth
	 * @param int $originalHeight
	 */
	public static function make_thumbnail($srcPath, $dstPath, $maxWidth, $maxHeight, $originalWidth, $originalHeight)
	{
		list($canvasWidth, $canvasHeight) = self::get_contain_size($originalWidth, $originalHeight, $maxWidth, $maxHeight);
		self::transform_image_size($srcPath, $dstPath, $canvasWidth, $canvasHeight);
	}

	/**
	     * 内接サイズを計算する
	     * @param int $width
	     * @param int $height
	     * @param int $containerWidth
	     * @param int $containerHeight
	     * @return array
	     */
	private static function get_contain_size($width, $height, $containerWidth, $containerHeight)
	{
	        $ratio = $width / $height;
	        $containerRatio = $containerWidth / $containerHeight;
	        if ($ratio > $containerRatio) {
	     	   return [$containerWidth, intval($containerWidth / $ratio)];
	        } else {
	     	   return [intval($containerHeight * $ratio), $containerHeight];
	        }
	}

	/**
	 * 画像のサイズを変形して保存する
	 * @param string $srcPath
	 * @param string $dstPath
	 * @param int $width
	 * @param int $height
	 */
	private static function transform_image_size($srcPath, $dstPath, $width, $height)
	{
		list($originalWidth, $originalHeight, $type) = getimagesize($srcPath);
		switch ($type) {
			case IMAGETYPE_JPEG:
				$source = imagecreatefromjpeg($srcPath);
				$canvas = imagecreatetruecolor($width, $height);
				imagecopyresampled($canvas, $source, 0, 0, 0, 0, $width, $height, $originalWidth, $originalHeight);
				imagejpeg($canvas, $dstPath);
				break;
			case IMAGETYPE_PNG:
				$source = imagecreatefrompng($srcPath);
				$canvas = imagecreatetruecolor($width, $height);
				imagealphablending($canvas, false);		// アルファブレンディングを無効
				imageSaveAlpha($canvas, true);			 // アルファチャンネルを有効
				$transparent = imagecolorallocatealpha($canvas, 0, 0, 0, 127); // 透明度を持つ色を作成
	   			imagefill($canvas, 0, 0, $transparent);	// 塗りつぶす
				imagecopyresampled($canvas, $source, 0, 0, 0, 0, $width, $height, $originalWidth, $originalHeight);
				imagepng($canvas, $dstPath);
			 	break;
			case IMAGETYPE_GIF:
				$source = imagecreatefromgif($srcPath);
				$canvas = imagecreatetruecolor($width, $height);
				$transparent = imagecolorallocatealpha($canvas, 0, 0, 0, 127); // 透明度を持つ色を作成
	   			imagefill($canvas, 0, 0, $transparent);	// 塗りつぶす
				imagecolortransparent($canvas, $transparent);
                		imagecopyresampled($canvas, $source, 0, 0, 0, 0, $width, $height, $originalWidth, $originalHeight);
                		imagegif($canvas, $dstPath);
            			break;
            		default:
                		throw new RuntimeException("サポートしていない画像形式です: $type");
	        }
	        imagedestroy($source);
	        imagedestroy($canvas);
	}

	/**
	 * ガラケー画像を作成する
	 * @param string $srcPath
	 * @param string $dstPath ガラケー画像用、フルパス
	 * @param int $maxWidth
	 * @param int $maxHeight
	 * @param int $originalWidth
	 * @param int $originalHeight
	 */
	public static function make_mbjpeg($srcPath, $dstPath, $maxWidth, $maxHeight, $originalWidth, $originalHeight)
	{
		// 指定サイズに変換 指定サイズより画像が大きい場合
		if ($maxHeight < $originalWidth || $maxHeight < $originalHeight) {
		    list($canvasWidth, $canvasHeight) = self::get_contain_size($originalWidth, $originalHeight, $maxWidth, $maxHeight);
		} else {
		    $canvasWidth = $originalWidth;
		    $canvasHeight = $originalHeight;
		}
		self::transform_jepg($srcPath, $dstPath, $canvasWidth, $canvasHeight);
	}

	/**
	 * 無条件にjpegに変換する
	 * @param string $srcPath
	 * @param string $dstPath ガラケー画像用、フルパス
	 */
	public static function transform_jepg($srcPath, $dstPath, $width, $height)
	{
	    list($originalWidth, $originalHeight, $type) = getimagesize($srcPath);

	    switch ($type) {
	        case IMAGETYPE_JPEG:
	            copy($srcPath, $dstPath);
	            $source = imagecreatefromjpeg($srcPath);
	            $canvas = imagecreatetruecolor($width, $height);
	            break;
	        case IMAGETYPE_PNG:
	            $source = imagecreatefrompng($srcPath);
	            $canvas = imagecreatetruecolor($width, $height);
	            imagefill($canvas, 0, 0, 0xFFFFFF);
	            break;
	        case IMAGETYPE_GIF:
	            $source = imagecreatefromgif($srcPath);
	            $canvas = imagecreatetruecolor($width, $height);
	            imagefill($canvas, 0, 0, 0xFFFFFF);
	            break;
	        default:
	            throw new RuntimeException("サポートしていない画像形式です: $type");
		}
	    imagecopyresampled($canvas, $source, 0, 0, 0, 0, $width, $height, $originalWidth, $originalHeight);
	    imagejpeg($canvas, $dstPath);
	    imagedestroy($source);
	    imagedestroy($canvas);
	}

	/**
	 * 画像URL作成
	 * 例 (shop_idは基本ない想定)
	 * 元画像
	 * http:img.gmorepeater.jp/assets/img/picture/1_1/150/150.png
	 * サムネイル
	 * http:img.gmorepeater.jp/assets/img/picture/1_1/150/thumb_150.png
	 * @param $picture
	 */
	public static function makePictureUrl($picture)
	{
		$server_config = Config::get('repeater.server_apps');
		$scheme = self::getUrlScheme();
		$picture_url = $scheme."://".$server_config['img_server']['host'].$server_config['img_server']['display_dir'];
		$picture_url .= self::makePicturePath($picture, $picture['id']);

		//拡張子取り出し
		//ガラケーからのアクセスの場合必ずjpegを返す
		$extension = explode('/', $picture['mimetype']);

		$picture_urls = array();
		//元画像
		$picture_urls['url'] = $picture_url.$picture['id'].'.'.$extension[1];
		//サムネイル画像用
		$picture_urls['thumb_url'] = $picture_url.$picture['id'].'_thumb.'.$extension[1];
		//ガラケー画像用
		$picture_urls['mb'] = $picture_url.$picture['id'].'_mb.jpeg';

		return $picture_urls;
	}

	/**
	 * 画像URL取得
	 * 例 (shop_idは基本ない想定)
	 * 元画像
	 * http:img.gmorepeater.jp/assets/img/picture/1_1/150/150.png
	 * @param $picture_id
	 * @return 画像url
	 */
	public static function getPictureUrl($picture_id)
	{
		//画像情報取得
		$picture = self::findById($picture_id);
		// FIXME : no image 用のファイルパスを返すようにしたい（Sato）
		if (!$picture) return "";

		//画像URL作成
		$picture_urls = array();
		$picture_urls = self::makePictureUrl($picture);

		return $picture_urls['url'];
	}

	/**
	 * ガラケー用画像URL取得
	 * 例 (shop_idは基本ない想定)
	 * jpeg画像
	 * http:img.gmorepeater.jp/assets/img/picture/1_1/150/150.jpeg
	 * @param $picture_id
	 * @return 画像url
	 */
	public static function getMbPictureUrl($picture_id)
	{
		//画像情報取得
		$picture = self::findById($picture_id);
		// FIXME : no image 用のファイルパスを返すようにしたい（Sato）
		if (!$picture) return "";

		//画像URL作成
		$picture_urls = array();
		$picture_urls = self::makePictureUrl($picture);

		return $picture_urls['mb'];
	}

	/**
	 * アクセススキーム判定
	 * httpかhttpsを返す
	 * @param
	 * @return $scheme
	 */
	public static function getUrlScheme()
	{
		$img_server = \Fuel\Core\Config::get('repeater.server_apps.img_server');
		if(!strstr(Input::protocol(), $img_server['scheme_https'])) {
			$scheme = $img_server['scheme_http'];
		} else {
			$scheme = $img_server['scheme_https'];
		}
		return $scheme;
	}
}
