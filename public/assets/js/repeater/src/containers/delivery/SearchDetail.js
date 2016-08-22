import React, { Component, PropTypes } from 'react';
import moment from 'moment'
import Selection from '../../components/commons/Selection'
import DropDownList from '../../components/commons/DropDownList'
import CheckList from '../../components/commons/CheckList'
import { eachCompany } from '../../utils/CommonUtils'
import DatePicker from 'react-datepicker'
import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE } from '../../constants/Constants'
import { GET_DISPLAY_ITEMS_ONLY_PATTERN } from '../../constants/Constants'

class SearchDetail extends Component {

    onSubmit(e) {
        e.preventDefault();
        this.props.onSearchDetail();
    }

    render() {
        const { currentUser, companies, brands, areas, stores, filter } = this.props;
        return (
            <form className="search" acceptCharset="utf-8" onSubmit={(e) => this.onSubmit(e)}>
            <div className="widget__page__delivery__select">
                <dl>
                    <dt style={{ border : '0px'}}>{Globalize.localize('map_company', Globalize.culture())}</dt>
                    <dd style={{ border : '0px'}}>
                        <div style={{display: 'inline-flex'}}>
                            {currentUser.authority >= USER_AUTHORITY_COMPANY ? currentUser.company_name :
                                <DropDownList
                                    data={companies}
                                    defaultValue={filter.delivery_company_id}
                                    hasEmptyOption={true}
                                    onChange={(e) => this.props.onChangeCompany(e.target.value)}
                                    eachCallback={eachCompany()}/>
                            }
                        </div>
                    </dd>
                </dl>
                <dl className="checkbox__row">
                    <dt>{Globalize.localize('map_brand', Globalize.culture())}</dt>
                    <dd>
                        {currentUser.authority >= USER_AUTHORITY_BRAND ? currentUser.brand_name :
                            <CheckList
                                id="delivery__list__brand__check__list"
                                data={brands}
                                checkedItems={filter.delivery_brand_ids}
                                onChangedSelection={this.props.onChangeBrand}
                                dataLabelKey='brand_name'
                                dataValueKey='id'
                                isVisibleData={data => {return filter.delivery_company_id === data.company_id}}
                                />
                        }
                        </dd>
                </dl>
                <dl className="checkbox__row">
                    <dt>{Globalize.localize('map_store', Globalize.culture())}</dt>
                    <dd>
                        {currentUser.authority >= USER_AUTHORITY_STORE ? currentUser.store_name :
                        <Selection
                                    data={stores}
                                    areas={areas}
                                    hasArea={true}
                                    isVisibleArea={this.props.isVisibleArea}
                                    selectedAreas={filter.selectedAreas}
                                    onChangeArea={this.props.onChangeArea}
                                    checkCondition={this.props.isVisibleStore}
                                    checkedItems={filter.delivery_store_ids}
                                    setCheckItems={(checkItems) => { this.props.filter.publisher_stores_ids = checkItems }}
                                    checkAll={this.props.onCheckAllStore}
                                    changeItem={this.props.onChangeStore}
                                />
                        }
                    </dd>
                </dl>
                <dl className="checkbox__row">
                    <dt>{Globalize.localize('map_delivery_date', Globalize.culture())}</dt>
                    <dd>
                        <DatePicker className={"input__date" + (filter.delivery_schedule_from ? " input__date__setted" : "")}
                                    dateFormat="YYYY年MM月DD日 (ddd)"
                                    locale='ja'
                                    dateFormatCalendar="YYYY年MM月"
                                    maxDate={filter.delivery_schedule_to}
                                    tetherConstraints={[]}
                                    readOnly
                                    isClearable={true}
                                    selected={filter.delivery_schedule_from}
                                    onChange={this.props.onChangeDeliveryScheduleFrom}
                                    />
                        <span>　〜　</span>
                        <DatePicker className={"input__date" + (filter.delivery_schedule_to ? " input__date__setted" : "")}
                                    dateFormat="YYYY年MM月DD日 (ddd)"
                                    locale="ja"
                                    dateFormatCalendar="YYYY年MM月"
                                    tetherConstraints={[]}
                                    minDate={filter.delivery_schedule_from}
                                    readOnly
                                    isClearable={true}
                                    selected={filter.delivery_schedule_to}
                                    onChange={this.props.onChangeDeliveryScheduleTo}
                                />
                                <br/>
                        <span style={{color: '#b2b2b2'}}>{Globalize.localize('filter_search_period_comment', Globalize.culture())}</span>
                    </dd>
                </dl>
            </div>
            <dl className="widget__page__button">
                <div className="button_clear"><input className="btn-base" type="submit" style={{width: '120px'}} defaultValue={Globalize.localize('filter_search', Globalize.culture())} /></div>
            </dl>
            </form>
        );
    }
}

export default SearchDetail
