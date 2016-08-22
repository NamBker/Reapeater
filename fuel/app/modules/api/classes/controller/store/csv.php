<?php

namespace Api;
class Controller_Store_Csv extends \Controller_Api
{
    protected static $required_parameters = array(
        'create' => array(
            'duplicate_process_type' => false,
        ),
    );

    protected function create()
    {
        \Additional_Log::debug('【STORE CSV IMPORT API】:START');

        // 自ユーザ情報取得
        $token = \Input::get('token');
        $user = \Model_User::findByToken($token);

        $save_path = APPPATH.'../../tmp';
        if ($user->company_id) {
            $save_path .= '/'.$user->company_id;
        }
        if ($user->brand_id) {
            $save_path .= '/'.$user->brand_id;
        }
        if ($user->store_id) {
            $save_path .= '/'.$user->store_id;
        }
        $config = array(
            'path' => $save_path,
            'randomize' => true,
            'ext_whitelist' => array('csv'),
        );
        \Upload::process($config);
        if (\Upload::is_valid()) {
            \Upload::save();
            $files = \Upload::get_files();
            if (count($files) < 1) {
                // 保存失敗エラー作成
                \Additional_Log::error('Could not save csv file'.var_dump(\Upload::get_errors()));
                throw new \ProtocolException(\Lang::get('store_csv_fail_to_save'), '', \ProtocolException::RESULT_CODE_STORE_FAIL_TO_SAVE_CSV_FILE);
            } else {
                // 'ファイル保存に成功'
                $csv_import = \Model_Csv_import::forge();
                $csv_import->company_id = $user->company_id;
                $csv_import->brand_id = $user->brand_id;
                $csv_import->section_id = $user->section_id;
                $csv_import->store_id = $user->store_id;
                $csv_import->duplicate_process_type = $this->params['duplicate_process_type'] ? $this->params['duplicate_process_type'] : CSV_IMPORT_DUPLICATE_PROCESS_TYPE_OVERWRITE;
                $csv_import->target_table = CSV_IMPORT_TARGET_TABLE_STORES;
                $csv_import->file_path = $files[0]['saved_as'];
                $csv_import->upload_filename = $files[0]['name'];
                $csv_import->mail_address = $user->mail_address;
                $csv_import->save();
            }
        } else {
            \Additional_Log::debug('ファイル保存に失敗しました。');
            throw new \ProtocolException(\Lang::get('store_csv_fail_to_save'), '', \ProtocolException::RESULT_CODE_STORE_FAIL_TO_SAVE_CSV_FILE);
        }

        \Additional_Log::debug('【STORE CSV IMPORT API】:END');
    }
}
