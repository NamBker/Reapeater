import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { brand_status } from '../../utils/CommonUtils'
import { fetchBrands } from '../../actions/brand'
import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE } from '../../constants/Constants'
import { Link } from 'react-router'
import { eachCompany } from '../../utils/CommonUtils'
import * as Const from '../../constants/Constants';

class Filter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { currentUser, onSubmit, filter, companies, handleCompanyIdChange, handleBrandCodeChange, handleBrandCodeName, handleStatusChange } =  this.props;
        return (
            <dl className="widget mb20">
                <dt className="widget__title ">
                    <img src="/assets/img/icon-search.png" className="info__icon"/>
                    <span>{Globalize.localize('filter_search_condition', Globalize.culture())}　{Globalize.localize('filter_search_description', Globalize.culture())}</span>
                </dt>
                <dd className="widget__contents">
                    <form className="" acceptCharset="utf-8" onSubmit={onSubmit}>
                        <div className="widget__page__section__select">
                            <div className="section_table">
                                <dl className="section_row">
                                    <dt className="section_cell">
                                        <label htmlFor="company">{Globalize.localize('map_company_name', Globalize.culture())}</label>
                                    </dt>
                                    <dd className="section_cell_content section_dropdown__list">
                                        <select className="form-control" id="company_id" name="company_id"
                                                value={filter.company_id || ''}
                                                onChange={handleCompanyIdChange}>
                                            {currentUser.authority < Const.USER_AUTHORITY_COMPANY ? <option></option> : null}
                                            {companies.map(company => <option value={company.id} key={company.id}>{company.company_name}</option>)}
                                        </select>
                                    </dd>
                                </dl>
                                <dl className="section_row">
                                    <dt className="section_cell">
                                        {Globalize.localize('map_brand_code', Globalize.culture())}
                                    </dt>
                                    <dd className="section_cell_content section_dropdown__list">
                                        <input maxLength="16" onChange={handleBrandCodeChange}/>
                                    </dd>
                                </dl>
                                <dl className="section_row">
                                    <dt className="section_cell">
                                        {Globalize.localize('map_brand_name', Globalize.culture())}
                                    </dt>
                                    <dd className="section_cell_content section_dropdown__list">
                                        <input maxLength="32" onChange={handleBrandCodeName}/>
                                    </dd>
                                </dl>
                                <dl className="section_row">
                                    <dt className="section_cell">
                                        <label htmlFor="brand">{Globalize.localize('map_status', Globalize.culture())}</label>
                                    </dt>
                                    <dd className="section_cell_content section_dropdown__list">
                                        <select className="form-control" id="brand_status" name="brand_status"
                                                value={filter.brand_status || ''}
                                                onChange={handleStatusChange}>

                                            <option value="" key=""></option>
                                            <option value="0" key="0">{Globalize.localize('business_condition_delete', Globalize.culture())}</option>
                                            <option value="1" key="1">{Globalize.localize('business_condition_close', Globalize.culture())}</option>
                                            <option value="2" key="2">{Globalize.localize('business_condition_prepare', Globalize.culture())}</option>
                                            <option value="3" key="3">{Globalize.localize('business_condition_open', Globalize.culture())}</option>
                                        </select>
                                    </dd>
                                </dl>
                            </div>
                            <div className="rowspanned">
                                <button className="btn-base">{Globalize.localize('filter_search', Globalize.culture())}</button>
                            </div>
                        </div>
                    </form>
                </dd>
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


export default connect(mapStateToProps)(Filter);
