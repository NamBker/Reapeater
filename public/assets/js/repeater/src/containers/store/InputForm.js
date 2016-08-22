import * as Const from '../../constants/Constants'
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DropDownList from  '../../components/commons/DropDownList'
import FormInput from '../../components/store/FormInput'
import { eachCompany, eachBrand, eachArea, storeStatus } from '../../utils/CommonUtils'
import MaskedInput from 'react-maskedinput';

const mapStateToProps = (state, ownProps) => {
    return {

    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { store } = ownProps.state;
    return {
        renderCompany() {
            return (
                <dd className="widget__page__input__brand__select">
                    {this.props.isCreate ? (ownProps.currentUser.authority >= Const.USER_AUTHORITY_COMPANY ? ownProps.currentUser.company_name :
                        <DropDownList
                            data={ownProps.companies}
                            defaultValue={ownProps.state.companyId  || ''}
                            hasEmptyOption={true}
                            onChange={ownProps.handleCompanyIdChange}
                            selectName='company_id'
                            isRequired={true}
                            eachCallback={eachCompany()}/>) : store.company_name}
                </dd>
            );
        },
        renderBrand() {
            return (
                <dd className="widget__page__input__brand__select">
                    {this.props.isCreate ? (ownProps.currentUser.authority >= Const.USER_AUTHORITY_BRAND ? ownProps.currentUser.brand_name :
                        <DropDownList
                            data={ownProps.brands}
                            defaultValue={store.brand_id || ''}
                            hasEmptyOption={true}
                            onChange={ownProps.handleBrandIdChange}
                            selectName='brand_id'
                            isRequired={true}
                            eachCallback={eachBrand(brand => {return brand.company_id == ownProps.state.companyId})}/>) : store.brand_name}
                </dd>
            );
        },
        renderStoreCode() {
            return (
                <dd>
                    <input type="text" maxLength="16" name="store_code" id="store_code"
                        size="16"
                        onChange={(e) => ownProps.handleStoreCodeChange(e)}
                        value={store.store_code}
                        required />
                </dd>
            );
        },
        renderStoreName() {
            return (
                <dd>
                    <input type="text" maxLength="32" name="store_name" id="store_name"
                        size="32"
                        onChange={(e) => this.handleStoreNameChange(e)}
                        value={store.store_name}
                        required />
                </dd>
            );
        },
        renderStoreStatus() {
            return (
                <dd>
                    <DropDownList
                        data={storeStatus}
                        defaultValue={store.store_status}
                        selectName='store_status'
                        onChange={(e) => this.handleStoreStatusChange(e)}
                        />
                </dd>
            );
        },
        renderStorePostalCode() {
            return (
                <dd>
                    〒　
                    <MaskedInput
                        className="widget__page__input__input"
                        mask="111-1111"
                        size="9"
                        name="store_postal_code"
                        placeholder=" "
                        placeholderChar=" "
                        value={store.store_postal_code || ""}
                        onChange={(e) => this.handleStorePostalCodeChange(e)} />
                    <label className="lable_example">{Globalize.localize('map_example', Globalize.culture())}）1500043</label>
                </dd>
            );
        },
        renderStorePrefecture() {
            return (
                <dd className="widget__page__input__prefecture__select">
                    <DropDownList
                        data={Const.PREFECTURE_ARRAY}
                        hasEmptyOption={true}
                        onChange={(e) => this.handleStorePrefectureChange(e)}
                        defaultValue={store.store_prefectures}
                        eachCallback={(name, index) => <option value={('0' + (index + 1)).slice(-2)} key={index}>{name}</option>}/>
                </dd>
            );
        },
        renderStoreCity() {
            return (
                <dd>
                    <input type="text" maxLength="64" size="64"
                        className="inputFormData"
                        value={store.store_address || ""}
                        name="store_address"
                        onChange={(e) => this.handleStoreAddressChange(e)} />
                </dd>
            );
        },
        renderStoreBuilding() {
            return (
                <dd>
                    <input type="text" maxLength="32" size="32"
                        className="inputFormData"
                        name="store_building"
                        value={store.store_building || ""}
                        onChange={(e) => this.handleStoreBuildingChange(e)} />
                </dd>
            );
        },
        renderStoreAccessChange(){
            return (
                <dd>
                    <input type="text" maxLength="64" size="64"
                        className="inputFormData"
                        value={store.store_access || ""}
                        name="store_access"
                        onChange={(e) => this.handleStoreAccessChange(e)} />
                </dd>
            );
        },
        renderStorePhoneNo() {
            return (
                <dd>
                    <MaskedInput
                        className="widget__page__input__input"
                        mask="1111111111"
                        size="12"
                        name="store_phone_no"
                        id="store_phone_no"
                        placeholderChar=" "
                        value={store.store_phone_no || ""}
                        onChange={(e) => this.handleStorePhoneNoChange(e)} />
                    <label style={{ color: 'rgba(160, 138, 138, 0.5)', marginLeft : '20px' }}>{Globalize.localize('map_example', Globalize.culture())}）0337707030</label>
                </dd>
            );
        },
        renderStoreFaxNo(){
            return (
                <dd>
                    <MaskedInput
                        className="widget__page__input__input"
                        mask="1111111111"
                        size="12"
                        name="store_fax_no"
                        id="store_fax_no"
                        placeholderChar=" "
                        value={store.store_fax_no || ""}
                        onChange={(e) => this.handleStoreFaxNoChange(e)} />
                    <label style={{ color: 'rgba(160, 138, 138, 0.5)', marginLeft : '20px' }}>{Globalize.localize('map_example', Globalize.culture())}）0337707030</label>
                </dd>
            );
        },
        renderStoreManagerName(){
            return (
                <dd>
                    <input type="text" maxLength="32" size="32" name="store_manager_name" id="store_manager_name"
                           onChange={(e) => this.handleStoreManagerNameChange(e)}
                           value={store.store_manager_name}
                           required />
                </dd>
            );
        },
        renderStoreBusinessHours(){
            return (
                <dd>
                    <textarea
                        className="widget__page__input__textarea"
                        onChange={(e) => this.handleStoreBusinessHourChange(e)}
                        value={store.store_business_hours}>
                    </textarea>
                </dd>
            );
        },
        renderStoreBusinessHoursFrom(){
            return (
                <dd>
                    <MaskedInput
                        className="widget__page__input__input"
                        mask="11:11"
                        size="5"
                        name="store_business_hours_from"
                        id="store_business_hours_from"
                        placeholderChar=" "
                        value={store.store_business_hours_from}
                        onChange={(e) => this.handleStoreBusinessHourFromChange(e)}
                        required={true}
                    />
                </dd>
            );
        },
        renderStoreBusinessHoursTo(){
            return (
                <dd>
                    <MaskedInput
                        className="widget__page__input__input"
                        mask="11:11"
                        size="5"
                        name="store_business_hours_to"
                        id="store_business_hours_to"
                        placeholderChar=" "
                        value={store.store_business_hours_to}
                        onChange={(e) => this.handleStoreBusinessHourToChange(e)}
                        required
                    />
                </dd>
            );
        },
        renderStoreRegularHoliday(){
            return (
                <dd>
                    <input type="text" maxLength="16" size="16" name="store_regular_holiday" id="store_regular_holiday"
                           onChange={(e) => this.handleStoreRegularHolidayChange(e)}
                           value={store.store_regular_holiday}
                           required />
                </dd>
            );
        },
        renderStoreParkingLot(){
            return (
                <dd>
                    <input type="text" maxLength="16" size="16" name="store_parking_lot" id="store_parking_lot"
                           onChange={(e) => this.handleStoreParkingLotChange(e)}
                           value={store.store_parking_lot}
                           required />
                </dd>
            );
        },
        renderStoreSeat(){
            return (
                <dd>
                    <input type="text" maxLength="16" size="16" name="store_seat" id="store_seat"
                           onChange={(e) => this.handleStoreSeatChange(e)}
                           value={store.store_seat}
                           required />
                </dd>
            );
        },
        renderStoreKidsRoom(){
            return (
                <dd>
                    <input type="text" maxLength="16" size="16" name="store_kids_room" id="store_kids_room"
                           onChange={(e) => this.handleStoreKidsRoomChange(e)}
                           value={store.store_kids_room}
                           required />
                </dd>
            );
        },
        renderStoreSignatureBlock(){
            return (
                <dd>
                    <textarea
                        className="widget__page__input__textarea"
                        onChange={(e) => this.handleStoreSignatureBlockChange(e)}
                        value={store.store_signature_block}>
                    </textarea>
                </dd>
            );
        },
        renderStoreTermsOfUse(){
            return (
                <dd>
                    <textarea
                        className="widget__page__input__textarea"
                        onChange={(e) => this.handleStoreTermsOfUseChange(e)}
                        value={store.store_terms_of_use}>
                    </textarea>
                </dd>
            );
        },
        renderStorePrivacyPolicy(){
            return (
                <dd>
                    <textarea
                        className="widget__page__input__textarea"
                        onChange={(e) => this.handleStorePrivacyPolicyChange(e)}
                        value={store.store_privacy_policy}>
                    </textarea>
                </dd>
            );
        },
        renderStoreFreeword(){
            return (
                <dd>
                    <textarea
                        className="widget__page__input__textarea"
                        onChange={(e) => this.handleStoreFreeWordChange(e)}
                        value={store.store_freeword}>
                    </textarea>
                </dd>
            );
        },
        renderStoreHeaderPictureId(){
            return (
                <dd>
                    <div className="contents__container__logo-container mb10 mt10">
                        <div className="contents__container__image-btn">
                            <input type="button"
                                   value={Globalize.localize('l_image_selection', Globalize.culture())}
                                   className="contents__container__input-button"
                                   onClick={() => {ownProps.onOpenSelectPicture()}} />
                        </div>
                        <div className="contents__container__image-name">{store.store_header_picture_name}</div>
                        {store.store_header_picture_id > 0 ?
                            <div className="contents__container__del-btn">
                                <img src="/assets/img/img-dell.png" alt={Globalize.localize('l_deletion', Globalize.culture())} height="20" width="20" onClick={() => {ownProps.onDeletePicture()}}/>
                            </div> : ""}
                    </div>
                    <div className="contents__container__logo mb10">
                        <img src={store.store_header_picture_url}  className="preview_image"/>
                    </div>
                </dd>
            );
        },
        renderStoreAreaLId(areas){
            return (
                <dd>
                    <DropDownList
                        data={areas}
                        defaultValue={store.store_area_L_id || ''}
                        hasEmptyOption={true}
                        onChange={this.handleStoreAreaLChange}
                        eachCallback={eachArea(Const.AREA_TYPE_LARGE, (area) => {return area.brand_id == store.brand_id})}/>
                </dd>
            );
        },
        renderStoreAreaMId(areas){
            return (
                <dd>
                    <DropDownList
                        data={areas}
                        defaultValue={store.store_area_M_id || ''}
                        hasEmptyOption={true}
                        onChange={this.handleStoreAreaMChange}
                        eachCallback={eachArea(Const.AREA_TYPE_MEDIUM, (area) => {return area.brand_id == store.brand_id})}/>
                </dd>
            );
        },
        renderStoreAreaSId(areas){
            return (
                <dd>
                    <DropDownList
                        data={areas}
                        defaultValue={store.store_area_S_id || ''}
                        hasEmptyOption={true}
                        onChange={this.handleStoreAreaSChange}
                        eachCallback={eachArea(Const.AREA_TYPE_SMALL, (area) => {return area.brand_id == store.brand_id})}/>
                </dd>
            );
        },
        renderStoreSeoKey1(){
            return (
                <dd>
                    <input type="text" maxLength="32" size="32" name="store_seo_key1" id="store_seo_key1"
                           onChange={(e) => this.handleStoreSeoKey1Change(e)}
                           value={store.store_seo_key1}
                           required />
                </dd>
            );
        },
        renderStoreSeoKey2(){
            return (
                <dd>
                    <input type="text" maxLength="32" size="32" name="store_seo_key2" id="store_seo_key2"
                           onChange={(e) => this.handleStoreSeoKey2Change(e)}
                           value={store.store_seo_key2}
                           required />
                </dd>
            );
        },
        renderStoreSeoKey3(){
            return (
                <dd>
                    <input type="text" maxLength="32" size="32" name="store_seo_key3" id="store_seo_key3"
                           onChange={(e) => this.handleStoreSeoKey3Change(e)}
                           value={store.store_seo_key3}
                           required />
                </dd>
            );
        },

        renderButton() {
            if(this.props.isCreate){
                var comment = Globalize.localize('check_store_create', Globalize.culture());
            }else{
                var comment = Globalize.localize('check_store_update', Globalize.culture());
            }
            return (
                <input type="button" value={comment} onClick={this.onSubmit} className="btn-base"/>
            );
        },
        dispatch
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(FormInput)
