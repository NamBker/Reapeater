import { SHOW_MODAL, CLOSE_MODAL } from '../constants/ActionTypes'

export const showModal = (modalType) => {
    return {type: SHOW_MODAL, modalType}
};

export const closeModal = () => {return {type: CLOSE_MODAL}}