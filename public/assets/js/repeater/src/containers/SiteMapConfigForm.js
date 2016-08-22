import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import SiteMapForm from '../components/SiteMapForm'

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        companies: state.companies,
        brands: state.brands,
        siteMap: state.site_map,
        siteMapCompany: [],
        siteMapStore: [],
    }
};
export default connect(mapStateToProps)(SiteMapForm)
