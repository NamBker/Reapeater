import * as Const from '../../constants/Constants'
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DropDownList from  '../../components/commons/DropDownList'
import Checkbox from  '../../components/commons/Checkbox'
import FormInput from '../../components/brand/FormInput'
import { prefectureCodes , eachArea, eachCompany, storeDisplayType } from '../../utils/CommonUtils'
import { createSection, updateSection } from '../../actions/section'

const mapStateToProps = (state, ownProps) => {
    return {

    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        renderCompany() {
            return (
                <dd>
                    {ownProps.companies.map((company) => {
                        if (ownProps.state.brand.company_id == company.id) {
                            return company.company_name
                        }
                    })}
                </dd>
            );
        },
        renderBrandCode() {
            return (
                <dd>
                    {ownProps.state.brand.brand_code}
                </dd>
            );
        },
        renderBrandName() {
            return (
                <dd>
                    {ownProps.state.brand.brand_name}
                </dd>
            );
        },
        renderBrandStatus() {
            return (
                <dd>
                    {ownProps.state.brand.brand_status}
                </dd>
            );
        },
        renderBrandPostalCode() {
            return (
                <dd>
                    {ownProps.state.brand.brand_postal_code}
                </dd>
            );
        },
        renderBrandPrefecture() {
            let brandPrefectures = ownProps.state.brand.brand_prefectures || "";
            if([1,2,3,4,5,6,7,8,9].indexOf(brandPrefectures) >= 0 ) brandPrefectures = '0' + brandPrefectures;
            return (
                <dd>
                    {prefectureCodes[brandPrefectures] || '　'}
                </dd>
            );
        },
        renderBrandCity() {
            return (
                <dd>
                    {ownProps.state.brand.brand_address}
                </dd>
            );
        },
        renderBrandBuilding() {
            return (
                <dd>
                    {ownProps.state.brand.brand_building}
                </dd>
            );
        },
        renderBrandPhoneNo() {
            return (
                <dd>
                    {ownProps.state.brand.brand_phone_no}
                </dd>
            );
        },
        renderBrandRegularHoliday() {
            return (
                <dd>
                    {ownProps.state.brand.brand_regular_holiday}
                </dd>
            );
        },
        renderBrandSignatureBlock() {
            return (
                <dd>
                    {ownProps.state.brand.brand_signature_block}
                </dd>
            );
        },
        renderBrandTermsOfUse() {
            return (
                <dd>
                    {ownProps.state.brand.brand_terms_of_use}
                </dd>
            );
        },
        renderBrandPrivacyPolicy() {
            return (
                <dd>
                    {ownProps.state.brand.brand_privacy_policy}
                </dd>
            );
        },
        renderBrandFreeWord() {
            return (
                <dd>
                    {ownProps.state.brand.brand_freeword}
                </dd>
            );
        },
        renderBrandStoreDisplayType() {
            return (
                <dd>
                    {storeDisplayType[ownProps.state.brand.store_display_type]}
                </dd>
            );
        },
        renderBrandGoogleAnalyticsId() {
            return (
                <dd>
                    {ownProps.state.brand.google_analytics_id}
                </dd>
            );
        },
        renderBrandGoogleAnalyticsPass() {
            return (
                <dd>
                    {ownProps.state.brand.google_analytics_pass}
                </dd>
            );
        },
        renderBrandMemberRegistrationFormTextUp() {
            return (
                <dd>
                    {ownProps.state.brand.member_registration_form_text_up}
                </dd>
            );
        },
        renderBrandMemberRegistrationFormTextDown() {
            return (
                <dd>
                    {ownProps.state.brand.member_registration_form_text_down}
                </dd>
            );
        },
        renderButton() {
            if(this.props.isCreateNew){
                var comment = Globalize.localize('confirm_brand_create', Globalize.culture());
            }else{
                var comment = Globalize.localize('confirm_brand_update', Globalize.culture());
            }
            return (
                <input type="submit" value={comment}
                       onClick={() => {ownProps.onSubmitBrand(ownProps.state.brand, ownProps.history)}}
                       className="btn-base" />
            );
        },
        dispatch
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(FormInput)
