import React, { Component, PropTypes } from 'react';

import SiteMapConfigShopPageCreateForm from '../containers/SiteMapConfigShopPageCreateForm'
import SiteMapConfigLinkAgeCreateForm from '../containers/SiteMapConfigLinkAgeCreateForm'

import { Link } from 'react-router'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import moment from 'moment'
import Notification from './commons/Notification'
import RadioButton from './commons/RadioButton'

import * as Const from '../constants/Constants'
import { SITE_MAP_CONFIG_COMPANY, SITE_MAP_CONFIG_STORE } from '../constants/Constants'
import { getUrl } from '../utils/CommonUtils'
import { fetchSiteMap, updateSiteStoreFree, updateMultiSiteStoreFree, fetchSiteFreeStoreAll, createSiteStoreFree } from '../actions/site'

class SiteMapShopPageForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            site: {
                company_id: this.props.params.companyId,
                brand_id: this.props.params.brandId,
                page_type: 1,
                linkage_site_id: 0,
                organize_type: 1,
                free_input: "example",
                memo: "example",
                site_hierarchy: 1,
                display_flg: 1,
                display_order: 1,
                sitemap_name: "",
                title_picture_id: 1,
                sitemap_url: props.params.pageType == 2 ? "index" : "",
                parents_site_id: 1,
                organize_parts: {}
            },
            isShowPageType: 0,
        };

        this.siteMapName= this.siteMapName.bind(this);
        this.siteMapUrl = this.siteMapUrl.bind(this);
        this.handleShowPageType = this.handleShowPageType.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }


    componentDidMount() {
        const { dispatch, hideNotification } = this.props;
        let filterParam = {
            'company_id': this.props.params.companyId,
            'brand_id': this.props.params.brandId
        };
        dispatch(fetchSiteMap(filterParam));

        let page_type = this.props.params.pageType;
        let filterParamStore = {
            page_type: this.props.params.pageType,
            pattern: Const.GET_ALL_PATTERN
        };
        dispatch(fetchSiteFreeStoreAll(this.props.params.brandId, filterParamStore));
        hideNotification(this.props.route.path);
    }

    componentWillUnmount() {
        const { hideNotification } = this.props;
        hideNotification(this.props.route.path);
    }


    siteMapName(e) {
        let site = this.state.site;
        site.sitemap_name = e.target.value;
        this.setState({ site: site });
    }

    siteMapUrl(e) {
        let site = this.state.site;
        site.sitemap_url = e.target.value;
        this.setState({ site: site});
    }

    getArraySite(stores, link_page_site_id) {
        const { site } = this.state;
        let newArr = [];
        stores.map((store, index) => {
            if (store.brand_id == this.props.params.brandId) {
                let newSite = {...site};
                newSite.store_id = store.id;
                newSite.site_hierarchy = this.props.params.siteHierarchy;
                newSite.linkage_site_id = link_page_site_id;
                if (this.props.params.pageType == Const.PAGE_TYPE_NO_LAYOUT || this.props.params.pageType == Const.PAGE_TYPE_NO_MEMNU_LAYOUT) {
                    newSite.organize_type = 2;
                }
                newArr.push(newSite);
            }
        });
        return newArr;
    }

    onSubmit(e) {
        e.preventDefault();
        const { dispatch } = this.props;
        let site = this.state.site;
        if (site.sitemap_name == "" && site.sitemap_url == "") {
            alert(Globalize.localize('site_map_name_and_url_required', Globalize.culture()));
            return;
        }
        site.page_type = this.props.params.pageType;
        // get siteId
        let siteId = 0;
        this.props.site_map.map((site, index) => {
            if (site.store_id != 0 && site.page_type == this.props.params.pageType) {
                siteId = site.id;
            }
        });
        let siteMapContent = ["メニュー詳細", "レイアウト無し", "メニュー/レイアウト無し"];
        if (this.state.isShowPageType == 0) {
            var siteArr = this.getArraySite(this.props.stores, 0);
            let siteParams = {'site' : siteArr, 'linkage_site_id': 0};
            console.log(siteParams);
            console.log(this.props.site_map);
            let newArrCheckDuplicate = [];
            if (this.props.site_map != null) {
                this.props.site_map.map((siteContent, index) => {
                    if (siteContent.sitemap_url == siteArr[0].sitemap_url.replace(/\s+/g, '')) {
                        newArrCheckDuplicate.push(siteContent);
                    }
                })
            }
            if (siteArr[0].sitemap_url.replace(/\s+/g, '') == 'index' && (siteArr[0].page_type == 1 || siteArr[0].page_type == 2)) {
                newArrCheckDuplicate = []
            }
            if (newArrCheckDuplicate.length > 0) {
                alert("サイトURLが存在しています。");
                return;
            } else {
                if (siteMapContent.indexOf(Const.SITE_MAP_PAGE_TYPE[this.props.params.pageType - 1]) >= 0) {
                dispatch(createSiteStoreFree(siteParams, this.props.history,
                    (err) => {
                        this.showNotification(err, false);
                    },
                    (res) => {
                        this.showNotification(Globalize.localize('store_top_page_set', Globalize.culture()));
                        this.context.router.push("/site/list/" + this.props.params.companyId + "/" + this.props.params.brandId + "/" + siteId + "/" + this.props.params.pageType);
                    }
                ));
            } else {
                dispatch(updateMultiSiteStoreFree(siteParams, this.props.history,
                    (err) => {
                        this.showNotification(err, false);
                    },
                    (res) => {
                        this.showNotification(Globalize.localize('store_top_page_set', Globalize.culture()));
                        this.context.router.push("/site/list/" + this.props.params.companyId + "/" + this.props.params.brandId + "/" + siteId + "/" + this.props.params.pageType);
                    }
                ));
            }
            }
        } else {
            if (siteMapContent.indexOf(Const.SITE_MAP_PAGE_TYPE[this.props.params.pageType - 1]) >= 0) {
                this.context.router.push("/site/map/shoppage/" + this.props.params.companyId + "/" + this.props.params.brandId + "/" + this.props.params.pageType + "/" + this.props.params.siteHierarchy + "/linkage");
            } else {
                let newStore = [];
                this.props.site_store_free_all.map((siteStore, index) => {
                    if (this.props.params.pageType == Const.PAGE_TYPE_NO_LAYOUT || this.props.params.pageType == Const.PAGE_TYPE_NO_MEMNU_LAYOUT) {
                        siteStore.organize_type = 2;
                    }
                    newStore.push(siteStore);
                });
                let site_data = newStore[0];
                var siteArrNew = this.getArraySite(this.props.stores, site_data.id);
                let siteArrNewParams = {'site' : siteArrNew};
                dispatch(updateMultiSiteStoreFree(siteArrNewParams, this.props.history,
                    (err) => {
                        this.showNotification(err, false);
                    },
                    (res) => {
                        this.showNotification(Globalize.localize('store_top_page_set', Globalize.culture()));
                        let page_type = this.props.params.pageType;
                        let url = getUrl(parseInt(page_type), site_data.brand_id, site_data.store_id, site_data.id);
                        this.context.router.push(url);
                    }
                ));
            }
        }
    }

    showNotification(message, isSuccess = true) {
        const { showNotification } = this.props;
        showNotification(this.props.route.path, message, isSuccess);
    }

    handleShowPageType(e) {
        let isShowPageType = this.state.isShowPageType;
        isShowPageType = e.target.value;
        this.setState({ isShowPageType: isShowPageType });
    }

    render() {
        const { currentUser, site_map, brands, stores, site_store_free_all } = this.props;
        const children = React.cloneElement(this.props.children, {
            props: this.props,
            state: this.state,
            siteMapName: this.siteMapName,
            siteMapUrl: this.siteMapUrl,
            handleShowPageType: this.handleShowPageType,
            onSubmit: this.onSubmit
        });

        return (
            <div>{children}</div>
        );
    }
};

SiteMapShopPageForm.contextTypes = {
    router: React.PropTypes.object,
}

export default SiteMapShopPageForm;
