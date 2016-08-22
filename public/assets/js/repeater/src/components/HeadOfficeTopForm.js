import React, { Component, PropTypes } from 'react';
import { fetchSiteFreeStore , updateSiteStoreFree ,fetchSiteFreeStoreUrl} from '../actions/site'
import { showNotification } from '../actions/notification';
import Notification from '../components/commons/Notification';
import { hideNotification } from '../actions/notification';
import {arrayMove} from 'react-sortable-hoc';
import MainImage from './headofficetop/MainImage';
import Content from './headofficetop/Content';
import LinkModal from './headofficetop/LinkModal';
import SelectPicture from '../components/SelectPicture'
import * as Const from '../constants/Constants';
var organizePartsDefaultValue =  {"main_pictures" : [{id:"",link:"", filename: "", url: ""}],
    "free_text":"",
    "info_display_setting": 1,
    "info_display_number" : 5 ,
    "contents":[{title:"",text:"",id: "",link: "", filename: "", url: ""}],
    "banner_picture": {id: "",link:"", filename: "", url: ""}};

class HeadOfficeTopForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headofficetop : props.headofficetop == null || Object.keys(props.headofficetop).length <= 0 ? {
                brand_id: props.params.brandId,
                store_id: 0,
                organize_type: 1,
                page_type : Const.PAGE_TYPE_HOME_TOP,
                parents_site_type : 1,
                free_input: "example",
                memo: "example",
                sitemap_name : "",
                title_picture_id: 1,
                site_hierarchy: 1,
                display_flg:1,
                display_order:1,
                parents_site_id: 1,
                sitemap_url: "example",
                organize_parts:organizePartsDefaultValue,
            } : props.headofficetop,
            sitemap_url : props.sitemap_url == null || Object.keys(props.sitemap_url).length <= 0 ? [{
                            sitemap_name:"",
                            sitemap_url: ""
                        }] : props.sitemap_url,
            sitemap_url_filter: {
                page:1,
                per_page: Const.PER_PAGE,
                pattern : Const.GET_ALL_PATTERN
            },
            error : props.error == null ? 0 : props.error,
            sitemap_count : props.count == null ? 0 : props.count,
            isOpenModal: false,
            tempLink : "",
            modalTemp : {
                type : "",
                item : {},
                index : 0
            },
            showSelectMainPicture: props.headofficetop != null && Object.keys(props.headofficetop).length > 0 ? props.headofficetop.organize_parts.main_pictures.map((picture) => picture.id ? true : false) : [false],
            showSelectContentPicture: props.headofficetop != null && Object.keys(props.headofficetop).length > 0 ? props.headofficetop.organize_parts.contents.map((picture) => picture.id ? true : false) : [false],
            isShowSelectBannerPicture: props.headofficetop != null && Object.keys(props.headofficetop).length > 0 && props.headofficetop.organize_parts.banner_picture.id
        };

        this.onChangeSiteMapName = this.onChangeSiteMapName.bind(this);
        this.onSortEndMainImage = this.onSortEndMainImage.bind(this);
        this.onSortEndContent = this.onSortEndContent.bind(this);
        this.addMainImage = this.addMainImage.bind(this);
        this.addContent = this.addContent.bind(this);
        this.deleteMainImage = this.deleteMainImage.bind(this);
        this.deleteContent = this.deleteContent.bind(this);
        this.onDeleteMainImagePicture = this.onDeleteMainImagePicture.bind(this);
        this.onSelectMainImagePicture = this.onSelectMainImagePicture.bind(this);
        this.onSelectBannerPicture = this.onSelectBannerPicture.bind(this);
        this.onChangeDisplayResult = this.onChangeDisplayResult.bind(this);
        this.onDisplaySettingOn = this.onDisplaySettingOn.bind(this);
        this.onDisplaySettingOff = this.onDisplaySettingOff.bind(this);
        this.onChangeFreeText = this.onChangeFreeText.bind(this);
        this.onChangeContentTitle = this.onChangeContentTitle.bind(this);
        this.onChangeContentText = this.onChangeContentText.bind(this);
        this.onSelectContentPicture = this.onSelectContentPicture.bind(this);
        this.onDeleteContentPicture = this.onDeleteContentPicture.bind(this);
        this.onDeleteBannerPicture = this.onDeleteBannerPicture.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.setMainImageLink = this.setMainImageLink.bind(this);
        this.setContentLink = this.setContentLink.bind(this);
        this.setModalLink = this.setModalLink.bind(this);
        this.setBannerLink = this.setBannerLink.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        const { headofficetop } = this.state;
        let fiterParam = {...headofficetop, pattern : Const.GET_ALL_PATTERN};
        dispatch(fetchSiteFreeStore(this.props.params.brandId, this.props.params.storeId, fiterParam));
        dispatch(fetchSiteFreeStoreUrl(this.props.params.brandId,this.state.sitemap_url_filter));
        dispatch(hideNotification(this.props.route.path));
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch(hideNotification(this.props.route.path));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.headofficetop != this.props.headofficetop && nextProps.headofficetop != null) {
            var nxtheadofficetop = nextProps.headofficetop;
            if(nxtheadofficetop.organize_parts == null) nxtheadofficetop.organize_parts = organizePartsDefaultValue;

            this.setState({
                headofficetop: nxtheadofficetop,
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

    handlePageClick(data) {
        const { dispatch } = this.props;
        let page = data.selected + 1;
        let sitemap_url_filter = Object.assign({}, this.state.sitemap_url_filter, {page:page});
        dispatch(fetchSiteFreeStoreUrl(this.props.params.brandId,sitemap_url_filter));
        this.setState({sitemap_url_filter:sitemap_url_filter});
    }


    onSubmit(e) {
        e.preventDefault();
        const { dispatch} = this.props;
        let {headofficetop,error} = this.state;
        if(Object.keys(error).length === 0) {
            if (this.state.headofficetop.sitemap_name == '' || this.state.headofficetop.sitemap_name == null || this.state.headofficetop.sitemap_name.length < 0) {
                alert("サイトマップ名称必須");
            }
            else {
                let organize_parts = headofficetop.organize_parts;
                let info_display_setting = organize_parts.info_display_setting;
                let newCharCount = organize_parts.info_display_number;
                if(info_display_setting == 0) {
                    newCharCount = 0;
                }
                let newOrganize_parts = {...organize_parts, info_display_number: newCharCount};
                let newItems = {...headofficetop,organize_parts: newOrganize_parts};
                dispatch(updateSiteStoreFree(newItems, this.props.history,
                    (err) => {
                        this.showNotification(err, false);
                    },
                    (res) => {
                        this.showNotification("ブランドトップページが設定されました。");
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


    onSortEndMainImage({oldIndex, newIndex}){
        let {headofficetop} = this.state;
        let organize_parts = headofficetop.organize_parts;
        let main_pictures = headofficetop.organize_parts.main_pictures;
        let newImage = [...arrayMove(main_pictures, oldIndex, newIndex)];
        let newOrganize_parts = {...organize_parts, main_pictures:newImage};
        let newItems = {...headofficetop,organize_parts: newOrganize_parts};
        this.setState({
            headofficetop: newItems
        });
    }

    onSortEndContent({oldIndex, newIndex}){
        let {headofficetop} = this.state;
        let organize_parts = headofficetop.organize_parts;
        let contents = headofficetop.organize_parts.contents;
        let newContent = [...arrayMove(contents, oldIndex, newIndex)];
        let newOrganize_parts = {...organize_parts, contents:newContent};
        let newItems = {...headofficetop,organize_parts: newOrganize_parts};
        this.setState({
            headofficetop: newItems
        });
    }

    addMainImage() {
        let {headofficetop} = this.state;
        let organize_parts = headofficetop.organize_parts;
        let main_pictures = headofficetop.organize_parts.main_pictures;
        let newImage = {id: "", link : "リンク先が選択されていません"};
        let newOrganize_parts = {...organize_parts, main_pictures:[...main_pictures,newImage]};
        let newItems = {...headofficetop,organize_parts: newOrganize_parts};
        this.setState({
            headofficetop: newItems
        });
    }

    addContent() {
        let {headofficetop} = this.state;
        let organize_parts = headofficetop.organize_parts;
        let contents = headofficetop.organize_parts.contents;
        let newContent = {title:"",text:"",id: "", link : "リンク先が選択されていません"};
        let newOrganize_parts = {...organize_parts, contents:[...contents,newContent]};
        let newItems = {...headofficetop,organize_parts: newOrganize_parts};
        this.setState({
            headofficetop: newItems
        });
    }

    deleteMainImage(index) {
        let {headofficetop} = this.state;
        let organize_parts = headofficetop.organize_parts;
        let main_pictures = headofficetop.organize_parts.main_pictures;
        let newOrganize_parts = {...organize_parts, main_pictures:[...main_pictures.slice(0,index),...main_pictures.slice(index+1)]};
        let newItems = {...headofficetop,organize_parts: newOrganize_parts};
        this.setState({
            headofficetop: newItems
        });
    }

    deleteContent(index) {
        let {headofficetop} = this.state;
        let organize_parts = headofficetop.organize_parts;
        let contents = headofficetop.organize_parts.contents;
        let newOrganize_parts = {...organize_parts, contents:[...contents.slice(0, index),...contents.slice(index+1)]};
        let newItems = {...headofficetop,organize_parts: newOrganize_parts};
        this.setState({
            headofficetop: newItems
        });
    }

    onSelectMainImagePicture(index) {
        this.setState({showSelectMainPicture: [...this.state.showSelectMainPicture.slice(0, index), true, ...this.state.showSelectMainPicture.slice(index+1)]});
    }

    onSelectContentPicture(index) {
        this.setState({showSelectContentPicture: [...this.state.showSelectContentPicture.slice(0, index), true, ...this.state.showSelectContentPicture.slice(index+1)]});
    }

    onSelectBannerPicture() {
        this.setState({isShowSelectBannerPicture: true});
    }

    onDeleteMainImagePicture(image, index) {
        let {headofficetop} = this.state;
        let organize_parts = headofficetop.organize_parts;
        let main_pictures = headofficetop.organize_parts.main_pictures;
        let newImage = {...image,id: "", filename: "", url: ""};
        let newOrganize_parts = {...organize_parts, main_pictures: [...main_pictures.slice(0,index),newImage,...main_pictures.slice(index+1)]};
        let newItems = {...headofficetop,organize_parts: newOrganize_parts};
        this.setState({
            headofficetop: newItems
        });
    }

    onDeleteBannerPicture() {
        let {headofficetop} = this.state;
        let organize_parts = headofficetop.organize_parts;
        let banner_picture = headofficetop.organize_parts.banner_picture;
        let newBanner = {...banner_picture,id:"", filename: "", url: ""};
        let newOrganize_parts = {...organize_parts, banner_picture: newBanner};
        let newItems = {...headofficetop,organize_parts: newOrganize_parts};
        this.setState({
            headofficetop: newItems
        });
    }

    onDeleteContentPicture(content, index) {
        let {headofficetop} = this.state;
        let organize_parts = headofficetop.organize_parts;
        let contents = headofficetop.organize_parts.contents;
        let newContent = {...content, id:"", filename: "", url: ""};
        let newOrganize_parts = {...organize_parts, contents: [...contents.slice(0,index),newContent,...contents.slice(index+1)]};
        let newItems = {...headofficetop,organize_parts: newOrganize_parts};
        this.setState({
            headofficetop: newItems
        });
    }

    onChangeSiteMapName(e) {
        let {headofficetop} = this.state;
        let newSiteMapName = e.target.value;
        let newItems = {...headofficetop, sitemap_name: newSiteMapName};
        this.setState({
            headofficetop : newItems
        });
    }

    onChangeDisplayResult(e) {
        let {headofficetop} = this.state;
        let organize_parts = headofficetop.organize_parts;
        let newOrganize_parts = {...organize_parts, info_display_number:e.target.value};
        let newItems = {...headofficetop,organize_parts: newOrganize_parts};
        this.setState({
            headofficetop : newItems
        });
    }

    onDisplaySettingOn() {
        let {headofficetop} = this.state;
        let organize_parts = headofficetop.organize_parts;
        let newOrganize_parts = {...organize_parts, info_display_setting:1};
        let newItems = {...headofficetop,organize_parts: newOrganize_parts};
        this.setState({
            headofficetop : newItems
        });
    }

    onDisplaySettingOff() {
        let {headofficetop} = this.state;
        let organize_parts = headofficetop.organize_parts;
        let newOrganize_parts = {...organize_parts, info_display_setting:0};
        let newItems = {...headofficetop,organize_parts: newOrganize_parts};
        this.setState({
            headofficetop : newItems
        });
    }

     onChangeFreeText(e) {
        let {headofficetop} = this.state;
        let organize_parts = headofficetop.organize_parts;
        let newOrganize_parts = {...organize_parts, free_text: e.target.value};
        let newItems = {...headofficetop,organize_parts: newOrganize_parts};
        this.setState({
            headofficetop : newItems
        });
     }

    onChangeContentTitle(content,index,e) {
        let {headofficetop} = this.state;
        let organize_parts = headofficetop.organize_parts;
        let contents = headofficetop.organize_parts.contents;
        let newContent = {...content,title : e.target.value};
        let newOrganize_parts = {...organize_parts, contents: [...contents.slice(0,index),newContent,...contents.slice(index+1)]};
        let newItems = {...headofficetop,organize_parts: newOrganize_parts};
        this.setState({
            headofficetop : newItems
        });
    }

    onChangeContentText(content,index,e) {
        let {headofficetop} = this.state;
        let organize_parts = headofficetop.organize_parts;
        let contents = headofficetop.organize_parts.contents;
        let newContent = {...content,text : e.target.value};
        let newOrganize_parts = {...organize_parts, contents: [...contents.slice(0,index),newContent,...contents.slice(index+1)]};
        let newItems = {...headofficetop,organize_parts: newOrganize_parts};
        this.setState({
            headofficetop : newItems
        });
    }

    openModal(type,item,index) {
        const {modalTemp} = this.state;
        let newModal = {...modalTemp,type : type, item : item, index : index};
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

    setMainImageLink(image,index,link) {
        let {headofficetop} = this.state;
        let organize_parts = headofficetop.organize_parts;
        let main_pictures = headofficetop.organize_parts.main_pictures;
        let newImage = {...image,link : link};
        let newOrganize_parts = {...organize_parts, main_pictures: [...main_pictures.slice(0,index),newImage,...main_pictures.slice(index+1)]};
        let newItems = {...headofficetop,organize_parts: newOrganize_parts};
        this.setState({
            headofficetop: newItems
        });
    }

    setContentLink(content,index,link) {
        let {headofficetop} = this.state;
        let organize_parts = headofficetop.organize_parts;
        let contents = headofficetop.organize_parts.contents;
        let newContent = {...content,link : link};
        let newOrganize_parts = {...organize_parts, contents: [...contents.slice(0,index),newContent,...contents.slice(index+1)]};
        let newItems = {...headofficetop,organize_parts: newOrganize_parts};
        this.setState({
            headofficetop: newItems
        });
    }

    setBannerLink(link) {
        let {headofficetop} = this.state;
        let organize_parts = headofficetop.organize_parts;
        let banner_picture = headofficetop.organize_parts.banner_picture;
        let newBanner = {...banner_picture,link : link};
        let newOrganize_parts = {...organize_parts, banner_picture:newBanner};
        let newItems = {...headofficetop, organize_parts: newOrganize_parts};
        this.setState({
            headofficetop: newItems
        });
    }

    setModalLink(tempLink) {
        this.setState({
            tempLink: tempLink
        });
    }

    closeSelectPictureModal() {
        this.setState({
            showSelectMainPicture: this.state.showSelectMainPicture.map(() => false),
            showSelectContentPicture: this.state.showSelectContentPicture.map(() => false),
            isShowSelectBannerPicture: false
        });
    }

    onSelectPicture(pictureInfo) {
        let { headofficetop, isShowSelectBannerPicture } = this.state;
        let organize_parts = headofficetop.organize_parts;
        let index = this.state.showSelectMainPicture.indexOf(true);
        if (index >= 0) {
            let mainPicture = organize_parts.main_pictures[index];
            mainPicture.id = pictureInfo.id;
            mainPicture.filename = pictureInfo.filename;
            mainPicture.url =pictureInfo.url;
            organize_parts.main_pictures = [...organize_parts.main_pictures.slice(0, index), mainPicture, ...organize_parts.main_pictures.slice(index + 1)];
            this.setState({headofficetop: {...headofficetop}});
            return;
        }
        index = this.state.showSelectContentPicture.indexOf(true);
        if (index >= 0) {
            let contentPicture = organize_parts.contents[index];
            contentPicture.id = pictureInfo.id;
            contentPicture.filename = pictureInfo.filename;
            contentPicture.url = pictureInfo.url;
            organize_parts.contents = [...organize_parts.contents.slice(0, index), contentPicture, ...organize_parts.contents.slice(index + 1)];
            this.setState({headofficetop: {...headofficetop}});
            return;
        }
        if (isShowSelectBannerPicture) {
            let banner_picture = organize_parts.banner_picture;
            banner_picture.id = pictureInfo.id;
            banner_picture.filename = pictureInfo.filename;
            banner_picture.url = pictureInfo.url;
        }
    }

    render() {
        const {organize_parts} = this.state.headofficetop;
        const { showSelectMainPicture, showSelectContentPicture, isShowSelectBannerPicture } = this.state;
        return (
            <div>
                <SelectPicture
                    isOpen={showSelectMainPicture.indexOf(true) >= 0 || showSelectContentPicture.indexOf(true) >= 0 || isShowSelectBannerPicture}
                    title={Globalize.localize('random_coupon_select_picture_title', Globalize.culture())}
                    closeDialog={() => {this.closeSelectPictureModal()}}
                    onSelectedPicture={(pictureInfo) => this.onSelectPicture(pictureInfo)}/>
            <Notification path={this.props.route.path}/>
            <form acceptCharset="utf-8" onSubmit={this.onSubmit.bind(this)} autoComplete="off">

                <LinkModal isOpen={this.state.isOpenModal} closeModal={this.closeModal}
                setMainImageLink={this.setMainImageLink} modalTemp={this.state.modalTemp}
                setModalLink={this.setModalLink} setContentLink={this.setContentLink}
                tempLink={this.state.tempLink} setBannerLink={this.setBannerLink}
                sitemap_url={this.state.sitemap_url} sitemap_count={this.state.sitemap_count}
                sitemap_url_filter={this.state.sitemap_url_filter} handlePageClick={this.handlePageClick}
                />

                <div className="contents__container">
                    <div className="contents__h2 contents__icon--smartphone"><span className="contents__container__h2--note">{Globalize.localize('home_top_title_smartphone', Globalize.culture())}</span></div>
                    <div className="contents__container__content">
                        <div className="contents__container__box mb20">
                            <div className="contents__container__dl clearfix">
                                <div className="contents__container__dt">{Globalize.localize('site_map_name', Globalize.culture())}</div>
                                <div className="contents__container__dd">
                                    <input type="text" className="contents__container__input--text width480" onChange={this.onChangeSiteMapName} value={this.state.headofficetop.sitemap_name} />
                                </div>
                            </div>

                            <MainImage items={organize_parts.main_pictures}
                                       onSortEnd={this.onSortEndMainImage}
                                       deleteItem={this.deleteMainImage}
                                       openModal={this.openModal}
                                       useDragHandle={true}
                                       onDeleteMainImagePicture={this.onDeleteMainImagePicture}
                                       onSelectMainImagePicture={this.onSelectMainImagePicture}/>
                            <div className="contents__container__dl clearfix">
                                <div className="contents__container__dd text-center">
                                    <input type="button" value={Globalize.localize('b_main_add', Globalize.culture())} className="contents__container__input-button btn_add" onClick={this.addMainImage}/>
                                </div>
                            </div>
                            <div className="contents__container__dl clearfix">
                                <div className="contents__container__dt">{Globalize.localize('l_lead_text', Globalize.culture())}</div>
                                <div className="contents__container__dd">
                                    <textarea className="contents__container__textarea width-full height160" placeholder="HTMLエディタ" onChange={this.onChangeFreeText} value={organize_parts.free_text}></textarea>
                                </div>
                            </div>
                            <div className="contents__container__dl clearfix">
                                <div className="contents__container__dt v__middle">{Globalize.localize('l_notice_display_setting', Globalize.culture())}</div>
                                <div className="contents__container__dd">
                                    <label className="contents__container__radio mr15">
                                        <input type="radio" name="noteDisplaySetting" value="1" checked={organize_parts.info_display_setting == 1} onChange={this.onDisplaySettingOn} className="input__radio" />
                                        <span className="btn_label">{Globalize.localize('l_display_on', Globalize.culture())}</span>
                                    </label>
                                    <div className="contents__container__number">{Globalize.localize('l_display_number', Globalize.culture())}
                                        <input type="number" value={organize_parts.info_display_number}  onChange={this.onChangeDisplayResult} disabled={organize_parts.info_display_setting == 0} className="contents__container__input--text input_number"/>件
                                    </div>
                                    <label className="contents__container__radio mr15">
                                        <input type="radio" name="noteDisplaySetting" value="0" checked={organize_parts.info_display_setting == 0} onChange={this.onDisplaySettingOff} className="input__radio" />
                                        <span className="btn_label">{Globalize.localize('l_display_off', Globalize.culture())}</span>
                                    </label>
                                </div>
                            </div>
                            <Content items={organize_parts.contents}
                                     onSortEnd={this.onSortEndContent}
                                     deleteItem={this.deleteContent}
                                     onChangeContentTitle={this.onChangeContentTitle}
                                     onChangeContentText={this.onChangeContentText}
                                     openModal={this.openModal}
                                     useDragHandle={true}
                                     onSelectContentPicture={this.onSelectContentPicture}
                                     onDeleteContentPicture={this.onDeleteContentPicture}/>
                            <div className="contents__container__dl clearfix">
                                <div className="contents__container__dd text-center">
                                    <input type="button" value={Globalize.localize('b_content_add', Globalize.culture())} className="contents__container__input-button btn_add" onClick={this.addContent}/>
                                </div>
                            </div>
                            <div className="contents__container__dl clearfix">
                                <div className="contents__container__dt">{Globalize.localize('l_banner_setting', Globalize.culture())}</div>
                                <div className="contents__container__dd__inner">
                                    <div className="contents__container__dl__inner clearfix">
                                        <div className="contents__container__dt__inner">{Globalize.localize('l_image', Globalize.culture())}</div>
                                        <div className="contents__container__dd__inner">
                                            <div className="contents__container__logo-contaner mb10 mt10">
                                                <div className="contents__container__image-btn"><input type="button" value={Globalize.localize('l_image_selection', Globalize.culture())} className="contents__container__input-button" onClick={this.onSelectBannerPicture} /></div>
                                                <div className="contents__container__image-name">{organize_parts.banner_picture.filename}</div>
                                                {organize_parts.banner_picture.id > 0 ? <div className="contents__container__del-btn"><img src="/assets/img/img-dell.png" onClick={this.onDeleteBannerPicture} /></div> : ""}
                                            </div>
                                            <div className="contents__container__logo mb10">
                                                <img src={organize_parts.banner_picture.url} className="preview_image"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="contents__container__dl__inner clearfix">
                                        <div className="contents__container__dt__inner v__middle">{Globalize.localize('l_link_destination', Globalize.culture())}</div>
                                        <div className="contents__container__dd__inner">{ (organize_parts.banner_picture.link != "") ? organize_parts.banner_picture.link : Globalize.localize('l_link_destination_tobe_not_selected', Globalize.culture())}</div>
                                        <div className="contents__container__dd contents__container__td__btn_edit">
                                            <input type="button" value={Globalize.localize('l_selection', Globalize.culture())} className="btn_edit" onClick={() =>  {this.openModal("BANNER")}} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="widget__page__input__bottom" >
                            <input type="submit" onSubmit={this.onSubmit} className="btn-base" value={Globalize.localize('b_register', Globalize.culture())} />
                        </div>
                    </div>
                </div>
                {/* end site header form */}
            </form>
            </div>
        )
    }
}

export default HeadOfficeTopForm;
