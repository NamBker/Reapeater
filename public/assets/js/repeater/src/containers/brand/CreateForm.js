import * as Const from '../../constants/Constants'
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Selection from '../../components/commons/Selection'
import DropDownList from  '../../components/commons/DropDownList'
import Checkbox from  '../../components/commons/Checkbox'
import FormInput from '../../components/brand/FormInput'
import { prefectureCodes , eachCompany, brand_status, storeDisplayType } from '../../utils/CommonUtils'

const mapStateToProps = (state, ownProps) => {
    return {

    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        renderCompany() {
            return (
                <dd>
                    {ownProps.currentUser.authority >= Const.USER_AUTHORITY_COMPANY ? ownProps.currentUser.company_name :
                        <DropDownList
                            data={ownProps.companies}
                            defaultValue={ownProps.state.brand.company_id || ''}
                            hasEmptyOption={true}
                            onChange={(e) => ownProps.handleCompanyIdChange(e)}
                            selectName='company_id'
                            isRequired={true}
                            eachCallback={eachCompany()}/>}
                </dd>
            );
        },
        renderBrandCode() {
            return (
                <dd>
                    <input type="text" maxLength="16" name="brand_code" id="brand_code"
                           onChange={(e) => ownProps.handleBrandCodeChange(e)}
                           value={ownProps.state.brand.brand_code}
                           required />
                </dd>
            );
        },
        renderBrandName() {
            return (
                <dd>
                    <input type="text" maxLength="32" name="brand_name" id="brand_name"
                           onChange={(e) => this.handleBrandNameChange(e)}
                           value={ownProps.state.brand.brand_name}
                           required />
                </dd>
            );
        },
        renderBrandStatus() {
            return (
                <dd>
                    <DropDownList
                        data={brand_status}
                        defaultValue={ownProps.state.brand.brand_status}
                        selectName='brand_status'
                        onChange={(e) => this.handleBrandStatusChange(e)}
                        />
                </dd>
            );
        },
        renderBrandPostalCode() {
            return (
                <dd>
                    〒　<input type="number"
                             name="brand_postal_code"
                             value={ownProps.state.brand.brand_postal_code || ""}
                             onChange={(e) => this.handlePostalCodeChange(e)} />
                    <label className="lable_example">{Globalize.localize('map_example', Globalize.culture())}）1500043</label>
                </dd>
            );
        },
        renderBrandPrefecture() {
            let brandPrefectures = ownProps.state.brand.brand_prefectures || "";
            if([1,2,3,4,5,6,7,8,9].indexOf(brandPrefectures) >= 0 ) brandPrefectures = '0' + brandPrefectures;
            return (
                <dd>
                    <DropDownList
                        data={Object.keys(prefectureCodes).sort((a, b) => a-b)}
                        hasEmptyOption={true}
                        onChange={(e) => this.handlePrefecturesChange(e)}
                        defaultValue={brandPrefectures}
                        eachCallback={code => <option value={code} key={code}>{prefectureCodes[code]}</option>}/>
                </dd>
            );
        },
        renderBrandCity() {
            return (
                <dd>
                    <input type="text" maxLength="64"
                           className="inputFormData"
                           value={ownProps.state.brand.brand_address || ""}
                           name="store_address"
                           onChange={(e) => this.handleAddressChange(e)} />
                </dd>
            );
        },
        renderBrandBuilding() {
            return (
                <dd>
                    <input type="text" maxLength="32"
                           className="inputFormData"
                           name="store_building"
                           value={ownProps.state.brand.brand_building || ""}
                           onChange={(e) => this.handleBuildingChange(e)} />
                </dd>
            );
        },
        renderBrandPhoneNo() {
            return (
                <dd><input type="number" name="brand_phone_no"  id="brand_phone_no"
                           onChange={(e) => this.handlePhoneNoChange(e)}
                           value={ownProps.state.brand.brand_phone_no || ''}
                    /><label style={{ color: 'rgba(160, 138, 138, 0.5)', marginLeft : '20px' }}>{Globalize.localize('map_example', Globalize.culture())}）0337707030</label>
                </dd>
            );
        },
        renderBrandRegularHoliday() {
            return (
                <dd>
                    <input type="text" maxLength="16" name="brand_regular_holiday" id="brand_regular_holiday"
                           onChange={(e) => this.handleHolidayChange(e)}
                           value={ownProps.state.brand.brand_regular_holiday}
                           required />
                </dd>
            );
        },
        renderBrandSignatureBlock() {
            return (
                <dd>
                    <textarea onChange={(e) => this.handleSignatureBlockChange(e)} value={ownProps.state.brand.brand_signature_block}></textarea>
                </dd>
            );
        },
        renderBrandTermsOfUse() {
            return (
                <dd>
                    <textarea onChange={(e) => this.handleTermsOfUseChange(e)} value={ownProps.state.brand.brand_terms_of_use}></textarea>
                </dd>
            );
        },
        renderBrandPrivacyPolicy() {
            return (
                <dd>
                    <textarea onChange={(e) => this.handlePrivacyPolicy(e)} value={ownProps.state.brand.brand_privacy_policy}></textarea>
                </dd>
            );
        },
        renderBrandFreeWord() {
            return (
                <dd>
                    <textarea onChange={(e) => this.handleFreeWord(e)} value={ownProps.state.brand.brand_freeword}></textarea>
                </dd>
            );
        },
        renderBrandStoreDisplayType() {
            return (
                <dd>
                    <DropDownList
                        data={storeDisplayType}
                        defaultValue={ownProps.state.brand.store_display_type}
                        selectName='store_display_type'
                        onChange={(e) => this.handleBrandStoreDisplayTypeChange(e)}
                        eachCallback={(value,index) => <option value={index+1} key={index}>{value}</option>}
                        />
                </dd>
            );
        },
        renderBrandGoogleAnalyticsId() {
            return (
                <dd>
                    <input type="number" min="1" max="2147483647" name="google_analytics_id" id="google_analytics_id"
                           onChange={(e) => this.handleGoogleAnalyticsIdChange(e)}
                           value={ownProps.state.brand.google_analytics_id}
                           required />
                </dd>
            );
        },
        renderBrandGoogleAnalyticsPass() {
            return (
                <dd>
                    <input type="text" maxLength="16" name="google_analytics_pass" id="google_analytics_pass"
                           onChange={(e) => this.handleGoogleAnalyticsPassChange(e)}
                           value={ownProps.state.brand.google_analytics_pass}
                           required />
                </dd>
            );
        },
        renderBrandMemberRegistrationFormTextUp() {
            return (
                <dd>
                    <input type="text" maxLength="256" name="member_registration_form_text_up" id="member_registration_form_text_up"
                           onChange={(e) => this.handleMemberRegistrationFormTextUpChange(e)}
                           value={ownProps.state.brand.member_registration_form_text_up}
                           required />
                </dd>
            );
        },
        renderBrandMemberRegistrationFormTextDown() {
            return (
                <dd>
                    <input type="text" maxLength="256" name="member_registration_form_text_down" id="member_registration_form_text_down"
                           onChange={(e) => this.handleMemberRegistrationFormTextDownChange(e)}
                           value={ownProps.state.brand.member_registration_form_text_down}
                           required />
                </dd>
            );
        },
        renderButton() {
            if(this.props.isCreateNew){
                var comment = Globalize.localize('check_brand_create', Globalize.culture());
            }else{
                var comment = Globalize.localize('check_brand_update', Globalize.culture());
            }
            return (
                <input type="button" value={comment} onClick={this.onSubmit} className="btn-base"/>
            );
        },
        dispatch
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(FormInput)
