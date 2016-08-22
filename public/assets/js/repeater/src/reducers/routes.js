import { CUSTOM_CREATE_ACTION } from '../constants/ActionTypes';

export const doCreate = (state = false, action) => {
    switch (action.type) {
        case CUSTOM_CREATE_ACTION:
            return action.doCreate;
        default:
            return state;
    }
};

