import * as types from '../constants/ActionTypes';

const initialState = {};

export const error = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_ERROR:
            return action.error;
        default:
            return state;
    }
};