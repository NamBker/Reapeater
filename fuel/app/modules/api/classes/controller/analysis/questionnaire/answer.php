<?php
namespace Api;

/**
 * Class Answer
 * @package Api
 */
class Controller_Analysis_Questionnaire_Answer extends \Controller_Api
{
    protected static $required_parameters = array(
        'index' => array(

        ),
    );

    protected function index()
    {
        \Additional_Log::debug('questionnaire/answer called');

        $questionnaire = \Model_Questionnaire::find($this->params['questionnaire_id'], array(), \ProtocolException::RESULT_CODE_QUESTIONNAIRES_NOT_FOUND);
        $res = $questionnaire->toArray(2);
        $res['question'] = array();
        foreach ($questionnaire->questionnaire_responds as $response) {
            $question = $response->question->toArray(2);
            if (!empty($question['question_nos'])) {
                $question['question_nos'] = explode(',', $question['question_nos']);
            }
            $question['daily_question'] = array();
            foreach ($response->questionnaire_analysis as $daily_question) {
                $daily_question_arr = $daily_question->toArray(2);
                if (in_array($question['question_type'], array(QUESTION_TYPE_RADIO, QUESTION_TYPE_SELECT_ONE, QUESTION_TYPE_SELECT_MANY)) && isset($question['question_nos'][(int)$daily_question->question_response])) {
                    $daily_question_arr['question_response'] = $question['question_nos'][(int)$daily_question->question_response];
                }
                $question['daily_question'][] = $daily_question_arr;
            }
            $res['question'][] = $question;
        }
        $this->response_fields['questionnaire_answer_analysis'] = $res;
    }
}