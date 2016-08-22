import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Toggle from 'react-toggle'
import ReactPaginate from 'react-paginate';

import { getUrl } from '../utils/CommonUtils'
import * as Const from '../constants/Constants'
import { fetchStores } from '../actions/store'
import { fetchSiteMap } from '../actions/site'
class SiteMapCompanyProfileForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {
                company_id: this.props.params.companyId,
                brand_id: this.props.params.brandId,
                page: 1,
                pattern: Const.GET_ALL_PATTERN
            },
        };

        this.handlePageClick = this.handlePageClick.bind(this);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchStores(Object.assign(this.state.filter, {per_page: Const.PER_PAGE})));
        var filter_site = {company_id : this.props.params.companyId, brand_id: this.props.params.brandId, page_type: this.props.params.pageType};
        dispatch(fetchSiteMap(filter_site));
    }

    handlePageClick(data) {
        const { dispatch } = this.props;
        let page = data.selected + 1;
        dispatch(fetchStores(Object.assign(this.state.filter, {page: page, per_page: Const.PER_PAGE})));
    }

    render() {
        const { currentUser, stores, pathTitle, count, site_map } = this.props;
        var offset = (this.state.filter.page - 1) * Const.PER_PAGE;
        var siteStoreNewArr = [];
        site_map.map((siteStore, index) => {
            if (siteStore.store_id != 0) {
                siteStoreNewArr[siteStore.store_id] = siteStore;
                //siteStoreNewArr.push(siteStore);
            }
        })
        console.log(stores);
        console.log(siteStoreNewArr);
        //site_map.length > 0 ? getUrl(siteStoreNewArr[indexSite].page_type, siteStoreNewArr[indexSite].brand_id, store.id, stores.length == siteStoreNewArr.length ? siteStoreNewArr[index].id : siteStoreNewArr[indexSite].id) : ""
        //console.log(siteStoreNewArr);
        //var indexSite = 0;
        //if (siteStoreNewArr.length > 0) {
        //    siteStoreNewArr.map((site, index) => {
        //        if (site.id == this.props.params.siteId) {
        //            indexSite = index;
        //        }
        //    })
        //}
        return (
            <div>
                <Tabs selectedIndex={1} className="widget__page__delivery__select__tabs">
                    <TabList>
                        <Tab disabled={true}>ブランドサイトマップ</Tab>
                        <Tab>店舗サイトマップ</Tab>
                    </TabList>
                    <TabPanel></TabPanel>
                    <TabPanel>
                        <div className="sitemap">
                            <div className="sitemap_head mb20">
                                <div className="sitemap_txt">{pathTitle}ページの編集を行う店舗を選択してください。</div>
                            </div>
                            <div className="contents__container__box companyprof">
                                <dl className="widget widget__page__table">
                                    <dt className="widget__title">
                                        <div className="tree"><span>&nbsp;</span></div>
                                        <div className="section_title_table">
                                            <div className="tree123"><span>店舗コード</span></div>
                                            <div className="tree123"><span>店舗名</span></div>
                                            <div className="contents__container__td__btn_edit">&nbsp;</div>
                                        </div>
                                    </dt>
                                </dl>

                                {
                                    stores.map((store, index) => {
                                        return (
                                            <div className="contents__container__tr" key={index}>
                                                <div className="contents__container__td contents__container__td__no">{index+1}</div>
                                                <div className="contents__container__td tree123">{store.store_code}</div>
                                                <div className="contents__container__td tree123">{store.store_name}</div>
                                                <div className="contents__container__td contents__container__td__btn_edit">
                                                    <span className="btn_edit"><Link to={getUrl(parseInt(this.props.params.pageType), this.props.params.brandId, store.id, siteStoreNewArr[store.id] != null  ? siteStoreNewArr[store.id].id : "")}>ページの編集</Link></span>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                    <dd className="widget__page__table__pagination">
                                        <span>{Globalize.localize('map_total', Globalize.culture())}：{count} {Globalize.localize('map_matter', Globalize.culture())}</span>
                                        <ReactPaginate
                                            previousLabel={" "}
                                            forceSelected={this.state.filter.page - 1}
                                            nextLabel={" "}
                                            breakLabel={<a>...</a>}
                                            pageNum={Math.ceil(count / Const.PER_PAGE)}
                                            marginPagesDisplayed={2}
                                            pageRangeDisplayed={5}
                                            clickCallback={this.handlePageClick}
                                            containerClassName={"pagination information_paginate"}
                                            subContainerClassName={"pages pagination"}
                                            activeClassName={"active"}
                                            />
                                        <span></span>
                                    </dd>
                            </div>
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        )
    }
}

export default SiteMapCompanyProfileForm;