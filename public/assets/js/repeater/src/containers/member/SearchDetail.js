import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import Selection from '../../components/commons/Selection'
import DropDownList from '../../components/commons/DropDownList'
import CheckList from '../../components/commons/CheckList'
import { eachCompany } from '../../utils/CommonUtils'
import DatePicker from 'react-datepicker'
import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE } from '../../constants/Constants'
import { GET_DISPLAY_ITEMS_ONLY_PATTERN } from '../../constants/Constants'
import { AREA_TYPE_LARGE, AREA_TYPE_MEDIUM, AREA_TYPE_SMALL } from '../../constants/Constants';
import { MEMBER_STATUS_REGISTERED, MEMBER_STATUS_WITHDRAW } from '../../constants/Constants';
import { MEMBER_DELIVERY_CONDITION_PERMITTED, MEMBER_DELIVERY_CONDITION_DENIED } from '../../constants/Constants';
import { MEMBER_DELIVERY_STATUS_NORMAL, MEMBER_DELIVERY_STATUS_ERROR } from '../../constants/Constants';
import { GENDER_MAN, GENDER_WOMAN } from '../../constants/Constants';
import { PREFECTURE_ARRAY } from '../../constants/Constants';
import { JOB_ARRAY } from '../../constants/Constants';

class SearchDetail extends Component {
    constructor(props) {
        super(props);
        this.memberStatuses = [
            { 'label': Globalize.localize('registered', Globalize.culture()), 'key': MEMBER_STATUS_REGISTERED },
            { 'label': Globalize.localize('withdraw', Globalize.culture()), 'key': MEMBER_STATUS_WITHDRAW },
        ];
        this.deliveryConditions = [
            { 'label': Globalize.localize('member_delivery_condition_permitted', Globalize.culture()), 'key': MEMBER_DELIVERY_CONDITION_PERMITTED },
            { 'label': Globalize.localize('member_delivery_condition_denied', Globalize.culture()), 'key': MEMBER_DELIVERY_CONDITION_DENIED },
        ];
        this.deliveryStatuses = [
            { 'label': Globalize.localize('normal', Globalize.culture()), 'key': MEMBER_DELIVERY_STATUS_NORMAL },
            { 'label': Globalize.localize('error', Globalize.culture()), 'key': MEMBER_DELIVERY_STATUS_ERROR },
        ];
        this.genders = [
            { 'label': Globalize.localize('gender_man', Globalize.culture()), 'key': GENDER_MAN},
            { 'label': Globalize.localize('gender_woman', Globalize.culture()), 'key': GENDER_WOMAN},
        ];
        this.prefectures = PREFECTURE_ARRAY.map((prefecture, index) => {
            return {
                'label': prefecture,
                'key': ('0' + (index + 1)).slice(-2),
            }
        });
        this.jobs = JOB_ARRAY.map((job, index) => {
            return {
                'label': job,
                'key': index + 1,
            }
        });
        this.state = {
            selectedAreas: {
                1: 0,
                2: 0,
                3: 0,
            },
        }
    }

    onChangeCompany(companyId) {
        let filter = this.props.filter;
        let selectedAreas = this.state.selectedAreas;
        companyId = companyId ? parseInt(companyId) : 0;
        filter.member_company_id = companyId;

        if (companyId) {
            // ブランドの選択している項目チェック
            if (0 < filter.member_brand_ids.length) {
                this.props.brands.map((brand) => {
                    let idx = filter.member_brand_ids.indexOf(brand.id);
                    if (0 <= idx && brand.company_id != companyId) {
                        filter.member_brand_ids.splice(idx, 1);
                    }
                });
            }

            // エリアの選択している項目チェック
            this.props.areas.map((area) => {
                if (area.company_id != companyId) {
                    for (var key in selectedAreas) {
                        if (selectedAreas[key] === parseInt(area.id)) {
                            selectedAreas[key] = 0;
                            break;
                        }
                    }
                }
            });

            // 店舗の選択している項目チェック
            if (0 < filter.member_store_ids.length) {
                this.props.stores.map((store) => {
                    let idx = filter.member_store_ids.indexOf(store.id);
                    if (0 <= idx && store.company_id != companyId) {
                        filter.member_store_ids.splice(idx, 1);
                    }
                });
            }
        } else {
            filter.member_brand_ids = [];
            selectedAreas = {
                1: 0,
                2: 0,
                3: 0,
            };
            filter.member_store_ids = [];
        }
        this.setState({selectedAreas: selectedAreas}, () => {
            this.props.onChangeFilter(filter);
        });
    }

    onChangeBrand(brandIds) {
        let filter = this.props.filter;
        let selectedAreas = this.state.selectedAreas;
        filter.member_brand_ids = brandIds;

        if (0 < brandIds.length) {
            // エリアの選択している項目チェック
            this.props.areas.map((area) => {
                if (brandIds.indexOf(area.brand_id) < 0) {
                    for (var key in selectedAreas) {
                        if (selectedAreas[key] === parseInt(area.id)) {
                            selectedAreas[key] = 0;
                            break;
                        }
                    }
                }
            });

            // 店舗の選択している項目チェック
            if (0 < filter.member_store_ids.length) {
                this.props.stores.map((store) => {
                    let idx = filter.member_store_ids.indexOf(store.id);
                    if (0 <= idx && brandIds.indexOf(store.brand_id) < 0) {
                        filter.member_store_ids.splice(idx, 1);
                    }
                });
            }
        } else {
            selectedAreas = {
                1: 0,
                2: 0,
                3: 0,
            };
            filter.member_store_ids = [];
        }
        this.setState({selectedAreas}, () => {
            this.props.onChangeFilter(filter);
        });
    }

    onChangeArea(type, areaId) {
        let filter = this.props.filter;
        let selectedAreas = this.state.selectedAreas;
        areaId = areaId ? parseInt(areaId) : 0;
        selectedAreas[type] = areaId;

        if (areaId != 0) {
            this.props.stores.map((store) => {
                let idx = filter.member_store_ids.indexOf(store.id);
                if (0 <= idx) {
                    let storeAreaId = 0;
                    switch(type) {
                    case AREA_TYPE_LARGE:
                        storeAreaId = store.area_L_id;
                        break;
                    case AREA_TYPE_MEDIUM:
                        storeAreaId = store.area_M_id;
                        break;
                    case AREA_TYPE_SMAL:
                        storeAreaId = store.area_S_id;
                        break;
                    }
                    if (storeAreaId != areaId) {
                        filter.member_store_ids.splice(idx, 1);
                    }
                }
            });
        }
        this.setState({selectedAreas}, () => {
            this.props.onChangeFilter(filter);
        });
    }

    isVisibleArea(area) {
        let filter = this.props.filter;
        return (filter.member_company_id === area.company_id) &&
            (0 <= filter.member_brand_ids.indexOf(area.brand_id));
    }

    onChangeStore(storeIds) {
        let filter = this.props.filter;
        filter.member_store_ids = storeIds;
        this.props.onChangeFilter(filter);
    }

    isVisibleStore(store) {
        const { filter } = this.props;
        const { selectedAreas } = this.state;

        return (filter.member_company_id === store.company_id) &&
            (0 <= filter.member_brand_ids.indexOf(store.brand_id)) &&
            (selectedAreas[AREA_TYPE_LARGE] == 0 || selectedAreas[AREA_TYPE_LARGE] == store.store_area_L_id) &&
            (selectedAreas[AREA_TYPE_MEDIUM] == 0 || selectedAreas[AREA_TYPE_MEDIUM] == store.store_area_M_id) &&
            (selectedAreas[AREA_TYPE_SMALL] == 0 || selectedAreas[AREA_TYPE_SMALL] == store.store_area_S_id);
    }

    onCheckAllStore(isAllCheck) {
        let filter = this.props.filter;
        filter.member_store_ids = [];
        if (isAllCheck) {
            filter.member_store_ids = this.props.stores.map((store) => {return this.isVisibleStore(store) ? store.id : null});
        }
        this.props.onChangeFilter(filter);
    }

    onChangeRegistrationDateFrom(date) {
        let filter = this.props.filter;
        filter.member_registration_date_from = date;
        this.props.onChangeFilter(filter);
    }

    onChangeRegistrationDateTo(date) {
        let filter = this.props.filter;
        filter.member_registration_date_to = date;
        this.props.onChangeFilter(filter);
    }

    onChangeMemberStatus(selectedValues) {
        let filter = this.props.filter;
        filter.store_member_statuses = selectedValues;
        this.props.onChangeFilter(filter);
    }

    onChangeDeliveryCondition(selectedValues) {
        let filter = this.props.filter;
        filter.mail_receptions = selectedValues;
        this.props.onChangeFilter(filter);
    }

    onChangeDeliveryStatus(selectedValues) {
        let filter = this.props.filter;
        filter.mail_delivery_statuses = selectedValues;
        this.props.onChangeFilter(filter);
    }

    onChangeGender(selectedValues) {
        let filter = this.props.filter;
        filter.genders = selectedValues;
        this.props.onChangeFilter(filter);
    }

    onChangeBirthdayFrom(date) {
        let filter = this.props.filter;
        filter.birthday_from = date;
        this.props.onChangeFilter(filter);
    }

    onChangeBirthdayTo(date) {
        let filter = this.props.filter;
        filter.birthday_to = date;
        this.props.onChangeFilter(filter);
    }

    onChangeName(name) {
        let filter = this.props.filter;
        filter.name = name;
        this.props.onChangeFilter(filter);
    }

    onChangePrefecture(selectedValues) {
        let filter = this.props.filter;
        filter.prefectures = selectedValues;
        this.props.onChangeFilter(filter);
    }

    onChangeJob(selectedValues) {
        let filter = this.props.filter;
        filter.jobs = selectedValues;
        this.props.onChangeFilter(filter);
    }

    render() {
        const { currentUser, companies, brands, areas, stores, filter } = this.props;
        return (
            <div>
                <div className="widget__page__input__contents__table">
                    <dl>
                        <dt>{Globalize.localize('map_company', Globalize.culture())}</dt>
                        <dd>
                            <div style={{display: 'inline-flex'}}>
                                {currentUser.authority >= USER_AUTHORITY_COMPANY ? currentUser.company_name :
                                    <DropDownList
                                        data={companies}
                                        defaultValue={filter.member_company_id}
                                        hasEmptyOption={true}
                                        onChange={(e) => this.onChangeCompany(e.target.value)}
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
                                    id="member__list__brand__check__list"
                                    data={brands}
                                    checkedItems={filter.member_brand_ids}
                                    onChangedSelection={(brandIds) => this.onChangeBrand(brandIds)}
                                    dataLabelKey='brand_name'
                                    dataValueKey='id'
                                    isVisibleData={data => {return filter.member_company_id === data.company_id}}
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
                                        isVisibleArea={(area) => this.isVisibleArea(area)}
                                        selectedAreas={this.state.selectedAreas}
                                        onChangeArea={(type, areaId) => this.onChangeArea(type, areaId)}
                                        checkCondition={(store) => this.isVisibleStore(store)}
                                        checkedItems={filter.member_store_ids}
                                        setCheckItems={(checkItems) => { filter.member_store_ids = checkItems }}
                                        checkAll={(isAllCheck) => this.onCheckAllStore(isAllCheck)}
                                        changeItem={(storeIds) => this.onChangeStore(storeIds)}
                                    />
                            }
                        </dd>
                    </dl>
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('member_search_condition_registered_day', Globalize.culture())}</dt>
                        <dd>
                            <DatePicker className={"input__date" + (filter.member_registration_date_from? " input__date__setted" : "")}
                                        dateFormat={Globalize.localize('display_date_format', Globalize.culture())}
                                        locale='ja'
                                        dateFormatCalendar={Globalize.localize('display_date_year_and_month_format', Globalize.culture())}
                                        maxDate={filter.member_registration_date_to}
                                        tetherConstraints={[]}
                                        readOnly
                                        isClearable={true}
                                        selected={filter.member_registration_date_from}
                                        onChange={(date) => this.onChangeRegistrationDateFrom(date)}
                                        />
                            <span>　〜　</span>
                            <DatePicker className={"input__date" + (filter.member_registration_date_to? " input__date__setted" : "")}
                                        dateFormat={Globalize.localize('display_date_format', Globalize.culture())}
                                        locale="ja"
                                        dateFormatCalendar={Globalize.localize('display_date_year_and_month_format', Globalize.culture())}
                                        tetherConstraints={[]}
                                        minDate={filter.member_registration_date_from}
                                        readOnly
                                        isClearable={true}
                                        selected={filter.member_registration_date_to}
                                        onChange={(date) => this.onChangeRegistrationDateTo(date)}
                                    />
                                    <br/>
                            <span style={{color: '#b2b2b2'}}>{Globalize.localize('filter_search_period_comment', Globalize.culture())}</span>
                        </dd>
                    </dl>
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('member_search_condition_member_status', Globalize.culture())}</dt>
                        <dd className="widget__page__input__scroll">
                            <CheckList
                                id="member__list__member__status__check__list"
                                data={this.memberStatuses}
                                checkedItems={filter.store_member_statuses}
                                onChangedSelection={(selectedValues) => this.onChangeMemberStatus(selectedValues)}
                                dataLabelKey='label'
                                dataValueKey='key'
                                />
                        </dd>
                    </dl>
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('member_search_condition_delivery_condition', Globalize.culture())}</dt>
                        <dd className="widget__page__input__scroll">
                            <CheckList
                                id="member__list__delivery__condition__check__list"
                                data={this.deliveryConditions}
                                checkedItems={filter.mail_receptions}
                                onChangedSelection={(selectedValues) => this.onChangeDeliveryCondition(selectedValues)}
                                dataLabelKey='label'
                                dataValueKey='key'
                                />
                        </dd>
                    </dl>
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('member_search_condition_delivery_status', Globalize.culture())}</dt>
                        <dd className="widget__page__input__scroll">
                            <CheckList
                                id="member__list__delivery__status__check__list"
                                data={this.deliveryStatuses}
                                checkedItems={filter.mail_delivery_statuses}
                                onChangedSelection={(selectedValues) => this.onChangeDeliveryStatus(selectedValues)}
                                dataLabelKey='label'
                                dataValueKey='key'
                                />
                        </dd>
                    </dl>
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('member_search_condition_gender', Globalize.culture())}</dt>
                        <dd className="widget__page__input__scroll">
                            <CheckList
                                id="member__list__gender__check__list"
                                data={this.genders}
                                checkedItems={filter.genders}
                                onChangedSelection={(selectedValues) => this.onChangeGender(selectedValues)}
                                dataLabelKey='label'
                                dataValueKey='key'
                                />
                        </dd>
                    </dl>
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('member_search_condition_birthday', Globalize.culture())}</dt>
                        <dd>
                            <DatePicker className={"input__date" + (filter.birthday_from? " input__date__setted" : "")}
                                        dateFormat={Globalize.localize('display_date_format', Globalize.culture())}
                                        locale='ja'
                                        dateFormatCalendar={Globalize.localize('display_date_year_and_month_format', Globalize.culture())}
                                        maxDate={filter.birthday_to}
                                        tetherConstraints={[]}
                                        readOnly
                                        isClearable={true}
                                        selected={filter.birthday_from}
                                        onChange={(date) => this.onChangeBirthdayFrom(date)}
                                        />
                            <span>　〜　</span>
                            <DatePicker className={"input__date" + (filter.birthday_to? " input__date__setted" : "")}
                                        dateFormat={Globalize.localize('display_date_format', Globalize.culture())}
                                        locale="ja"
                                        dateFormatCalendar={Globalize.localize('display_date_year_and_month_format', Globalize.culture())}
                                        tetherConstraints={[]}
                                        minDate={filter.birthday_from}
                                        readOnly
                                        isClearable={true}
                                        selected={filter.birthday_to}
                                        onChange={(date) => this.onChangeBirthdayTo(date)}
                                    />
                                    <br/>
                            <span style={{color: '#b2b2b2'}}>{Globalize.localize('filter_search_period_comment', Globalize.culture())}</span>
                        </dd>
                    </dl>
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('member_search_condition_name', Globalize.culture())}</dt>
                        <dd>
                            <input type="text" size="40" maxLength="32" onChange={(e) => this.onChangeName(e.target.value)}/>
                        </dd>
                    </dl>
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('member_search_condition_prefecture', Globalize.culture())}</dt>
                        <dd className="widget__page__input__scroll">
                            <CheckList
                                id="member__list__prefecture__check__list"
                                data={this.prefectures}
                                checkedItems={filter.prefectures}
                                onChangedSelection={(selectedValues) => this.onChangePrefecture(selectedValues)}
                                dataLabelKey='label'
                                dataValueKey='key'
                                isKeyNumber={false}
                                />
                        </dd>
                    </dl>
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('member_search_condition_job', Globalize.culture())}</dt>
                        <dd className="widget__page__input__scroll">
                            <CheckList
                                id="member__list__job__check__list"
                                data={this.jobs}
                                checkedItems={filter.jobs}
                                onChangedSelection={(selectedValues) => this.onChangeJob(selectedValues)}
                                dataLabelKey='label'
                                dataValueKey='key'
                                />
                        </dd>
                    </dl>
                </div>
                <dl className="widget__page__button">
                    <div className="button_clear"><button className="btn-base" onClick={this.props.onSearch}>{Globalize.localize('filter_search', Globalize.culture())}</button></div>
                </dl>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        companies: state.currentCompanies,
        brands: state.currentBrands,
        stores: state.currentStores,
        areas: state.currentAreas,
    };
}

export default connect(mapStateToProps)(SearchDetail);
