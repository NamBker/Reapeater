import { RECEIVE_QUESTIONNAIRE_INFO } from '../constants/ActionTypes';
import { QUESTIONNAIRE_TYPE_OTHER, QUESTIONNAIRE_AGREEMENT_IS_NOT_SHOW } from '../constants/Constants'
import moment from 'moment'

const initialState = {
    company_id: '',
    brand_id: '',
    questionnaire_name: '',
    questionnaire_text: '',
    questionnaire_limit: null,
    questionnaire_type: QUESTIONNAIRE_TYPE_OTHER,
    questionnaire_thank_text: '',
    questionnaire_agreement: QUESTIONNAIRE_AGREEMENT_IS_NOT_SHOW,
    questionnaire_responds: [],
};

export const updateQuestionnaire = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_QUESTIONNAIRE_INFO:
            let questionnaire =  action.questionnaire;
            questionnaire.questionnaire_limit = moment(questionnaire.questionnaire_limit);
            return questionnaire;
        default:
            return state;
    }
};
