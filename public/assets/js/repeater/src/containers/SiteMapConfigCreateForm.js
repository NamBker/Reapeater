import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import SiteMapCreateForm from '../components/SiteMapCreateForm'
import * as NotificationAction from '../actions/notification'

const mapStateToProps = (state) => {
    return {
        isCreateNew: true,
        currentUser: state.currentUser,
        site_map: state.site_map,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const actionCreator = bindActionCreators(NotificationAction, dispatch);
    return {
        dispatch,
        ...actionCreator
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SiteMapCreateForm)
