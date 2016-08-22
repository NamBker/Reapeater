import { RECEIVE_COUPON_ANALYSIS } from '../constants/ActionTypes'

const initialState = [];

export const couponAnalysis = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_COUPON_ANALYSIS:
            return action.dailyCoupon;
        default:
            return state;
    }
};