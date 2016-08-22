import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router'
import Toggle from 'react-toggle'
import RadioButton from './commons/RadioButton'
import Notification from './commons/Notification'
import SelectPicture from './SelectPicture'

import ItemList from '../components/site/ItemList'
import { arrayMove } from 'react-sortable-hoc';
import { fetchSiteStoreInfo, fetchSiteFreeStore, updateSiteStoreFree } from '../actions/site'
import * as Const from '../constants/Constants'
var organizePartsDefaultValue =  {
                                    address_display_setting : false,
                                    access_display_setting : false,
                                    phone_display_setting: false,
                                    business_hours_display_setting: false,
                                    regular_holiday_display_setting: false,
                                    map_display_setting: false,
                                    free_text: "",
                                    left_picture_id: null,
                                    right_picture_id: null,
                                    info_display_setting: 0,
                                    info_display_number: 0,
                                    content: []
                                };

class SiteConfigForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            site: props.site_info == null || Object.keys(props.site_info).length <= 0 ? {
                company_id: props.currentUser.authority < Const.USER_AUTHORITY_COMPANY ? 0 : props.currentUser.company_id,
                brand_id: props.currentUser.authority < Const.USER_AUTHORITY_BRAND ? 0 : props.currentUser.brand_id,
                organize_type: 0,
                page_type: Const.PAGE_TYPE_STORE_TOP,
                free_input: "example",
                memo: "example",
                sitemap_picture_url_left: "",
                sitemap_picture_url_right: "",
                site_hierarchy: 1,
                display_flg: 1,
                display_order: 1,
                sitemap_name: "",
                title_picture_id: 1,
                parents_site_id: 1,
                organize_parts: organizePartsDefaultValue,
            } : props.site_info,
            isSwitched: false,
            itemList: [],
            isDeletePictureLeft: true,
            isDeletePictureRight: true,
            showSelectPicture: null,
        };
        this.handleShowSettingStatus = this.handleShowSettingStatus.bind(this);
        this.onSortEnd = this.onSortEnd.bind(this);
        this.addNewITem = this.addNewITem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.onChangeTitleItem = this.onChangeTitleItem.bind(this);
        this.onChangeBodyItem = this.onChangeBodyItem.bind(this);

        this.siteMapName = this.siteMapName.bind(this);
        this.handleToggleShowAddress = this.handleToggleShowAddress.bind(this);
        this.handleToggleShowAccess = this.handleToggleShowAccess.bind(this);
        this.handleToggleShowPhoneNumber = this.handleToggleShowPhoneNumber.bind(this);
        this.handleToggleShowBusinessHours = this.handleToggleShowBusinessHours.bind(this);
        this.handleToggleShowRegularHoliday = this.handleToggleShowRegularHoliday.bind(this);
        this.handleFreeInput = this.handleFreeInput.bind(this);

        this.onDeletePictureLeft = this.onDeletePictureLeft.bind(this);
        this.onDeletePictureRight = this.onDeletePictureRight.bind(this);

        this.handleDisplayNumber = this.handleDisplayNumber.bind(this);
        //this.closeModal = this.closeModal.bind(this);
        //this.handleCreateSiteConfig = this.handleCreateSiteConfig.bind(this);
        this.showNotification = this.showNotification.bind(this);
    }

    componentDidMount() {
        const { dispatch, hideNotification } = this.props;
        const { site } = this.state;
        let fiterParam = {...site, pattern : Const.GET_ALL_PATTERN};
        dispatch(fetchSiteFreeStore(this.props.params.brandId, this.props.params.storeId, fiterParam));
        dispatch(fetchSiteStoreInfo(this.props.params.brandId, this.props.params.storeId));
        hideNotification(this.props.route.path);
    }

    componentWillUnmount() {
        const { hideNotification } = this.props;
        hideNotification(this.props.route.path);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.site_info != this.props.site_info && nextProps.site_info != null) {
            var nxtSiteInfo = nextProps.site_info;
            if(nxtSiteInfo.organize_parts == null) nxtSiteInfo.organize_parts = organizePartsDefaultValue;

            this.setState({
                site: nxtSiteInfo,
            });
        }
        if (nextProps.site_info != null && nextProps.site_info.hasOwnProperty("organize_parts")) {
            this.setState({ itemList : nextProps.site_info.organize_parts.content})
        } else {
            let itemList = [];
            itemList.push({"title" : "タイトル", "body" : "テキスト"});
            this.setState({itemList : itemList});
        }
    }

    /* closeModal() {
        this.setState({ isOpenModal: false });
    } */

    handleShowSettingStatus(e) {
        let site = this.state.site;
        site.organize_parts.info_display_setting = e.target.value;
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
            itemList.push({"title" : "タイトル", "body" : "テキスト"});
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
    }

    onChangeBodyItem(index, value) {
        let itemList = this.state.itemList;
        itemList[index].body = value;
        this.setState({ itemList : itemList });
    }

    onSubmit(e) {
        e.preventDefault();
        //this.setState({ isOpenModal: true });
        const { dispatch} = this.props;
        let site = this.state.site;
        site.organize_parts.content = this.state.itemList;
        site.brand_id = this.props.params.brandId;
        site.store_id = this.props.params.storeId;
        this.setState({ site : site });
        dispatch(updateSiteStoreFree(site, this.props.history,
            (err) => {
                this.showNotification(err, false);
            },
            (res) => {
                this.showNotification(Globalize.localize('store_top_page_set', Globalize.culture()));
            }
        ));
    }

    siteMapName(e) {
        let site = this.state.site;
        site.sitemap_name = e.target.value;
        this.setState({ site : site });
    }

    handleToggleShowAddress(e) {
        let site = this.state.site;
        site.organize_parts.address_display_setting = e.target.checked;
        this.setState({ site : site });
    }

    handleToggleShowAccess(e) {
        let site = this.state.site;
        site.organize_parts.access_display_setting = e.target.checked;
        this.setState({ site : site });
    }

    handleToggleShowPhoneNumber(e) {
        let site = this.state.site;
        site.organize_parts.phone_display_setting = e.target.checked;
        this.setState({ site : site });
    }

    handleToggleShowBusinessHours(e) {
        let site = this.state.site;
        site.organize_parts.business_hours_display_setting = e.target.checked;
        this.setState({ site : site });
    }

    handleToggleShowRegularHoliday(e) {
        let site = this.state.site;
        site.organize_parts.regular_holiday_display_setting = e.target.checked;
        this.setState({ site : site });
    }

    handleFreeInput(e) {
        let site = this.state.site;
        site.organize_parts.free_text = e.target.value;
        this.setState({ site: site });
    }

    onSelectedPicture(picture) {
        let site = this.state.site;
        if (this.state.showSelectPicture == 'LEFT') {
            site.organize_parts.left_picture_id = picture.id;
            site.organize_parts.left_picture_name = picture.filename;
            site.sitemap_picture_url_left = picture.url;
        } else {
            site.organize_parts.right_picture_id = picture.id;
            site.organize_parts.right_picture_name = picture.filename;
            site.sitemap_picture_url_right = picture.url;
        }
        this.setState({ site: site, showSelectPicture: null });
    }

    onDeletePictureLeft() {
        let site = this.state.site;
        site.organize_parts.left_picture_id = null;
        site.organize_parts.left_picture_name = '';
        site.sitemap_picture_url_left = '';
        this.setState({ site: site });
    }

    onDeletePictureRight() {
        let site = this.state.site;
        site.organize_parts.right_picture_id = null;
        site.organize_parts.right_picture_name = '';
        site.sitemap_picture_url_right = '';
        this.setState({ site: site });
    }

    /*
    handleCreateSiteConfig() {
        const { dispatch, ownProps } = this.props;
        let site = this.state.site;
        site.brand_id = this.props.params.brandId;
        site.store_id = this.props.params.storeId;
        dispatch(updateSiteStoreFree(site, ownProps.history,
            (err) => {
                this.showNotification(err, false);
            },
            (res) => {
                this.showNotification(Globalize.localize('store_top_page_set', Globalize.culture()));
            }
        ));
        this.setState({ isOpenModal : false });
    } */

    showNotification(message, isSuccess = true) {
        const { showNotification } = this.props;
        showNotification(this.props.route.path, message, isSuccess);
    }

    handleDisplayNumber(e) {
        let site = this.state.site;
        site.organize_parts.info_display_number = site.organize_parts.info_display_setting == 0 ? e.target.value : 0;
        this.setState({ site : site });
    }

    render() {
        const { store_info } = this.props;
        var editStoreLink = '/store/edit/' + this.props.params.storeId;
        return (
            <div>
                <SelectPicture isOpen={this.state.showSelectPicture ? true : false}
                               title="Globalize.localize('random_coupon_select_picture_title', Globalize.culture())"
                               closeDialog={() => {this.setState({showSelectPicture: null})}}
                               onSelectedPicture={(picture) => {this.onSelectedPicture(picture)}}/>
                <Notification path={this.props.route.path}/>
            <form acceptCharset="utf-8" onSubmit={this.onSubmit.bind(this)} autoComplete="off" target="_top">
                <div className="contents__container mb20">
                    <div className="contents__h2 contents__icon--smartphone"><span className="contents__container__h2--note">{Globalize.localize('store_top_page_title', Globalize.culture())}</span></div>
                    <div className="contents__container__content">

                        <div className="contents__container__box mb20">
                            <div className="contents__container__dl clearfix">
                                <div className="contents__container__dt">サイトマップ名称</div>
                                <div className="contents__container__dd"><input value={this.state.site.sitemap_name} onChange={this.siteMapName} type="text" className="contents__container__input--text width480 setHeight" /></div>
                            </div>
                        </div>

                        <div className="contents__container__box mb20">
                            <div className="contents__container__theader">
                                <div className="contents__container__th contents__container__td__toggle">表示</div>
                                <div className="contents__container__th contents__container__td__komoku">項目</div>
                                <div className="contents__container__th">内容</div>
                            </div>
                            <div className="contents__container__tr">
                                <div className="contents__container__td contents__container__td__toggle">
                                    <Toggle checked={this.state.site.organize_parts.address_display_setting} onChange={this.handleToggleShowAddress} />
                                </div>
                                <div className="contents__container__td contents__container__td__komoku">住所</div>
                                <div className="contents__container__td">{store_info.store_address}</div>
                                <div className="contents__container__td contents__container__td__btn_edit"><button className="btn_edit"><Link to={editStoreLink}>{"編集"}</Link></button></div>
                            </div>

                            <div className="contents__container__tr">
                                <div className="contents__container__td contents__container__td__toggle">
                                    <Toggle checked={this.state.site.organize_parts.access_display_setting} onChange={this.handleToggleShowAccess} />
                                </div>
                                <div className="contents__container__td contents__container__td__komoku">アクセス</div>
                                <div className="contents__container__td">{store_info.store_access}</div>
                                <div className="contents__container__td contents__container__td__btn_edit"><button className="btn_edit"><Link to={editStoreLink}>{"編集"}</Link></button></div>
                            </div>

                            <div className="contents__container__tr">
                                <div className="contents__container__td contents__container__td__toggle">
                                    <Toggle checked={this.state.site.organize_parts.phone_display_setting} onChange={this.handleToggleShowPhoneNumber} />
                                </div>
                                <div className="contents__container__td contents__container__td__komoku">電話番号</div>
                                <div className="contents__container__td">{store_info.store_phone_no}</div>
                                <div className="contents__container__td contents__container__td__btn_edit"><button className="btn_edit"><Link to={editStoreLink}>{"編集"}</Link></button></div>
                            </div>

                            <div className="contents__container__tr">
                                <div className="contents__container__td contents__container__td__toggle">
                                    <Toggle checked={this.state.site.organize_parts.business_hours_display_setting} onChange={this.handleToggleShowBusinessHours} />
                                </div>
                                <div className="contents__container__td contents__container__td__komoku">営業時間</div>
                                <div className="contents__container__td">{store_info.store_business_hours_from}<br />{store_info.store_business_hours_to}</div>
                                <div className="contents__container__td contents__container__td__btn_edit"><button className="btn_edit"><Link to={editStoreLink}>{"編集"}</Link></button></div>
                            </div>

                            <div className="contents__container__tr">
                                <div className="contents__container__td contents__container__td__toggle">
                                    <Toggle checked={this.state.site.organize_parts.regular_holiday_display_setting} onChange={this.handleToggleShowRegularHoliday} />
                                </div>
                                <div className="contents__container__td contents__container__td__komoku">定休日</div>
                                <div className="contents__container__td">{store_info.store_regular_holiday}</div>
                                <div className="contents__container__td contents__container__td__btn_edit"><button className="btn_edit"><Link to={editStoreLink}>{"編集"}</Link></button></div>
                            </div>

                            <div className="contents__container__box">
                                <div className="contents__container__dl clearfix">
                                    <div className="contents__container__dt">リード文</div>
                                    <div className="contents__container__dd"><textarea value={this.state.site.organize_parts.free_text} onChange={this.handleFreeInput} className="contents__container__textarea width520"></textarea></div>
                                </div>
                                <div className="contents__container__dl clearfix">
                                    <div className="contents__container__dt">画像挿入</div>
                                    <div className="contents__container__dd lineR width__half">
                                        <div className="contents__container__logo-container mb10">
                                            <div className="contents__container__image-btn">
                                                <a className="contents__container__input-button" onClick={() => {this.setState({showSelectPicture: 'LEFT'})}}>左側の画像を選択</a>
                                            </div>
                                            {<div className="contents__container__image-name">{this.state.site.organize_parts.left_picture_name}</div>}
                                            {this.state.site.organize_parts.left_picture_id ? <div className="contents__container__del-btn"><img src="../assets/img/img-dell.png" onClick={this.onDeletePictureLeft} alt="削除" height="20" width="20" /></div> : null}
                                        </div>
                                        <div className="contents__container__logo-image80 mb10"><img src={this.state.site.sitemap_picture_url_left} width="80" height="80" /></div>
                                    </div>
                                    <div className="contents__container__dd width__half">
                                        <div className="contents__container__logo-container mb10">
                                            <div className="contents__container__image-btn">
                                                <a className="contents__container__input-button" onClick={() => {this.setState({showSelectPicture: 'RIGHT'})}}>右側の画像を選択</a>
                                            </div>
                                            {<div className="contents__container__image-name">{this.state.site.organize_parts.right_picture_name}</div>}
                                            {this.state.site.organize_parts.right_picture_id ? <div className="contents__container__del-btn"><img src="../assets/img/img-dell.png" onClick={this.onDeletePictureRight} alt="削除" height="20" width="20" /></div> : null}
                                        </div>
                                        <div className="contents__container__logo-image80 mb10"><img src={this.state.site.sitemap_picture_url_right} width="80" height="80" /></div>
                                    </div>
                                </div>
                            </div>

                            <div className="contents__container__dl clearfix">
                                <div className="contents__container__dt">お知らせ表示設定</div>
                                <div className="contents__container__dd">
                                    <RadioButton id={"display_" + 0}  label={"表示する"} radioName="radio_config_data" value="0" check={this.handleShowSettingStatus} isChecked={this.state.site.organize_parts.info_display_setting == 0} classRadio="contents__container__radio mr15" />
                                    <div className="contents__container__number">表示件数<input type="number" value={this.state.site.organize_parts.info_display_setting == 1 ? 0 : this.state.site.organize_parts.info_display_number} onChange={this.handleDisplayNumber} className="contents__container__input--text input_number setHeight" max="5" disabled={this.state.site.organize_parts.info_display_setting == 1 ? true : false} />件</div>
                                    <RadioButton id={"display_" + 1}  label={"表示しない"} radioName="radio_config_data"  value="1" check={this.handleShowSettingStatus} isChecked={this.state.site.organize_parts.info_display_setting == 1} classRadio="contents__container__radio mr15" />
                                </div>
                            </div>
                            { <ItemList items={this.state.itemList}
                                                    btnText="プルダウンの追加"
                                                    addItem={this.addNewITem}
                                                    deleteItem={this.deleteItem}
                                                    onSortEnd={this.onSortEnd}
                                                    isCheckedStatus={this.state.site.organize_parts.info_display_setting}
                                                    content={this.state.site.organize_parts.content}
                                                    onChangeTitleItem={this.onChangeTitleItem}
                                                    onChangeBodyItem={this.onChangeBodyItem}
                                />

                            }
                        </div>
                        <div><input type="submit" className="btn-base contents__btn--save" value="登録" /></div>
                    </div>
                </div>
            </form>
            </div>
        )
    }
}

export default SiteConfigForm;
