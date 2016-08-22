import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import MenuDetailForm from '../components/MenuDetailForm';
import { bindActionCreators } from 'redux';
import * as siteAction from '../actions/site';
import * as notificationAction from '../actions/notification';

const mapStateToProps = (state) => {
    return {
        isCreateNew: true,
        currentUser: state.currentUser,
        site: state.site_store_free,
        error : state.error,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        siteAction : bindActionCreators(siteAction,dispatch),
        notificationAction : bindActionCreators(notificationAction,dispatch),
    }
};


export default connect(mapStateToProps,mapDispatchToProps)(MenuDetailForm)
