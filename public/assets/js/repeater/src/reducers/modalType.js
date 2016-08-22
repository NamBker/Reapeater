import { SHOW_MODAL, CLOSE_MODAL } from '../constants/ActionTypes';

const initialState = '';
export const modalType = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_MODAL:
            return action.modalType;
        case CLOSE_MODAL:
            return '';
        default:
            return state;
    }
    return state;
};
