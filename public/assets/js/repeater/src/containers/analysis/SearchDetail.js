import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DropDownList from '../../components/commons/DropDownList'
import CheckList from '../../components/commons/CheckList'
import Selection from '../../components/commons/Selection'
import { eachCompany, eachBrand, eachStore, couponStatus } from '../../utils/CommonUtils'

import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE } from '../../constants/Constants'


class SearchDetail extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.handleSubmit();
    }

    render() {
        const {currentUser, companies, brands, stores,areas, filter, handleCompanyIdChange, handleBrandIdChange, handleStoreIdChange} = this.props;
        return (
            <form className="search" acceptCharset="utf-8" >
                <div className="widget__page__information__select">
                    <dl>
                        <dt>{Globalize.localize('map_company_name', Globalize.culture())}</dt>
                        <dd>
                            <div style={{display: 'inline-flex'}}>
                                {currentUser.authority >= USER_AUTHORITY_COMPANY ? currentUser.company_name :
                                    <DropDownList
                                        data={companies}
                                        defaultValue={filter.company_id}
                                        hasEmptyOption={true}
                                        onChange={handleCompanyIdChange}
                                        eachCallback={eachCompany()}/>
                                }
                            </div>
                        </dd>
                    </dl>
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('map_brand_name', Globalize.culture())}</dt>
                        <dd>
                            {
                                currentUser.authority >= USER_AUTHORITY_BRAND ? currentUser.brand_name :
                                    <CheckList
                                        id="brands"
                                        data={brands}
                                        checkedItems={filter.brand_ids}
                                        onChangedSelection={handleBrandIdChange}
                                        dataLabelKey='brand_name'
                                        dataValueKey='id'
                                        isVisibleData={data => data.company_id == filter.company_id}
                                        />
                            }
                        </dd>
                    </dl>
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('map_store_name', Globalize.culture())}</dt>
                        <dd>
                            <Selection
                                hasArea={true}
                                data={stores}
                                checkedItems={filter.store_ids}
                                changeItem={handleStoreIdChange}
                                nameField="store_name"
                                checkCondition={store => filter.brand_ids.length > 0 && filter.brand_ids.indexOf(store.brand_id) >= 0}
                            />
                        </dd>
                    </dl>
                    <dl className="widget__page__button" style={{ border: '0px' }}>
                        <div className="button_clear"><input onClick={this.onSubmit} className="btn-base" type="submit" defaultValue="条件で検索する" /></div>
                    </dl>
                </div>
            </form>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        companies: state.companies,
        brands: state.brands,
        stores: state.stores,
        areas: state.areas
    }
};

export default connect(mapStateToProps)(SearchDetail);
