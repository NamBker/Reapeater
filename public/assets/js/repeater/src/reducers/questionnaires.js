import { RECEIVE_QUESTIONNAIRE } from '../constants/ActionTypes';

export const questionnaires = (state = [], action) => {
    switch (action.type) {
        case RECEIVE_QUESTIONNAIRE:
            return action.questionnaires;
        default:
            return state;
    }
};

export const questionnaire_count = (state = 0, action) => {
    switch (action.type) {
        case RECEIVE_QUESTIONNAIRE:
            return action.questionnaire_count;
        default:
            return state;
    }
};
