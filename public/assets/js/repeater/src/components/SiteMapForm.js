import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import moment from 'moment'
import Modal from './commons/Modal'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
import Toggle from 'react-toggle'
import DropDownList from  './commons/DropDownList'
import Checkbox from '../components/commons/Checkbox'
import SiteItemList from '../components/site/SiteItemList'

import { fetchSiteMap, deleteSite, updateSiteStoreFreeOrder } from '../actions/site'
import * as Const from '../constants/Constants'
import { getUrl, removeDuplicatesBy } from '../utils/CommonUtils'
import { eachArea, eachCompany, eachBrand, eachStore } from '../utils/CommonUtils'

class SiteMapForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {
                company_id: "",
                brand_id: "",
            },
            brands: props.brands,
            siteMap: props.siteMap,
            siteMapCompany: props.siteMapCompany,
            siteMapStore: props.siteMapStore,
            isShowTable: false,
            isCheckAllSiteCompany: false,
            isDeleteShowCompany: true,
            isDeleteShowStore: true,
            isShowAllCompany: true,
            isShowAllStore: true,
            checkedItemsSiteCompany : [],
            storeIdSiteCompany: {
                site_free_store_ids: []
            },
            isCheckAllSiteStore: false,
            checkedItemsSiteStore : [],
            storeIdSiteStore: {
                site_free_store_ids: []
            }
        };
        this.handleCompanyIdChange = this.handleCompanyIdChange.bind(this);
        this.handleBrandIdChange = this.handleBrandIdChange.bind(this);
        this.checkAllSiteCompany = this.checkAllSiteCompany.bind(this);
        this.checkSiteMapCompany = this.checkSiteMapCompany.bind(this);
        this.deleteSelectedSiteCompany = this.deleteSelectedSiteCompany.bind(this);

        this.checkAllSiteStore = this.checkAllSiteStore.bind(this);
        this.checkSiteMapStore = this.checkSiteMapStore.bind(this);
        this.deleteSelectedSiteStore = this.deleteSelectedSiteStore.bind(this);
        this.onSortEndCompany = this.onSortEndCompany.bind(this);
        this.onSortEndStore = this.onSortEndStore.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.siteMap != this.state.siteMap) {
           this.setState({ siteMap : nextProps.siteMap });
        }
        let site = nextProps.siteMap;
        let siteMapCompany = nextProps.siteMapCompany;
        let siteMapStore = nextProps.siteMapStore;
        site.map((site, index) => {
            if (site.store_id == 0) {
                siteMapCompany.push(site);
            } else {
                siteMapStore.push(site);
            }
        });

        let uniQSiteStore = removeDuplicatesBy(x => x.linkage_site_id + "_" + x.page_type, siteMapStore);
        if (siteMapCompany != this.state.siteMapCompany) {
            this.setState({ siteMapCompany : siteMapCompany });
        }
        if (siteMapStore != this.state.siteMapStore) {
            this.setState({ siteMapStore: uniQSiteStore });
        }
    }

    onSortEndCompany({oldIndex, newIndex}) {
        const { dispatch } = this.props;
        let siteCompany = this.state.siteMapCompany;
        this.setState({
            items: arrayMove(this.state.siteMapCompany, oldIndex, newIndex)
        });
        let newSiteCompanyOrder = [];
        siteCompany.map((site, index) => {
            site.display_order = index + 1;
            newSiteCompanyOrder.push(site);
        });
        let filterParams = {
            sites:newSiteCompanyOrder
        };

        dispatch(updateSiteStoreFreeOrder(filterParams, this.props.history, (err) => {}, (res) => {}));
    }

    onSortEndStore({oldIndex, newIndex}) {
        const { dispatch } = this.props;
        let siteStore = this.state.siteMapStore;
        this.setState({
            items: arrayMove(this.state.siteMapStore, oldIndex, newIndex)
        });
        let newSiteStoreOrder = [];
        siteStore.map((site, index) => {
            site.display_order = index + 1;
            newSiteStoreOrder.push(site);
        });
        let filterParams = {
            sites:newSiteStoreOrder
        };
        dispatch(updateSiteStoreFreeOrder(filterParams, this.props.history, (err) => {}, (res) => {}));
    }

    handleCompanyIdChange(e) {
        let filter = this.state.filter;
        filter.company_id = this.props.currentUser.authority < Const.USER_AUTHORITY_COMPANY ? e.target.value : this.props.currentUser.company_id;
        var brand_arr = [];
        this.props.brands.map(brand => {
            if (brand.company_id == filter.company_id) {
                brand_arr.push(brand);
            }
        });
        this.setState({ filter: filter, brands: brand_arr });
    }

    handleBrandIdChange(e) {
        let filter = this.state.filter;
        filter.brand_id = e.target.value;
        this.setState({ filter: filter });
    }

    onSubmit(e) {
        e.preventDefault();
        const { dispatch } = this.props;
        if (this.state.filter.company_id != "" && this.state.filter.brand_id != "") {
            this.setState({ isShowTable : true });
            dispatch(fetchSiteMap(this.state.filter));
        }
    }

    checkAllSiteCompany() {
        this.setState({ isCheckAllSiteCompany: !this.state.isCheckAllSiteCompany, isDeleteShowCompany : true });
        let checkedItemsSiteCompany = [];
        if (!this.state.isCheckAllSiteCompany) {
            var siteCompanyList = this.state.siteMapCompany;
            for (var i = 0 ; i < siteCompanyList.length ; i++) {
                if (siteCompanyList[i] != null && siteCompanyList[i].hasOwnProperty("id")) {
                    checkedItemsSiteCompany.push(siteCompanyList[i].id);
                }
            }
        }
        this.setState({ checkedItemsSiteCompany: checkedItemsSiteCompany });
    }

    checkSiteMapCompany(siteId) {
        this.setState({ isDeleteShowCompany : true });
        let checkedItemsSiteCompany = this.state.checkedItemsSiteCompany;
        let index = checkedItemsSiteCompany.indexOf(siteId);
        let isCheckAllSiteCompany = this.state.isCheckAllSiteCompany;
        if (index >= 0) {
            checkedItemsSiteCompany =  [...checkedItemsSiteCompany.slice(0,index),...checkedItemsSiteCompany.slice(index+1)];
            isCheckAllSiteCompany = false;
        } else {
            checkedItemsSiteCompany.push(siteId);
        }
        this.setState({ checkedItemsSiteCompany: checkedItemsSiteCompany, isCheckAllSiteCompany: isCheckAllSiteCompany });
    }

    deleteSelectedSiteCompany(checkItemsCompanyList) {
        const  { dispatch } = this.props;
        if (confirm(Globalize.localize('confirm_delete', Globalize.culture()))) {
            let store_ids = this.state.storeIdSiteCompany;
            store_ids.site_free_store_ids = checkItemsCompanyList;
            dispatch(deleteSite(store_ids));
            let siteMapCompany = this.state.siteMapCompany;
            for (var index = 0; index < siteMapCompany.length; index++) {
                for (var i = 0; i < checkItemsCompanyList.length ; i++) {
                    if (checkItemsCompanyList[i] == siteMapCompany[index].id) {
                        siteMapCompany.splice(index, 1);
                    }
                }
            }
            if (siteMapCompany.length <= 0) {
                this.setState({ isShowAllCompany: false });
            }
            this.setState({ siteMapCompany : siteMapCompany , isDeleteShowCompany: false });
        }
    }

    checkAllSiteStore() {
        this.setState({ isCheckAllSiteStore: !this.state.isCheckAllSiteStore, isDeleteShowStore : true });
        let checkedItemsSiteStore = [];
        if (!this.state.isCheckAllSiteStore) {
            var siteStoreList = this.state.siteMapStore;
            for (var i = 0 ; i < siteStoreList.length ; i++) {
                if (siteStoreList[i] != null && siteStoreList[i].hasOwnProperty("id")) {
                    checkedItemsSiteStore.push(siteStoreList[i].id);
                }
            }
        }
        this.setState({ checkedItemsSiteStore: checkedItemsSiteStore });
    }

    checkSiteMapStore(siteId) {
        this.setState({ isDeleteShowStore : true });
        let checkedItemsSiteStore = this.state.checkedItemsSiteStore;
        let index = checkedItemsSiteStore.indexOf(siteId);
        let isCheckAllSiteStore = this.state.isCheckAllSiteStore;
        if (index >= 0) {
            checkedItemsSiteStore =  [...checkedItemsSiteStore.slice(0,index),...checkedItemsSiteStore.slice(index+1)];
            isCheckAllSiteStore = false;
        } else {
            checkedItemsSiteStore.push(siteId);
        }
        this.setState({ checkedItemsSiteStore: checkedItemsSiteStore, isCheckAllSiteStore: isCheckAllSiteStore });
    }

    deleteSelectedSiteStore(checkItemsStoreList) {
        const  { dispatch } = this.props;
        if (confirm(Globalize.localize('confirm_delete', Globalize.culture()))) {
            let store_ids = this.state.storeIdSiteStore;
            store_ids.site_free_store_ids = checkItemsStoreList;
            dispatch(deleteSite(store_ids));
            let siteMapStore = this.state.siteMapStore;
            for (var index = 0; index < siteMapStore.length; index++) {
                for (var i = 0; i < checkItemsStoreList.length ; i++) {
                    if (checkItemsStoreList[i] == siteMapStore[index].id) {
                        siteMapStore.splice(index, 1);
                    }
                }
            }
            if (siteMapStore.length <= 0) {
                this.setState({ isShowAllStore: false });
            }

            this.setState({ siteMapStore : this.state.siteMapStore, isDeleteShowStore: false });
        }
    }

    render() {
        const { currentUser, companies, brands, siteMap, siteMapCompany, siteMapStore } = this.props;
        var checked_company = this.state.isCheckAllSiteCompany ? "checked" : '';
        var checked_store = this.state.isCheckAllSiteStore ? "checked" : '';
        return (
            <div>
                {/* form data */}
                <form acceptCharset="utf-8" onSubmit={this.onSubmit.bind(this)} autoComplete="off">
                <dl className="widget widget__page__input mb20">
                    <div></div>
                    <dt className="widget__page__input__title">
                        <div className="widget__page__type__create"></div><span className="widget__page__main__title font-base1">企業・ブランドを選択してください</span>
                    </dt>
                    <dt className="widget__page__input__contents">
                        <div className="widget__page__input__contents__table mb20 mt20">
                            <dl>
                                <dt>企業</dt>
                                <dd>
                                    <DropDownList
                                        data={companies}
                                        defaultValue={this.state.filter.company_id}
                                        hasEmptyOption={true}
                                        onChange={this.handleCompanyIdChange}
                                        eachCallback={eachCompany()}/>
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>ブランド</dt>
                                <dd>
                                    <DropDownList
                                        data={this.state.brands}
                                        defaultValue={this.state.filter.brand_id}
                                        hasEmptyOption={true}
                                        onChange={this.handleBrandIdChange}
                                        eachCallback={eachBrand()}
                                        />
                                </dd>
                            </dl>
                        </div>
                        <div className="delivery__add__lock__btn mb20">
                            <div><input className="btn-base" value="サイトマップを表示" type="submit" /></div>
                        </div>

                    </dt>
                </dl>
                </form>

                {/* Table content */}
                {
                    this.state.isShowTable ?
                        <Tabs className="widget__page__delivery__select__tabs">
                            <TabList>
                                <Tab>ブランドサイトマップ</Tab>
                                <Tab>店舗サイトマップ</Tab>
                            </TabList>
                            <TabPanel>
                                <div className="sitemap">
                                    <div className="sitemap_head mb20">
                                        <div className="sitemap_txt">現在設定されているブランドサイトマップの一覧です。</div>
                                        <div className="sitemap_btn">
                                            {/* <a href="#" className="btn_darkgray mr10">サイトの色変更</a> */}
                                            <div className="btn-base"><Link to={"/site/map/create/" + this.state.filter.company_id + "/" + this.state.filter.brand_id} style={{color: '#fff'}}>ページの追加</Link></div>
                                        </div>
                                    </div>
                                    <dl className="widget widget__page__table">
                                        <dt className="widget__title">
                                            {this.state.isShowAllCompany && this.state.siteMapCompany.length > 0 ?
                                                <span className="check-all">
                                                <input type="checkbox" id="checkbox_all" checked={checked_company} onClick={this.checkAllSiteCompany}/>
                                                <label htmlFor="checkbox_all"></label>
                                            </span> : ""
                                            }
                                            {
                                                (!this.state.isCheckAllSiteCompany && this.state.checkedItemsSiteCompany.length == 0 || !this.state.isDeleteShowCompany) ?
                                                    <div className="section_title_table">
                                                        <div className="tree"><span>表示</span></div>
                                                        <div className="tree123"><span>第一階層</span></div>
                                                        <div className="tree123"><span>第二階層</span></div>
                                                        <div className="tree123"><span>第三階層</span></div>
                                                        <div className="contents__container__td__btn_edit">&nbsp;</div>
                                                    </div>
                                                    :
                                                    <a className="section_button_delete" onClick={this.deleteSelectedSiteCompany.bind(null, this.state.checkedItemsSiteCompany)}></a>
                                            }
                                        </dt>
                                        <SiteItemList
                                            items={this.state.siteMapCompany}
                                            onSortEnd={this.onSortEndCompany}
                                            checkSiteMap={this.checkSiteMapCompany}
                                            checkedItemsSite={this.state.checkedItemsSiteCompany}
                                            getUrl={getUrl}
                                            history={this.props.history}
                                            />
                                    </dl>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div className="sitemap">
                                    <div className="sitemap_head mb20">
                                        <div className="sitemap_txt">現在設定されているブランドサイトマップの一覧です。</div>
                                        <div className="sitemap_btn">
                                            {/* <a href="#" className="btn_darkgray mr10">サイトの色変更</a> */}
                                            <div className="btn-base"><Link to={"/site/map/create/" + this.state.filter.company_id + "/" + this.state.filter.brand_id} style={{color: '#fff'}}>ページの追加</Link></div>
                                        </div>
                                    </div>
                                </div>
                                <dl className="widget widget__page__table">
                                    <dt className="widget__title">
                                        {
                                            this.state.isShowAllStore && this.state.siteMapStore.length > 0 ? <span className="check-all">
                                            <input type="checkbox" id="checkbox_all" checked={checked_store} onClick={this.checkAllSiteStore} />
                                            <label htmlFor="checkbox_all"></label>
                                        </span> : ""
                                        }

                                        {
                                            (!this.state.isCheckAllSiteStore && this.state.checkedItemsSiteStore.length == 0 || !this.state.isDeleteShowStore) ?
                                                <div className="section_title_table">
                                                    <div className="tree"><span>表示</span></div>
                                                    <div className="tree123"><span>第一階層</span></div>
                                                    <div className="tree123"><span>第二階層</span></div>
                                                    <div className="tree123"><span>第三階層</span></div>
                                                    <div className="contents__container__td__btn_edit">&nbsp;</div>
                                                </div>
                                                :
                                                <a className="section_button_delete" onClick={this.deleteSelectedSiteStore.bind(null, this.state.checkedItemsSiteStore)}></a>
                                        }
                                    </dt>
                                    <SiteItemList
                                            items={this.state.siteMapStore}
                                            onSortEnd={this.onSortEndStore}
                                            checkSiteMap={this.checkSiteMapStore}
                                            checkedItemsSite={this.state.checkedItemsSiteStore}
                                            history={this.props.history}
                                        />
                                </dl>
                            </TabPanel>
                        </Tabs> : ""
                }

            </div>
        )
    }
}

export default SiteMapForm;
