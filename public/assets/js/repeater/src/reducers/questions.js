import { CREATE_QUESTION, UPDATE_QUESTION, DELETE_QUESTION, RECEIVE_QUESTION, SWAP_QUESTION, SET_QUESTION_TYPE } from '../constants/ActionTypes';
import { QUESTIONNAIRE_STATUS_UNUSED, QUESTIONNAIRE_TYPE_INITIAL_REGISTRATION, QUESTIONNAIRE_TYPE_OTHER } from '../constants/Constants'
import {arrayMove} from 'react-sortable-hoc';

const initialState = [];

export const questions = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_QUESTION:
            return action.questions;
        case CREATE_QUESTION:
            return [...state, {
                questionnaire_order: state.reduce((maxOrder, question) => Math.max(question.questionnaire_order, maxOrder), -1) + 1,
                questionnaire_required: 0,
                question_status: QUESTIONNAIRE_STATUS_UNUSED,
                questionnaire_type: QUESTIONNAIRE_TYPE_OTHER,
                question_type: action.question_type,
                question_body: action.question_body,
                question_char_limit: action.question_char_limit,
                question_nos: action.question_nos
            }];
        case SET_QUESTION_TYPE:
            return state.map((question, index) => index == action.index ?
                Object.assign({}, question, {questionnaire_type: 3 - question.questionnaire_type}) : question);
        case DELETE_QUESTION:
        default:
            return state;
    }
};
