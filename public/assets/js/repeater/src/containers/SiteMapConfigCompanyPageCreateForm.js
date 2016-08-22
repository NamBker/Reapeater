import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import SiteMapCompanyPageCreateForm from '../components/SiteMapCompanyPageCreateForm'
import * as NotificationAction from '../actions/notification'

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        site_store_free_all: state.site_store_free_all,
    }
};

const mapDispatchToProps = (dispatch) => {
    const actionCreator = bindActionCreators(NotificationAction, dispatch);
    return {
        dispatch,
        ...actionCreator
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SiteMapCompanyPageCreateForm)
