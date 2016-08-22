import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import SiteHeaderFooterForm from '../components/SiteHeaderFooterForm'
import { fetchSiteHeaderFooter } from '../actions/site'
import { fetchPictureInfo } from '../actions/picture';

const mapStateToProps = (state) => {
    return {
        isCreateNew: true,
        currentUser: state.currentUser,
        site_info: state.site_headers_footers,
        picture: state.picture,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch, ownProps
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SiteHeaderFooterForm)
