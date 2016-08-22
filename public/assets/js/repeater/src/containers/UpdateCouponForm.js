import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import CouponForm from '../components/CouponForm'

CouponForm.contextTypes = {
    router: React.PropTypes.object,
};

const mapStateToProps = (state) => {
    return {
        isCreateNew: false,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CouponForm)

