<?php

namespace Api;
class Controller_Question extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'pattern' => true,
        ),
        'create' => array(
            'questionnaire_type' => true,
            'question_type' => true,
            'question_title' => false,
            'question_body' => true,
            'question_char_limit' => false,
            'question_nos' => false,
        ),
        'update' => array(
            'id' => true,
            'question_deleted_flg' => false,
        ),
        'delete' => array(
            'question_ids' => true,
        )
    );

    /**
     * 質問一覧
     */
    protected function index()
    {
        \Additional_Log::debug('【QUESTION LIST API】:START');

        // 引数取得
        $user = \Model_User::find($this->user_id);

        // 質問情報取得
        $conditions = $this->makeConditionForUser($user);
        $results = \Model_Question::find('all', array(
            'where' => $conditions,
        ));

        // 検索結果設定
        $rec = array();
        foreach ($results as $question) {
            $rec[] = $question->toArray($this->params['pattern']);
        }
        $this->response_fields['question'] = $rec;

        \Additional_Log::debug('【QUESTION LIST API】:END');
    }

    /**
     * 質問作成
     */
    protected function create()
    {
        \Additional_Log::debug('【QUESTION CREATE API】:START');

        $user = \Model_User::find($this->user_id);

        $question = \Model_Question::forge();
        $question->company_id = 0;
        $question->brand_id = 0;
        $question->section_id = 0;
        $question->store_id = 0;
        switch ($user->authority) {
        case USER_AUTHORITY_STORE:
            $question['store_id'] = $user->store_id;
        case USER_AUTHORITY_SECTION:
            $question['section_id'] = $user->section_id;
        case USER_AUTHORITY_BRAND:
            $question['brand_id'] = $user->brand_id;
        case USER_AUTHORITY_COMPANY:
            $question['company_id'] = $user->company_id;
        }
        $question->questionnaire_type = QUESTIONNAIRES_TYPE_OTHER;
        $question->question_title = " ";
        $question->question_type = $this->params['question_type'];
        $question->question_type = $this->params['question_type'];
        $question->question_body = $this->params['question_body'];
        $question->question_char_limit = $this->params['question_char_limit'] ? $this->params['question_char_limit'] : 0;
        $question->question_nos = $this->params['question_nos'];
        $question->question_used_flg = 1;
        $question->question_deleted_flg = 0;
        \Additional_Log::debug(print_r($question, true));
        $question->save();

        \Additional_Log::debug('【QUESTION CREATE API】:END');
    }

    /**
     * 質問更新
     * 　=>論理削除のみ
     */
    protected function update()
    {
        \Additional_Log::debug('【QUESTION UPDATE API】:START');

        $user = \Model_User::find($this->user_id);
        $conditions = $this->makeConditionForUser($user);
        $conditions[] = array('id', $this->params['id']);
        $conditions[] = array('question_used_flg', '!=', 2);

        $question = \Model_Question::find('first', array(
            'where' => $conditions,
        ));

        if ($question) {
            $question->question_type = $this->params['question_type'];
            $question->question_body = $this->params['question_body'];
            $question->question_char_limit = $this->params['question_char_limit'];
            $question->question_nos = $this->params['question_nos'];
            $question->save();
        }

        \Additional_Log::debug('【QUESTION UPDATE API】:END');
    }

    protected function delete()
    {
        \Additional_Log::debug('【QUESTION DELETE API】:START');

        $user = \Model_User::find($this->user_id);
        $conditions = $this->makeConditionForUser($user);
        $conditions[] = array('id', 'IN', $this->params['question_ids']);
        $conditions[] = array('question_used_flg', '!=', 2);

        $targets = \Model_Question::find('all', array(
            'where' => $conditions,
        ));

        foreach($targets as $target) {
            $target->question_deleted_flg = 1;
            $target->save();
        }

        \Additional_Log::debug('【QUESTION DELETE API】:END');
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
        $conditions[] = array('question_deleted_flg', 0);
        return $conditions;
    }
}

