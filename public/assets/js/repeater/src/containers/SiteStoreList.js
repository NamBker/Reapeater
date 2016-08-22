import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SiteStoreListForm from '../components/SiteStoreListForm'

const mapStateToProps = (state) => {
    return {
        isCreateNew: true,
        currentUser: state.currentUser,
        siteStoreList : state.site_store_free,
        count : state.site_store_free_url.count,
        error : state.error,
    }
};

export default connect(mapStateToProps)(SiteStoreListForm)
