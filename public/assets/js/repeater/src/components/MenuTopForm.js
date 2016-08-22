import React, { Component, PropTypes } from 'react';

import { showNotification } from '../actions/notification';
import Notification from '../components/commons/Notification';
import { hideNotification } from '../actions/notification';
import { arrayMove} from 'react-sortable-hoc';
import MenuList from '../components/menutop/MenuList'
import LinkModal from '../components/menutop/LinkModal'
import SelectPicture from '../components/SelectPicture'
import { fetchSiteFreeStore , updateSiteStoreFree ,fetchSiteFreeStoreUrl, fetchSiteMap} from '../actions/site'
import * as Const from '../constants/Constants'
var organizePartsDefaultValue =   {free_text: "", menu_list: [{id:"", url: "", menu:""}]};

class MenuTopForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            site: props.site == null || Object.keys(props.site).length <= 0 ? {
                brand_id: props.params.brandId,
                store_id: props.params.storeId,
                organize_type: 1,
                page_type: Const.PAGE_TYPE_MENU_TOP,
                free_input: "example",
                memo: "example",
                sitemap_name : "",
                title_picture_id: 1,
                site_hierarchy: 2,
                display_flg:1,
                display_order:0,
                parents_site_id: 1,
                sitemap_url: "example",
                organize_parts:organizePartsDefaultValue,
            } : props.site,
            sitemap_url : props.sitemap_url == null || Object.keys(props.sitemap_url).length <= 0 ? [{
                            sitemap_name:"",
                            sitemap_url: "",
                        }] : props.sitemap_url,
            sitemap_url_filter: {
                page:1,
                per_page: Const.PER_PAGE,
                pattern : Const.GET_ALL_PATTERN,
                page_type: Const.PAGE_TYPE_MENU_DETAIL,
            },
            error : props.error == null ? 0 : props.error,
            sitemap_count : props.count == null ? 0 : props.count,
            isOpenModal : false,
            modalTemp : {
                item: {},
                index: 0
            },
            tempMenu: "",
            showSelectPicture: props.site != null && Object.keys(props.site).length > 0 ? props.site.organize_parts.menu_list.map((menu) => menu.id ? true : false) : [false]
        };
        this.onSortEnd = this.onSortEnd.bind(this);
        this.addNewItem = this.addNewItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.onSelectPicture = this.onSelectPicture.bind(this);
        this.onDeletePicture = this.onDeletePicture.bind(this);
        this.onChangeSiteMapName = this.onChangeSiteMapName.bind(this);
        this.onChangeFreetext = this.onChangeFreetext.bind(this);
        this.showNotification = this.showNotification.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.setModalLink = this.setModalLink.bind(this);
        this.setMenuLink = this.setMenuLink.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        const { site } = this.state;
        let fiterParam = {...site, pattern : Const.GET_ALL_PATTERN};
        dispatch(fetchSiteFreeStore(this.props.params.brandId, this.props.params.storeId, fiterParam));
        dispatch(fetchSiteFreeStoreUrl(this.props.params.brandId,this.state.sitemap_url_filter));
        dispatch(hideNotification(this.props.route.path));

        let params = {pattern: Const.GET_ALL_PATTERN, brand_id: this.props.params.brandId }
        dispatch(fetchSiteMap(params));
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch(hideNotification(this.props.route.path));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.site != this.props.site && nextProps.site != null) {

            var nxtSite = nextProps.site;
            if(nxtSite.organize_parts == null) nxtSite.organize_parts = organizePartsDefaultValue;

            this.setState({
                site: nxtSite,
            });
        }
        if (nextProps.sitemap_url != this.props.sitemap_url && nextProps.sitemap_url != null) {
            this.setState({
                sitemap_url: nextProps.sitemap_url,
            });
        }
        if (nextProps.count != this.props.count && nextProps.count != null) {
            this.setState({
                sitemap_count: nextProps.count,
            });
        }
        if (nextProps.error != this.props.error && nextProps.error != null) {
            this.setState({
                error: nextProps.error,
            });
        }
    }

    onSortEnd({oldIndex, newIndex}) {
        let { site } = this.state;
        let organize_parts = site.organize_parts;
        let menu_list = site.organize_parts.menu_list;
        let newMenu = [...arrayMove(menu_list, oldIndex, newIndex)];
        let newOrganize_parts = {...organize_parts, menu_list:newMenu};
        let newItems = {...site,organize_parts: newOrganize_parts};
        this.setState({
            site : newItems
        });
    }

    addNewItem() {
        let { site, showSelectPicture} = this.state;
        let organize_parts = site.organize_parts;
        let menu_list = site.organize_parts.menu_list;
        let newMenu = {id:"",menu:""};
        let newOrganize_parts = {...organize_parts, menu_list:[...menu_list,newMenu]};
        let newItems = {...site,organize_parts: newOrganize_parts};
        this.setState({
            site : newItems,
            showSelectPicture: [...showSelectPicture, false]
        });
    }

    deleteItem(index) {
        let { site, showSelectPicture} = this.state;
        let organize_parts = site.organize_parts;
        let menu_list = site.organize_parts.menu_list;
        let newOrganize_parts = {...organize_parts, menu_list:[...menu_list.slice(0, index),...menu_list.slice(index+1)]};
        let newItems = {...site,organize_parts: newOrganize_parts};
        this.setState({
            site : newItems,
            showSelectPicture: [showSelectPicture.slice(0, index), showSelectPicture.slice(index + 1)]
        });
    }

    onSubmit(e) {
        e.preventDefault();
        const { dispatch} = this.props;
        let {site,error} = this.state;
        if(Object.keys(error).length === 0) {
            if (site.sitemap_name == '' || site.sitemap_name == null || site.sitemap_name.length < 0) {
                alert("サイトマップ名称必須");
            }
            else {
                dispatch(updateSiteStoreFree(site, this.props.history,
                    (err) => {
                        this.showNotification(err, false);
                    },
                    (res) => {
                        this.showNotification("メニュー一覧が設定されました。");
                    }
                ));
            }
        }
        else {
            alert(error);
        }
    }

    onChangeSiteMapName(e) {
        let {site} = this.state;
        let newSiteMapName = e.target.value;
        let newItems = {...site, sitemap_name: newSiteMapName};
        this.setState({ site : newItems });
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

    onSelectPicture(pictureInfo) {
        let index = this.state.showSelectPicture.indexOf(true);
        let {site} = this.state;
        let organize_parts = site.organize_parts;
        let menu_list = site.organize_parts.menu_list;
        let newMenu = {...pictureInfo};
        let newOrganize_parts = {...organize_parts, menu_list: [...menu_list.slice(0,index),newMenu,...menu_list.slice(index+1)]};
        let newItems = {...site,organize_parts: newOrganize_parts};
        this.setState({
            site : newItems
        });
    }

    onDeletePicture(image, index) {
        let {site} = this.state;
        let organize_parts = site.organize_parts;
        let menu_list = site.organize_parts.menu_list;
        let newMenu = {id : "", url: "", menu: image.menu};
        let newOrganize_parts = {...organize_parts, menu_list:[...menu_list.slice(0,index),newMenu,...menu_list.slice(index+1)]};
        let newItems = {...site,organize_parts: newOrganize_parts};
        this.setState({
            site : newItems
        });
    }

    showNotification(message, isSuccess = true) {
        const { dispatch } = this.props;
        dispatch(showNotification(this.props.route.path, message, isSuccess));
    }

    openModal(item,index) {
        const {modalTemp} = this.state;
        let newModal = {...modalTemp,item : item, index : index};
        this.setState({
            isOpenModal : true,
            modalTemp : newModal,
        });
    }

    closeModal() {
        this.setState({
            isOpenModal : false,
        });
    }

    setModalLink(tempMenu) {
        this.setState({
            tempMenu: tempMenu
        });
    }

    setMenuLink(menulist, index, menu) {
        let {site} = this.state;
        let organize_parts = site.organize_parts;
        let menu_list = site.organize_parts.menu_list;
        let newMenu = {...menulist, menu: menu};
        let newOrganize_parts = {...organize_parts, menu_list:[...menu_list.slice(0,index),newMenu,...menu_list.slice(index+1)]};
        let newItems = {...site, organize_parts: newOrganize_parts};
        this.setState({
            site : newItems
        });
    }

    handlePageClick(data) {
        const { dispatch } = this.props;
        let page = data.selected + 1;
        let sitemap_url_filter = {...this.state.sitemap_url_filter, page: page};
        dispatch(fetchSiteFreeStoreUrl(this.props.params.brandId,sitemap_url_filter));
        this.setState({sitemap_url_filter:sitemap_url_filter});
    }

    render() {
        const { site, showSelectPicture } = this.state;
        return (
            <div>
                <Notification path={this.props.route.path}/>
                <SelectPicture
                    isOpen={showSelectPicture.indexOf(true) >= 0}
                    title={Globalize.localize('random_coupon_select_picture_title', Globalize.culture())}
                    closeDialog={() => {this.setState({showSelectPicture: this.state.showSelectPicture.map(() => false)})}}
                    onSelectedPicture={(pictureInfo) => this.onSelectPicture(pictureInfo)}/>
            <form acceptCharset="utf-8" onSubmit={this.onSubmit.bind(this)} autoComplete="off" target="_top">
                <LinkModal isOpen={this.state.isOpenModal} modalTemp={this.state.modalTemp} tempMenu={this.state.tempMenu}
                closeModal={this.closeModal} setModalLink={this.setModalLink} setMenuLink={this.setMenuLink}
                sitemap_url={this.state.sitemap_url} sitemap_count={this.state.sitemap_count}
                sitemap_url_filter={this.state.sitemap_url_filter} handlePageClick={this.handlePageClick} />
                <div className="contents__container">
                    <div className="contents__h2 contents__icon--smartphone">
                        <span className="contents__container__h2--note">{Globalize.localize('menu_top_title_smartphone', Globalize.culture())}</span>
                    </div>
                    <div className="contents__container__content">
                        <div className="contents__h3">{Globalize.localize('menu_top_title_setup_menu_list', Globalize.culture())}</div>
                        <div className="contents__container__box mb20">
                            <div className="contents__container__dl clearfix">
                                <div className="contents__container__dt v__middle">{Globalize.localize('site_map_name', Globalize.culture())}</div>
                                <div className="contents__container__dd">
                                    <input type="text" className="contents__container__input--text width480" value={site.sitemap_name} onChange={this.onChangeSiteMapName}/>
                                </div>
                            </div>
                            <div className="contents__container__dl clearfix">
                                <div className="contents__container__dt">{Globalize.localize('l_lead_text', Globalize.culture())}</div>
                                <div className="contents__container__dd">
                                    <textarea className="contents__container__textarea width480" value={site.organize_parts.free_text} onChange={this.onChangeFreetext}></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="contents__h3">{Globalize.localize('menu_top_title_menu_list', Globalize.culture())}</div>
                        <div className="contents__container__box">
                            <MenuList items={site.organize_parts.menu_list}
                                      siteMap={this.props.site_map}
                                      onSortEnd={this.onSortEnd}
                                      deleteItem={this.deleteItem}
                                      onDeletePicture={this.onDeletePicture}
                                      useDragHandle={true}
                                      onOpenSelectPicture={(index) => {
                                          let showSelectPicture = [...this.state.showSelectPicture];
                                          showSelectPicture[index] = true;
                                          this.setState({showSelectPicture});
                                      }}
                                      openModal={this.openModal}/>
                            <div className="contents__container__dl clearfix">
                                <div className="contents__container__dd text-center">
                                    <input type="button" value={Globalize.localize('b_content_add', Globalize.culture())} className="contents__container__input-button btn_add" onClick={this.addNewItem}/>
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

export default MenuTopForm;