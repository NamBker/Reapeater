import { RECEIVE_NOTIFICATION } from '../constants/ActionTypes';

export const notification = (state = {path: "", message: "", isShow: false}, action) => {
    switch (action.type) {
        case RECEIVE_NOTIFICATION:
            return action.notification;
        default:
            return state;
    }
};

