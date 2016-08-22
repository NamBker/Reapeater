import * as types from '../constants/ActionTypes';

const initialState = [];
export const pictures = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_PICTURE:
            return action.pictures;
        default:
            return state;
    }
};

export const picture_count = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_PICTURE:
            return action.picture_count;
        default:
            return state;
    }
};

export const picture = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_PICTURE_INFO:
            return action.picture;
        default:
            return state;
    }
};

