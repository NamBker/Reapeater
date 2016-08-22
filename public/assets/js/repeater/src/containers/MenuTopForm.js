import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import MenuTopForm from '../components/MenuTopForm'

const mapStateToProps = (state) => {
    return {
        isCreateNew: true,
        currentUser: state.currentUser,
        site : state.site_store_free,
        sitemap_url : state.site_store_free_url,
        site_map : state.site_map,
        count : state.count,
        error : state.error,
    }
};


export default connect(mapStateToProps)(MenuTopForm)
