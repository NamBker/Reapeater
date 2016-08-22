import * as types from '../constants/ActionTypes';
import moment from 'moment'

const initialState = {
    company_id: 0,
    brand_id: 0,
    store_id: 0,
    title: '',
    body: '',
    picture_id: '',
    publisher_brand_ids: [],
    publisher_store_ids: [],
    status: 0,
    effective_period_from: null,
    effective_period_to: null,
};

export const updateInformation = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_INFORMATION_INFO:
            let information = action.information;
            information.effective_period_from = moment(information.effective_period_from);
            information.effective_period_to = moment(information.effective_period_to);
            return information;
        default:
            return state;
    }
};
