import * as types from '../constants/ActionTypes';

const initialState = {
    company_id: '',
    brand_id : '',
    id: '',
    section_status : '',
    section_name: '',
    store_postal_code : '',
    store_prefectures : '',
    store_address : '',
    store_building : '',
    section_phone_no: '',
    store_ids: [],
};

export const updateSection = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_SECTION_INFO:
            return action.section;
        default:
            return state;
    }
};
