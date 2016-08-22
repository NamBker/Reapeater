import React, { Component, PropTypes } from 'react';
import { brand_status,eachCompany,prefectureCodes,storeDisplayType  } from '../utils/CommonUtils'
import { fetchBrandInfo } from '../actions/brand'
import DropDownList from  '../components/commons/DropDownList'
import { connect } from 'react-redux';
import * as Const from '../constants/Constants';
import { fetchCompanies } from '../actions/company'
import CreateForm from '../containers/brand/CreateForm'
import ConfirmForm from '../containers/brand/ConfirmForm'
import { createBrand, updateBrand } from '../actions/brand'
import { showNotification } from '../actions/notification';

class BrandForm extends Component {
    constructor(props) {
        super(props);
        this.state =  {
            brand: this.props.isCreateNew ? {
                company_id: props.currentUser.company_id,
                brand_code: '',
                brand_status: Const.BRAND_STATUS_DEFAULT_VALUE,
                brand_name: '',
                brand_postal_code: '',
                brand_prefectures: '',
                brand_address: '',
                brand_building: '',
                brand_phone_no: '',
                brand_regular_holiday: '',
                brand_signature_block: '',
                brand_terms_of_use: '',
                brand_privacy_policy: '',
                brand_freeWord: '',
                store_display_type: 1,
                google_analytics_id: '',
                google_analytics_pass: '',
                brand_first_open_date: '',
                member_registration_form_text_up: '',
                member_registration_form_text_down: ''
            } : this.props.brand
        };

        this.handleCompanyIdChange = this.handleCompanyIdChange.bind(this);
        this.handleBrandCodeChange = this.handleBrandCodeChange.bind(this);
        this.handleBrandNameChange = this.handleBrandNameChange.bind(this);
        this.handleBrandStatusChange = this.handleBrandStatusChange.bind(this);
        this.handlePostalCodeChange = this.handlePostalCodeChange.bind(this);
        this.handlePrefecturesChange = this.handlePrefecturesChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleBuildingChange = this.handleBuildingChange.bind(this);
        this.handlePhoneNoChange = this.handlePhoneNoChange.bind(this);
        this.handleHolidayChange = this.handleHolidayChange.bind(this);
        this.handleSignatureBlockChange = this.handleSignatureBlockChange.bind(this);
        this.handleTermsOfUseChange = this.handleTermsOfUseChange.bind(this);
        this.handlePrivacyPolicy = this.handlePrivacyPolicy.bind(this);
        this.handleFreeWord = this.handleFreeWord.bind(this);
        this.handleBrandStoreDisplayTypeChange = this.handleBrandStoreDisplayTypeChange.bind(this);
        this.handleGoogleAnalyticsIdChange = this.handleGoogleAnalyticsIdChange.bind(this);
        this.handleGoogleAnalyticsPassChange = this.handleGoogleAnalyticsPassChange.bind(this);
        this.handleMemberRegistrationFormTextUpChange = this.handleMemberRegistrationFormTextUpChange.bind(this);
        this.handleMemberRegistrationFormTextDownChange = this.handleMemberRegistrationFormTextDownChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSubmitBrand = this.onSubmitBrand.bind(this);
    }

    componentDidMount() {
        if (!this.props.isCreateNew) {
            this.props.dispatch(fetchBrandInfo(this.props.params.brandId, Const.GET_ALL_PATTERN));
         }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.isCreateNew && nextProps.brand != this.props.brand) {
            this.setState({
                brand: nextProps.brand
            });
        }
    }

    handleCompanyIdChange(e) {
        let brand = Object.assign({}, this.state.brand);
        brand.company_id = e.target.value;
        brand.brand_id = '';
        brand.status = '';

        this.setState({ brand: brand });
    }

    handleBrandCodeChange(e) {
        let brand = Object.assign({}, this.state.brand);
        brand.brand_code = e.target.value;
        this.setState({brand: brand});
    }

    handleBrandNameChange(e) {
        let brand = Object.assign({}, this.state.brand);
        brand.brand_name = e.target.value;
        this.setState({brand: brand});
    }

    handleBrandStatusChange(e) {
        let brand = Object.assign({}, this.state.brand);
        brand.brand_status = e.target.value;
        this.setState({brand: brand});
    }

    handlePostalCodeChange(e){
        let brand = Object.assign({}, this.state.brand);
        if(e.target.value.length <= 8)
            brand.brand_postal_code = e.target.value;
        this.setState({brand: brand});
    }

    handlePrefecturesChange(e){
        let brand = Object.assign({}, this.state.brand);
        brand.brand_prefectures = e.target.value;
        this.setState({brand: brand});
    }

    handleAddressChange(e){
        let brand = Object.assign({}, this.state.brand);
        brand.brand_address = e.target.value;
        this.setState({brand: brand});
    }

    handleBuildingChange(e){
        let brand = Object.assign({}, this.state.brand);
        brand.brand_building = e.target.value;
        this.setState({brand: brand});
    }

    handlePhoneNoChange(e){
        let brand = Object.assign({}, this.state.brand);
        if(e.target.value.length <= 16)
            brand.brand_phone_no = e.target.value;
        this.setState({brand: brand});
    }

    handleHolidayChange(e){
        let brand = Object.assign({}, this.state.brand);
        brand.brand_regular_holiday = e.target.value;
        this.setState({brand: brand});
    }

    handleSignatureBlockChange(e){
        let brand = Object.assign({}, this.state.brand);
        brand.brand_signature_block = e.target.value;
        this.setState({brand: brand});
    }

    handleTermsOfUseChange(e){
        let brand = Object.assign({}, this.state.brand);
        brand.brand_terms_of_use = e.target.value;
        this.setState({brand: brand});
    }

    handlePrivacyPolicy(e){
        let brand = Object.assign({}, this.state.brand);
        brand.brand_privacy_policy = e.target.value;
        this.setState({brand: brand});
    }

    handleFreeWord(e){
        let brand = Object.assign({}, this.state.brand);
        brand.brand_freeword = e.target.value;
        this.setState({brand: brand});
    }

    handleBrandStoreDisplayTypeChange(e){
        let brand = Object.assign({}, this.state.brand);
        brand.store_display_type = e.target.value;
        this.setState({brand: brand});
    }

    handleGoogleAnalyticsIdChange(e){
        let brand = Object.assign({}, this.state.brand);
        brand.google_analytics_id = e.target.value;
        this.setState({brand: brand});
    }

    handleGoogleAnalyticsPassChange(e){
        let brand = Object.assign({}, this.state.brand);
        brand.google_analytics_pass = e.target.value;
        this.setState({brand: brand});
    }

    handleMemberRegistrationFormTextUpChange(e){
        let brand = Object.assign({}, this.state.brand);
        brand.member_registration_form_text_up = e.target.value;
        this.setState({brand: brand});
    }

    handleMemberRegistrationFormTextDownChange(e){
        let brand = Object.assign({}, this.state.brand);
        brand.member_registration_form_text_down = e.target.value;
        this.setState({brand: brand});
    }

    showNotificationCall(message, isSuccess = true) {
        this.props.dispatch(showNotification('/brand', message, isSuccess));
    }

    onSubmit(e) {
        let brand = Object.assign({}, this.state.brand);

        if (!brand.company_id) {
            alert(Globalize.localize('check_company', Globalize.culture()));
        } else if (!brand.brand_code) {
            alert(Globalize.localize('check_brand_code', Globalize.culture()));
        } else if (!brand.brand_name) {
            alert(Globalize.localize('check_brand_name', Globalize.culture()));
        } else if (!brand.brand_phone_no) {
            alert(Globalize.localize('check_brand_phone', Globalize.culture()));
        }
        else {
            this.context.router.push(this.props.location.pathname + '/confirm');
        }
    }

    onSubmitBrand(e, history) {
        let brand = Object.assign({}, this.state.brand);

        if(this.props.isCreateNew){
            // 登録処理
            this.props.dispatch(createBrand(brand, history,
                (err) => {
                    this.showNotificationCall(err, false);
                },
                (res) => {
                    this.showNotificationCall(Globalize.localize('brand_created', Globalize.culture()));
                    this.context.router.push('/brand');
                }
            ));
        }else{
            // 更新処理
            this.props.dispatch(updateBrand(brand, history,
                (err) => {
                    this.showNotificationCall(err, false);
                },
                (res) => {
                    this.showNotificationCall(Globalize.localize('brand_updated', Globalize.culture()));
                }
            ));
        }
    }

    render() {
        const { currentUser, companies, onSubmit } = this.props;
        const children = React.cloneElement(this.props.children, {
            props: this.props,
            state: this.state,
            currentUser: currentUser,
            companies: companies,
            handleCompanyIdChange: this.handleCompanyIdChange,
            handleBrandCodeChange: this.handleBrandCodeChange,
            handleBrandNameChange: this.handleBrandNameChange,
            handleBrandStatusChange: this.handleBrandStatusChange,
            handlePostalCodeChange: this.handlePostalCodeChange,
            handlePrefecturesChange: this.handlePrefecturesChange,
            handleAddressChange: this.handleAddressChange,
            handleBuildingChange: this.handleBuildingChange,
            handlePhoneNoChange: this.handlePhoneNoChange,
            handleHolidayChange: this.handleHolidayChange,
            handleSignatureBlockChange: this.handleSignatureBlockChange,
            handleTermsOfUseChange: this.handleTermsOfUseChange,
            handlePrivacyPolicy: this.handlePrivacyPolicy,
            handleFreeWord: this.handleFreeWord,
            handleBrandStoreDisplayTypeChange: this.handleBrandStoreDisplayTypeChange,
            handleGoogleAnalyticsIdChange: this.handleGoogleAnalyticsIdChange,
            handleGoogleAnalyticsPassChange: this.handleGoogleAnalyticsPassChange,
            handleMemberRegistrationFormTextUpChange: this.handleMemberRegistrationFormTextUpChange,
            handleMemberRegistrationFormTextDownChange: this.handleMemberRegistrationFormTextDownChange,
            onSubmit: this.onSubmit,
            onSubmitBrand: this.onSubmitBrand
        });

        if(this.props.isCreateNew){
            var comment = Globalize.localize('brand_create_comment', Globalize.culture());
        }else{
            var comment = Globalize.localize('brand_update_comment', Globalize.culture());
        }

        return (

            <dl className="widget">
                <dt className="widget__title ">
                    <img src="/assets/img/icon-info-blue.png" className="info__icon"/>
                    <span>{comment}</span>
                </dt>
                {children}
            </dl>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        companies : state.companies,
    }
};

BrandForm.contextTypes = {
    router: React.PropTypes.object,
}

export default connect(mapStateToProps)(BrandForm);
