import * as types from '../constants/ActionTypes';

const initialState = {
    company_id: '',
    brand_code: '',
    brand_name: '',
    brand_status: '',
    brand_postal_code: '',
    brand_prefectures: '',
    brand_address: '',
    brand_building: '',
    brand_phone_no: '',
    brand_regular_holiday: '',
    brand_signature_block: '',
    brand_terms_of_use: '',
    brand_privacy_policy: '',
    brand_freeword: '',
    store_display_type: '',
    google_analytics_id: '',
    google_analytics_pass: '',
    brand_first_open_date: '',
    member_registration_form_text_up: '',
    member_registration_form_text_down: ''
};

export const updateBrand = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_BRAND_INFO:
            return action.brand;
        default:
            return state;
    }
};
