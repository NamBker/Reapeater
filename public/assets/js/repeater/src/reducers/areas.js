import { RECEIVE_AREA } from '../constants/ActionTypes';

const initialState = [];
export const areas = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_AREA:
            return action.areas;
        default:
            return state;
    }
};

export const areas_count = (state = 0, action) => {
    switch (action.type) {
        case RECEIVE_AREA:
            return action.areas_count;
        default:
            return state;
    }
};
