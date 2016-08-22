import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import moment from 'moment'
import Modal from './commons/Modal'
import Toggle from 'react-toggle'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { SITE_MAP_CONFIG_COMPANY, SITE_MAP_CONFIG_STORE } from '../constants/Constants'

import RadioButton from './commons/RadioButton'
import Notification from './commons/Notification'

import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';

import { fetchSiteMap } from '../actions/site'
import * as Const from '../constants/Constants'
const DragHandle = SortableHandle(() => <span className="drap_handle"></span>);

class SiteMapCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        const { dispatch, hideNotification } = this.props;
        const { site } = this.state;
        let filterParam = {
            'company_id': this.props.params.companyId,
            'brand_id': this.props.params.brandId
        };
        dispatch(fetchSiteMap(filterParam));
        hideNotification(this.props.route.path);
    }

    componentWillUnmount() {
        const { hideNotification } = this.props;
        hideNotification(this.props.route.path);
    }

    componentWillReceiveProps(nextProps) {

    }

    onSubmit(e) {
        e.preventDefault();
    }

    showNotification(message, isSuccess = true) {
        const { showNotification } = this.props;
        showNotification(this.props.route.path, message, isSuccess);
    }

    render() {
        const { currentUser, isCreateNew, site_map } = this.props;
        let siteMapCompany = []; let siteMapStore = [];
        for (var i = 0 ; i < site_map.length ; i++) {
            if (site_map[i].store_id == 0) {
                siteMapCompany.push(site_map[i]);
            } else {
                siteMapStore.push(site_map[i]);
            }
        }
        let siteMapCompanyPageType = []; let siteMapStorePageType = []; let siteMapPageTypeContent = ["メニュー詳細", "レイアウト無し", "メニュー/レイアウト無し"];
        for (var i_name = 0; i_name < siteMapCompany.length; i_name++) {
            if (siteMapPageTypeContent.indexOf(Const.SITE_MAP_PAGE_TYPE[siteMapCompany[i_name].page_type - 1]) < 0) {
                siteMapCompanyPageType.push(siteMapCompany[i_name].page_type);
            }
        }
        for (var i_store = 0; i_store < siteMapStore.length; i_store++) {
            if (siteMapPageTypeContent.indexOf(Const.SITE_MAP_PAGE_TYPE[siteMapStore[i_store].page_type - 1]) < 0) {
                siteMapStorePageType.push(siteMapStore[i_store].page_type);
            }
        }
        return (
            <Tabs className="widget__page__delivery__select__tabs">
                <TabList>
                    <Tab>{Globalize.localize('company_site_tab', Globalize.culture())}</Tab>
                    <Tab>{Globalize.localize('store_site_tab', Globalize.culture())}</Tab>
                </TabList>
                <TabPanel>
                    <div className="sitemap_head mb20">
                        <div className="sitemap_txt">{Globalize.localize('site_map_create_title', Globalize.culture())}</div>
                    </div>
                    <div className="hyojijun">
                        <dl className="widget widget__page__table">
                            <dt className="widget__title">
                                <div className="tree"><span>&nbsp;</span></div>
                                <div className="section_title_table">
                                    <div className="tree123"><span>{Globalize.localize('first_hierachy_position', Globalize.culture())}</span></div>
                                    <div className="tree123"><span>{Globalize.localize('second_hierachy_position', Globalize.culture())}</span></div>
                                    <div className="tree123"><span>{Globalize.localize('third_hierachy_position', Globalize.culture())}</span></div>
                                    <div className="contents__container__td__btn_edit">&nbsp;</div>
                                </div>
                            </dt>
                        {
                            Const.SITE_MAP_CONFIG_COMPANY.map((site, index) => {
                                return (
                                    <div className="contents__container__tr" key={index}>
                                        <div className="contents__container__td contents__container__td__no">{index+1}</div>
                                        <div className="contents__container__td tree123">{site.site_hierarchy == 1 ? site.sitemap_name : ""}<br />{site.site_hierarchy == 1 ? site.sitemap_url : " "}</div>
                                        <div className="contents__container__td tree123">{site.site_hierarchy == 2 ? site.sitemap_name : ""}<br />{site.site_hierarchy == 2 ? site.sitemap_url : " "}</div>
                                        <div className="contents__container__td tree123">{site.site_hierarchy == 3 ? site.sitemap_name : ""}<br />{site.site_hierarchy == 3 ? site.sitemap_url : " "}</div>
                                        <div className="contents__container__td contents__container__td__btn_edit">
                                            {
                                                siteMapCompanyPageType.indexOf(site.page_type) < 0 ? <span className="btn_edit" style={{ marginLeft: '90px' }}><Link to={"/site/map/companypage/create/" + this.props.params.companyId + "/" + this.props.params.brandId + "/" + site.page_type + "/" + site.site_hierarchy}>追加</Link></span> : <span className="btn_edit" style={{ marginLeft: '90px' }}><a href="javascript:void(0)" style={{ cursor: "default", opacity: "0.3"}}>追加</a></span>
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                        </dl>
                    </div>
                    <div className="text-center mt20"><div className="btn_darkgray"><Link to={"/site/map"}>{Globalize.localize('btn_return_site_map', Globalize.culture())}</Link></div></div>
                </TabPanel>
                <TabPanel>
                    <div className="sitemap_head mb20">
                        <div className="sitemap_txt">{Globalize.localize('site_map_create_title', Globalize.culture())}</div>
                    </div>
                    <div className="hyojijun">
                        <dl className="widget widget__page__table">
                            <dt className="widget__title">
                                <div className="tree"><span>&nbsp;</span></div>
                                <div className="section_title_table">
                                    <div className="tree123"><span>{Globalize.localize('first_hierachy_position', Globalize.culture())}</span></div>
                                    <div className="tree123"><span>{Globalize.localize('second_hierachy_position', Globalize.culture())}</span></div>
                                    <div className="tree123"><span>{Globalize.localize('third_hierachy_position', Globalize.culture())}</span></div>
                                    <div className="contents__container__td__btn_edit">&nbsp;</div>
                                </div>
                            </dt>
                        {
                            Const.SITE_MAP_CONFIG_STORE.map((site, index) => {
                                return (
                                    <div className="contents__container__tr" key={index}>
                                        <div className="contents__container__td contents__container__td__no">{index+1}</div>
                                        <div className="contents__container__td tree123">{site.site_hierarchy == 1 ? site.sitemap_name : ""}<br />{site.site_hierarchy == 1 ? site.sitemap_url : " "}</div>
                                        <div className="contents__container__td tree123">{site.site_hierarchy == 2 ? site.sitemap_name : ""}<br />{site.site_hierarchy == 2 ? site.sitemap_url : " "}</div>
                                        <div className="contents__container__td tree123">{site.site_hierarchy == 3 ? site.sitemap_name : ""}<br />{site.site_hierarchy == 3 ? site.sitemap_url : " "}</div>
                                        <div className="contents__container__td contents__container__td__btn_edit">
                                            {
                                                siteMapStorePageType.indexOf(site.page_type) < 0 ? <span className="btn_edit" style={{ marginLeft: '90px' }}><Link to={"/site/map/shoppage/" + this.props.params.companyId + "/" + this.props.params.brandId + "/" + site.page_type + "/" + site.site_hierarchy}>追加</Link></span> : <span className="btn_edit" style={{ marginLeft: '90px' }}><a href="javascript:void(0)" style={{ cursor: "default", opacity: "0.3"}}>追加</a></span>
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                        </dl>
                    </div>
                    <div className="text-center mt20"><div className="btn_darkgray"><Link to={"/site/map"}>{Globalize.localize('btn_return_site_map', Globalize.culture())}</Link></div></div>
                </TabPanel>
            </Tabs>
        )
    }
}

export default SiteMapCreateForm;
