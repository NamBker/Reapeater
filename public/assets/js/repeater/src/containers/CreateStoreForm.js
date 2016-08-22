import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import StoreForm from '../components/StoreForm'
import { createStore } from '../actions/store'

const mapStateToProps = (state) => {
    return {
        isCreate: true,
        currentUser: state.currentUser,
        companies: state.currentCompanies,
        brands: state.currentBrands,
        areas: state.currentAreas,
        isConfirm: false,
    }
};

export default connect(mapStateToProps)(StoreForm)

