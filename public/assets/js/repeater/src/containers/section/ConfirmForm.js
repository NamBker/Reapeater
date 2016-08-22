import * as Const from '../../constants/Constants'
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Selection from '../../components/commons/Selection'
import DropDownList from  '../../components/commons/DropDownList'
import Checkbox from  '../../components/commons/Checkbox'
import FormInput from '../../components/section/FormInput'
import { sectionStatus, prefectureCodes , eachArea, eachCompany, eachBrand, eachStore } from '../../utils/CommonUtils'
import { createSection, updateSection } from '../../actions/section'

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        renderCompany() {
            return (
                <dd>
                    {ownProps.companies.map((company) => {
                        if (ownProps.section.company_id == company.id) {
                            return company.company_name
                        }
                    })}
                </dd>
            );
        },
        renderBrand() {
            return (
                <dd>
                    {ownProps.brands.map((brand) => {
                        if (ownProps.section.brand_id == brand.id) {
                            return brand.brand_name
                        }
                    })}
                </dd>
            );
        },
        renderSectionName() {
            return (
                <dd>
                    {ownProps.section.section_name}
                </dd>
            );
        },
        renderStatus() {
            return (
                <dd>
                    {sectionStatus[ownProps.section.section_status]}
                </dd>
            );
        },
        renderZipCode() {
            return (
                <dd>
                    {ownProps.section.store_postal_code || '　'}
                </dd>
            );
        },
        renderPrefectures() {
            let storePrefectures = ownProps.section.store_prefectures ? ownProps.section.store_prefectures : "";
            if([1,2,3,4,5,6,7,8,9].indexOf(storePrefectures) >= 0) storePrefectures = '0' + storePrefectures
            return (
                <dd>
                    {prefectureCodes[storePrefectures] || '　'}
                </dd>
            );
        },
        renderDistrict() {
            return (
                <dd>
                    {ownProps.section.store_address || '　'}
                </dd>
            );
        },
        renderBuildingAddress() {
            return (
                <dd>
                    {ownProps.section.store_building || '　'}
                </dd>
            );
        },
        renderPhoneNo() {
            return (
                <dd>
                    {ownProps.section.section_phone_no || '　'}
                </dd>
            );
        },
        renderStoresHolder() {
            let new_stores = [];
            return (
                <dd>
                    <div style={{paddingTop: '5px'}}>
                        <div style={{ marginRight: 'auto' }}>{Globalize.localize('filter_select_store', Globalize.culture())}：{ownProps.section.store_ids.length}店</div>
                        {
                            ownProps.stores.map((store) => {
                                ownProps.section.store_ids.map((storeId) => {
                                    if (store.id == storeId) {
                                        new_stores.push(store.store_name)
                                    }
                                })
                            })
                        }
                        {new_stores.join()}
                    </div>
                </dd>
            );
        },
        renderButton() {
            return (
                <input type="submit" value={Globalize.localize('confirm_section_create', Globalize.culture())}
                       onClick={() => {ownProps.submitSection(ownProps.section, ownProps.history)}}
                       className="btn-base" />
            );
        },
        dispatch
    }
};


export default connect(null, mapDispatchToProps)(FormInput)
