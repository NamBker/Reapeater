import * as types from '../constants/ActionTypes';

const initialState = {
    mail_address: '',
    authority: '',
    company_id: '',
    brand_id: '',
    store_id: '',
    name: '',
    address: '',
    phone_no: '',
}

export const currentUser = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_USER_INFO:
            return action.user;
        default:
            return state;
    }
};

export const currentCompanies = (state = [], action) => {
    switch (action.type) {
        case types.RECEIVE_USER_INFO:
            return action.companies;
        default:
            return state;
    }
};

export const currentBrands = (state = [], action) => {
    switch (action.type) {
        case types.RECEIVE_USER_INFO:
            return action.brands;
        default:
            return state;
    }
};

export const currentAreas = (state = [], action) => {
    switch (action.type) {
        case types.RECEIVE_USER_INFO:
            return action.areas;
        default:
            return state;
    }
};

export const currentStores = (state = [], action) => {
    switch (action.type) {
        case types.RECEIVE_USER_INFO:
            return action.stores;
        default:
            return state;
    }
};

