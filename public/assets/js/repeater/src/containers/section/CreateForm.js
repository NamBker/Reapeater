import * as Const from '../../constants/Constants'
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Selection from '../../components/commons/Selection'
import DropDownList from  '../../components/commons/DropDownList'
import Checkbox from  '../../components/commons/Checkbox'
import FormInput from '../../components/section/FormInput'
import { sectionStatus, prefectureCodes , eachArea, eachCompany, eachBrand, eachStore } from '../../utils/CommonUtils'

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
                        defaultValue={ownProps.section.company_id || ''}
                        hasEmptyOption={true}
                        onChange={ownProps.handleCompanyIdChange}
                        selectName='company_id'
                        isRequired={true}
                        eachCallback={eachCompany()}/>}
                </dd>
            );
        },
        renderBrand() {
            return (
                <dd>
                    {ownProps.currentUser.authority >= Const.USER_AUTHORITY_BRAND ? ownProps.currentUser.brand_name :
                    <DropDownList
                        data={ownProps.brands}
                        defaultValue={ownProps.section.brand_id || ''}
                        hasEmptyOption={true}
                        onChange={ownProps.handleBrandIdChange}
                        selectName='brand_id'
                        isRequired={true}
                        eachCallback={eachBrand(brand => !ownProps.section.company_id || ownProps.section.company_id == brand.company_id)}/>}
                </dd>
            );
        },
        renderSectionName() {
            return (
                <dd>
                    <input type="text" name="section_name" id="section_name"
                           onChange={ownProps.handleSectionNameChange}
                           value={ownProps.section.section_name}
                           required />

                </dd>
            );
        },
        renderStatus() {
            return (
                <dd>
                    <DropDownList
                    data={sectionStatus}
                    defaultValue={ownProps.section.section_status}
                    selectName='section_status'
                    onChange={ownProps.handleSectionStatusChange}
                    />
                </dd>
            );
        },
        renderZipCode() {
            return (
                <dd>
                    〒　<input type="number" min="1"
                               name="store_postal_code"
                               value={ownProps.section.store_postal_code || ""}
                               onChange={ownProps.handleZipCodeChange} />
                    <label className="lable_example">{Globalize.localize('map_example', Globalize.culture())}）1500043</label>
                </dd>
            );
        },
        renderPrefectures() {
            let storePrefectures = ownProps.section.store_prefectures || "";
            if([1,2,3,4,5,6,7,8,9].indexOf(storePrefectures) >= 0 ) storePrefectures = '0' + storePrefectures;
            return (
                <dd>
                    <DropDownList
                        data={Object.keys(prefectureCodes).sort((a, b) => a-b)}
                        hasEmptyOption={true}
                        onChange={ownProps.handlePrefecturesChange}
                        defaultValue={storePrefectures}
                        eachCallback={code => <option value={code} key={code}>{prefectureCodes[code]}</option>}/>
                </dd>
            );
        },
        renderDistrict() {
            return (
                <dd>
                    <input type="text"
                           className="inputFormData"
                           value={ownProps.section.store_address || ""}
                           name="store_address"
                           onChange={ownProps.handleDistrictChange} />
                </dd>
            );
        },
        renderBuildingAddress() {
           return (
               <dd>
                 <input type="text"
                        className="inputFormData"
                        name="store_building"
                        value={ownProps.section.store_building || ""}
                        onChange={ownProps.handleBuildingAddressChange} />
               </dd>
           );
        },
        renderPhoneNo() {
            return (
                <dd><input type="number" min="1" name="section_phone_no"
                           onChange={ownProps.handleSectionPhoneNoChange}
                           value={ownProps.section.section_phone_no || ''}
                    /><label style={{ color: 'rgba(160, 138, 138, 0.5)', marginLeft : '20px' }}>{Globalize.localize('map_example', Globalize.culture())}）0337707030</label>
                </dd>
            );
        },
        renderStoresHolder() {
            return (
                <dd>
                    <Selection data={ownProps.stores}
                               isShowCheckAll={false}
                               checkCondition={store => !ownProps.section.brand_id || ownProps.section.brand_id == store.brand_id}
                               checkedItems={[...ownProps.section.store_ids]}
                               nameField="store_name"
                               changeItem={ownProps.handleStoreIds}/>
                </dd>
            );
        },
        renderButton() {
            return (
                <input type="button" value={Globalize.localize('check_section_create', Globalize.culture())} onClick={ownProps.onSubmit} className="btn-base"/>
            );
        },
        dispatch
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(FormInput)
