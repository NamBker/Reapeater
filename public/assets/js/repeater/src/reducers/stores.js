import * as types from '../constants/ActionTypes';

const initialState = [];
export const stores = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_STORE:
            return action.stores;
        default:
            return state;
    }
};

export const stores_count = (state = 0, action) => {
    switch (action.type) {
        case types.RECEIVE_STORE:
            return action.stores_count;
        default:
            return state;
    }
};

export const storeDetail = (state = {}, action) => {
    switch (action.type) {
    case types.RECEIVE_STORE_INFO:
        return action.storeDetail;
    default:
        return state;
    }
}
