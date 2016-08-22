import React, { Component, PropTypes } from 'react';
import DatePicker from 'react-datepicker'

import Selection from './commons/Selection'
import DropDownList from  './commons/DropDownList'
import CheckList from  './commons/CheckList'
import Dialog from  './commons/Dialog'
import InputTime from './commons/InputTime'
import Body from '../containers/information/form/Body'
import SelectPicture from '../components/SelectPicture'
import Preview from '../components/information/Preview'

import { fetchInformationInfo } from '../actions/information'

import { eachArea, eachCompany, eachBrand, eachStore } from '../utils/CommonUtils'
import * as Const from '../constants/Constants'

class InformationForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            information: props.information ? props.information :
            {
                publisher_company_id: props.currentUser.authority < Const.USER_AUTHORITY_COMPANY ? 0 : props.currentUser.company_id,
                title: '',
                body: '',
                picture_id: '',
                picture_name: '',
                publisher_brand_ids: props.currentUser.authority < Const.USER_AUTHORITY_BRAND ? [] : [props.currentUser.brand_id],
                publisher_store_ids: [],
                status: 0,
                effective_period_from: null,
                effective_period_to: null,
            },
            file: {},
            fileUrl: !props.isNew && props.information.picture_url ? props.information.picture_url.url : '',
            largeAreaId: '',
            mediumAreaId: '',
            smallAreaId: '',
            dialogTitle: '',
            isOpenDialog: false,
            isShowSelectPicture: false,
            pictureTarget: null,
            isShowPreview: false,
            isNew: props.isNew,
        };
        this.handleEffectivePeriodFromChange = this.handleEffectivePeriodFromChange.bind(this);
        this.handleEffectivePeriodToChange = this.handleEffectivePeriodToChange.bind(this);
        this.handleBodyChange = this.handleBodyChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleCompanyIdChange = this.handleCompanyIdChange.bind(this);
        this.handlePublisherBrandIds = this.handlePublisherBrandIds.bind(this);
        this.handlePublisherStoreIds = this.handlePublisherStoreIds.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.saveInformation = this.saveInformation.bind(this);
        this.onSelectedPicture = this.onSelectedPicture.bind(this);
        this.onCloseSelectPicture = this.onCloseSelectPicture.bind(this);
        this.handleImageSelectClick = this.handleImageSelectClick.bind(this);
        this.handleChangeFromTime = this.handleChangeFromTime.bind(this);
        this.handleChangeToTime = this.handleChangeToTime.bind(this);
        this.onDeletePicture = this.onDeletePicture.bind(this);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        if (!this.state.isNew) {
            dispatch(fetchInformationInfo(this.props.params.informationId))
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.information != undefined) {
            this.setState({
                information: nextProps.information,
                fileUrl: nextProps.information.picture_url ?  nextProps.information.picture_url.url : ''
            });
        } else {
            let { information } = this.state;
            information.publisher_company_id = nextProps.currentUser.authority < Const.USER_AUTHORITY_COMPANY ? 0 : nextProps.currentUser.company_id;
        }
    }

    handleEffectivePeriodFromChange(date) {
        let information = this.state.information;
        information.effective_period_from = date;
        this.setState({
            information: information
        });
    }

    handleEffectivePeriodToChange(date) {
        let information = this.state.information;
        information.effective_period_to = date;
        this.setState({
            information: information
        });
    }

    handleTitleChange(e) {
        let information = this.state.information;
        information.title = e.target.value;
        this.setState({
            information: information
        });
    }

    handleBodyChange(value) {
        let information = this.state.information;
        information.body = value;
        this.setState({
            information: information
        });
    }

    handleCompanyIdChange(e) {
        let information = {...this.state.information};
        information.publisher_company_id = e.target.value;
        information.publisher_brand_ids = [];
        information.publisher_store_ids = [];
        this.setState({
            information: information
        });
    }

    handlePublisherBrandIds(brandIds) {
        let information = this.state.information;
        information.publisher_brand_ids = brandIds;
        information.publisher_store_ids = [];
        this.setState({information: information});
    }

    handlePublisherStoreIds(storeIds) {
        let information = this.state.information;
        information.publisher_store_ids = storeIds;
        this.setState({information: information});
    }

    handleStatusChange(e) {
        let information = this.state.information;
        information.status = e.target.value;
        this.setState({
            information: information
        });
    }

    handleChangeFromTime(e) {
        let information = this.state.information;
        information.effective_period_from.hour(e.target.value.substr(0, 2)).minute(e.target.value.substr(3, 2));
        this.setState({
            information: information
        });
    };

    handleChangeToTime(e) {
        let information = this.state.information;
        information.effective_period_to.hour(e.target.value.substr(0, 2)).minute(e.target.value.substr(3, 2));
        this.setState({
            information: information
        });
    };

    saveInformation() {
        let validateError = [];
        if (!this.state.information.title) {
            validateError.push(Globalize.localize('check_title', Globalize.culture()));
        }
        if (!this.state.information.body) {
            validateError.push(Globalize.localize('check_sentence', Globalize.culture()));
        }
        if (!this.state.information.effective_period_from) {
            validateError.push(Globalize.localize('check_publish_date', Globalize.culture()));
        }
        if (!this.state.information.effective_period_to) {
            validateError.push(Globalize.localize('check_publish_end_date', Globalize.culture()));
        }

        if (validateError.length > 0) {
            alert(validateError.join("\n"));
            return;
        }
        this.props.submitInformation(this.state.information, this.context.router);
        this.setState({isOpenDialog: false});
    }

    onSubmit(e) {
        e.preventDefault();
        let validateError = [];
        if (!this.state.information.title) {
            validateError.push(Globalize.localize('check_title', Globalize.culture()));
        }
        if (!this.state.information.body) {
            validateError.push(Globalize.localize('check_sentence', Globalize.culture()));
        }
        if (!this.state.information.effective_period_from) {
            validateError.push(Globalize.localize('check_publish_date', Globalize.culture()));
        }
        if (!this.state.information.effective_period_to) {
            validateError.push(Globalize.localize('check_publish_end_date', Globalize.culture()));
        }

        if (validateError.length > 0) {
            alert(validateError.join("\n"));
            return;
        }
        this.setState({isShowPreview: true});
        return;
/*        if (this.state.information.status == Const.INFORMATION_STATUS_PUBLIC) {
            this.setState({isOpenDialog: true, dialogTitle: Globalize.localize('check_information_publish', Globalize.culture())});
        } else if(this.state.information.status == Const.INFORMATION_STATUS_NOT_PUBLIC) {
            this.setState({isOpenDialog: true, dialogTitle: Globalize.localize('check_draft', Globalize.culture())});
        } else {
            this.saveInformation();
        }*/
    }

    onSelectedPicture(pictureInfo) {
        if (this.state.pictureTarget) {
            this.state.pictureTarget.onSelectedPicture(pictureInfo);
        } else {
            let { information } = this.state;
            information.picture_id = pictureInfo.id;
            information.picture_name = pictureInfo.filename;
            this.setState({information, fileUrl: pictureInfo.url});
        }
    }

    onDeletePicture() {
        let { information } = this.state;
        information.picture_id = 0;
        information.picture_name = '';
        this.setState({information, fileUrl: ''});
    }

    onCloseSelectPicture() {
        this.setState({isShowSelectPicture: false, pictureTarget: null});
    }

    handleImageSelectClick() {
        this.setState({isShowSelectPicture: true, pictureTarget: null});
    }

    onClickShowSelectPictureFromBody(target) {
        this.setState({isShowSelectPicture: true, pictureTarget: target});
    }

    render() {

        const { currentUser, companies, brands, stores, areas, isNew } = this.props;
        const information = {...this.state.information};
        return (
            <dl className="widget">
                <SelectPicture
                    isOpen={this.state.isShowSelectPicture}
                    title={Globalize.localize('select_picture_title', Globalize.culture())}
                    closeDialog={() => this.onCloseSelectPicture('')}
                    onSelectedPicture={(pictureInfo) => this.onSelectedPicture(pictureInfo)}/>
                <Preview isOpen={this.state.isShowPreview}
                         information={this.state.information}
                         fileUrl={this.state.fileUrl}
                         stores={stores}
                         isNew={isNew}
                         closeModal={() => {this.setState({isShowPreview: false})}}
                         handleSubmitForm={this.saveInformation}/>
                <form acceptCharset="utf-8" onSubmit={this.onSubmit.bind(this)} autoComplete="off">
                    <Dialog isOpen={this.state.isOpenDialog}
                            title={this.state.dialogTitle}
                            content={Globalize.localize('check_before_publish', Globalize.culture())}
                            closeDialog={() => {this.setState({isOpenDialog: false})}}
                            confirmOK={this.saveInformation}/>
                    <dt className="widget__page__input__title">
                        <div className="widget__page__type__create"/>
                        <span>{isNew ? Globalize.localize('information_create_message', Globalize.culture()) : Globalize.localize('information_update_message', Globalize.culture())}</span>
                    </dt>
                    <dd className="widget__contents">
                        <div className="widget__page__information__form">
                            <div className="widget__page__information__form__left mb20">
                                <input type="text" placeholder={Globalize.localize('check_title', Globalize.culture())} value={information.title} onChange={this.handleTitleChange}/>
                                <br/>
                                <label htmlFor="file-upload">
                                    <span onClick={this.handleImageSelectClick}
                                        className="custom-file-upload">{Globalize.localize('filter_add_catch_picture', Globalize.culture())}</span> {this.state.information.picture_name || Globalize.localize('filter_select_file', Globalize.culture())}
                                    {this.state.information.picture_id ? <div className="contents__container__del-btn"><img src="/assets/img/img-dell.png" onClick={this.onDeletePicture}/></div> : null}
                                </label>
                            </div>
                        </div>
                        <div>
                            <Body isNew={this.state.isNew} bodyText={this.state.information.body} onChangeBody={this.handleBodyChange} onSelectPicture={(target) => this.onClickShowSelectPictureFromBody(target)}/>
                        </div>
                        <div className="widget__page__information__select">
                            <dl>
                                <dt>{Globalize.localize('map_company_name', Globalize.culture())}</dt>
                                <dd>{currentUser.authority >= Const.USER_AUTHORITY_COMPANY || !this.state.isNew ? currentUser.company_name :
                                    <DropDownList
                                        data={companies}
                                        defaultValue={this.state.information.publisher_company_id}
                                        hasEmptyOption={true}
                                        onChange={this.handleCompanyIdChange}
                                        eachCallback={eachCompany()}/>}</dd>
                            </dl>
                            <dl className={currentUser.authority < Const.USER_AUTHORITY_BRAND ? "checkbox__row" : ""}>
                                <dt>{Globalize.localize('map_brand_name', Globalize.culture())}</dt>
                                <dd>{currentUser.authority >= Const.USER_AUTHORITY_BRAND ? currentUser.brand_name :
                                    <CheckList
                                        id="information__list__brand__check__list"
                                        data={brands}
                                        checkedItems={information.publisher_brand_ids}
                                        onChangedSelection={this.handlePublisherBrandIds}
                                        dataLabelKey='brand_name'
                                        dataValueKey='id'
                                        isVisibleData={data => {return parseInt(this.state.information.publisher_company_id) === data.company_id}}/>
                                }</dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('filter_publish_store', Globalize.culture())}</dt>
                                <dd>
                                    <Selection
                                        data={stores}
                                        checkCondition={store => this.state.information.publisher_brand_ids.length > 0 && this.state.information.publisher_brand_ids.indexOf(store.brand_id) >= 0}
                                        checkedItems={this.state.information.publisher_store_ids}
                                        nameField="store_name"
                                        hasArea={true}
                                        setCheckItems={(checkItems) => { information.publisher_store_ids = checkItems; this.setState({information});}}
                                        changeItem={this.handlePublisherStoreIds}/>
                                </dd>
                            </dl>
                            <dl>
                                <dt>{Globalize.localize('map_status', Globalize.culture())}</dt>
                                <dd><DropDownList data={Const.informationStatus} defaultValue={this.state.information.status}
                                                  onChange={this.handleStatusChange}/>
                                </dd>
                            </dl>
                            <dl>
                                <dt>{Globalize.localize('map_publish_start_date', Globalize.culture())}</dt>
                                <dd><DatePicker className="input__date"
                                                dateFormat="YYYY年MM月DD日 (ddd)"
                                                locale='ja'
                                                dateFormatCalendar="YYYY年MM月"
                                                maxDate={this.state.information.effective_period_to}
                                                tetherConstraints={[]}
                                                readOnly
                                                isClearable={true}
                                                selected={this.state.information.effective_period_from}
                                                onChange={this.handleEffectivePeriodFromChange}/>
                                    {this.state.information.effective_period_from ? <InputTime value={this.state.information.effective_period_from.format('HH:mm')}
                                                className="input__date"
                                                onChange={this.handleChangeFromTime}/> : null}
                                </dd>
                            </dl>
                            <dl>
                                <dt>{Globalize.localize('map_publish_end_date', Globalize.culture())}</dt>
                                <dd><DatePicker className="input__date"
                                                dateFormat="YYYY年MM月DD日 (ddd)"
                                                locale="ja"
                                                dateFormatCalendar="YYYY年MM月"
                                                tetherConstraints={[]}
                                                minDate={this.state.information.effective_period_from}
                                                readOnly
                                                isClearable={true}
                                                selected={this.state.information.effective_period_to}
                                                onChange={this.handleEffectivePeriodToChange}/>
                                    {this.state.information.effective_period_to ? <InputTime value={this.state.information.effective_period_to.format('HH:mm')}
                                               className="input__date"
                                               onChange={this.handleChangeToTime}/> : null}
                                </dd>
                            </dl>
                        </div>
                    </dd>
                    <div className="widget__page__input__coupon__submit">
                        <button className="btn-base">{isNew ? Globalize.localize('confirm_before_create_information', Globalize.culture()) : Globalize.localize('confirm_before_update_information', Globalize.culture())}</button>
                    </div>
                </form>
            </dl>
        );
    }

}
InformationForm.contextTypes = {
    router: React.PropTypes.object,
};

export default InformationForm
