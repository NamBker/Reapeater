import { RECEIVE_RANDOM_COUPON } from '../constants/ActionTypes';

export const randomCoupons = (state = [], action) => {
    switch (action.type) {
        case RECEIVE_RANDOM_COUPON:
            return action.randomCoupons;
        default:
            return state;
    }
};

export const randomCouponCount = (state = 0, action) => {
    switch (action.type) {
        case RECEIVE_RANDOM_COUPON:
            return action.randomCouponCount;
        default:
            return state;
    }
};

