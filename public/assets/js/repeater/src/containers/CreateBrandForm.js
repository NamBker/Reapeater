import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import BrandForm from '../components/BrandForm'
import { createBrand } from '../actions/brand'

const mapStateToProps = (state) => {
    return {
        isCreateNew: true,
        currentUser: state.currentUser,
        companies: state.companies,
        isConfirm: false,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onSubmitBrand(e) {
            e.preventDefault();
            dispatch(createBrand(this.state.brand, ownProps.history));
        },
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(BrandForm)



