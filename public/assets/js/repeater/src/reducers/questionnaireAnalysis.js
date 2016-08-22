import { RECEIVE_QUESTIONNAIRE_ANALYSIS } from '../constants/ActionTypes'

const initialState = [];

export const questionnaireAnalysis = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_QUESTIONNAIRE_ANALYSIS:
            return action.dailyQuestionnaire;
        default:
            return state;
    }
};