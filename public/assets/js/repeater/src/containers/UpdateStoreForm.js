import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateStore } from '../actions/store'
import StoreForm from '../components/StoreForm'

const mapStateToProps = (state, ownProps) => {
    return {
        isCreate: false,
        currentUser: state.currentUser,
        areas: state.currentAreas,
        storeDetail: state.storeDetail,
    }
};

export default connect(mapStateToProps)(StoreForm)



