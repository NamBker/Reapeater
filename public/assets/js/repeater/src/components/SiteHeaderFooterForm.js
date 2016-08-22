import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import Modal from './commons/Modal'
import SelectPicture from './SelectPicture'

import { fetchSiteHeaderFooter, createSiteHeaderFooter, updateSiteHeaderFooter } from '../actions/site'
import { showNotification } from '../actions/notification';
import Notification from '../components/commons/Notification';
import { hideNotification } from '../actions/notification';
import { fetchPictureInfo } from '../actions/picture';

import * as Const from '../constants/Constants'

class SiteHeaderFooterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            site: props.site_info == null || Object.keys(props.site_info).length <= 0 ? {
                company_id: props.currentUser.authority < Const.USER_AUTHORITY_COMPANY ? 0 : props.currentUser.company_id,
                brand_id: props.currentUser.authority < Const.USER_AUTHORITY_BRAND ? 0 : props.currentUser.brand_id,
                store_id: props.currentUser.authority < Const.USER_AUTHORITY_STORE ? 0 : props.currentUser.section_id,
                sitemap_name: "",
                sitemap_catchcopy : "",
                sitemap_picture_id: 0,
                sitemap_picture_url: "",
                sitemap_free_text: "",
                sitemap_copyright: "",
                sitemap_contents_title: "",
                memo : "",
                hasDataSite: true,
            } : props.site_info,
            isOpenSelectPicture: false,
            isCreate: true,
            isDeletePicture: true,
            picture: props.picture,
        };
        this.siteMapName = this.siteMapName.bind(this);
        this.siteMapCatchCopy = this.siteMapCatchCopy.bind(this);
        this.siteMapFreeText = this.siteMapFreeText.bind(this);
        this.siteMapCopyRight = this.siteMapCopyRight.bind(this);
        this.siteMapContentTitle = this.siteMapContentTitle.bind(this);
        this.onOpenSelectPicture = this.onOpenSelectPicture.bind(this);
        this.onSelectedPicture = this.onSelectedPicture.bind(this);
        this.onDeletePicture = this.onDeletePicture.bind(this);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchSiteHeaderFooter());
        dispatch(hideNotification(this.props.route.path));
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch(hideNotification(this.props.route.path));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.site_info != this.props.site_info && nextProps.site_info != null) {
            this.setState({
                site: nextProps.site_info,
            });
            if (nextProps.site_info.sitemap_picture_id != null && nextProps.site_info.sitemap_picture_id != 0) {
                const { dispatch } = this.props;
                dispatch(fetchPictureInfo(nextProps.site_info.sitemap_picture_id));
                this.setState({ isDeletePicture : false });
            }
        }
    }

    siteMapName(e) {
        let site = this.state.site;
        site.sitemap_name = e.target.value;
        this.setState({ site: site });
    }

    siteMapCatchCopy(e) {
        let site = this.state.site;
        site.sitemap_catchcopy = e.target.value;
        this.setState({ site: site });
    }

    siteMapFreeText(e) {
        let site = this.state.site;
        site.sitemap_free_text = e.target.value;
        this.setState({ site: site });
    }

    siteMapCopyRight(e) {
        let site = this.state.site;
        site.sitemap_copyright = e.target.value;
        this.setState({ site: site });
    }

    siteMapContentTitle(e) {
        let site = this.state.site;
        site.sitemap_contents_title = e.target.value;
        this.setState({ site: site });
    }

    onSubmit(e) {
        e.preventDefault();
        const { dispatch, ownProps } = this.props;
        if (this.state.site.sitemap_name == '' || this.state.site.sitemap_name == null || this.state.site.sitemap_name.length < 0) {
            alert("サイトマップ名称必須");
        }
        let site = this.state.site
        dispatch(updateSiteHeaderFooter(site, ownProps.history,
            (err) => {
                this.showNotification(err, false);
            },
            (res) => {
                this.showNotification("サイトしを保存ました。");
            }
        ));
    }

    showNotification(message, isSuccess = true) {
        const { dispatch } = this.props;
        dispatch(showNotification(this.props.route.path, message, isSuccess));
    }

    onOpenSelectPicture() {
        this.setState({ isOpenSelectPicture : true });
    }

    doneSelectPicture() {
        this.setState({ isOpenSelectPicture : false });
    }

    onSelectedPicture(picture) {
        this.setState({ isDeletePicture : false });
        let site = this.state.site;
        site.sitemap_picture_id = picture.id;
        site.sitemap_picture_url = picture.url;
        this.setState({ site: site });

        const { dispatch } = this.props;
        dispatch(fetchPictureInfo(site.sitemap_picture_id));
    }

    onDeletePicture() {
        this.setState({ isDeletePicture : true });
        let site = this.state.site;
        site.sitemap_picture_id = 0;

        this.setState({ site: site });
    }

    render() {
        const { currentUser, isCreateNew, site_info, picture } = this.props;
        let imagePreviewUrl = null;
        imagePreviewUrl = !this.state.isDeletePicture ? this.state.site.sitemap_picture_url == null ? this.props.picture.picture_url : this.state.site.sitemap_picture_url : "";

        return (
            <div>
                <div>
                    <SelectPicture isOpen={this.state.isOpenSelectPicture}
                            title="画像の挿入"
                            closeDialog={() => {this.doneSelectPicture()}}
                            onSelectedPicture={(picture) => {this.onSelectedPicture(picture)}}
                        />
                </div>
            <Notification path={this.props.route.path}/>
            <form acceptCharset="utf-8" onSubmit={this.onSubmit.bind(this)} autoComplete="off">
                <div className="contents__container mb20">
                    <div className="contents__h2 contents__icon--smartphone"><span className="contents__container__h2--note">ブランド共通へッタの設定を行ってください</span></div>
                    <div className="contents__container__content">
                        <div className="contents__container__box">
                            <div className="contents__container__dl clearfix"><div className="contents__container__dt">サイトマップ名称</div><div className="contents__container__dd"><input type="text" className="contents__container__input--text" onChange={this.siteMapName} value={this.state.site.sitemap_name} /></div></div>
                            <div className="contents__container__dl clearfix"><div className="contents__container__dt">キャッチコピーの設定</div><div className="contents__container__dd"><textarea className="contents__container__textarea form__input__textarea" onChange={this.siteMapCatchCopy} value={this.state.site.sitemap_catchcopy} placeholder="ここはhtmlコードを入力できるエリアです" /></div></div>
                            <div className="contents__container__dl clearfix">
                                <div className="contents__container__dt">ロゴバナーの設定</div>
                                <div className="contents__container__dd">
                                    <div className="contents__container__logo-contaner mb10">
                                        <div className="contents__container__image-btn"><input type="button" value="画像を選択" className="contents__container__input-button" onClick={this.onOpenSelectPicture} /></div>
                                        {!this.state.isDeletePicture ? <div className="contents__container__del-btn"><img src="../assets/img/img-dell.png" onClick={this.onDeletePicture} /></div> : ""}
                                    </div>
                                    <div className="contents__container__logo-image mb10"><img src={ imagePreviewUrl } /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* end site header form */}
                {/* site footer form */}
                <div className="contents__container mb20">
                    <div className="contents__h2 contents__icon--smartphone"><span className="contents__container__h2--note">ブランド共通フッタの設定を行ってください</span></div>
                    <div className="contents__container__content">
                        <div className="contents__container__box">
                            <div className="contents__container__dl clearfix"><div className="contents__container__dt">フリーテキストの設定</div><div className="contents__container__dd"><textarea className="contents__container__textarea form__input__textarea" onChange={this.siteMapFreeText} value={this.state.site.sitemap_free_text} placeholder="ここはhtmlコードを入力できるエリアです" /></div></div>
                            <div className="contents__container__dl clearfix"><div className="contents__container__dt">コピーライトの設定</div><div className="contents__container__dd"><textarea className="contents__container__textarea form__input__textarea" onChange={this.siteMapCopyRight} value={this.state.site.sitemap_copyright} placeholder="ここはhtmlコードを入力できるエリアです" /></div></div>
                            <div className="contents__container__dl clearfix"><div className="contents__container__dt">コンテンツメニューのタイトル</div><div className="contents__container__dd"><input type="text" className="contents__container__input--text" onChange={this.siteMapContentTitle} value={this.state.site.sitemap_contents_title} /></div></div>
                        </div>
                    </div>
                </div>
                {/* end site footer form */}
                <div className="contents__btn--save"><input type="submit" className="btn-base contents__btn--save" value="この内容で保存する" /></div>
            </form>
            </div>
        )
    }
}

export default SiteHeaderFooterForm;
