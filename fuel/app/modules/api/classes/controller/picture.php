<?php

namespace Api;
class Controller_Picture extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'picture_file_name' => false,
            'mimetype' => false,
            'page' => false,
            'per_page' => false,
            'pattern' => true,
        ),
        'create' => array(
            'duplicate_process_type' => false,
        ),
        'update' => array(
            'id' => true,
            'picture_file_name' => true,
        ),
        'delete' => array(
            'picture_ids' => true,
        ),
    );

    /**
     * 画像検索
     */
    protected function index()
    {
        \Additional_Log::debug('【PICTURE LIST API】:START');

        // 引数取得
        $user = \Model_User::find($this->user_id);
        $pattern = $this->params['pattern'];

        // 画像情報取得
        $conditions = $this->makeConditionForUser($user);
        $conditions[] = array('picture_file_name', 'LIKE', "%{$this->params['picture_file_name']}%");

        // TODO ソート条件をQuery paramから設定
        $order_condition = array('id' => 'desc');

        $find_params = array(
            'where' => $conditions,
            'order_by' => $order_condition,
        );

        if ($this->is_setted_param('page') && $this->is_setted_param('per_page')) {
            $find_params['offset'] = ($this->params['page'] - 1) * $this->params['per_page'];
            $find_params['limit'] = $this->params['per_page'];
        }

        $pictures = \Model_Picture::find('all', $find_params);
        //get count
        $count = \Model_Picture::count(array('where' => $conditions));

        // 検索結果設定
        $rec = array();
        $picture_arr = array();

        foreach ($pictures as $picture) {
            $rec = $picture->toArray($pattern);
            unset($rec['company']);
            unset($rec['brand']);
            unset($rec['store']);

            if (PATTERN_ONLY_KEY < $pattern) {
                $rec['company_name'] = array_key_exists('company', $picture) ? $picture->company->company_name : null;
                $rec['brand_name'] = array_key_exists('brand', $picture) ? $picture->brand->brand_name : null;
                $rec['store_name'] = array_key_exists('store', $picture) ? $picture->store->store_name : null;

                //画像URL作成
                $picture_urls = \Model_Picture::makePictureUrl($picture);
                $rec['picture_url'] = $picture_urls['url'];
                $rec['picture_thumb_url'] = $picture_urls['thumb_url'];
            }
            $picture_arr[] = $rec;
        }

        $this->response_fields['pictures'] = $picture_arr;
        $this->response_fields['count'] = $count;

        \Additional_Log::debug('【PICTURE LIST API】:END');
    }

    /**
     * 画像登録
     */
    protected function create()
    {
        \Additional_Log::debug('【PICTURE UPLOAD API】:START');

        // 引数取得
        $user = \Model_User::find($this->user_id);
        $params = $this->setParams($user);

        // 操作権限チェック
        $user->authority($user);
        \Additional_Log::debug('【PICTURE UPLOAD API】:PARAM - company_id:'.$user->company_id."/ brand_id:".$user->brand_id."/ store_id:".$user->store_id);

        // Start Transaction
        // 画像ID取得
        // 保存先組み合わせ ObjectStorage/[company_id]_[brand_id]_[store_id]_画像ID_sp/画像ID.png
        // 保存先例 1_1_1_51_sp
        // sp:SmartPhone

        $db = \Fuel\Core\Database_Connection::instance();
        $db->start_transaction();

        $config = array(
            'ext_whitelist' => array('png','jpg','jpeg','gif'),
        );

        try {
            \Upload::process($config);
            if (\Upload::is_valid()) {
                $files = \Upload::get_files();
                if (count($files) < 1) {
                    // 保存失敗エラー作成
                    \Additional_Log::error('Could not save picture file');
                    $db->rollback_transaction();
                    throw new \ProtocolException(\Lang::get('picture_picture_fail_to_save'), '', \ProtocolException::RESULT_CODE_PICTURE_FAIL_TO_SAVE_PICTURE_FILE);
                } else {
                    // 幅長さサイズ取得
                    list($width, $height) = \Model_Picture::getPictureSize($files[0]);

                    // 画像レココード作成処理
                    $picture = \Model_Picture::makePictureRecord($files[0], $width, $height, $user);

                    // 画像登録処理
                    $picture_id = \Model_Picture::insertPicture($picture);

                    // 保存ファイルフルパス作成
                    $save_path = \Model_Picture::makePicturePath($picture, $picture_id);

                    // 保存ファイル名作成 保存ファイル拡張子は mimetype に合わせる(jpg は jpeg になる)
                    $extension = explode('/', $picture['mimetype']);
                    $save_file = $picture_id.'.'.$extension[1];
                    \Additional_Log::debug('【PICTURE UPLOAD API】: PATH : '. $save_path.$save_file);

                    // オブジェクトストレージ保存
                    \Model_Picture::uploadObjectStorage($files[0]['file'], $save_path, $save_file);

                    // サムネイル画像作成
                    $thumb_file = $files[0]['file'].'_thumb';
                    \Model_Picture::make_thumbnail($files[0]['file'], $thumb_file, 150, 150, $width, $height);

                    // サムネイル保存ファイル名作成
                    $save_file = $picture_id.'_thumb.'.$extension[1];

                    // サムネイル画像 オブジェクトストレージ保存
                    \Model_Picture::uploadObjectStorage($thumb_file, $save_path, $save_file);

                    // ガラケー用jpeg画像 作成 無条件にjpegにする
                    $mbjpeg_file = $files[0]['file'].'_mgjpeg';
                    \Model_Picture::make_mbjpeg($files[0]['file'], $mbjpeg_file, 480, 800, $width, $height);

                    // ガラケー用jpeg画像 保存ファイル名作成
                    $save_file = $picture_id.'_mb.jpeg';

                    // ガラケー用jpeg画像 オブジェクトストレージ保存
                    \Model_Picture::uploadObjectStorage($mbjpeg_file, $save_path, $save_file);

                    $db->commit_transaction();
                    \Additional_Log::debug('【PICTURE PICTURE UPLOAD API】:SUCCESS');

                }
            } else {
                $db->rollback_transaction();
                \Additional_Log::debug('ファイル保存に失敗しました。');
            }
        } catch (Exception $ex) {
            $db->rollback_transaction();
                    \Additional_Log::error('Could not save picture file');
        }
        // End Transaction
        \Additional_Log::debug('【PICTURE PICTURE UPLOAD API】:END');
    }


    /**
     * 画像更新
     */
    protected function update()
    {
        \Additional_Log::info('【PICTURE UPDATE API】:START');
        // 引数取得
        $user = \Model_User::find($this->user_id);
        $conditions = $this->makeConditionForUser($user);
        $conditions[] = array('id', $this->params['id']);
        $target = \Model_Picture::find('first', array(
            'where' => $conditions,
        ));
        if ($target) {
            $target->picture_file_name = $this->params['picture_file_name'];
            $target->save();
        }
        \Additional_Log::debug('【PICTURE UPDATE API】:END');
    }

    protected function delete()
    {
        \Additional_Log::debug('【PICTURE DELETE API】:START');

        // 引数取得
        $user = \Model_User::find($this->user_id);
        $params = $this->setParams($user);

        $conditions = $this->makeConditionForUser($user);
        $conditions[] = array('id', 'IN', $this->params['picture_ids']);

        $targets = \Model_Picture::find('all', array(
            'where' => $conditions,
        ));

        $ids = array();

        foreach($targets as $picture) {
            // ファイルフルパス作成
            $picture_path = \Model_Picture::makePicturePath($picture, $picture->id);

            // ファイル名作成
            $picture_extension = explode('/', $picture['mimetype']);

            //ObjectStorageのファイルを削除
            \Model_Picture::deleteObjectStorageData($picture_path, $picture->id.".".$picture_extension[1]);

            //ObjectStorageのサムネイル用ファイルを削除
            \Model_Picture::deleteObjectStorageData($picture_path, $picture->id."_thumb.".$picture_extension[1]);

            //ObjectStorageのガラケー用ファイルを削除
            \Model_Picture::deleteObjectStorageData($picture_path, $picture->id."_mb.jpeg");

            //imgサーバのデータ削除
            \Model_Picture::deleteImgServerData($picture_path, $picture->id.".".$picture_extension[1]);

            $ids[] = $picture->id;
            $picture->delete();
        }
        $this->response_fields['pictures'] = $ids;

        \Additional_Log::debug('【PICTURE DELETE API】:END');
    }

    private function makeConditionForUser($user)
    {
        $conditions = array();
        switch($user->authority) {
            case USER_AUTHORITY_STORE:
                $conditions[] = array('store_id', 'IN', $user->store_id);
            case USER_AUTHORITY_SECTION:
                $conditions[] = array('section_id', $user->section_id);
            case USER_AUTHORITY_BRAND:
                $conditions[] = array('brand_id', $user->brand_id);
            case USER_AUTHORITY_COMPANY:
                $conditions[] = array('company_id', $user->company_id);
                break;
        }
        return $conditions;
    }

    /**
     * パラメータ登録
     * @return array
     */
    private function setParams($user){
        \Additional_Log::debug('【PICTURE API】:SET PARAM');

        // 画像情報設定
        $picture = array();

        if(empty($this->params['company_id'])){
            // 初期処理
            $picture['company_id'] = $user->company_id;
            $picture['brand_id'] = $user->brand_id;
            $picture['section_id'] = $user->section_id;
            $picture['store_id'] = $user->store_id;
        }else{
            // 後続処理
            $picture['company_id'] = isset($this->params['company_id']) ? $this->params['company_id'] : "";
            $picture['brand_id'] = isset($this->params['brand_id']) ? $this->params['brand_id'] : "";
            $picture['section_id'] = $this->is_setted_param('section_id') ? $this->prams['section_id'] : "";
            $picture['store_id'] = isset($this->params['store_id']) ? $this->params['store_id'] : "";
        }

        $picture['id'] = isset($this->params['id']) ? $this->params['id'] : "";
        $picture['picture_path'] = isset($this->params['picture_path']) ? $this->params['picture_path'] : "";
        $picture['picture_file_name'] = isset($this->params['picture_file_name']) ? $this->params['picture_file_name'] : "";
        $picture['file_size'] = isset($this->params['file_size']) ? $this->params['file_size'] : 0;
        $picture['vertically_horizontally'] = isset($this->params['vertically_horizontally']) ? $this->params['vertically_horizontally'] : "";
        $picture['mimetype'] = isset($this->params['mimetype']) ? $this->params['mimetype'] : "";
        $picture['picture_ids'] = isset($this->params['picture_ids']) ? $this->params['picture_ids'] : "";

        return $picture;
    }

    /**
     * エラーハンドラー
     * noticeをハンドリングするため
     */
    private function errorHandler($errno, $errstr, $errfile, $errline){
        throw new \ErrorException ("サポートしていない画像形式です。", 0, $errno, $errfile, $errline);
    }
}
