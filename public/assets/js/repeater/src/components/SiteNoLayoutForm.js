import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchSiteFreeStore , updateSiteStoreFree } from '../actions/site'
import { showNotification } from '../actions/notification';
import Notification from '../components/commons/Notification';
import { hideNotification } from '../actions/notification';

import * as Const from '../constants/Constants';
var organizePartsDefaultValue =    {"free_text": "", "display_title": 0}

class SiteNoLayoutForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            siteNoLayout: props.siteNoLayout == null || Object.keys(props.siteNoLayout).length <= 0 ? {
                brand_id: props.params.brandId,
                store_id: props.params.storeId,
                site_id: props.params.siteId,
                organize_type: 2,
                page_type: Const.PAGE_TYPE_NO_LAYOUT,
                free_input: "example",
                memo: "example",
                sitemap_name: "",
                title_picture_id: 1,
                site_hierarchy: 2,
                display_flg: 1,
                display_order: 0,
                parents_site_id: 1,
                sitemap_url: "example",
                organize_parts: organizePartsDefaultValue,
            } : props.siteNoLayout,
            error: props.error == null ? 0 : props.error,
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeSiteMapName = this.onChangeSiteMapName.bind(this);
        this.onChangeFreeText = this.onChangeFreeText.bind(this);
        this.onChangeDisplayTitle = this.onChangeDisplayTitle.bind(this);

    }

    componentDidMount() {
        const { dispatch } = this.props;
        const { siteNoLayout } = this.state;
        let fiterParam = {...siteNoLayout, pattern : Const.GET_ALL_PATTERN};
        dispatch(fetchSiteFreeStore(this.props.params.brandId, this.props.params.storeId, fiterParam));
        dispatch(hideNotification(this.props.route.path));
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch(hideNotification(this.props.route.path));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.siteNoLayout != this.props.siteNoLayout && nextProps.siteNoLayout != null) {

            var nxtSite = nextProps.siteNoLayout;
            if(nxtSite.organize_parts == null) nxtSite.organize_parts = organizePartsDefaultValue;
            this.setState({
                siteNoLayout: nxtSite,
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
        let {siteNoLayout,error} = this.state;
        if(Object.keys(error).length === 0) {
            if (this.state.siteNoLayout.sitemap_name == '' || this.state.siteNoLayout.sitemap_name == null || this.state.siteNoLayout.sitemap_name.length < 0) {
                alert("サイトマップ名称必須");
            }
            else {
                dispatch(updateSiteStoreFree(siteNoLayout, this.props.history,
                    (err) => {
                        this.showNotification(err, false);
                    },
                    (res) => {
                        this.showNotification("レイアウト無しが設定されました。");
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
        let {siteNoLayout} = this.state;
        let newSiteMapName = e.target.value;
        let newItems = {...siteNoLayout, sitemap_name: newSiteMapName};
        this.setState({
            siteNoLayout : newItems
        });
    }

    onChangeFreeText(e) {
        let {siteNoLayout} = this.state;
        let organize_parts = siteNoLayout.organize_parts;
        let newOrganize_parts = {...organize_parts, free_text: e.target.value};
        let newItems = {...siteNoLayout,organize_parts: newOrganize_parts};
        this.setState({
            siteNoLayout : newItems
        });
    }

    onChangeDisplayTitle(e) {
        let {siteNoLayout} = this.state;
        let organize_parts = siteNoLayout.organize_parts;
        let newOrganize_parts = {...organize_parts, display_title: e.target.value};
        let newItems = {...siteNoLayout,organize_parts: newOrganize_parts};
        this.setState({
            siteNoLayout : newItems
        });
    }

    render() {
        const {organize_parts} = this.state.siteNoLayout;
        return (<div>
                <Notification path={this.props.route.path}/>
                <form acceptCharset="utf-8" onSubmit={this.onSubmit.bind(this)} autoComplete="off">
                    <div className="contents__container mb20">
                        <div className="contents__h2 contents__icon--smartphone"><span className="contents__container__h2--note">{Globalize.localize('l_no_layout_title_smartphone', Globalize.culture())}</span></div>
                        <div className="contents__container__content">
                            <div className="contents__container__box">
                                <div className="contents__container__dl clearfix">
                                    <div className="contents__container__dt">{Globalize.localize('site_map_name', Globalize.culture())}</div>
                                    <div className="contents__container__dd">
                                        <input type="text" className="contents__container__input--text width480" onChange={this.onChangeSiteMapName} value={this.state.siteNoLayout.sitemap_name} />
                                    </div>
                                </div>
                                <div className="contents__container__dl clearfix">
                                    <div className="contents__container__dt">{Globalize.localize('l_title_display', Globalize.culture())}</div>
                                    <div className="contents__container__dd">
                                        <label className="contents__container__radio mr15"><input type="radio" name="dispTitle" value="1" checked={organize_parts.display_title == 1} onChange={this.onChangeDisplayTitle} /><span className="btn_label">する</span></label>
                                        <label className="contents__container__radio mr15"><input type="radio" name="dispTitle" value="0" checked={organize_parts.display_title == 0} onChange={this.onChangeDisplayTitle} /><span className="btn_label">しない</span></label>
                                    </div>
                                </div>
                                <div className="contents__container__dl clearfix">
                                    <div className="contents__container__dt">{Globalize.localize('l_free_text', Globalize.culture())}</div>
                                    <div className="contents__container__dd widget__page__information__form textarea">
                                        <textarea className="contents__container__textarea width480" placeholder="ここはhtmlコードを入力できるエリアです" onChange={this.onChangeFreeText} value={organize_parts.free_text}></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="widget__welcome__contents__bottom widget__page__register__button">
                                <input type="submit" onSubmit={this.onSubmit} className="btn-base contents__btn--save" value={Globalize.localize('b_register', Globalize.culture())} />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default SiteNoLayoutForm;