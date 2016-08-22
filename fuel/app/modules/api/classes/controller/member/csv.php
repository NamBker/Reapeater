<?php

namespace Api;
class Controller_Member_Csv extends \Controller_Api
{
    protected static $required_parameters = array(
        'create' => array(
            'duplicate_process_type' => false,
        ),
    );

    protected function create()
    {
        \Additional_Log::debug('【MEMBER CSV IMPORT API】:START');

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
                \Additional_Log::error('Could not save csv file');
                throw new \ProtocolException(\Lang::get('member_csv_fail_to_save'), '', \ProtocolException::RESULT_CODE_MEMBER_FAIL_TO_SAVE_CSV_FILE);
            } else {
                // 'ファイル保存に成功'
                $csv_import = \Model_Csv_import::forge();
                $csv_import->company_id = $user->company_id;
                $csv_import->brand_id = $user->brand_id;
                $csv_import->section_id = $user->section_id;
                $csv_import->store_id = $user->store_id;
                $csv_import->duplicate_process_type = $this->params['duplicate_process_type'] ? $this->params['duplicate_process_type'] : CSV_IMPORT_DUPLICATE_PROCESS_TYPE_OVERWRITE;
                $csv_import->target_table = CSV_IMPORT_TARGET_TABLE_MEMBERS;
                $csv_import->file_path = $files[0]['saved_as'];
                $csv_import->upload_filename = $files[0]['name'];
                $csv_import->mail_address = $user->mail_address;
                $csv_import->save();
            }
        } else {
            \Additional_Log::debug('ファイル保存に失敗しました。');
            throw new \ProtocolException(\Lang::get('member_csv_fail_to_save'), '', \ProtocolException::RESULT_CODE_MEMBER_FAIL_TO_SAVE_CSV_FILE);
        }

        \Additional_Log::debug('【MEMBER CSV IMPORT API】:END');
    }
}
