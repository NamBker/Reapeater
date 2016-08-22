import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Table from '../../../components/analysis/coupon/Table'

const mapStateToProps = (state, ownProps) => {
    return {
        coupons: state.couponAnalysis,
    }
};


export default connect(mapStateToProps)(Table)