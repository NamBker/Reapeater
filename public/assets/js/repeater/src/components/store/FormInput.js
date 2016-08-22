import React, { Component, PropTypes } from 'react';

class FormInput extends Component {

    render() {
        return (
            <dd className="widget__page__input__contents mb20">
                <div className="widget__page__input__contents__table mt20 mb20">
                    { /* 企業名 */ }
                    <dl>
                        <dt>{Globalize.localize('map_company', Globalize.culture())}</dt>
                        {this.props.renderCompany()}
                    </dl>
                    { /* ブランド名 */ }
                    <dl>
                        <dt>{Globalize.localize('map_brand', Globalize.culture())}</dt>
                        {this.props.renderBrand()}
                    </dl>
                    { /* 店舗コード */ }
                    <dl>
                        <dt>{Globalize.localize('map_store_code', Globalize.culture())}</dt>
                        {this.props.renderStoreCode()}
                    </dl>
                    { /* 店舗名 */ }
                    <dl>
                        <dt>{Globalize.localize('map_store_name', Globalize.culture())}</dt>
                        {this.props.renderStoreName()}
                    </dl>
                    { /* 状態 */ }
                    <dl>
                        <dt>{Globalize.localize('map_status', Globalize.culture())}</dt>
                        {this.props.renderStoreStatus()}
                    </dl>
                    { /* 住所 */ }
                    <dl className="widget__page__input__subcelltitle">
                        <p>{Globalize.localize('map_address', Globalize.culture())}</p>
                        <span>{Globalize.localize('map_postal_code', Globalize.culture())}</span>
                        {this.props.renderStorePostalCode()}
                        <span>{Globalize.localize('map_prefecture', Globalize.culture())}</span>
                        {this.props.renderStorePrefecture()}
                        <span>{Globalize.localize('map_city', Globalize.culture())}</span>
                        {this.props.renderStoreCity()}
                        <span>{Globalize.localize('map_building', Globalize.culture())}</span>
                        {this.props.renderStoreBuilding()}
                    </dl>
                    { /* アクセス */ }
                    <dl>
                        <dt>{Globalize.localize('map_access', Globalize.culture())}</dt>
                        {this.props.renderStoreAccessChange()}
                    </dl>
                    { /* 電話番号 */ }
                    <dl>
                        <dt>{Globalize.localize('map_phone_no', Globalize.culture())}</dt>
                        {this.props.renderStorePhoneNo()}
                    </dl>
                    { /* FAX */ }
                    <dl>
                        <dt>{Globalize.localize('map_fax_no', Globalize.culture())}</dt>
                        {this.props.renderStoreFaxNo()}
                    </dl>
                    { /* 店長名 */ }
                    <dl>
                        <dt>{Globalize.localize('map_manager_name', Globalize.culture())}</dt>
                        {this.props.renderStoreManagerName()}
                    </dl>
                    { /* 営業時間 */ }
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('map_business_hours', Globalize.culture())}</dt>
                        {this.props.renderStoreBusinessHours()}
                    </dl>
                    { /* 営業時間_開店 */ }
                    { /*
                    <dl>
                        <dt>{Globalize.localize('map_business_hours_from', Globalize.culture())}</dt>
                        {this.props.renderStoreBusinessHoursFrom()}
                    </dl>
                     */ }
                    { /* 営業時間_閉店 */ }
                    { /*
                    <dl>
                        <dt>{Globalize.localize('map_business_hours_to', Globalize.culture())}</dt>
                        {this.props.renderStoreBusinessHoursTo()}
                    </dl>
                    */ }
                    { /* 定休日 */ }
                    <dl>
                        <dt>{Globalize.localize('map_regular_holiday', Globalize.culture())}</dt>
                        {this.props.renderStoreRegularHoliday()}
                    </dl>
                    { /* 駐車場情報 */ }
                    <dl>
                        <dt>{Globalize.localize('map_parking_lot', Globalize.culture())}</dt>
                        {this.props.renderStoreParkingLot()}
                    </dl>
                    { /* 席情報 */ }
                    <dl>
                        <dt>{Globalize.localize('map_seat', Globalize.culture())}</dt>
                        {this.props.renderStoreSeat()}
                    </dl>
                    { /* キッズルーム */ }
                    <dl>
                        <dt>{Globalize.localize('map_kids_room', Globalize.culture())}</dt>
                        {this.props.renderStoreKidsRoom()}
                    </dl>
                    { /* メール署名 */ }
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('map_signature_block', Globalize.culture())}</dt>
                        {this.props.renderStoreSignatureBlock()}
                    </dl>
                    { /* 利用規約 */ }
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('map_terms_of_use', Globalize.culture())}</dt>
                        {this.props.renderStoreTermsOfUse()}
                    </dl>
                    { /* プライバシーポリシー */ }
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('map_privacy_policy', Globalize.culture())}</dt>
                        {this.props.renderStorePrivacyPolicy()}
                    </dl>
                    { /* フリーワード */ }
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('map_freeword', Globalize.culture())}</dt>
                        {this.props.renderStoreFreeword()}
                    </dl>
                    { /* 店舗ヘッダ画像 */ }
                    <dl className="checkbox__row">
                        <dt className="checkbox__row">{Globalize.localize('map_header_picture_id', Globalize.culture())}</dt>
                        {this.props.renderStoreHeaderPictureId()}
                    </dl>
                    { /* エリア(大分類) */ }
                    <dl>
                        <dt>{Globalize.localize('map_area_L', Globalize.culture())}</dt>
                        {this.props.renderStoreAreaLId(this.props.props.areas)}
                    </dl>
                    { /* エリア(中分類) */ }
                    <dl>
                        <dt>{Globalize.localize('map_area_M', Globalize.culture())}</dt>
                        {this.props.renderStoreAreaMId(this.props.props.areas)}
                    </dl>
                    { /* エリア(小分類) */ }
                    <dl>
                        <dt>{Globalize.localize('map_area_S', Globalize.culture())}</dt>
                        {this.props.renderStoreAreaSId(this.props.props.areas)}
                    </dl>
                    { /* SEOキーワード1 */ }
                    <dl>
                        <dt>{Globalize.localize('map_seo_key1', Globalize.culture())}</dt>
                        {this.props.renderStoreSeoKey1()}
                    </dl>
                    { /* SEOキーワード2 */ }
                    <dl>
                        <dt>{Globalize.localize('map_seo_key2', Globalize.culture())}</dt>
                        {this.props.renderStoreSeoKey2()}
                    </dl>
                    { /* SEOキーワード3 */ }
                    <dl>
                        <dt>{Globalize.localize('map_seo_key3', Globalize.culture())}</dt>
                        {this.props.renderStoreSeoKey3()}
                    </dl>
                </div>
                <div className="widget__page__input__bottom mb20">
                    {this.props.renderButton()}
                </div>
            </dd>

        )
    }
}

export default FormInput;
