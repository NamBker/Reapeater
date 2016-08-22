import React, { Component, PropTypes } from 'react';
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { Link } from 'react-router'
import * as Const from '../../constants/Constants'
import { fetchCompanies } from '../../actions/company'

class FormInput extends Component {

    //shouldComponentUpdate(nextProps, nextState) {
    //    return this.props.brand != nextProps.brand;
    //}

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchCompanies());
    }

    render() {
        return (
            <dd className="widget__contents">
                <div className="widget__page__information__select widget__page__section__form">
                    { /* 企業名 */ }
                    <dl>
                        <dt>{Globalize.localize('map_company_name', Globalize.culture())}</dt>
                        {this.props.renderCompany()}
                    </dl>
                    { /* ブランドコード */ }
                    <dl>
                        <dt>{Globalize.localize('map_brand_code', Globalize.culture())}</dt>
                        {this.props.renderBrandCode()}
                    </dl>
                    { /* ブランド名 */ }
                    <dl>
                        <dt>{Globalize.localize('map_brand_name', Globalize.culture())}</dt>
                        {this.props.renderBrandName()}
                    </dl>
                    { /* 状態 */ }
                    <dl>
                        <dt>{Globalize.localize('map_status', Globalize.culture())}</dt>
                        {this.props.renderBrandStatus()}
                    </dl>
                    { /* 住所 */ }
                    <dl className="widget__page__section__address">
                        <p>{Globalize.localize('map_address', Globalize.culture())}</p>
                        <span>{Globalize.localize('map_postal_code', Globalize.culture())}</span>
                        {this.props.renderBrandPostalCode()}
                        <span>{Globalize.localize('map_prefecture', Globalize.culture())}</span>
                        {this.props.renderBrandPrefecture()}
                        <span>{Globalize.localize('map_city', Globalize.culture())}</span>
                        {this.props.renderBrandCity()}
                        <span>{Globalize.localize('map_building', Globalize.culture())}</span>
                        {this.props.renderBrandBuilding()}
                    </dl>
                    { /* 電話番号 */ }
                    <dl>
                        <dt>{Globalize.localize('map_phone_no', Globalize.culture())}</dt>
                        {this.props.renderBrandPhoneNo()}
                    </dl>
                    { /* 定休日 */ }
                    <dl>
                        <dt>{Globalize.localize('map_regular_holiday', Globalize.culture())}</dt>
                        {this.props.renderBrandRegularHoliday()}
                    </dl>
                    { /* メール署名 */ }
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('map_signature_block', Globalize.culture())}</dt>
                        {this.props.renderBrandSignatureBlock()}
                    </dl>
                    { /* 利用規約 */ }
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('map_terms_of_use', Globalize.culture())}</dt>
                        {this.props.renderBrandTermsOfUse()}
                    </dl>
                    { /* プラバシーポリシー */ }
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('map_privacy_policy', Globalize.culture())}</dt>
                        {this.props.renderBrandPrivacyPolicy()}
                    </dl>
                    { /* フリーワード */ }
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('map_free_word', Globalize.culture())}</dt>
                        {this.props.renderBrandFreeWord()}
                    </dl>
                    { /* 店舗一覧表示タイプ */ }
                    <dl>
                        <dt>{Globalize.localize('map_store_display_type', Globalize.culture())}</dt>
                        {this.props.renderBrandStoreDisplayType()}
                    </dl>
                    { /* googleアナリティクスID */ }
                    <dl>
                        <dt>{Globalize.localize('map_google_analytics_id', Globalize.culture())}</dt>
                        {this.props.renderBrandGoogleAnalyticsId()}
                    </dl>
                    { /* googleアナリティクスパス */ }
                    <dl>
                        <dt>{Globalize.localize('map_google_analytics_pass', Globalize.culture())}</dt>
                        {this.props.renderBrandGoogleAnalyticsPass()}
                    </dl>
                    { /* 会員登録フォームボタンの上に表示するテキスト */ }
                    <dl>
                        <dt>{Globalize.localize('map_member_registration_form_text_up', Globalize.culture())}</dt>
                        {this.props.renderBrandMemberRegistrationFormTextUp()}
                    </dl>
                    { /* 会員登録フォームボタンの下に表示するテキスト */ }
                    <dl>
                        <dt>{Globalize.localize('map_member_registration_form_text_down', Globalize.culture())}</dt>
                        {this.props.renderBrandMemberRegistrationFormTextDown()}
                    </dl>
                </div>
                <div className="widget__welcome__contents__bottom" style={{ textAlign: 'center' }}>
                    {this.props.renderButton()}
                </div>
            </dd>

        )
    }
}

export default FormInput;
