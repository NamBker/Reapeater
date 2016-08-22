import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import { fetchSiteFreeStore , updateSiteStoreFree } from '../actions/site'
import { showNotification } from '../actions/notification';
import Notification from '../components/commons/Notification';
import { hideNotification } from '../actions/notification';

import * as Const from '../constants/Constants';
var organizePartsDefaultValue = {"free_text": "", "display_type": 1};
class SiteStoreListForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            siteStoreList: props.siteStoreList == null || Object.keys(props.siteStoreList).length <= 0 ? {
                brand_id: props.params.brandId,
                store_id: props.params.storeId,
                organize_type: 1,
                page_type: Const.PAGE_TYPE_STORE_LIST,
                free_input: "example",
                memo: "example",
                sitemap_name: "",
                title_picture_id: 1,
                site_hierarchy: 2,
                display_flg: 1,
                display_order: 0,
                sitemap_url: "example",
                parents_site_id: 1,
                organize_parts: organizePartsDefaultValue,
            } : props.siteStoreList,
            error: props.error == null ? 0 : props.error,
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeSiteMapName = this.onChangeSiteMapName.bind(this);
        this.onChangeFreeText = this.onChangeFreeText.bind(this);
        this.onChangeDisplayType = this.onChangeDisplayType.bind(this);

    }

    componentDidMount() {
        const { dispatch } = this.props;
        const { siteStoreList } = this.state;
        let fiterParam = {...siteStoreList, pattern : Const.GET_ALL_PATTERN};
        dispatch(fetchSiteFreeStore(this.props.params.brandId, this.props.params.storeId, fiterParam));
        dispatch(hideNotification(this.props.route.path));
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch(hideNotification(this.props.route.path));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.siteStoreList != this.props.siteStoreList && nextProps.siteStoreList != null) {
            var nxtSiteStoreList = nextProps.siteStoreList;
            if (nxtSiteStoreList.organize_parts == null) nxtSiteStoreList.organize_parts = organizePartsDefaultValue;
            this.setState({
                siteStoreList: nxtSiteStoreList,
            });
        }
        if (nextProps.error != this.props.error && nextProps.error != null) {
            this.setState({
                error: nextProps.error,
            });
        }

    }

    onSubmit(e) {
        e.preventDefault();
        const { dispatch} = this.props;
        let {siteStoreList,error} = this.state;
        if(Object.keys(error).length === 0) {
            if (this.state.siteStoreList.sitemap_name == '' || this.state.siteStoreList.sitemap_name == null || this.state.siteStoreList.sitemap_name.length < 0) {
                alert("サイトマップ名称必須");
            }
            else {
                dispatch(updateSiteStoreFree(siteStoreList, this.props.history,
                    (err) => {
                        this.showNotification(err, false);
                    },
                    (res) => {
                        this.showNotification("店舗一覧が設定されました。");
                    }
                ));
            }
        }
        else {
            alert(error);
        }
    }

    showNotification(message, isSuccess = true) {
        const { dispatch } = this.props;
        dispatch(showNotification(this.props.route.path, message, isSuccess));
    }

    onChangeSiteMapName(e) {
        let {siteStoreList} = this.state;
        let newSiteMapName = e.target.value;
        let newItems = {...siteStoreList, sitemap_name: newSiteMapName};
        this.setState({
            siteStoreList : newItems
        });
    }

    onChangeFreeText(e) {
        let {siteStoreList} = this.state;
        let organize_parts = siteStoreList.organize_parts;
        let newOrganize_parts = {...organize_parts, free_text: e.target.value};
        let newItems = {...siteStoreList,organize_parts: newOrganize_parts};
        this.setState({
            siteStoreList : newItems
        });
    }

    onChangeDisplayType(e) {
        let {siteStoreList} = this.state;
        let organize_parts = siteStoreList.organize_parts;
        let newOrganize_parts = {...organize_parts, display_type: e.target.value};
        let newItems = {...siteStoreList,organize_parts: newOrganize_parts};
        this.setState({
            siteStoreList : newItems
        });
    }

    render() {
        const {organize_parts} = this.state.siteStoreList;
        return (
            <div>
                <Notification path={this.props.route.path}/>
                <form acceptCharset="utf-8" onSubmit={this.onSubmit.bind(this)} autoComplete="off">
                    <div className="contents__container">
                        <div className="contents__h2 contents__icon--smartphone"><span className="contents__container__h2--note">店舗一覧の設定を行ってください</span></div>
                        <div className="contents__container__content">
                            <div className="contents__container__box">
                                <div className="contents__container__dl clearfix">
                                    <div className="contents__container__dt">{Globalize.localize('site_map_name', Globalize.culture())}</div>
                                    <div className="contents__container__dd">
                                        <input type="text" className="contents__container__input--text width480" onChange={this.onChangeSiteMapName} value={this.state.siteStoreList.sitemap_name} />
                                    </div>
                                </div>
                                <div className="contents__container__dl clearfix">
                                    <div className="contents__container__dt">{Globalize.localize('l_free_text_setting', Globalize.culture())}</div>
                                    <div className="contents__container__dd">
                                        <textarea className="contents__container__textarea width480" placeholder="ここはhtmlコードを入力できるエリアです" onChange={this.onChangeFreeText} value={organize_parts.free_text}></textarea>
                                    </div>
                                </div>
                                <div className="contents__container__dl clearfix">
                                    <div className="contents__container__dt">{Globalize.localize('l_display_type', Globalize.culture())}</div>
                                    <div className="contents__container__dd">
                                        <div className="dd-line">
                                            <label className="contents__container__radio2"><input type="radio" name="disp-type" value="1" checked={organize_parts.display_type == 1} onChange={this.onChangeDisplayType} /><span className="ml10">{Globalize.localize('l_store_page_display', Globalize.culture())}</span></label>
                                        </div>
                                        <div className="dd-line">
                                            <div className="mr30 area-link">
                                                <label className="contents__container__radio2"><input type="radio" name="disp-type" value="2" checked={organize_parts.display_type == 2} onChange={this.onChangeDisplayType}/>
                                                <span className="ml10">{Globalize.localize('l_setting_area_type_page', Globalize.culture())}</span></label>
                                            </div>
                                            <div className="area-link mr20"><Link to={"/area"}>{Globalize.localize('l_area_setting', Globalize.culture())}<img src="/assets/img/ex-link.png" className="ml10 vertical-middle" /></Link></div>
                                            <div className="area-link"><Link to={"/areasort"}>{Globalize.localize('l_area_display_setting', Globalize.culture())}<img src="/assets/img/ex-link.png" className="ml10 vertical-middle" /></Link></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="contents__btn--save" >
                                <input type="submit" onSubmit={this.onSubmit} className="btn-base contents__btn--save" value={Globalize.localize('b_register', Globalize.culture())} />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default SiteStoreListForm;

