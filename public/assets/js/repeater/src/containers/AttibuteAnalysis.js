import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as memberanalysisAction from '../actions/memberanalysis' ;
import AttributeAnalysis from '../components/analysis/StoreAnalysis'

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        companies: state.companies,
        brands: state.brands,
        stores: state.stores,
        memberAnalysis: state.memberAnalysis,
        isMember: false
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchDailyStoreInfo : (newfilter) => { return dispatch(memberanalysisAction.fetchDailyStoreInfo(newfilter, false)) },
        fetchMonthlyStoreInfo : (newfilter) => { return dispatch(memberanalysisAction.fetchMonthlyStoreInfo(newfilter, false)) },
        dispatch
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(AttributeAnalysis);