import { RECEIVE_COUPON } from '../constants/ActionTypes';

const initialState = [];
export const coupons = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_COUPON:
            return action.coupons;
        default:
            return state;
    }
};

export const coupons_count = (state = 0, action) => {
    switch (action.type) {
        case RECEIVE_COUPON:
            return action.count;
        default:
            return state;
    }
};
