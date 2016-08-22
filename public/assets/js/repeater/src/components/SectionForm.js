import React, { Component, PropTypes } from 'react';
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { Link } from 'react-router'

import Selection from './commons/Selection'
import DropDownList from  './commons/DropDownList'
import Checkbox from  './commons/Checkbox'
import * as Const from '../constants/Constants'
import CreateForm from '../containers/section/CreateForm'
import ConfirmForm from '../containers/section/ConfirmForm'
import { fetchUserInfo } from '../actions/user'
import { fetchCompanies } from '../actions/company'
import { fetchBrands } from '../actions/brand'
import { fetchStores } from '../actions/store'
import { fetchSectionInfo } from '../actions/section'
import { sectionStatus, prefectureCodes , eachArea, eachCompany, eachBrand, eachStore } from '../utils/CommonUtils'

class SectionForm extends Component {

    constructor(props) {
        super(props);
        this.state= {
            section: this.props.isCreateNew ? {
                company_id: props.currentUser.authority < Const.USER_AUTHORITY_COMPANY ? 0 : props.currentUser.company_id,
                brand_id : props.currentUser.authority < Const.USER_AUTHORITY_BRAND ? 0 : props.currentUser.brand_id,
                section_status : 2,
                section_name: '',
                section_phone_no: '',
                store_prefectures : '01',
                store_postal_code : '',
                store_address: '',
                store_building : '',
                store_ids: [],
            } : this.props.section,
        };

        this.handleCompanyIdChange = this.handleCompanyIdChange.bind(this);
        this.handleBrandIdChange = this.handleBrandIdChange.bind(this);
        this.handleSectionStatusChange = this.handleSectionStatusChange.bind(this);
        this.handleStoreIds = this.handleStoreIds.bind(this);
        this.handlePrefecturesChange = this.handlePrefecturesChange.bind(this);
        this.handleSectionNameChange = this.handleSectionNameChange.bind(this);
        this.handleSectionPhoneNoChange = this.handleSectionPhoneNoChange.bind(this);
        this.handleZipCodeChange = this.handleZipCodeChange.bind(this);
        this.handleDistrictChange = this.handleDistrictChange.bind(this);
        this.handleBuildingAddressChange = this.handleBuildingAddressChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.isCreateNew && nextProps.section != this.props.section) {
            this.setState({
                section: nextProps.section
            });
        }
    }

    componentDidMount() {
        const { dispatch } = this.props;
        if (!this.props.isCreateNew) {
            dispatch(fetchSectionInfo(this.props.params.sectionId));
        }
    }

    handleCompanyIdChange(e) {
        let section = {...this.state.section};
        section.company_id = e.target.value;
        section.brand_id = 0;
        section.store_ids = [];
        this.setState({section: section});
    }

    handleBrandIdChange(e) {
        let section = {...this.state.section};
        section.brand_id = e.target.value;
        section.store_ids = [];
        this.setState({ section: section})

    }

    handleSectionStatusChange(e) {
        let section = {...this.state.section};
        section.section_status = e.target.value;
        this.setState({section: section, section_status : e.target.value })
    }

    handleStoreIds(storeIds) {
        let section = {...this.state.section};
        section.store_ids = storeIds;
        this.setState({ section: section});
    }

    handlePrefecturesChange(e) {
        let section = {...this.state.section};
        section.store_prefectures = e.target.value;
        this.setState({section: section});
    }

    handleSectionNameChange(e) {
        let section = {...this.state.section};
        section.section_name = e.target.value;
        this.setState({section: section});
    }

    handleSectionPhoneNoChange(e) {
        let section = {...this.state.section};
        section.section_phone_no = e.target.value;
        this.setState({section: section});
    }

    handleZipCodeChange(e) {
        let section = {...this.state.section};
        section.store_postal_code = e.target.value;
        this.setState({section: section});
    }

    handleDistrictChange(e) {
        let section = {...this.state.section};
        section.store_address = e.target.value;
        this.setState({section: section});
    }

    handleBuildingAddressChange(e) {
        let section = {...this.state.section};
        section.store_building = e.target.value;
        this.setState({section: section});
    }

    onSubmit(e) {
        e.preventDefault();
        let section = {...this.state.section};
        if (!section.company_id) {
            alert('企業名を入力してください。')
        } else if (!section.brand_id) {
            alert('ブランド名を入力してください。')
        } else if (section.section_name.trim() == '') {
            alert('事業部名を入力してください。。')
        } else {
            this.props.history.push(this.props.location.pathname + '/confirm');
        }
    }

    render() {
        const children = React.cloneElement(this.props.children, {
            ...this.props,
            section: this.state.section,
            store_ids: this.state.store_ids,
            brandId: this.state.section.brand_id,
            handleCompanyIdChange: this.handleCompanyIdChange,
            handleBrandIdChange: this.handleBrandIdChange,
            handleSectionStatusChange: this.handleSectionStatusChange,
            handleStoreIds: this.handleStoreIds,
            handlePrefecturesChange: this.handlePrefecturesChange,
            handleSectionNameChange: this.handleSectionNameChange,
            handleSectionPhoneNoChange: this.handleSectionPhoneNoChange,
            handleZipCodeChange: this.handleZipCodeChange,
            handleDistrictChange: this.handleDistrictChange,
            handleBuildingAddressChange: this.handleBuildingAddressChange,
            onSubmit: this.onSubmit,
        });
        return (
            <dl className="widget">
                <dt className="widget__title ">
                    <img src="/assets/img/icon-info-blue.png" className="info__icon"/>
                    <span>新規お知らせの作成を行ってください。</span>
                </dt>
                {children}
            </dl>
        )
    }
}

export default SectionForm;
