import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import SiteMapShopPageCreateForm from '../components/SiteMapShopPageCreateForm'
import * as NotificationAction from '../actions/notification'

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        site_map: state.site_map,
        stores: state.stores,
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

export default connect(mapStateToProps, mapDispatchToProps)(SiteMapShopPageCreateForm)
