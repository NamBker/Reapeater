import * as Const from '../../constants/Constants'
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DropDownList from  '../../components/commons/DropDownList'
import Checkbox from  '../../components/commons/Checkbox'
import FormInput from '../../components/store/FormInput'
import { storeStatus } from '../../utils/CommonUtils'
import { createSection, updateSection } from '../../actions/section'

const mapStateToProps = (state, ownProps) => {
    return {

    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const { store } = ownProps.state;
    const { companies, brands } = ownProps;
    return {
        renderCompany() {
            let company_name = '　';
            if (this.props.isCreate) {
                let company = companies.find((company) => {
                    return company.id == ownProps.state.companyId;
                });
                company_name = company ? company.company_name : '　';
            } else {
                company_name = store.company_name;
            }
            return (
                <dd>
                    {company_name}
                </dd>
            );
        },
        renderBrand() {
            let brand_name = '　';
            if (this.props.isCreate) {
                let brand = brands.find((brand) => {
                    return brand.id == store.brand_id;
                });
                brand_name = brand ? brand.brand_name : '　';
            } else {
                brand_name = store.brand_name;
            }
            return (
                <dd>
                    {brand_name}
                </dd>
            );
        },
        renderStoreCode() {
            return (
                <dd>
                    {store.store_code}
                </dd>
            );
        },
        renderStoreName() {
            return (
                <dd>
                    {store.store_name}
                </dd>
            );
        },
        renderStoreStatus() {
            return (
                <dd>
                    {store.store_status ? storeStatus[store.store_status] : '　'}
                </dd>
            );
        },
        renderStorePostalCode() {
            return (
                <dd>
                    {store.store_postal_code || '　'}
                </dd>
            );
        },
        renderStorePrefecture() {
            return (
                <dd>
                    {Const.PREFECTURE_ARRAY[parseInt(store.store_prefectures) - 1] || '　'}
                </dd>
            );
        },
        renderStoreCity() {
            return (
                <dd>
                    {store.store_address || '　'}
                </dd>
            );
        },
        renderStoreBuilding() {
            return (
                <dd>
                    {store.store_building || '　'}
                </dd>
            );
        },
        renderStoreAccessChange() {
            return (
                <dd>
                    {store.store_access || '　'}
                </dd>
            );
        },
        renderStorePhoneNo() {
            return (
                <dd>
                    {store.store_phone_no || '　'}
                </dd>
            );
        },
        renderStoreFaxNo() {
            return (
                <dd>
                    {store.store_fax_no || '　'}
                </dd>
            );
        },
        renderStoreManagerName() {
            return (
                <dd>
                    {store.store_manager_name || '　'}
                </dd>
            );
        },
        renderStoreBusinessHours() {
            return (
                <dd>
                    {store.store_business_hours || '　'}
                </dd>
            );
        },
        renderStoreBusinessHoursFrom() {
            return (
                <dd>
                    {store.store_business_hours_from || '　'}
                </dd>
            );
        },
        renderStoreBusinessHoursTo() {
            return (
                <dd>
                    {store.store_business_hours_to || '　'}
                </dd>
            );
        },
        renderStoreRegularHoliday() {
            return (
                <dd>
                    {store.store_regular_holiday || '　'}
                </dd>
            );
        },
        renderStoreParkingLot() {
            return (
                <dd>
                    {store.store_parking_lot || '　'}
                </dd>
            );
        },
        renderStoreSeat() {
            return (
                <dd>
                    {store.store_seat || '　'}
                </dd>
            );
        },
        renderStoreKidsRoom() {
            return (
                <dd>
                    {store.store_kids_room || '　'}
                </dd>
            );
        },
        renderStoreSignatureBlock() {
            return (
                <dd>
                    <div className="widget__page__input__multiline">
                        {store.store_signature_block || '　'}
                    </div>
                </dd>
            );
        },
        renderStoreTermsOfUse() {
            return (
                <dd>
                    <div className="widget__page__input__multiline">
                        {store.store_terms_of_use || '　'}
                    </div>
                </dd>
            );
        },
        renderStorePrivacyPolicy() {
            return (
                <dd>
                    <div className="widget__page__input__multiline">
                        {store.store_privacy_policy || '　'}
                    </div>
                </dd>
            );
        },
        renderStoreFreeword() {
            return (
                <dd>
                    <div className="widget__page__input__multiline">
                        {store.store_freeword || '　'}
                    </div>
                </dd>
            );
        },
        renderStoreHeaderPictureId() {
            return (
                <dd>
                    <div className="contents__container__logo-container mb10 mt10">
                    </div>
                    <div className="contents__container__logo mb10">
                        <img src={store.store_header_picture_url} className="preview_image"/>
                    </div>
                </dd>
            );
        },
        renderStoreAreaLId(areas) {
            let area = areas.find((area) => {return area.id == store.store_area_L_id});
            return (
                <dd>
                    {area ? area.area_name : '　'}
                </dd>
            );
        },
        renderStoreAreaMId(areas) {
            let area = areas.find((area) => {return area.id == store.store_area_M_id});
            return (
                <dd>
                    {area ? area.area_name : '　'}
                </dd>
            );
        },
        renderStoreAreaSId(areas) {
            let area = areas.find((area) => {return area.id == store.store_area_S_id});
            return (
                <dd>
                    {area ? area.area_name : '　'}
                </dd>
            );
        },
        renderStoreSeoKey1() {
            return (
                <dd>
                    {store.store_seo_key1 || '　'}
                </dd>
            );
        },
        renderStoreSeoKey2() {
            return (
                <dd>
                    {store.store_seo_key2 || '　'}
                </dd>
            );
        },
        renderStoreSeoKey3() {
            return (
                <dd>
                    {store.store_seo_key3 || '　'}
                </dd>
            );
        },
        renderButton() {
            if(this.props.isCreate){
                var comment = Globalize.localize('confirm_store_create', Globalize.culture());
            }else{
                var comment = Globalize.localize('confirm_store_update', Globalize.culture());
            }
            return (
                <input type="submit" value={comment}
                       onClick={() => {this.props.isCreate ? ownProps.onRegister(store) : ownProps.onUpdate(store)}}
                       className="btn-base" />
            );
        },
        dispatch
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(FormInput)
