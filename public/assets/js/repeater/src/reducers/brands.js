import * as types from '../constants/ActionTypes';

const initialState = [];
export const brands = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_BRAND:
            return action.brand;
        default:
            return state;
    }
};

export const brands_count = (state = 0, action) => {
    switch (action.type) {
        case types.RECEIVE_BRAND:
            return action.brands_count;
        default:
            return state;
    }
};
