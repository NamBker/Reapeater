import * as types from '../constants/ActionTypes';

const initialState = {
    mail_address: '',
    password: '',
    authority: '',
    company_id: '',
    brand_id: '',
    store_id: '',
    name: '',
    address: '',
    phone_no: '',
    companies: []
};

export const updateUser = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_UPDATE_USER:
            return action.user;
        default:
            return state;
    }
};
