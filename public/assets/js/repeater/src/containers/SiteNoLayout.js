import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SiteNoLayoutForm from '../components/SiteNoLayoutForm'

const mapStateToProps = (state) => {
    return {
        isCreateNew: true,
        currentUser: state.currentUser,
        siteNoLayout : state.site_store_free,
        error : state.error,
    }
};

export default connect(mapStateToProps)(SiteNoLayoutForm)
