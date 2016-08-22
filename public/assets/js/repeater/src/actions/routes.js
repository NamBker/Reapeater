import { CUSTOM_CREATE_ACTION } from '../constants/ActionTypes';

export const doCustomCreate = () => {
    return dispatch => {
        dispatch(requestCustomCreateAction(true));
    }
};

export const doneCustomCreate = () => {
    return dispatch => {
        dispatch(requestCustomCreateAction(false));
    }
}

const requestCustomCreateAction = (doCreate) =>  {
    return {
        type: CUSTOM_CREATE_ACTION,
        doCreate: doCreate
    }
};

