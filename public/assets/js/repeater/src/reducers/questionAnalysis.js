import { RECEIVE_QUESTIONNAIRE_ANSWER_ANALYSIS } from '../constants/ActionTypes'

const initialState = {question: []};

export const questionAnalysis = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_QUESTIONNAIRE_ANSWER_ANALYSIS:
            return action.dailyQuestion;
        default:
            return state;
    }
};