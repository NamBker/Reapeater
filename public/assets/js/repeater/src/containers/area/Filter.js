import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DropDownList from '../../components/commons/DropDownList'
import { USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE, PER_PAGE } from '../../constants/Constants'
import { eachCompany, eachBrand } from '../../utils/CommonUtils'

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

    onChangeAreaType(areaType) {
        let filter = this.props.filter;
        filter.area_type = areaType;
        this.props.onChangeFilter(filter);
    }

    render() {
        const { companies ,brands, areaTypes, currentUser, filter, onSubmit } =  this.props;
        return (
            <dl className="widget">
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
                                        <label htmlFor="brand">{Globalize.localize('map_area', Globalize.culture())}</label>
                                    </dt>
                                    <dd className="section_cell_content section_dropdown__list">
                                        <DropDownList
                                            data={areaTypes}
                                            defaultValue={filter.area_type}
                                            hasEmptyOption={true}
                                            onChange={(e) => this.onChangeAreaType(e.target.value)}
                                            eachCallback={(label, index) => <option key={"area_type_" + index} value={index + 1}>{label}</option>}/>
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
        brands: state.currentBrands,
    }
};

export default connect(mapStateToProps)(Filter);

