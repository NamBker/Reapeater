import React, { Component, PropTypes } from 'react';
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { Link } from 'react-router'
import * as Const from '../../constants/Constants'

class FormInput extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.section != nextProps.section
        || nextProps.companies.length > 0
        || nextProps.brands.length > 0
        || nextProps.stores.length > 0;
    }

    render() {
        return (
            <dd className="widget__contents">
                <div className="widget__page__information__select widget__page__section__form">
                    <dl>
                        <dt>企業名</dt>
                        {this.props.renderCompany()}
                    </dl>
                    <dl>
                        <dt>ブランド名</dt>
                        {this.props.renderBrand()}
                    </dl>
                    <dl>
                        <dt>事業部名</dt>
                        {this.props.renderSectionName()}
                    </dl>
                    <dl>
                        <dt>状態</dt>
                        {this.props.renderStatus()}
                    </dl>
                    <dl className="widget__page__section__address">
                        <p>住所</p>
                        <span>郵便番号</span>
                        {this.props.renderZipCode()}
                        <span>都道府県</span>
                        {this.props.renderPrefectures()}
                        <span>市区町村</span>
                        {this.props.renderDistrict()}
                        <span style={{ marginLeft : '0px', paddingLeft : '70px' }}>番地・建物</span>
                        {this.props.renderBuildingAddress()}
                    </dl>
                    <dl>
                        <dt>電話番号</dt>
                        {this.props.renderPhoneNo()}
                    </dl>
                    <dl className="widget__section__store__form">
                        <dt style={{height: this.props.location.pathname.search('confirm') >= 0 ? '90px' : '200px'}}>管轄店舗</dt>
                        {this.props.renderStoresHolder()}
                    </dl>
                </div>
                <div className="widget__welcome__contents__bottom" style={{ textAlign: 'center' }}>{this.props.renderButton()}</div>
            </dd>
        )
    }
}

export default FormInput;