import { RECEIVE_NOTIFICATION } from '../constants/ActionTypes';

export const showNotification = (path, message) => {
    return dispatch => {
        dispatch(receiveNotification({path: path, message: message, isShow: true}));
    }
};

export const hideNotification = (path) => {
    return dispatch => {
        dispatch(receiveNotification({path: path, message: "", isShow: false}));
    }
}

const receiveNotification = (notification) => {
    return {
        type: RECEIVE_NOTIFICATION,
        notification: notification,
    }
};

