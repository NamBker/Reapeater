import * as types from '../constants/ActionTypes';

const initialState = [];
export const informations = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_INFORMATION:
            return action.informations;
        default:
            return state;
    }
};

export const information_count = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_INFORMATION:
            return action.information_count;
        default:
            return state;
    }
};

