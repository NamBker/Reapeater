import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// import self defined components
import DeliveryForm from './DeliveryForm';

DeliveryForm.contextTypes = {
    router: React.PropTypes.object,
};

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        companies: state.currentCompanies,
        brands: state.currentBrands,
        areas: state.currentAreas,
        stores: state.currentStores,
        isNew: false,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryForm);
