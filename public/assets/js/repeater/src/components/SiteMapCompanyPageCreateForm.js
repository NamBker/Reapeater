import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import moment from 'moment'
import Notification from './commons/Notification'

import * as Const from '../constants/Constants'
import { SITE_MAP_CONFIG_COMPANY, SITE_MAP_CONFIG_STORE } from '../constants/Constants'
import { updateSiteStoreFree, fetchSiteFreeStoreAll } from '../actions/site'

class SiteMapCompanyPageCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            site: {
                company_id: props.params.companyId,
                brand_id: props.params.brandId,
                store_id: 0,
                page_type: props.params.pageType,
                organize_type: 1,
                organize_part : 1,
                free_input: "example",
                memo: "example",
                site_hierarchy: 1,
                display_flg: 1,
                display_order: 1,
                sitemap_name: "",
                title_picture_id: 1,
                sitemap_url: props.params.pageType == 1 ? "index" : "",
                parents_site_id: 1,
                organize_parts: {}
            }
        };

        this.siteMapName= this.siteMapName.bind(this);
        this.siteMapUrl = this.siteMapUrl.bind(this);
    }

    componentDidMount() {
        const { dispatch, hideNotification } = this.props;
        let filterParamStore = {
            pattern: Const.GET_ALL_PATTERN
        };
        dispatch(fetchSiteFreeStoreAll(this.props.params.brandId, filterParamStore));
        hideNotification(this.props.route.path);
    }

    componentWillUnmount() {
        const { hideNotification } = this.props;
        hideNotification(this.props.route.path);
    }

    componentWillReceiveProps(nextProps) {

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

    showNotification(message, isSuccess = true) {
        const { showNotification } = this.props;
        showNotification(this.props.route.path, message, isSuccess);
    }

    onSubmit(e) {
        e.preventDefault();
        const { dispatch, site_store_free_all } = this.props;
        let site = this.state.site;
        let siteDuplicate = [];
        console.log(site);
        if (site_store_free_all != null) {
             site_store_free_all.map((siteStore, index) => {
                if (site.sitemap_url.replace(/\s+/g, '') == siteStore.sitemap_url) {
                    siteDuplicate.push(siteStore);
                }
            })
        }
        if (site.sitemap_url.replace(/\s+/g, '') == 'index' && site.page_type == 1) {
                siteDuplicate = []
        }
        if (siteDuplicate.length > 0) {
            alert("サイトURLが存在しています。");
            return;
        } else {
            site.page_type = this.props.params.pageType;
            site.site_hierarchy = this.props.params.siteHierarchy;
            if (this.props.params.pageType == Const.PAGE_TYPE_NO_LAYOUT || this.props.params.pageType == Const.PAGE_TYPE_NO_MEMNU_LAYOUT) {
                site.organize_type = 2;
            }
            dispatch(updateSiteStoreFree(site, this.props.history,
                (err) => {
                    this.showNotification(err, false);
                },
                (res) => {
                    this.showNotification(Globalize.localize('store_top_page_set', Globalize.culture()));
                    let url = "/site/map/create/" + this.props.params.companyId + "/" + this.props.params.brandId;
                    this.context.router.push(url);
                }
            ));
        }
    }

    render() {
        const { currentUser, site_store_free_all } = this.props;
        console.log(site_store_free_all);
        let page_type = parseInt(this.props.params.pageType) - 1;
        return (
            <div>
                <Notification path={this.props.route.path}/>
                <Tabs selectedIndex={0} className="widget__page__delivery__select__tabs">
                    <TabList>
                        <Tab>{Globalize.localize('company_site_tab', Globalize.culture())}</Tab>
                        <Tab disabled={true}>{Globalize.localize('store_site_tab', Globalize.culture())}</Tab>
                    </TabList>
                    <TabPanel>
                        <form acceptCharset="utf-8" onSubmit={this.onSubmit.bind(this)} autoComplete="off">
                            <div className="sitemap">
                                <div className="sitemap_head mb20">
                                    <div className="sitemap_txt">{Globalize.localize('company_site_map_title', Globalize.culture())}</div>
                                </div>
                            </div>
                            <div className="contents__container__box box-padding20">
                                <div className="contents__container__box--title">「{Const.SITE_MAP_PAGE_TYPE[page_type]}」の追加</div>
                                <div className="contents__container__box">
                                    <div className="contents__container__dl clearfix">
                                        <div className="contents__container__dt">名前</div>
                                        <div className="contents__container__dd"><input type="text" onChange={this.siteMapName} value={this.state.site.sitemap_name} className="contents__container__input--text width230" /></div>
                                    </div>
                                    <div className="contents__container__dl clearfix">
                                        <div className="contents__container__dt">URL</div>
                                        <div className="contents__container__dd"><input type="text" onChange={this.siteMapUrl} value={this.state.site.sitemap_url} className="contents__container__input--text width230 mr10" readOnly={this.props.params.pageType == 1 ? true : false} /> <span className="ml20 text-gray">{Globalize.localize('l_tutorial_input_enter', Globalize.culture())}</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="btn-area__gray-blue clearfix">
                                    <div className="btn-area__gray-blue--left"><Link to={"/site/map/"} className="btn-gray2">{Globalize.localize('btn_return_site_map', Globalize.culture())}</Link></div>
                                    <div className="btn-area__gray-blue--right"><input type="submit" className="btn-base" value={Globalize.localize('menu_site_map_create', Globalize.culture())} /></div>
                                </div>
                            </div>
                        </form>
                    </TabPanel>
                    <TabPanel></TabPanel>
                </Tabs>
            </div>
        )
    }
}

SiteMapCompanyPageCreateForm.contextTypes = {
    router: React.PropTypes.object,
}

export default SiteMapCompanyPageCreateForm;
