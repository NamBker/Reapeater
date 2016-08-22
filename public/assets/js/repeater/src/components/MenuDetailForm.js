import React, { Component, PropTypes } from 'react';
import Notification from '../components/commons/Notification';
import {arrayMove} from 'react-sortable-hoc';
import MenuItem from './menudetail/MenuItem';
import * as Const from '../constants/Constants';
import SelectPicture from '../components/SelectPicture'
var organizePartsDefaultValue =   {"free_text":"",
    "menu_items" : [
        {item_name:"",price: "", description: "", picture_id: "", picture_name: "", picture_url: ""},
        {item_name:"",price: "", description: "", picture_id: "", picture_name: "", picture_url: ""}
        ],"menu_display" : 0 };

class MenuDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            site : props.site == null || Object.keys(props.site).length <= 0 ? {
                brand_id: props.params.brandId,
                store_id: props.params.storeId,
                site_id: props.params.siteId,
                organize_type: 1,
                page_type : Const.PAGE_TYPE_MENU_DETAIL,
                parents_site_type : 1,
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
            showSelectPicture: props.site != null && Object.keys(props.site).length > 0 ? props.site.organize_parts.menu_items.map((menu) => menu.picture_id ? true : false) : [false]
        };

        this.onChangeSiteMapName = this.onChangeSiteMapName.bind(this);
        this.onSortEnd = this.onSortEnd.bind(this);
        this.addMenuItem = this.addMenuItem.bind(this);
        this.deleteMenuItem = this.deleteMenuItem.bind(this);
        this.onMenuDisplayOn = this.onMenuDisplayOn.bind(this);
        this.onMenuDisplayOff = this.onMenuDisplayOff.bind(this);
        this.onChangeFreeText = this.onChangeFreeText.bind(this);
        this.onChangeMenuItemName = this.onChangeMenuItemName.bind(this);
        this.onChangeMenuItemPrice = this.onChangeMenuItemPrice.bind(this);
        this.onDeleteMenuItemPicture = this.onDeleteMenuItemPicture.bind(this);
        this.onChangeMenuItemDescription = this.onChangeMenuItemDescription.bind(this);
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
        const {siteAction} = this.props
        if(Object.keys(error).length === 0) {
            if (site.sitemap_name == '' || site.sitemap_name == null || site.sitemap_name.length < 0) {
                alert("メニュー名は必須");
            }
            else {
                siteAction.updateSiteStoreFree(site, this.props.history,
                    (err) => {
                        this.showNotification(err, false);
                    },
                    (res) => {
                        this.showNotification("新規メニューが作成されました。");
                    }
                );
            }
        }
        else {
            alert(error);
        }
    }

    showNotification(message, isSuccess = true) {
        const {notificationAction} = this.props;
        notificationAction.showNotification(this.props.route.path, message, isSuccess);
    }


    onSortEnd({oldIndex, newIndex}){
        let {site} = this.state;
        let organize_parts = site.organize_parts;
        let menu_items = site.organize_parts.menu_items;
        let newMenu = [...arrayMove(menu_items, oldIndex, newIndex)];
        let newOrganize_parts = {...organize_parts, menu_items:newMenu};
        let newItems = {...site,organize_parts: newOrganize_parts};
        this.setState({
            site: newItems
        });
    }

    addMenuItem() {
        let {site} = this.state;
        let organize_parts = site.organize_parts;
        let menu_items = site.organize_parts.menu_items;
        let newMenu = {item_name:"",price: "", description: "", picture_id: ""};
        let newOrganize_parts = {...organize_parts, menu_items:[...menu_items,newMenu]};
        let newItems = {...site,organize_parts: newOrganize_parts};
        this.setState({
            site: newItems
        });
    }

    deleteMenuItem(index) {
        let {site} = this.state;
        let organize_parts = site.organize_parts;
        let menu_items = site.organize_parts.menu_items;
        let newOrganize_parts = {...organize_parts, menu_items:[...menu_items.slice(0,index),...menu_items.slice(index+1)]};
        let newItems = {...site,organize_parts: newOrganize_parts};
        this.setState({
            site: newItems
        });
    }

    onDeleteMenuItemPicture(menu,index) {
        let {site} = this.state;
        let organize_parts = site.organize_parts;
        let menu_items = site.organize_parts.menu_items;
        let newMenu = {...menu, picture_id: "", picture_name: "", picture_url: ""};
        let newOrganize_parts = {...organize_parts, menu_items: [...menu_items.slice(0,index),newMenu,...menu_items.slice(index+1)]};
        let newItems = {...site,organize_parts: newOrganize_parts};
        this.setState({
            site: newItems
        });
    }

    onChangeSiteMapName(e) {
        let {site} = this.state;
        let newSiteMapName = e.target.value;
        let newItems = {...site, sitemap_name: newSiteMapName};
        this.setState({
            site : newItems
        });
    }

    onMenuDisplayOn() {
        let {site} = this.state;
        let organize_parts = site.organize_parts;
        let newOrganize_parts = {...organize_parts, menu_display:1};
        let newItems = {...site,organize_parts: newOrganize_parts};
        this.setState({
            site : newItems
        });
    }

    onMenuDisplayOff() {
        let {site} = this.state;
        let organize_parts = site.organize_parts;
        let newOrganize_parts = {...organize_parts, menu_display:0};
        let newItems = {...site,organize_parts: newOrganize_parts};
        this.setState({
            site : newItems
        });
    }

     onChangeFreeText(e) {
        let {site} = this.state;
        let organize_parts = site.organize_parts;
        let newOrganize_parts = {...organize_parts, free_text: e.target.value};
        let newItems = {...site,organize_parts: newOrganize_parts};
        this.setState({
            site : newItems
        });
     }

    onChangeMenuItemName(menu,index,e) {
        let {site} = this.state;
        let organize_parts = site.organize_parts;
        let menu_items = site.organize_parts.menu_items;
        let newMenu = {...menu,item_name : e.target.value};
        let newOrganize_parts = {...organize_parts, menu_items: [...menu_items.slice(0,index),newMenu,...menu_items.slice(index+1)]};
        let newItems = {...site,organize_parts: newOrganize_parts};
        this.setState({
            site : newItems
        });
    }

    onChangeMenuItemPrice(menu,index,e) {
        //let patternNum = /^\d+$/;
        //if(patternNum.test(e.target.value)) {
            let {site} = this.state;
            let organize_parts = site.organize_parts;
            let menu_items = site.organize_parts.menu_items;
            let newMenu = {...menu,price : e.target.value};
            let newOrganize_parts = {...organize_parts, menu_items: [...menu_items.slice(0,index),newMenu,...menu_items.slice(index+1)]};
            let newItems = {...site,organize_parts: newOrganize_parts};
            this.setState({
                site : newItems
            });
        //}
    }

    onChangeMenuItemDescription(menu,index,e) {
        let {site} = this.state;
        let organize_parts = site.organize_parts;
        let menu_items = site.organize_parts.menu_items;
        let newMenu = {...menu,description : e.target.value};
        let newOrganize_parts = {...organize_parts, menu_items: [...menu_items.slice(0,index),newMenu,...menu_items.slice(index+1)]};
        let newItems = {...site,organize_parts: newOrganize_parts};
        this.setState({
            site : newItems
        });
    }

    onSelectPicture(pictureInfo) {
        let index = this.state.showSelectPicture.indexOf(true);
        let { site } = this.state;
        let organize_parts = site.organize_parts;
        let menu_items = site.organize_parts.menu_items;
        let newMenu = menu_items[index];
        newMenu.picture_id = pictureInfo.id;
        newMenu.picture_url = pictureInfo.url;
        newMenu.picture_name = pictureInfo.filename;
        let newOrganize_parts = {...organize_parts, menu_items: [...menu_items.slice(0,index),newMenu,...menu_items.slice(index+1)]};
        let newItems = {...site, organize_parts: newOrganize_parts};
        this.setState({
            site : newItems
        });
    }

    render() {
        const { site, showSelectPicture } = this.state;
        const { organize_parts } = site;
        return (
            <div>
                <SelectPicture
                    isOpen={showSelectPicture.indexOf(true) >= 0}
                    title={Globalize.localize('random_coupon_select_picture_title', Globalize.culture())}
                    closeDialog={() => {this.setState({showSelectPicture: this.state.showSelectPicture.map(() => false)})}}
                    onSelectedPicture={(pictureInfo) => this.onSelectPicture(pictureInfo)}/>
            <Notification path={this.props.route.path}/>
            <form acceptCharset="utf-8" onSubmit={this.onSubmit.bind(this)} autoComplete="off">
                <div className="contents__container">
                    <div className="contents__h2 contents__icon--newadd">
                        <span className="contents__container__h2--note">{Globalize.localize('l_menu_detail_note', Globalize.culture())}</span>
                    </div>
                    <div className="contents__container__content">
                        <div className="contents__container__box mb20">
                            <div className="contents__container__dl clearfix">
                                <div className="contents__container__dt v__middle">{Globalize.localize('l_menu_name', Globalize.culture())}</div>
                                <div className="contents__container__dd">
                                    <input type="text" className="contents__container__input--text width480" onChange={this.onChangeSiteMapName} value={this.state.site.sitemap_name}/>
                                </div>
                            </div>
                            <div className="contents__container__dl clearfix">
                                <div className="contents__container__dt">{Globalize.localize('l_lead_text', Globalize.culture())}</div>
                                <div className="contents__container__dd">
                                    <textarea className="contents__container__textarea width480" onChange={this.onChangeFreeText} value={organize_parts.free_text} ></textarea>
                                </div>
                            </div>
                            <MenuItem items={organize_parts.menu_items}
                                      onSortEnd={this.onSortEnd}
                                      deleteItem={this.deleteMenuItem}
                                      onOpenSelectPicture={
                                          (index) => {
                                              let showSelectPicture = [...this.state.showSelectPicture];
                                              showSelectPicture[index] = true;
                                              this.setState({showSelectPicture});
                                          }
                                      }
                                      useDragHandle={true}
                                      onDeleteMenuItemPicture={this.onDeleteMenuItemPicture}
                                      onChangeMenuItemName={this.onChangeMenuItemName}
                                      onChangeMenuItemPrice={this.onChangeMenuItemPrice}
                                      onChangeMenuItemDescription={this.onChangeMenuItemDescription}/>
                            {organize_parts.menu_items.length < 5 ?
                            <div className="contents__container__dl clearfix">
                                <div className="contents__container__dd text-center">
                                    <input type="button" value={Globalize.localize('b_menu_add', Globalize.culture())} className="contents__container__input-button btn_add" onClick={this.addMenuItem} />
                                </div>
                            </div>
                            : null
                            }
                            <div className="contents__container__dl clearfix">
                                <div className="contents__container__dt v__middle">{Globalize.localize('l_menu_display_list', Globalize.culture())}</div>
                                <div className="contents__container__dd">
                                    <label className="contents__container__radio mr30">
                                        <input type="radio" name="menuDisplay" value="1" checked={organize_parts.menu_display == 1} onChange={this.onMenuDisplayOn} className="input__radio" />
                                        <span className="btn_label">{Globalize.localize('l_menu_detail_display_radio_on', Globalize.culture())}</span>
                                    </label>
                                    <label className="contents__container__radio mr15">
                                        <input type="radio" name="menuDisplay" value="0" checked={organize_parts.menu_display == 0} onChange={this.onMenuDisplayOff} />
                                        <span className="btn_label">{Globalize.localize('l_menu_detail_display_radio_off', Globalize.culture())}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <input type="submit" className="btn-base contents__btn--save" onSubmit={this.onSubmit} value={Globalize.localize('b_register', Globalize.culture())} />
                        </div>
                    </div>
                </div>
            </form>
            </div>
        )
    }
}

export default MenuDetailForm;
