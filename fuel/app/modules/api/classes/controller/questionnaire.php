<?php

namespace Api;
class Controller_Questionnaire extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(
            'questionnaire_release_flg' => false,
            'questionnaire_limit_from' => false,
            'questionnaire_limit_to' => false,
            'questionnaire_name' => false,
            'page' => false,
            'per_page' => false,
            'pattern' => true,
        ),
        'create' => array(
            'questionnaire_name' => true,
            'questionnaire_limit' => true,
            'questionnaire_type' => false,
            'questionnaire_responds' => false,
            'questionnaire_text' => false,
            'questionnaire_agreement' => false,
            'questionnaire_thank_text' => false
        ),
        'update' => array(
            'id' => true,
        ),
        'delete' => array(
            'questionnaire_ids' => true
        )
    );

    /**
     * アンケート一覧
     */
    protected function index()
    {
        \Additional_Log::debug('【QUESTIONNAIRE LIST API】:START');

        // 引数取得
        $user = \Model_User::find($this->user_id);

        // 質問情報取得
        $conditions = $this->makeConditionForUser($user);
        if ($this->is_setted_param('questionnaire_name')) {
            $conditions[] = array('questionnaire_name', 'LIKE', "%{$this->params['questionnaire_name']}%");
        }
        if ($this->is_setted_param('questionnaire_limit_from')) {
            $conditions[] = array('questionnaire_limit', '>=', $this->params['questionnaire_limit_from'] . " 00:00:00");
        }
        if ($this->is_setted_param('questionnaire_limit_to')) {
            $conditions[] = array('questionnaire_limit', '<=', $this->params['questionnaire_limit_to'] . " 23:59:59");
        }
        if ($this->is_setted_param('questionnaire_release_flg')) {
            $conditions[] = array('questionnaire_release_flg', $this->params['questionnaire_release_flg']);
        }
        $find_params = array();
        if (0 < count($conditions)) {
            $find_params['where'] = $conditions;
        }
        if (isset($this->params['page']) && isset($this->params['per_page']) && $this->params['page'] && $this->params['per_page']) {
            $find_params['offset'] = ($this->params['page'] - 1) * $this->params['per_page'];
            $find_params['limit'] = $this->params['per_page'];
        }
        // そーと条件を設定 TODO
        if (true) {
            $find_params['order_by'] = array('questionnaire_limit' => 'desc');
        }
        $questionnaires = \Model_Questionnaire::find('all', $find_params);
        $count = \Model_Questionnaire::count(array('where' => $conditions));
        // 検索結果設定
        $response = array();
        foreach ($questionnaires as $questionnaire) {
            $rec = array();
            // アンケート情報設定
            $rec = $questionnaire->toArray($this->params['pattern']);
            // アンケート質問情報設定
            foreach($questionnaire->questionnaire_responds as $respond){
                $rec["questionnaire_responds"][] = $respond->toArray($this->params['pattern']);
            }
            $response[] = $rec;
        }
        $this->response_fields['questionnaire'] = $response;
        $this->response_fields['count'] = $count;

        \Additional_Log::debug('【QUESTIONNAIRE LIST API】:END');
    }

    /**
     * アンケート作成
     */
    protected function create()
    {
        \Additional_Log::debug('【QUESTIONNAIRE CREATE API】:START');

        $params = $this->setParams();
        $user = \Model_User::find($this->user_id);

        $questionnaire = \Model_Questionnaire::forge();

        $questionnaire->company_id = 0;
        $questionnaire->brand_id = 0;
        $questionnaire->section_id = 0;
        $questionnaire->store_id = 0;
        switch ($user->authority) {
        case USER_AUTHORITY_STORE:
            $questionnaire->store_id = $user->store_id;
        case USER_AUTHORITY_SECTION:
            $questionnaire->section_id = $user->section_id;
        case USER_AUTHORITY_BRAND:
            $questionnaire->brand_id = $user->brand_id;
        case USER_AUTHORITY_COMPANY:
            $questionnaire->company = $user->company;
        }
        $questionnaire->questionnaire_code = uniqid();
        $questionnaire->questionnaire_release_flg = 0;
        $questionnaire->questionnaire_type = QUESTIONNAIRES_TYPE_OTHER;
        $questionnaire->questionnaire_category_id = 0;
        $questionnaire->questionnaire_name = $params['questionnaire_name'];
        $questionnaire->questionnaire_limit = $params['questionnaire_limit'];
        $questionnaire->questionnaire_text = $params['questionnaire_text'];
        $questionnaire->questionnaire_agreement = $params['questionnaire_agreement'];
        $questionnaire->questionnaire_thank_text = $params['questionnaire_thank_text'];
        $questionnaire->questionnaire_deleted_flg = 0;
        // アンケート質問情報登録処理
        foreach($params['responds'] as $respond){
            $question = \Model_Question::findByUserAndId($user, $respond['question_id']);
            if (empty($question)) {
                throw new \ProtocolException(\Lang::get('authority_error'), "You don't have permission to access.", \ProtocolException::RESULT_CODE_EXECUTE_AUTHORITY);
            }
            $questionnaire_respond = \Model_Questionnaire_Respond::forge();
            $questionnaire_respond->question = $question;
            $questionnaire_respond->questionnaire_required = $respond['questionnaire_required'];
            $questionnaire_respond->questionnaire_order = $respond['questionnaire_order'];
            $questionnaire_respond->question_status = $respond['question_status'];
            $questionnaire_respond->update_flg = $respond['update_flg'];
            $questionnaire->questionnaire_responds[] = $questionnaire_respond;
        }
        $questionnaire->save();
        \Additional_Log::debug('【QUESTIONNAIRE CREATE API】:END');
    }

    /**
     * アンケート更新
     */
    protected function update()
    {
        \Additional_Log::debug('【QUESTIONNAIRE UPDATE API】:START');
        $params = $this->setParams();
        $user = \Model_User::find($this->user_id);

        $questionnaire = \Model_Questionnaire::findByUserAndId($user, $this->params['id']);
        if (empty($questionnaire)) {
            throw new \ProtocolException(\Lang::get('authority_error'), "You don't have permission to access.", \ProtocolException::RESULT_CODE_EXECUTE_AUTHORITY);
        }
        $questionnaire->questionnaire_release_flg = $params['questionnaire_release_flg'];
        $questionnaire->questionnaire_name = $params['questionnaire_name'];
        $questionnaire->questionnaire_limit = $params['questionnaire_limit'];
        $questionnaire->questionnaire_text = $params['questionnaire_text'];
        $questionnaire->questionnaire_agreement = $params['questionnaire_agreement'];
        $questionnaire->questionnaire_thank_text = $params['questionnaire_thank_text'];

        // アンケート質問情報更新処理
        $updated_responds = array();
        foreach($params['responds'] as $respond){
            $question = \Model_Question::findByUserAndId($user, $respond['question_id']);
            if (empty($question)) {
                throw new \ProtocolException(\Lang::get('authority_error'), "You don't have permission to access.", \ProtocolException::RESULT_CODE_EXECUTE_AUTHORITY);
            }
            $questionnaire_respond = null;
            if ($respond['id']) {
                if (isset($questionnaire->questionnaire_responds[$respond['id']])) {
                    $questionnaire_respond = $questionnaire->questionnaire_responds[$respond['id']];
                } else {
                    throw new \ProtocolException(\Lang::get('authority_error'), "You don't have permission to access.", \ProtocolException::RESULT_CODE_EXECUTE_AUTHORITY);
                }
            } else {
                $questionnaire_respond = \Model_Questionnaire_Respond::forge();
                $questionnaire_respond->question = $question;
                $questionnaire->questionnaire_responds[] = $questionnaire_respond;
            }
            $questionnaire_respond->questionnaire_required = $respond['questionnaire_required'];
            $questionnaire_respond->questionnaire_order = $respond['questionnaire_order'];
            $questionnaire_respond->question_status = $respond['question_status'];
            $questionnaire_respond->update_flg = $respond['update_flg'];
            $updated_responds[] = $questionnaire_respond;
        }
        foreach($questionnaire->questionnaire_responds as $respond) {
            if (!in_array($respond, $updated_responds)) {
                unset($questionnaire->questionnaire_responds[$respond->id]);
                $respond->delete();
            }
        }
        $questionnaire->save();
        \Additional_Log::debug('【QUESTIONNAIRE UPDATE API】:END');
    }

    /**
     * アンケート削除
     */
    protected function delete()
    {
        \Additional_Log::debug('【QUESTIONNAIRE DELETE API】:START');

        $user = \Model_User::find($this->user_id);
        // 引数取得
        $conditions = $this->makeConditionForUser($user);
        $conditions[] = array('id', 'IN', $this->params['questionnaire_ids']);
        $questionnaires = \Model_Questionnaire::find('all', array(
            'where' => $conditions,
        ));

        $this->response_fields['questionnaire'] = array();
        foreach($questionnaires as $questionnaire)
        {
            $questionnaire->questionnaire_deleted_flg = 1;
            $questionnaire->save();
            $this->response_fields['questionnaire'][] = $questionnaire->toArray();
        }

        \Additional_Log::debug('【QUESTIONNAIRE DELETE API】:END');
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
        $conditions[] = array('questionnaire_deleted_flg', 0);
        return $conditions;
    }

    /**
     * パラメータ設定
     * @return array
     */
    private function setParams(){
        \Additional_Log::debug('【QUESTIONNAIRE API】:SET PARAM');

        // アンケート情報設定
        $questionnaire = array();
        $questionnaire['id'] = isset($this->params['id']) ? $this->params['id'] : "";
        $questionnaire['questionnaire_release_flg'] = isset($this->params['questionnaire_release_flg']) ? $this->params['questionnaire_release_flg'] : "";
        $questionnaire['questionnaire_type'] = isset($this->params['questionnaire_type']) ? $this->params['questionnaire_type'] : "";
        $questionnaire['questionnaire_category_id'] = isset($this->params['questionnaire_category_id']) ? $this->params['questionnaire_category_id'] : 0;
        $questionnaire['questionnaire_name'] = isset($this->params['questionnaire_name']) ? $this->params['questionnaire_name'] : "";
        $questionnaire['questionnaire_limit'] = isset($this->params['questionnaire_limit']) ? $this->params['questionnaire_limit'] : "";
        $questionnaire['questionnaire_text'] = isset($this->params['questionnaire_text']) ? $this->params['questionnaire_text'] : "";
        $questionnaire['questionnaire_agreement'] = isset($this->params['questionnaire_agreement']) ? 1 : 0;
        $questionnaire['questionnaire_thank_text'] = isset($this->params['questionnaire_thank_text']) ? $this->params['questionnaire_thank_text'] : "";
        $questionnaire['questionnaire_deleted_flg'] = isset($this->params['questionnaire_deleted_flg']) ? $this->params['questionnaire_deleted_flg'] : 0;

        // アンケート質問情報設定
        $questionnaire['responds'] = array();
        if(!empty($this->params['questionnaire_responds'])){
            foreach($this->params['questionnaire_responds'] as $key => $respond){
                $rec = array();

                $rec['id'] = isset($respond['id']) ? $respond['id'] : 0;
                $rec['questionnaire_id'] = isset($respond['questionnaire_id']) ? $respond['questionnaire_id'] : "";
                $rec['question_id'] = isset($respond['question_id']) ? $respond['question_id'] : "";
                $rec['questionnaire_required'] = isset($respond['questionnaire_required']) && $respond['questionnaire_required']? 1 : 0;
                $rec['questionnaire_order'] = $key;
                $rec['question_status'] = isset($respond['question_status']) ? $respond['question_status'] : "";
                $rec['update_flg'] = isset($respond['update_flg']) ? $respond['update_flg'] : 0;
                $rec['del_flg'] = isset($respond['del_flg']) ? $respond['del_flg'] : 1; // 0:削除 / 1:登録・更新

                $questionnaire['responds'][] = $rec;
            }
        }
        return $questionnaire;
    }

}

