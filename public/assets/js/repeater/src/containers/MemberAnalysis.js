import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as memberanalysisAction from '../actions/memberanalysis' ;
import StoreAnalysis from '../components/analysis/StoreAnalysis'

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        companies: state.companies,
        brands: state.brands,
        stores: state.stores,
        isMember: true
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchDailyStoreInfo : (newfilter) => { return dispatch(memberanalysisAction.fetchDailyStoreInfo(newfilter)) },
        fetchMonthlyStoreInfo : (newfilter) => { return dispatch(memberanalysisAction.fetchMonthlyStoreInfo(newfilter)) },
        dispatch
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(StoreAnalysis);
