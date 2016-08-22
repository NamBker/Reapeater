import { RECEIVE_DELIVERY_ANALYSIS } from '../constants/ActionTypes'

const initialState = [];

export const deliveryAnalysis = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_DELIVERY_ANALYSIS:
            return action.dailyDelivery;
        default:
            return state;
    }
};