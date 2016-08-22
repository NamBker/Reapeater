import { RECEIVE_QUESTIONNAIRE_ANALYSIS, RECEIVE_QUESTIONNAIRE_ANSWER_ANALYSIS } from '../constants/ActionTypes';
import Rpapi from './rpapi';

export const fetchQuestionnaireAnalysis = (filterParams, pattern = 3) => {
    let params = {...filterParams, pattern};
    return dispatch => {
        new Rpapi('get', '/questionnaire/analysis')
            .query(params)
            .end(function (err, res) {
                console.log('dailyquestionnaire api called.');
                if (err || res.error_code) {
                    alert(Globalize.localize('questionnaire_analysis_cant_get', Globalize.culture()));
                    console.log(err);
                } else {
                    dispatch(receiveQuestionnaireAnalysis(res.daily_questionnaire));
                }
            });
    }
};

const receiveQuestionnaireAnalysis = (dailyQuestionnaire) => {
    return {
        type: RECEIVE_QUESTIONNAIRE_ANALYSIS,
        dailyQuestionnaire,
    };
};

export const clearQuestionnaireAnalysis = () => {
    return receiveQuestionnaireAnalysis([]);
};

export const fetchQuestionAnalysis = (questionnaireId) => {
    return dispatch => {
        new Rpapi('get', `/questionnaire/${questionnaireId}/answer/analysis`)
            .end((err, res) => {
                console.log('dailyquestionnaire api called.');
                if (err || res.error_code) {
                    alert(Globalize.localize('questionnaire_analysis_cant_get', Globalize.culture()));
                    console.log(err);
                } else {
                    dispatch(receiveQuestionAnalysis(res.questionnaire_answer_analysis));
                }
            })
    }
};

const receiveQuestionAnalysis = (dailyQuestion) => {
    return {
        type: RECEIVE_QUESTIONNAIRE_ANSWER_ANALYSIS,
        dailyQuestion,
    };
};