import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Table from '../../../components/analysis/delivery/Table'
import { bindActionCreators } from 'redux'
import * as DeliveryAction from '../../../actions/delivery'

const mapStateToProps = (state, ownProps) => {
    return {
        deliveries: state.deliveryAnalysis,
    }
};


export default connect(mapStateToProps)(Table)