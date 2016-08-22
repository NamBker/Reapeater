import React, { Component, PropTypes } from 'react';
import moment from 'moment'
import { connect } from 'react-redux';
import { Link } from 'react-router'
import Selection from '../../components/commons/Selection'
import DropDownList from '../../components/commons/DropDownList'
import CheckList from '../../components/commons/CheckList'
import { informationStatus, eachCompany } from '../../utils/CommonUtils'
import DatePicker from 'react-datepicker'
import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE } from '../../constants/Constants'

class SearchDetail extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.filter != nextProps.filter;
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.onDetailSearch();
    }

    render() {
        const { currentUser, companies, brands, stores, areas, filter,
            handleCompanyIdChange ,handlePublisherBrandIds, handlePublisherStoreIds, handleStatusChange, checkAllStore, checkConditionShowStore, handleEffectivePeriodFromChange, handleEffectivePeriodToChange } =  this.props;
        return (
            <form className="search" acceptCharset="utf-8" onSubmit={(e) => this.onSubmit(e)}>
            <div className="widget__page__information__select">
                <dl>
                    <dt style={{ border : '0px'}}>{Globalize.localize('map_company_name', Globalize.culture())}</dt>
                    <dd style={{ border : '0px'}}>
                        <div style={{display: 'inline-flex'}}>
                            {currentUser.authority >= USER_AUTHORITY_COMPANY ? currentUser.company_name :
                                <DropDownList
                                    data={companies}
                                    defaultValue={this.props.filter.company_id}
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
                        {currentUser.authority >= USER_AUTHORITY_BRAND ? currentUser.brand_name :
                            <CheckList
                                    id="information__list__brand__check__list"
                                    data={brands}
                                    checkedItems={filter.brand_ids}
                                    onChangedSelection={handlePublisherBrandIds}
                                    dataLabelKey='brand_name'
                                    dataValueKey='id'
                                    isVisibleData={data => {return parseInt(filter.company_id) === data.company_id}}/>
                        }
                        </dd>
                </dl>
                <dl className="checkbox__row">
                    <dt>{Globalize.localize('store', Globalize.culture())}</dt>
                    <dd>
                        <Selection
                            data={stores}
                            checkCondition={store => filter.brand_ids.length > 0 && filter.brand_ids.indexOf(store.brand_id) >= 0}
                            checkedItems={filter.store_ids}
                            nameField="store_name"
                            setCheckItems={(checkItems) => { filter.stores_ids = checkItems }}
                            hasArea={true}
                            changeItem={handlePublisherStoreIds}/>
                    </dd>
                </dl>
                <dl>
                    <dt>{Globalize.localize('map_status', Globalize.culture())}</dt>
                    <dd>
                        <DropDownList data={informationStatus}
                                      defaultValue={filter.status}
                                      hasEmptyOption={true}
                                      onChange={handleStatusChange}/>
                    </dd>
                </dl>
                <dl>
                    <dt>{Globalize.localize('map_publish_start_date', Globalize.culture())}</dt>
                    <dd>
                        <DatePicker className="input__date"
                                    dateFormat="YYYY年MM月DD日 (ddd)"
                                    locale='ja'
                                    dateFormatCalendar="YYYY年MM月"
                                    maxDate={filter.effective_period_to}
                                    tetherConstraints={[]}
                                    readOnly
                                    selected={filter.effective_period_from}
                                    onChange={handleEffectivePeriodFromChange}
                                    isClearable={true}
                                    /></dd>
                </dl>
                <dl>
                    <dt>{Globalize.localize('map_publish_end_date', Globalize.culture())}</dt>
                    <dd>
                        <DatePicker className="input__date"
                                    dateFormat="YYYY年MM月DD日 (ddd)"
                                    locale="ja"
                                    dateFormatCalendar="YYYY年MM月"
                                    tetherConstraints={[]}
                                    minDate={filter.effective_period_from}
                                    readOnly
                                    selected={filter.effective_period_to}
                                    isClearable={true}
                                    onChange={handleEffectivePeriodToChange}/></dd>
                </dl>
            </div>
            <dl className="widget__page__button">
                <div className="button_clear"><input className="btn-base" type="submit" style={{width: '150px'}} defaultValue={Globalize.localize('filter_search', Globalize.culture())} /></div>
            </dl>
            </form>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        companies: state.companies,
        brands: state.brands,
        stores: state.stores,
    }
};

export default connect(mapStateToProps)(SearchDetail)
