import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Notification from '../components/commons/Notification';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
import * as Const from '../constants/Constants'
var organizePartsDefaultValue = {menu_name: "", title_picture_id: "", menu_link_display: 0, free_text: ""};

class MenuFreeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            site: props.site == null || Object.keys(props.site).length <= 0 ? {
                brand_id: props.params.brandId,
                store_id: props.params.storeId,
                site_id: props.params.siteId,
                organize_type: 2,
                page_type: Const.PAGE_TYPE_NO_MEMNU_LAYOUT,
                free_input: "example",
                memo: "example",
                sitemap_name : "",
                title_picture_id: 1,
                site_hierarchy: 3,
                display_flg:1,
                display_order:0,
                parents_site_id: 1,
                sitemap_url: "example",
                organize_parts: organizePartsDefaultValue,
            } : props.site,
            error : props.error == null ? 0 : props.error,
        };
        this.onSelectTitlePicture = this.onSelectTitlePicture.bind(this);
        this.onDeleteTitlePicture = this.onDeleteTitlePicture.bind(this);
        this.onChangeMenuName = this.onChangeMenuName.bind(this);
        this.onChangeFreetext = this.onChangeFreetext.bind(this);
        this.onChangeMenuLinkDisplay = this.onChangeMenuLinkDisplay.bind(this);
        this.showNotification = this.showNotification.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        const { site } = this.state;
        const { siteAction, notificationAction} = this.props;
        let fiterParam = {...site, pattern : Const.GET_ALL_PATTERN};
        siteAction.fetchSiteFreeStore(this.props.params.brandId, this.props.params.storeId, fiterParam);
        notificationAction.hideNotification(this.props.route.path);
    }

    componentWillUnmount() {
        const {notificationAction} = this.props;
        notificationAction.hideNotification(this.props.route.path);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.site != this.props.site && nextProps.site != null) {
            var nxtSite = nextProps.site;
            if(nxtSite.organize_parts == null) nxtSite.organize_parts = organizePartsDefaultValue;

            this.setState({
                site: nxtSite,
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
        const {site,error} = this.state;
        const {siteAction} = this.props;
        if(Object.keys(error).length === 0) {
            if (site.sitemap_name == '' || site.sitemap_name == null || site.sitemap_name.length < 0) {
                alert("サイトマップ名称必須");
            }
            else {
                siteAction.updateSiteStoreFree(site, this.props.history,
                    (err) => {
                        this.showNotification(err, false);
                    },
                    (res) => {
                        this.showNotification("新規メニュー（フリーレイアウト）が設定されました。");
                    }
                );  
            }
        }
        else {
            alert(error);
        }
    }

    onChangeMenuName(e) {
        let {site} = this.state;
        let organize_parts = site.organize_parts;
        let newOrganize_parts = {...organize_parts, menu_name: e.target.value };
        let newItems = {...site,organize_parts: newOrganize_parts};
        this.setState({
            site : newItems
        });
    }

    onChangeFreetext(e) {
        let {site} = this.state;
        let organize_parts = site.organize_parts;
        let newOrganize_parts = {...organize_parts, free_text: e.target.value };
        let newItems = {...site,organize_parts: newOrganize_parts};
        this.setState({
            site : newItems
        });
    }

    onSelectTitlePicture() {
        let {site} = this.state;
        let organize_parts = site.organize_parts;
        let newOrganize_parts = {...organize_parts, title_picture_id: 1 };
        let newItems = {...site,organize_parts: newOrganize_parts};
        this.setState({
            site : newItems
        });
    }

    onDeleteTitlePicture() {
        let {site} = this.state;
        let organize_parts = site.organize_parts;
        let newOrganize_parts = {...organize_parts, title_picture_id: "" };
        let newItems = {...site,organize_parts: newOrganize_parts};
        this.setState({
            site : newItems
        });
    }

    onChangeMenuLinkDisplay(e) {
        let {site} = this.state;
        let organize_parts = site.organize_parts;
        let newOrganize_parts = {...organize_parts, menu_link_display: e.target.value};
        let newItems = {...site,organize_parts: newOrganize_parts};     
        this.setState({
            site : newItems
        });
    }

    showNotification(message, isSuccess = true) {
        const {notificationAction} = this.props;
        notificationAction.showNotification(this.props.route.path, message, isSuccess);
    }

    render() {
        const { site } = this.state;
        const { organize_parts } = this.state.site;
        return (
        <div>
            <Notification path={this.props.route.path}/>
            <form acceptCharset="utf-8" onSubmit={this.onSubmit.bind(this)} autoComplete="off" target="_top">
                <div className="contents__container mb20">
                    <div className="contents__h2 contents__icon--smartphone">
                        <span className="contents__container__h2--note">{Globalize.localize('l_menu_detail_note', Globalize.culture())}</span></div>
                        <div className="contents__container__content">
                            <div className="contents__container__box">
                                <div className="contents__container__dl clearfix">
                                    <div className="contents__container__dt">{Globalize.localize('l_menu_name', Globalize.culture())}</div>
                                    <div className="contents__container__dd">
                                        <input type="text" className="contents__container__input--text width480" value={organize_parts.menu_name} onChange={this.onChangeMenuName}/>
                                    </div>
                                </div>
                                <div className="contents__container__dl clearfix">
                                    <div className="contents__container__dt">{Globalize.localize('l_title_image', Globalize.culture())}</div>
                                    <div className="contents__container__dd">
                                        <div className="contents__container__logo-container mb10">
                                            <div className="contents__container__image-btn">
                                                <input type="button" value={Globalize.localize('l_image_selection', Globalize.culture())} className="contents__container__input-button" onClick={this.onSelectTitlePicture} />
                                            </div>
                                            {organize_parts.title_picture_id > 0 ? <div className="contents__container__image-name">image{organize_parts.title_picture_id}</div> : ""}
                                            {organize_parts.title_picture_id > 0 ? <div className="contents__container__del-btn"><img src="/assets/img/img-dell.png" onClick={this.onDeleteTitlePicture}/></div> : ""}
                                        </div>
                                        <div className="contents__container__logo mb10">
                                            <img src={organize_parts.title_picture_id > 0 ? "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRla77E0m1nBYLPXUi7PncdzLoj9zpGlgNJm09WEXQORi1NirtY" : ""} />
                                        </div>
                                        <div className="contents__container--note">※ロゴバナーの大きさは400px(W)×100px(H)まで</div>
                                    </div>
                                </div>
                                <div className="contents__container__dl clearfix">
                                    <div className="contents__container__dt">{Globalize.localize('l_to_menu_list', Globalize.culture())}<br />{Globalize.localize('l_link_display', Globalize.culture())}</div>
                                    <div className="contents__container__dd">
                                        <label className="contents__container__radio">
                                            <input type="radio" value="1" checked={organize_parts.menu_link_display == 1} onChange={this.onChangeMenuLinkDisplay} className="input__radio" />
                                            <span className="btn_label">{Globalize.localize('l_menu_detail_display_radio_on', Globalize.culture())}</span>
                                        </label>　　
                                        <label className="contents__container__radio">
                                            <input type="radio" value="0" checked={organize_parts.menu_link_display == 0} onChange={this.onChangeMenuLinkDisplay} className="input__radio" />
                                            <span className="btn_label">{Globalize.localize('l_menu_detail_display_radio_off', Globalize.culture())}</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="contents__container__dl clearfix">
                                    <div className="contents__container__dt">{Globalize.localize('l_free_text', Globalize.culture())}</div>
                                    <div className="contents__container__dd widget__page__information__form textarea">
                                        <textarea className="contents__container__textarea" value={organize_parts.free_text} onChange={this.onChangeFreetext} placeholder={Globalize.localize('place_holder_enter_html', Globalize.culture())} ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="widget__welcome__contents__bottom widget__page__register__button">
                                <button className="btn-base">{Globalize.localize('b_register', Globalize.culture())}</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default MenuFreeForm;