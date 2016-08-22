import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import InformationForm from '../components/InformationForm'
import { createInformation } from '../actions/information'

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        companies: state.companies,
        brands: state.brands,
        stores: state.stores,
        isNew: true
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        submitInformation(information, router) {
            dispatch(createInformation(information, router));
        },
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(InformationForm)
