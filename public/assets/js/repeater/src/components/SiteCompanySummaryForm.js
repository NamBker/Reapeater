import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import moment from 'moment'
import Toggle from 'react-toggle'
import RadioButton from './commons/RadioButton'
import Notification from './commons/Notification'

import ColumnTitle from '../components/commons/ColumnTitle'
import CompanySummaryListItem from '../components/site/CompanySummaryListItem'
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';

import { fetchSiteCompanySummary, fetchSiteFreeStore, updateSiteStoreFree } from '../actions/site'
import * as Const from '../constants/Constants'
const DragHandle = SortableHandle(() => <span className="drap_handle"></span>);

var organizePartsDefaultValue =  {
    company_name_display: false,
    company_name_title: "社名",
    company_ceo_display: false,
    company_ceo_title: "代表者",
    company_address_display: false,
    company_address_title: "住所",
    company_phone_display: false,
    company_phone_title: "電話番号",
    company_free: [],
}

class SiteCompanySummaryForm extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            site: props.site_info == null || Object.keys(props.site_info).length <= 0 ? {
                sitemap_name: "",
                title_picture_id: 1,
                organize_type: 1,
                page_type: Const.PAGE_TYPE_COMPANY_SUMMARY,
                organize_parts: organizePartsDefaultValue,
                free_input: "example",
                memo: "example",
                site_hierarchy: 2,
                parents_site_id: 1,
                display_flg: 1,
                display_order: 0,
            }: props.site_info,
            itemList: [],
            isToggleFree: [],
            error : props.error == null ? 0 : props.error,
        };

        this.onSortEnd = this.onSortEnd.bind(this);
        this.addNewITem = this.addNewITem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.onChangeTitleItem = this.onChangeTitleItem.bind(this);
        this.onChangeBodyItem = this.onChangeBodyItem.bind(this);
        this.onChangeToggleItem = this.onChangeToggleItem.bind(this);
        this.showNotification = this.showNotification.bind(this);

        this.handleSiteMapName = this.handleSiteMapName.bind(this);
        this.handleToggleShowCompanyName = this.handleToggleShowCompanyName.bind(this);
        this.handleToggleShowCompanyCeo = this.handleToggleShowCompanyCeo.bind(this);
        this.handleToggleShowCompanyAddress = this.handleToggleShowCompanyAddress.bind(this);
        this.handleToggleShowCompanyPhoneNo = this.handleToggleShowCompanyPhoneNo.bind(this);

        this.handleCompanyName = this.handleCompanyName.bind(this);
        this.handleCompanyCeo = this.handleCompanyCeo.bind(this);
        this.handleCompanyAddress = this.handleCompanyAddress.bind(this);
        this.handleCompanyPhoneNo = this.handleCompanyPhoneNo.bind(this);
    }

    componentDidMount() {
        const { dispatch, hideNotification } = this.props;
        const { site, error } = this.state;
        let fiterParam = {...site, pattern : Const.GET_ALL_PATTERN};
        dispatch(fetchSiteCompanySummary(this.props.params.brandId));
        dispatch(fetchSiteFreeStore(this.props.params.brandId, this.props.params.storeId, fiterParam));
        hideNotification(this.props.route.path);
    }

    componentWillUnmount() {
        const { hideNotification } = this.props;
        hideNotification(this.props.route.path);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.site_info != this.props.site_info && nextProps.site_info != null) {
            var nxtSiteInfo = nextProps.site_info;
            if(!nxtSiteInfo.hasOwnProperty("organize_parts")) nxtSiteInfo.organize_parts = organizePartsDefaultValue;
            this.setState({
                site: nxtSiteInfo,
            });
        }
        if (nextProps.site_info != null && nextProps.site_info.hasOwnProperty("organize_parts")) {
            this.setState({ itemList : nextProps.site_info.organize_parts.company_free})
        }
    }

    handleSiteMapName(e) {
        let site = this.state.site;
        site.sitemap_name = e.target.value;
        this.setState({ site: site });
    }

    handleToggleShowCompanyName(e) {
        let site = this.state.site;
        site.organize_parts.company_name_display = e.target.checked;
        this.setState({ site: site });
    }

    handleToggleShowCompanyCeo(e) {
        let site = this.state.site;
        site.organize_parts.company_ceo_display = e.target.checked;
        this.setState({ site: site });
    }

    handleToggleShowCompanyAddress(e) {
        let site = this.state.site;
        site.organize_parts.company_address_display = e.target.checked;
        this.setState({ site: site });
    }

    handleToggleShowCompanyPhoneNo(e) {
        let site = this.state.site;
        site.organize_parts.company_phone_display = e.target.checked;
        this.setState({ site: site });
    }

    handleCompanyName(e) {
        let site = this.state.site;
        site.organize_parts.company_name_title = e.target.value;
        this.setState({ site: site });
    }

    handleCompanyCeo(e) {
        let site = this.state.site;
        site.organize_parts.company_ceo_title = e.target.value;
        this.setState({ site: site });

    }

    handleCompanyAddress(e) {
        let site = this.state.site;
        site.organize_parts.company_address_title = e.target.value;
        this.setState({ site: site });
    }

    handleCompanyPhoneNo(e) {
        let site = this.state.site;
        site.organize_parts.company_phone_title = e.target.value;
        this.setState({ site: site });
    }

    onSortEnd({oldIndex, newIndex}) {
        this.setState({
            items: arrayMove(this.state.itemList, oldIndex, newIndex)
        });
    }

    addNewITem() {
        let itemList = this.state.itemList;
        if (itemList.length < 5) {
            itemList.push({"title" : Globalize.localize('l_title', Globalize.culture()), "body" : Globalize.localize('l_text', Globalize.culture()), "display": false});
            this.setState({itemList : itemList});
        } else {
            alert(Globalize.localize('store_top_page_item_limit', Globalize.culture()));
        }
    }

    deleteItem(index) {
        let itemList = this.state.itemList;
        itemList.splice(index, 1);
        this.setState({itemList: itemList});
    }

    onChangeTitleItem(index, value) {
        let itemList = this.state.itemList;
        itemList[index].title = value;
        this.setState({ itemList: itemList });
        console.log(this.state.itemList)
    }

    onChangeBodyItem(index, value) {
        let itemList = this.state.itemList;
        itemList[index].body = value;
        this.setState({ itemList : itemList });
    }

    onChangeToggleItem(index, value) {
        let itemList = this.state.itemList;
        itemList[index].display= value;
        this.setState({ itemList: itemList });
    }

    showNotification(message, isSuccess = true) {
        const { showNotification } = this.props;
        showNotification(this.props.route.path, message, isSuccess);
    }

    onSubmit(e) {
        e.preventDefault();
        const { dispatch} = this.props;
        let site = this.state.site;
        site.organize_parts.company_free = this.state.itemList;
        site.brand_id = this.props.params.brandId;
        site.store_id = this.props.params.storeId;
        let { error } = this.state;
        if(Object.keys(error).length === 0) {
            dispatch(updateSiteStoreFree(this.state.site, this.props.history,
                (err) => {
                    this.showNotification(err, false);
                },
                (res) => {
                    this.showNotification(Globalize.localize('site_company_summary_set', Globalize.culture()));
                }
            ));
            this.setState({ site: site });
        } else {
            alert(error);
        }
    }


    render() {
        const { currentUser, site_company_summary, site_info, error } = this.props;
        return (
            <form acceptCharset="utf-8" onSubmit={this.onSubmit.bind(this)} autoComplete="off" target="_top">
                <Notification path={this.props.route.path}/>
                <div className="contents__container">
                    <div className="contents__h2 contents__icon--smartphone"><span className="contents__container__h2--note">{Globalize.localize('site_company_summary_page_title', Globalize.culture())}</span></div>
                    <div className="contents__container__content">

                        <div className="contents__container__box mb20">
                            <div className="contents__container__dl clearfix">
                                <div className="contents__container__dt v__middle">{Globalize.localize('site_map_name', Globalize.culture())}</div>
                                <div className="contents__container__dd"><input type="text" className="contents__container__input--text width480" value={this.state.site.sitemap_name} onChange={this.handleSiteMapName} /></div>
                            </div>
                        </div>

                        <div className="contents__container__box mb20">
                            <div className="contents__container__theader">
                                <div className="contents__container__th contents__container__td__toggle2">表示</div>
                                <div className="contents__container__th contents__container__td__komoku2">項目</div>
                                <div className="contents__container__th">内容</div>
                            </div>
                            <div className="contents__container__tr">
                                <div className="contents__container__td contents__container__td__toggle2">
                                    <Toggle checked={this.state.site.organize_parts.company_name_display} onChange={this.handleToggleShowCompanyName} />
                                </div>
                                <div className="contents__container__td contents__container__td__komoku2">
                                    <input type="text" value={this.state.site.organize_parts.company_name_title} onChange={this.handleCompanyName} className="contents__container__input--text width150" />
                                </div>
                                <div className="contents__container__td">
                                    <label className="width-full">{site_company_summary.company_name}</label>
                                </div>
                            </div>
                            <div className="contents__container__tr">
                                <div className="contents__container__td contents__container__td__toggle2">
                                    <Toggle checked={this.state.site.organize_parts.company_ceo_display} onChange={this.handleToggleShowCompanyCeo} />
                                </div>
                                <div className="contents__container__td contents__container__td__komoku2">
                                    <input type="text" value={this.state.site.organize_parts.company_ceo_title} onChange={this.handleCompanyCeo} className="contents__container__input--text width150" />
                                </div>
                                <div className="contents__container__td">
                                    <label className="width-full">{site_company_summary.company_ceo}</label>
                                </div>
                            </div>
                            <div className="contents__container__tr">
                                <div className="contents__container__td contents__container__td__toggle2">
                                    <Toggle checked={this.state.site.organize_parts.company_address_display} onChange={this.handleToggleShowCompanyAddress} />
                                </div>
                                <div className="contents__container__td contents__container__td__komoku2">
                                    <input type="text" value={this.state.site.organize_parts.company_address_title} onChange={this.handleCompanyAddress} className="contents__container__input--text width150" />
                                </div>
                                <div className="contents__container__td">
                                    <label className="width-full">{site_company_summary.company_address}</label>
                                </div>
                            </div>
                            <div className="contents__container__tr">
                                <div className="contents__container__td contents__container__td__toggle2">
                                    <Toggle checked={this.state.site.organize_parts.company_phone_display} onChange={this.handleToggleShowCompanyPhoneNo} />
                                </div>
                                <div className="contents__container__td contents__container__td__komoku2">
                                    <input type="text" value={this.state.site.organize_parts.company_phone_title} onChange={this.handleCompanyPhoneNo} className="contents__container__input--text width150" />
                                </div>
                                <label className="width-full">{site_company_summary.company_phone_no}</label>
                            </div>
                            { <CompanySummaryListItem items={this.state.itemList}
                                                      site_company_summary={site_company_summary}
                                                      btnText={Globalize.localize('b_add_free_item', Globalize.culture())}
                                                      addItem={this.addNewITem}
                                                      deleteItem={this.deleteItem}
                                                      onSortEnd={this.onSortEnd}
                                                      onChangeToggleItem={this.onChangeToggleItem}
                                                      onChangeTitleItem={this.onChangeTitleItem}
                                                      onChangeBodyItem={this.onChangeBodyItem}
                                />

                            }
                        </div>
                        <div><input type="submit" className="btn-base contents__btn--save" value={Globalize.localize('b_register', Globalize.culture())} /></div>
                    </div>
                </div>
            </form>
        )
    }
}

export default SiteCompanySummaryForm;
