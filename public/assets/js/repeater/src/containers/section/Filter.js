import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE } from '../../constants/Constants'
import { Link } from 'react-router'
import * as Const from '../../constants/Constants';
import DropDownList from '../../components/commons/DropDownList';

import { fetchSections, clearSections } from '../../actions/section'

import { eachCompany, eachBrand } from '../../utils/CommonUtils'

class Filter extends Component {

    onChangeCompany(companyId) {
        let filter = this.props.filter;
        filter.company_id = companyId;
        filter.brand_id = 0;
        this.props.onChangeFilter(filter);
    }

    onChangeBrand(brandId) {
        let filter = this.props.filter;
        filter.brand_id = brandId;
        this.props.onChangeFilter(filter);
    }

    onChangeName(name) {
        let filter = this.props.filter;
        filter.section_name = name;
        this.props.onChangeFilter(filter);
    }

    render() {
        const { currentUser, companies, brands, handleSubmit, filter } =  this.props;
        return (
            <dl className="widget">
                <dt className="widget__title ">
                    <img src="/assets/img/icon-search.png" className="info__icon"/>
                    <span>{Globalize.localize('filter_search_condition', Globalize.culture())}　{Globalize.localize('filter_search_description', Globalize.culture())}</span>
                </dt>
                <dd className="widget__contents">
                    <form className="" acceptCharset="utf-8" onSubmit={handleSubmit}>
                        <div className="widget__page__section__select">
                            <div className="section_table">
                                <dl className="section_row">
                                    <dt className="section_cell">
                                        <label htmlFor="company">{Globalize.localize('map_company_name', Globalize.culture())}</label>
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
                                        <label htmlFor="brand">{Globalize.localize('map_brand_name', Globalize.culture())}</label>
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
                                        {Globalize.localize('map_section_name', Globalize.culture())}
                                    </dt>
                                    <dd className="section_cell_content section_dropdown__list">
                                        <input value={filter.section_name} onChange={(e) => this.onChangeName(e.target.value)}/>
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

    componentWillUnmount() {
        const { onWillUnmount } = this.props;
        onWillUnmount();
    }
}

Filter.propTypes = {
    onSubmit: PropTypes.func
};

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        companies: state.currentCompanies,
        brands: state.currentBrands,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onWillUnmount: () => {
            dispatch(clearSections());
        },
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);

