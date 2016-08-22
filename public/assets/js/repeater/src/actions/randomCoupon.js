import * as request from 'superagent';
import { RECEIVE_RANDOM_COUPON } from '../constants/ActionTypes';
import Rpapi from './rpapi';

export const fetchRandomCoupons = (filterParams = {pattern: 1}, whenFailed, whenSucceeded) => {
    return dispatch => {
        new Rpapi('get', '/random/coupons')
            .query(filterParams)
            .end(function (err, res) {
                if (err) {
                    whenFailed(err);
                } else {
                    dispatch(receiveRandomCoupons(res.random_coupons, res.count));
                    whenSucceeded(res);
                }
            });
    }
};

const receiveRandomCoupons = (randomCoupons, count) =>  {
    return {
        type: RECEIVE_RANDOM_COUPON,
        randomCoupons: randomCoupons,
        randomCouponCount: count ? parseInt(count) : 0,
    }
};

export const deleteRandomCoupons = (deleteIds, whenFailed, whenSucceeded) => {
    new Rpapi('delete', '/random/coupons')
        .send({delete_ids: deleteIds})
        .end(function (err, res) {
            if (err) {
                whenFailed(err);
            } else {
                whenSucceeded(res);
            }
        });
}

export const getRandomCouponDetail = (randomCouponId, whenFailed, whenSucceeded) => {
    new Rpapi('get', '/random/coupon/' + randomCouponId)
        .end(function (err, res) {
            if (err) {
                whenFailed(err);
            } else {
                whenSucceeded(res);
            }
        });
}

export const createRandomCoupon = (params, whenFailed, whenSucceeded) => {
    new Rpapi('post', '/random/coupon')
        .send(params)
        .end(function (err, res) {
            if (err) {
                whenFailed(err);
            } else {
                whenSucceeded(res);
            }
        });
}

export const updateRandomCoupon = (randomCouponId, params, whenFailed, whenSucceeded) => {
    new Rpapi('put', '/random/coupon/' + randomCouponId)
        .send(params)
        .end(function (err, res) {
            if (err) {
                whenFailed(err);
            } else {
                whenSucceeded(res);
            }
        })
}

export const clearRandomCoupon = () => {
    return dispatch => {
        dispatch(receiveRandomCoupons([]));
    }
}

