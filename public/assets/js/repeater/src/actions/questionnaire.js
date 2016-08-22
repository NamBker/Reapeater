import * as request from 'superagent';
import { RECEIVE_QUESTIONNAIRE, RECEIVE_QUESTIONNAIRE_INFO } from '../constants/ActionTypes';
import * as Const from '../constants/Constants';
import Rpapi from './rpapi';

var default_filters = {};
default_filters.pattern = Const.GET_DISPLAY_ITEMS_ONLY_PATTERN;

export const fetchQuestionnaires = (filterParams = default_filters) => {
    return dispatch => {
        new Rpapi('get', '/questionnaires')
            .query(filterParams)
            .end(function (err, res) {
                console.log('questionnaires api called.');
                if (err || res.error_code) {
                    alert(Globalize.localize('questionnaire_cant_get', Globalize.culture()));
                    console.log(err);
                } else {
                    let count = res.count ? res.count : 0;
                    dispatch(receiveQuestionnaires(res.questionnaire, count));
                }
            });
    }
};

const receiveQuestionnaires = (questionnaires, count) => {
    return {
        type: RECEIVE_QUESTIONNAIRE,
        questionnaires : questionnaires,
        questionnaire_count: count,
    }
};

export const clearQuestionnaires = () => {
    return dispatch => {
        dispatch(receiveQuestionnaires([]));
    }
};

export const deleteQuestionnaires = (questionnaireIds, whenFailed, whenSucceeded) => {
    new Rpapi('delete', '/questionnaires')
        .send({questionnaire_ids: questionnaireIds})
        .end(function (err, res) {
            if (err) {
                whenFailed(err);
            } else {
                whenSucceeded(res);
            }
        });
};

export const createQuestionnaire = (questionnaire, whenFailure, whenSuccess) => {
    new Rpapi('post', '/questionnaire')
        .send(questionnaire)
        .end(function (err, res) {
            if (err) {
                whenFailure(err);
            } else {
                whenSuccess(res);
            }
        })
};

export const updateQuestionnaire = (questionnaireId, questionnaire, whenFailure, whenSuccess) => {
    new Rpapi('put', '/questionnaire/' + questionnaireId)
        .send(questionnaire)
        .end(function (err, res) {
            if (err) {
                whenFailure(err);
            } else {
                whenSuccess(res);
            }
        })
};

export const fetchQuestionnaireInfo = (questionnaireId, whenFailed, whenSucceeded) => {
    new Rpapi('get', '/questionnaire/' + questionnaireId)
        .end((err, res) => {
            if (err) {
                whenFailed(err);
            } else {
                whenSucceeded(res);
            }
        })
};

