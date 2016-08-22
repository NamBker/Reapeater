import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import SiteConfigForm from '../components/SiteConfigForm'
import * as NotificationAction from '../actions/notification'

const mapStateToProps = (state) => {
    return {
        isCreateNew: true,
        currentUser: state.currentUser,
        site_info: state.site_store_free,
        store_info: state.site_store_info,
        picture: state.picture,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const actionCreator = bindActionCreators(NotificationAction, dispatch);
    return {
        dispatch,
        ...actionCreator
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SiteConfigForm)
