import { RECEIVE_COUPON } from '../constants/ActionTypes';
import * as Const from '../constants/Constants';
import Rpapi from './rpapi';

var default_filters = {pattern: Const.GET_DISPLAY_ITEMS_ONLY_PATTERN};
export const fetchCoupons = (filterParams = default_filters, whenFailed = (err) => {}, whenSucceeded = (res) => {}) => {
    return dispatch => {
        new Rpapi('get', '/coupons')
            .query(filterParams)
            .end(function (err, res) {
                if (err) {
                    whenFailed(err);
                } else {
                    let count = res.count ? res.count : 0;
                    dispatch(receiveCoupons(res.coupon, count));
                    whenSucceeded(res);
                }
            });
    }
};

const receiveCoupons = (coupons, count) => {
    return {
        type: RECEIVE_COUPON,
        coupons,
        count
    }
};

export const clearCoupons = () => {
    return dispatch => {
        dispatch(receiveCoupons([]));
    }
};

export const deleteCoupons = (deleteIds, whenFailed, whenSucceeded) => {
    new Rpapi('delete', '/coupons')
        .send({coupon_ids: deleteIds})
        .end((err, res) => {
            if (err) {
                whenFailed(err);
            } else {
                whenSucceeded(res);
            }
        });
};

export const createCoupon = (couponParams, whenFailed, whenSucceeded) => {
    let tmp = {...couponParams};
    if(tmp.coupon_limit_from){
        tmp.coupon_limit_from = tmp.coupon_limit_from.format("YYYY-MM-DD");
    }
    if(tmp.coupon_limit_to){
        tmp.coupon_limit_to = tmp.coupon_limit_to.format("YYYY-MM-DD");
    }

    new Rpapi('post', '/coupon')
        .send(tmp)
        .end(function (err, res) {
            if (err) {
                whenFailed(err);
            } else {
                whenSucceeded(res);
            }
        });
};

export const fetchCouponInfo = (couponId, whenFailed, whenSucceeded) => {
    new Rpapi('get', '/coupon/' + couponId)
        .end((err, res) => {
            if (err) {
                whenFailed(err);
            } else {
                whenSucceeded(res);
            }
        });
};

export const updateCoupon = (couponId, couponParams, whenFailed, whenSucceeded) => {
    let tmp = {...couponParams};
    if(tmp.coupon_limit_from){
        tmp.coupon_limit_from = tmp.coupon_limit_from.format("YYYY-MM-DD");
    }
    if(tmp.coupon_limit_to){
        tmp.coupon_limit_to = tmp.coupon_limit_to.format("YYYY-MM-DD");
    }

    new Rpapi('put', '/coupon/' + couponId)
        .send(tmp)
        .end((err, res) => {
            if (err) {
                whenFailed(err);
            } else {
                whenSucceeded(res);
            }
        });
};
