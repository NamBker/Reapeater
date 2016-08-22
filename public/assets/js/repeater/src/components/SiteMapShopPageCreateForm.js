import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import moment from 'moment'
import Notification from './commons/Notification'
import RadioButton from './commons/RadioButton'

import * as Const from '../constants/Constants'
import { SITE_MAP_CONFIG_COMPANY, SITE_MAP_CONFIG_STORE } from '../constants/Constants'
import { fetchSiteMap, updateSiteStoreFree, updateMultiSiteStoreFree, fetchSiteFreeStoreAll } from '../actions/site'

class SiteMapShopPageCreateForm extends Component {
    render() {
        let newStore = [];
        if (this.props.site_store_free_all != null) {
            this.props.site_store_free_all.length > 0 ? this.props.site_store_free_all.map((site, index) => {
                    if (site.store_id == 0) {
                        newStore.push(site);
                    }
            }) : "";
        }
        var page_type = this.props.params.pageType - 1;
        return (
            <div>
                <Tabs selectedIndex={1} className="widget__page__delivery__select__tabs">
                    <TabList>
                        <Tab disabled={true}>{Globalize.localize('company_site_tab', Globalize.culture())}</Tab>
                        <Tab>{Globalize.localize('store_site_tab', Globalize.culture())}</Tab>
                    </TabList>
                    <TabPanel></TabPanel>
                    <TabPanel>
                        <form acceptCharset="utf-8" onSubmit={this.props.onSubmit.bind(this)} autoComplete="off">
                            <div className="sitemap">
                                <div className="sitemap_head mb20">
                                    <div className="sitemap_txt">{Globalize.localize('store_site_map_title', Globalize.culture())}</div>
                                </div>
                            </div>
                            <div className="contents__container__box box-padding20">
                                <div className="contents__container__box--title">「{Const.SITE_MAP_PAGE_TYPE[page_type]}」の追加</div>
                                <div className="contents__container__box">
                                    <div className="contents__container__dl clearfix">
                                        <div className="contents__container__dt">名前</div>
                                        <div className="contents__container__dd"><input type="text" onChange={this.props.siteMapName} value={this.props.state.site.sitemap_name} className="contents__container__input--text width230" /></div>
                                    </div>
                                    <div className="contents__container__dl clearfix">
                                        <div className="contents__container__dt">URL</div>
                                        <div className="contents__container__dd"><input type="text" onChange={this.props.siteMapUrl} value={this.props.state.site.sitemap_url} className="contents__container__input--text width230 mr10" readOnly={this.props.params.pageType == 2 ? true : false}/> <span className="ml20 text-gray">※半角英数字が入力可能です。</span></div>
                                    </div>
                                    <div className="contents__container__dl clearfix">
                                        <div className="contents__container__dt v__middle">{Globalize.localize('how_to_create_page', Globalize.culture())}</div>
                                        <div className="contents__container__dd2">
                                            <div className="contents__container__dd--list">
                                                <div className="radio">
                                                    <RadioButton id={"display_" + 0}  label={Globalize.localize('l_personal_page', Globalize.culture())} radioName={Globalize.localize('how_to_create_page', Globalize.culture())} value="0" check={this.props.handleShowPageType} isChecked={this.props.state.isShowPageType == 0} />
                                                </div>
                                                <div className="note">{Globalize.localize('l_tutorial_create_page_for_company', Globalize.culture())}</div>
                                            </div>
                                            <div className="contents__container__dd--list">
                                                <div className="radio">
                                                    {newStore.length > 0 ?
                                                        <RadioButton id={"display_" + 1}  label={Globalize.localize('l_company_page', Globalize.culture())} radioName={Globalize.localize('how_to_create_page', Globalize.culture())} value="1" check={this.props.handleShowPageType} isChecked={this.props.state.isShowPageType == 1} />

                                                        : <label className="contents__container__radio radio_disabled"><input type="radio" name="disabled" className="input__radio" disabled /><span className="btn_label">企業連動ページ</span></label>
                                                    }

                                                </div>
                                                <div className="note">{Globalize.localize('l_tutorial_create_page', Globalize.culture())}</div>
                                            </div>
                                        </div>
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
                </Tabs>
            </div>
        )
    }
}

SiteMapShopPageCreateForm.contextTypes = {
    router: React.PropTypes.object,
};

export default SiteMapShopPageCreateForm;
