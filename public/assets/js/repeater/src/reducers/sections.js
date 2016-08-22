import * as types from '../constants/ActionTypes';

const initialState = [];
export const sections = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_SECTION:
            return action.section;
        default:
            return state;
    }
};

export const sections_count = (state = 0, action) => {
    switch (action.type) {
        case types.RECEIVE_SECTION:
            return action.section_count;
        default:
            return state;
    }
};
