import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import SiteMapCompanyProfileForm from '../components/SiteMapCompanyProfileForm'
import * as Const from '../constants/Constants'

const mapStateToProps = (state) => {
    let siteId = state.routing.locationBeforeTransitions.pathname.split("/").pop();
    let pathTitle = "";
    state.site_map.map((site, index) => {
        if (site.id == siteId) {
            pathTitle = Const.SITE_MAP_PAGE_TYPE[site.page_type - 1];
        }
    });
    return {
        pathTitle: pathTitle,
        currentUser: state.currentUser,
        stores: state.stores,
        count: state.stores_count,
        site_map: state.site_map,
    }
};

export default connect(mapStateToProps)(SiteMapCompanyProfileForm)
