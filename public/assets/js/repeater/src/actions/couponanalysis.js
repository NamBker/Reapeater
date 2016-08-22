import { RECEIVE_COUPON_ANALYSIS } from '../constants/ActionTypes';
import Rpapi from './rpapi';

export const fetchCouponAnalysis = (filterParams, pattern = 3) => {
    let params = {...filterParams, pattern};
    return dispatch => {
        new Rpapi('get', '/coupon/analysis')
            .query(params)
            .end(function (err, res) {
                console.log('dailycoupon api called.');
                if (err || res.error_code) {
                    alert(Globalize.localize('coupon_analysis_cant_get', Globalize.culture()));
                    console.log(err);
                } else {
                    dispatch(receiveCouponAnalysis(res.daily_coupon));
                }
            });
    }
};

const receiveCouponAnalysis = (dailyCoupon) => {
    return {
        type: RECEIVE_COUPON_ANALYSIS,
        dailyCoupon,
    };
};

export const clearCouponAnalysis = () => {
    return receiveCouponAnalysis([]);
}