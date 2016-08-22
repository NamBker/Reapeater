<?php

class Model_Question extends \Model_Standard_Model
{
    protected static $_primary_key = array('id');
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
        'questionnaire_type' => array(
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
            'label' => '種別タイプ',
            'expose_pattern' => 2,
        ),
        'question_type' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'validation' => array(
                'required',
                'is_numeric',
                'numeric_between' => array(
                    1,
                    7,
                ),
            ),
            'label' => '回答タイプ',
            'expose_pattern' => 2,
        ),
        'question_title' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    32,
                ),
            ),
            'label' => '項目名',
            'expose_pattern' => 2,
        ),
        'question_body' => array(
            'data_type' => 'varchar',
            'null' => false,
            'validation' => array(
                'required',
                'max_length' => array(
                    32,
                ),
            ),
            'label' => '質問本文',
            'expose_pattern' => 2,
        ),
        'question_char_limit' => array(
            'data_type' => 'smallint',
            'null' => true,
            'validation' => array(
                'is_numeric'
            ),
            'label' => '文字数制限',
            'expose_pattern' => 2,
        ),
        'question_nos' => array(
            'data_type' => 'varchar',
            'null' => true,
            'validation' => array(
                'max_length' => array(
                    256,
                ),
            ),
            'label' => '回答NOs',
            'expose_pattern' => 2,
        ),
        'question_used_flg' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'default' => 1,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    1,
                    2,
                ),
            ),
            'label' => '公開フラグ',
            'expose_pattern' => 3,
        ),
        'question_deleted_flg' => array(
            'data_type' => 'tinyint',
            'null' => false,
            'default' => 0,
            'validation' => array(
                'is_numeric',
                'numeric_between' => array(
                    0,
                    1,
                ),
            ),
            'label' => '削除フラグ',
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
     * 質問登録処理
     * @param $param
     */
    public static function insertQuestion($param)
    {
        $question = static::forge(array(
            'company_id' => $param['company_id']
            ,'brand_id' => $param['brand_id']
            ,'section_id' => $param['section_id']
            ,'store_id' => $param['store_id']
            ,'questionnaire_type' => $param['questionnaire_type']
            ,'question_type' => $param['question_type']
            ,'question_title' => ' '
            ,'question_body' => $param['question_body']
            ,'question_char_limit' => $param['question_char_limit']
            ,'question_nos' => implode(',', $param['question_nos'])
            ,'question_deleted_flg' => 0
        ));
        $question->save();

        \Additional_Log::debug('【QUESTION CREATE API】:'.$question->id);
    }

    /**
     * 質問更新処理
     * 　=>論理削除のみ
     * @param $param
     * @throws ProtocolException
     */
    public static function updateQuestion($param, $user)
    {
        $question = self::findByUserAndId($user, $param['id']);
        if(!empty($question)){
            $question->question_deleted_flg = $param['question_deleted_flg'];
            $question->questionnaire_type = $param['questionnaire_type'];
            $question->question_type = $param['question_type'];
            $question->question_body = $param['question_body'];
            $question->question_char_limit = $param['question_char_limit'];
            $question->question_nos = implode(',', $param['question_nos']);
            $question->save();
        }else{
            throw new \ProtocolException(\Lang::get('question_is_not_registration'), "Question is not exist.", \ProtocolException::RESULT_CODE_QUESTION_NOT_FOUND);
        }
    }

    /**
     * 公開フラグ更新
     * @param $id
     * @param $question_used_flg
     * @throws Exception
     * @throws ProtocolException
     */
    public static function updateUsedFlg($id, $question_used_flg)
    {
        $question = self::findById($id);
        if(!empty($question)){
            $question->question_used_flg = $question_used_flg;
            $question->save();
        }else{
            throw new \ProtocolException(\Lang::get('question_is_not_registration'), "Question is not exist.", \ProtocolException::RESULT_CODE_QUESTION_NOT_FOUND);
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
        if(!empty($params['section_id'])){
            $conditions[] = array('section_id', $params['section_id']);
        }
        if(!empty($params['store_id'])){
            $conditions[] = array('store_id', $params['store_id']);
        }
        if(!empty($params['questionnaire_type'])){
            $conditions[] = array('questionnaire_type', $params['questionnaire_type']);
        }
        if(!empty($params['question_type'])){
            $conditions[] = array('question_type', $params['question_type']);
        }
        if(!empty($params['question_title'])){
            $tmp = $params['question_title'];
            $conditions[] = array('question_title', 'like', "%$tmp%");
        }
        if(!empty($params['question_body'])){
            $tmp = $params['question_body'];
            $conditions[] = array('question_body', 'like', "%$tmp%");
        }
        if(!empty($params['question_char_limit'])){
            $conditions[] = array('question_char_limit', $params['question_char_limit']);
        }
        if(!empty($params['question_nos'])){
            $tmp = $params['question_nos'];
            $conditions[] = array('question_nos', 'like', "%$tmp%");
        }

        return $conditions;
    }

}
