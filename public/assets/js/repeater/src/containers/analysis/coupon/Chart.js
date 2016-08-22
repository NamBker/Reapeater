import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Chart from '../../../components/analysis/coupon/Chart'
import { bindActionCreators } from 'redux'
import * as CouponAction from '../../../actions/coupon'

const mapStateToProps = (state, ownProps) => {
    let couponDataset = [
        {
            color:     "#0076de",
            lineColor: "#0076de", // 凡例の色
            legendName: Globalize.localize('user', Globalize.culture()),
            value: 0,
        },
        {
            color:     "#e5f3ff",
            lineColor: "#e5f3ff", // 凡例の色
            legendName: Globalize.localize('unuser', Globalize.culture()),
            value: 0,
        }
    ];

    let latestCoupon = '';
    if (state.couponAnalysis.length > 0) {
        latestCoupon = state.couponAnalysis[0];
        couponDataset[0].value = latestCoupon.used_coupon_count;
        couponDataset[1].value = latestCoupon.display_coupon_count - latestCoupon.used_coupon_count;
    }
    let total = couponDataset[0].value + couponDataset[1].value;
    if (total > 0) {
        couponDataset[0].label = couponDataset[0].legendName + couponDataset[0].value + Globalize.localize('people', Globalize.culture()) + "(" + Math.round(couponDataset[0].value * 100 / total) + "%)";
        couponDataset[1].label = couponDataset[1].legendName + couponDataset[1].value + Globalize.localize('people', Globalize.culture()) + "(" + Math.round(couponDataset[1].value * 100 / total) + "%)";
    }

    return {
        couponDataset, latestCoupon, total
    }
};


export default connect(mapStateToProps)(Chart)