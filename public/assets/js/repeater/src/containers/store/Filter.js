import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import DropDownList from '../../components/commons/DropDownList';

import { eachCompany, eachBrand } from '../../utils/CommonUtils';

// import Constants
import { USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND } from '../../constants/Constants'

class Filter extends Component {
    constructor(props) {
        super(props);
    }

    onChangeCompany(companyId) {
        let filter = this.props.filter;
        filter.company_id = companyId;
        this.props.onChangeFilter(filter);
    }

    onChangeBrand(brandId) {
        let filter = this.props.filter;
        filter.brand_id = brandId;
        this.props.onChangeFilter(filter);
    }

    onChangeCode(code) {
        let filter = this.props.filter;
        filter.store_code = code;
        this.props.onChangeFilter(filter);
    }

    onChangeName(name) {
        let filter = this.props.filter;
        filter.store_name = name;
        this.props.onChangeFilter(filter);
    }

    onChangeStatus(status) {
        let filter = this.props.filter;
        filter.store_status = status;
        this.props.onChangeFilter(filter);
    }

    render() {
        const { filter, currentUser, companies, brands, storeStatuses, onSubmit } =  this.props;
        return (
            <dl className="widget mb20">
                <dt className="widget__page__search widget__page__input__title">
                    <div className="widget__page__type__search"/>
                    <span>{Globalize.localize('filter_search_condition', Globalize.culture())}</span>
                    <span>{Globalize.localize('filter_search_description', Globalize.culture())}</span>
                </dt>
                <dd className="widget__contents">
                    <form className="" acceptCharset="utf-8" onSubmit={onSubmit}>
                        <div className="widget__page__section__select">
                            <div className="section_table">
                                <dl className="section_row">
                                    <dt className="section_cell">
                                        <label htmlFor="company">{Globalize.localize('map_company', Globalize.culture())}</label>
                                    </dt>
                                    <dd className="section_cell_content section_dropdown__list">
                                        {currentUser.authority >= USER_AUTHORITY_COMPANY ?
                                            <span className="ml10">{currentUser.company_name}</span> :
                                            <DropDownList
                                                data={companies}
                                                defaultValue={filter.company_id}
                                                hasEmptyOption={true}
                                                onChange={(e) => this.onChangeCompany(e.target.value)}
                                                eachCallback={eachCompany()}/>
                                        }
                                    </dd>
                                </dl>
                                <dl className="section_row">
                                    <dt className="section_cell">
                                        <label htmlFor="brand">{Globalize.localize('map_brand', Globalize.culture())}</label>
                                    </dt>
                                    <dd className="section_cell_content section_dropdown__list">
                                        {currentUser.authority >= USER_AUTHORITY_BRAND ?
                                            <span className="ml10">{currentUser.brand_name}</span> :
                                            <DropDownList
                                                data={brands}
                                                defaultValue={filter.brand_id}
                                                hasEmptyOption={true}
                                                onChange={(e) => this.onChangeBrand(e.target.value)}
                                                eachCallback={eachBrand(brand => brand.company_id == filter.company_id)}/>
                                        }
                                    </dd>
                                </dl>
                                <dl className="section_row">
                                    <dt className="section_cell">
                                        {Globalize.localize('map_store_code', Globalize.culture())}
                                    </dt>
                                    <dd className="section_cell_content section_dropdown__list">
                                        <input maxLength="16" onChange={(e) => this.onChangeCode(e.target.value)} value={filter.store_code}/>
                                    </dd>
                                </dl>
                                <dl className="section_row">
                                    <dt className="section_cell">
                                        {Globalize.localize('map_store_name', Globalize.culture())}
                                    </dt>
                                    <dd className="section_cell_content section_dropdown__list">
                                        <input maxLength="32" onChange={(e) => this.onChangeName(e.target.value)} value={filter.store_name}/>
                                    </dd>
                                </dl>
                                <dl className="section_row">
                                    <dt className="section_cell">
                                        <label htmlFor="brand">{Globalize.localize('map_status', Globalize.culture())}</label>
                                    </dt>
                                    <dd className="section_cell_content section_dropdown__list">
                                        <DropDownList
                                            data={storeStatuses}
                                            defaultValue={filter.store_status}
                                            hasEmptyOption={true}
                                            onChange={(e) => this.onChangeStatus(e.target.value)}
                                            eachCallback={(label, index) => <option key={"store_status_" + index} value={index}>{label}</option>}/>
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
        companies : state.currentCompanies,
        brands: state.currentBrands
    }
};

export default connect(mapStateToProps)(Filter);
