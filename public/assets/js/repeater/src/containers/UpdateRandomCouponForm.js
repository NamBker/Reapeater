import React from 'react';
import { connect } from 'react-redux';

import RandomCouponInputForm from './randomCoupon/RandomCouponInputForm';

const mapStateToProps = (state) => {
    return {
        isNew: false,
    };
};

export default connect(mapStateToProps)(RandomCouponInputForm);

