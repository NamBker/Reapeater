import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import moment from 'moment'
import Notification from './commons/Notification'
import RadioButton from './commons/RadioButton'

import * as Const from '../constants/Constants'
import { getUrl } from '../utils/CommonUtils'
import { fetchSiteFreeStoreAll, createSiteStoreFree, updateMultiSiteStoreFree } from '../actions/site'

class SiteMapLinkAgeCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            site: {
                company_id: props.params.companyId,
                brand_id: props.params.brandId,
                store_id: 0,
                page_type: 1,
                organize_type: 1,
                organize_part : 1,
                free_input: "example",
                memo: "example",
                site_hierarchy: 1,
                display_flg: 1,
                display_order: 1,
                sitemap_name: "",
                title_picture_id: 1,
                sitemap_url: "",
                parents_site_id: 1,
                organize_parts: {}
            },
            siteFreeStoreId: 0,
        };
        this.handleChooseSiteFreeStore = this.handleChooseSiteFreeStore.bind(this);
        this.getStoreName = this.getStoreName.bind(this);
    }

    componentDidMount() {
        const { dispatch, hideNotification } = this.props;
        let filterParam = {
            page_type: this.props.params.pageType,
            pattern: Const.GET_ALL_PATTERN
        };
        dispatch(fetchSiteFreeStoreAll(this.props.params.brandId, filterParam));
        hideNotification(this.props.route.path);
    }

    componentWillUnmount() {
        const { hideNotification } = this.props;
        hideNotification(this.props.route.path);
    }

    showNotification(message, isSuccess = true) {
        const { showNotification } = this.props;
        showNotification(this.props.route.path, message, isSuccess);
    }

    getArraySite(stores, site, siteMapName, siteMapUrl) {
        let newArr = [];
        stores.map((store, index) => {
            if (store.brand_id == this.props.params.brandId) {
                let newSite = {...site};
                newSite.store_id = store.id;
                newSite.site_hierarchy = this.props.params.siteHierarchy;
                newSite.linkage_site_id = site.id;
                newSite.sitemap_name = siteMapName;
                newSite.sitemap_url = siteMapUrl;
                delete newSite.id;
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
        const { dispatch, state } = this.props;
        let site_choose = [];
        this.props.site_store_free_all.map((site, index) => {
            if (site.id == this.state.siteFreeStoreId) {
                if (this.props.params.pageType == Const.PAGE_TYPE_NO_LAYOUT || this.props.params.pageType == Const.PAGE_TYPE_NO_MEMNU_LAYOUT) {
                    site.organize_type = 2;
                }
                site_choose.push(site);
            }
        });
        let site_data = site_choose[0];
        var siteArrNew = this.getArraySite(this.props.stores, site_data, state.site.sitemap_name, state.site.sitemap_url);
        let siteArrNewParams = {'site' : siteArrNew, 'linkage_site_id': site_data.id};
        dispatch(createSiteStoreFree(siteArrNewParams, this.props.history,
            (err) => {
                this.showNotification(err, false);
            },
            (res) => {
                this.showNotification(Globalize.localize('store_top_page_set', Globalize.culture()));
                let page_type = this.props.params.pageType;
                let url = getUrl(parseInt(page_type), site_data.brand_id, 0, site_data.id);
                this.context.router.push(url);
            }
        ));
    }

    handleChooseSiteFreeStore(e) {
        let siteFreeStoreId= this.state.siteFreeStoreId;
        siteFreeStoreId = e.target.value;
        this.setState({ siteFreeStoreId: siteFreeStoreId });
    }

    getStoreName(storeId) {
        let store_name = "";
        this.props.stores.map((store, index) => {
            if (store.id == storeId) {
                store_name = store.store_name;
            }
        });
        return store_name;
    }

    render() {
        const { currentUser, site_store_free_all, stores } = this.props;
        let newStoreArr = [];
        stores.map((store, index) => {
            newStoreArr.push({id: store.id, store_name: store.store_name});
        });

        let newSiteStoreFreeAll = [];
        site_store_free_all.map((site, index) => {
            if (site.company_id == this.props.params.companyId && site.brand_id == this.props.params.brandId && site.store_id == 0) {
                newSiteStoreFreeAll.push(site);
            }
        });
        return (
            <div>
                <Notification path={this.props.route.path}/>
                <Tabs selectedIndex={1} className="widget__page__delivery__select__tabs">
                    <TabList>
                        <Tab disabled={true}>{Globalize.localize('company_site_tab', Globalize.culture())}</Tab>
                        <Tab>{Globalize.localize('store_site_tab', Globalize.culture())}</Tab>
                    </TabList>
                    <TabPanel></TabPanel>
                    <TabPanel>
                        <div className="sitemap">
                            <div className="sitemap_head mb20">
                                <div className="sitemap_txt">{Globalize.localize('site_map_link_page_title', Globalize.culture())}</div>
                            </div>
                        </div>
                        <div className="contents__container__box box-padding20">
                            <form acceptCharset="utf-8" onSubmit={this.onSubmit.bind(this)} autoComplete="off">
                                <div className="contents__container__box clearfix">
                                    {
                                        newSiteStoreFreeAll.map((site, index) => {
                                            return (
                                                <div className="contents__container__dl" key={index}>
                                                    <div className="radio-area">
                                                        <RadioButton id={"display_" + index} key={index}
                                                                     label={site.sitemap_name + " " + this.getStoreName(site.store_id)}
                                                                     radioName="site_free_store" value={site.id}
                                                                     check={this.handleChooseSiteFreeStore}
                                                                     isChecked={this.state.siteFreeStoreId == site.id}/>
                                                    </div>
                                                    <div className="btn-area">
                                                        <Link to={getUrl(parseInt(site.page_type), site.brand_id, site.store_id, site.id)}
                                                              target="_blank"
                                                              className="btn_edit btn_edit_modifier">{Globalize.localize('btn_confirm_page', Globalize.culture())}</Link>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                                <div className="text-center">
                                    <div className="btn-area__gray-blue clearfix">
                                        <div className="btn-area__gray-blue--left"><Link to={"/site/map/"} className="btn-gray2">{Globalize.localize('btn_return_site_map', Globalize.culture())}</Link></div>
                                        <div className="btn-area__gray-blue--right"><input type="submit" className="btn-base" value={Globalize.localize('btn_add_link_page', Globalize.culture())} /></div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        )
    }
}

SiteMapLinkAgeCreateForm.contextTypes = {
    router: React.PropTypes.object,
}

export default SiteMapLinkAgeCreateForm;
