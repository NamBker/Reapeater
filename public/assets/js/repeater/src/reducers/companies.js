import * as types from '../constants/ActionTypes';

const initialState = [];
export const companies = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_COMPANY:
            return action.companies;
        default:
            return state;
    }
};

