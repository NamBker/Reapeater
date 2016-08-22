import * as types from '../constants/ActionTypes';

const initialState = [];
export const members = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_MEMBER:
            return action.members;
        default:
            return state;
    }
};

export const member_count = (state = 0, action) => {
    switch (action.type) {
        case types.RECEIVE_MEMBER:
            return action.member_count;
        default:
            return state;
    }
}

export const member_info = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_MEMBER_INFO:
            return action.member_info;
        default:
            return state;
    }
};
