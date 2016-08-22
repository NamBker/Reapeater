<?php

class Model_Csv_import extends \Model_Standard_Model
{
    protected static $_primary_key = array('id');
    protected static $_properties = array(
        'id' => array(
            'label' => 'CSVインポートID',
            'expose_pattern' => 1,
        ),
        'company_id' => array(
            'label' => '企業ID',
            'expose_pattern' => 1,
        ),
        'brand_id' => array(
            'label' => 'ブランドID',
            'expose_pattern' => 1,
        ),
        'section_id' => array(
            'label' => '事業部ID',
            'expose_pattern' => 1,
        ),
        'store_id' => array(
            'label' => '店舗ID',
            'expose_pattern' => 1,
        ),
        'status' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'default' => 0,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    3,
                ),
            ),
            'label' => '状態',
            'expose_pattern' => 1,
        ),
        'duplicate_process_type' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    1,
                    2,
                ),
            ),
            'label' => '重複時処理',
            'expose_pattern' => 2,
        ),
        'target_table' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    1,
                    2,
                ),
            ),
            'label' => '対象TBL',
            'expose_pattern' => 2,
        ),
        'file_path' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    64,
                ),
            ),
            'label' => 'ファイルパス',
            'expose_pattern' => 2,
        ),
        'upload_filename' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    64,
                ),
            ),
            'label' => 'アップロードファイル名',
            'expose_pattern' => 2,
        ),
        'mail_address' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    32,
                ),
            ),
            'label' => '実行ユーザのメールアドレス',
            'expose_pattern' => 2,
        ),
        'overlap_count' => array(
            'data_type' => 'int',
            'null' => false,
            'default' => 0,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    4294967295,
                ),
            ),
            'label' => '重複数',
            'expose_pattern' => 3,
        ),
        'created_at' => array(
            'data_type' => 'datetime',
            'expose_type' => 'null',
        ),
        'updated_at' => array(
            'data_type' => 'datetime',
            'expose_type' => 'null',
        ),
    );


    protected static $_to_array_exclude = array(
        'created_at', 'updated_at',
    );

    /**
     * キー情報からレコードを取得
     * @param $id
     * @return \Orm\Model|\Orm\Model[]
     */
    public static function findById($id)
    {
        return static::find('first', array(
            'where' => array(
                'id' => $id
            )
        ));
    }

    /**
     * CSVインポート状況更新
     * @param $csv_import
     * @param $status
     * @throws ProtocolException
     */
    public static function updateCsvImportStatus($csv_import, $status){
        if(!empty($csv_import)){
            $csv_import->status = $status;
            $csv_import->save();
        }else{
            throw new \ProtocolException(\Lang::get('csv_information_not_exist'), "Csv import record is not exist.", \ProtocolException::RESULT_CODE_CSV_IMPORT_ERROR);
        }
    }
}
