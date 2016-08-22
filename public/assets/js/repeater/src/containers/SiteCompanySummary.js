import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import SiteCompanySummaryForm from '../components/SiteCompanySummaryForm'
import * as NotificationAction from '../actions/notification'

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        site_company_summary: state.site_company_summary,
        site_info: state.site_store_free,
        error : state.error,
    }
};

const mapDispatchToProps = (dispatch) => {
    const actionCreator = bindActionCreators(NotificationAction, dispatch);
    return {
        dispatch,
        ...actionCreator
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SiteCompanySummaryForm)
