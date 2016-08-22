import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import InformationForm from '../components/InformationForm'
import { updateInformation } from '../actions/information'

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        information: state.updateInformation,
        companies: state.companies,
        brands: state.brands,
        stores: state.stores,
        isNew: false
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        submitInformation(information, router) {
            dispatch(updateInformation(information, router));
        },
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(InformationForm)
