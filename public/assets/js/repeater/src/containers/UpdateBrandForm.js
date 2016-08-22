import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import  BrandForm from '../components/BrandForm'
import { updateBrand } from '../actions/brand'

const mapStateToProps = (state, ownProps) => {
    return {
        isCreateNew: false,
        currentUser: state.currentUser,
        companies: state.companies,
        isConfirm: false,
        brand: state.updateBrand
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onSubmit(e) {
            e.preventDefault();
            dispatch(updateBrand(this.state.brand, ownProps.history));
        },
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(BrandForm)



