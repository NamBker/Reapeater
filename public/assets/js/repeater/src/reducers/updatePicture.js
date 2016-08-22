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

export const updatePicture = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_PICTURE_INFO:
            let picture = action.picture;
            picture.effective_period_from = moment(picture.effective_period_from);
            picture.effective_period_to = moment(picture.effective_period_to);
            return picture;
        default:
            return state;
    }
};
