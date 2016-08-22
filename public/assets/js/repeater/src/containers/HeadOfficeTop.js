import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import HeadOfficeTopForm from '../components/HeadOfficeTopForm'

const mapStateToProps = (state) => {
    return {
        isCreateNew: true,
        currentUser: state.currentUser,
        headofficetop : state.site_store_free,
        sitemap_url : state.site_store_free_url,
        count : state.count,
        error : state.error,
    }
};

export default connect(mapStateToProps)(HeadOfficeTopForm)
