import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE } from '../../../constants/Constants';
import { GET_DISPLAY_ITEMS_ONLY_PATTERN } from '../../../constants/Constants';
import { AREA_TYPE_LARGE, AREA_TYPE_MEDIUM, AREA_TYPE_SMALL } from '../../../constants/Constants';
import { eachCompany } from '../../../utils/CommonUtils';

import Selection from '../../../components/commons/Selection';
import DropDownList from '../../../components/commons/DropDownList';
import CheckList from '../../../components/commons/CheckList';

class Target extends Component {

    selectedStoreNameList() {
        const { brands, stores, filter, data } = this.props;
        let nameList = {};

        data.delivery_store_ids.sort((n1, n2) => {return n1 - n2});

        stores.map(store => {
            if (0 <= data.delivery_store_ids.indexOf(store.id)) {
                if (nameList[store.brand_id] == null) {
                    nameList[store.brand_id] = {brandName:'', storeNames: []};
                }
                nameList[store.brand_id].storeNames.push(store.store_name);
            }
        });
        let selectedBrands = Object.keys(nameList);
        brands.map(brand => {
            if (0 <= selectedBrands.indexOf(String(brand.id))) {
                nameList[brand.id].brandName = brand.brand_name;
            }
        });
        let tmp = [];
        for (var key in nameList) {
            tmp.push({
                brandId: key,
                brandName: nameList[key].brandName,
                storeNames: nameList[key].storeNames.join(", "),
            });
        }
        return (
            <div>
                {tmp.map(obj => {
                    return (
                        <p key={"selected_store_group_" + obj.brandId}>
                            <span className="selected__store__group__name font-headline1">{obj.brandName}</span><br/>
                            {obj.storeNames}
                        </p>
                    )
                })}
            </div>
        );
    }

    onChangeCompany(companyId) {
        let filter = this.props.filter;
        let data = this.props.data;
        let isUpdatedData = false;
        companyId = companyId ? parseInt(companyId) : 0;
        filter.delivery_company_id = companyId;

        if (companyId != 0) {
            // ブランドの選択している項目チェック
            if (0 < filter.delivery_brand_ids.length) {
                this.props.brands.map((brand) => {
                    let idx = filter.delivery_brand_ids.indexOf(brand.id);
                    if (0 <= idx && brand.company_id != companyId) {
                        filter.delivery_brand_ids.splice(idx, 1);
                    }
                });
            }

            // エリアの選択している項目チェック
            this.props.areas.map((area) => {
                if (area.company_id != companyId) {
                    for (var key in filter.selectedAreas) {
                        if (filter.selectedAreas[key] === parseInt(area.id)) {
                            filter.selectedAreas[key] = 0;
                            break;
                        }
                    }
                }
            });

            // 店舗の選択している項目チェック
            if (0 < data.delivery_store_ids.length) {
                this.props.stores.map((store) => {
                    let idx = data.delivery_store_ids.indexOf(store.id);
                    if (0 <= idx && store.company_id != companyId) {
                        data.delivery_store_ids.splice(idx, 1);
                        isUpdatedData = true;
                    }
                });
            }
        } else {
            filter.delivery_brand_ids = [];
            filter.selectedAreas = {
                1: 0,
                2: 0,
                3: 0,
            };
            filter.delivery_store_ids = [];
        }
        if (isUpdatedData) {
            this.props.onChangeFilterAndData(filter, data);
        } else {
            this.props.onChangeFilter(filter);
        }
    }

    onChangeBrand(brandIds) {
        let filter = this.props.filter;
        let data = this.props.data;
        let isUpdatedData = false;
        filter.delivery_brands_ids = brandIds;

        if (0 < brandIds.length) {
            // エリアの選択している項目チェック
            this.props.areas.map((area) => {
                if (brandIds.indexOf(area.brand_id) < 0) {
                    for (var key in filter.selectedAreas) {
                        if (filter.selectedAreas[key] === parseInt(area.id)) {
                            filter.selectedAreas[key] = 0;
                            break;
                        }
                    }
                }
            });

            // 店舗の選択している項目チェック
            if (0 < data.delivery_store_ids.length) {
                this.props.stores.map((store) => {
                    let idx = data.delivery_store_ids.indexOf(store.id);
                    if (0 <= idx && brandIds.indexOf(store.brand_id) < 0) {
                        data.delivery_store_ids.splice(idx, 1);
                        isUpdatedData = true;
                    }
                });
            }
        } else {
            filter.selectedAreas = {
                1: 0,
                2: 0,
                3: 0,
            };
            filter.delivery_store_ids = [];
        }
        if (isUpdatedData) {
            this.props.onChangeFilterAndData(filter, data);
        } else {
            this.props.onChangeFilter(filter);
        }
    }

    onChangeArea(type, areaId) {
        let filter = this.props.filter;
        areaId = areaId ? parseInt(areaId) : 0;
        filter.selectedAreas[type] = areaId;
        let data = this.props.data;
        let isUpdatedData = false;

        if (areaId != 0) {
            this.props.stores.map((store) => {
                let idx = data.delivery_store_ids.indexOf(store.id);
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
                        data.delivery_store_ids.splice(idx, 1);
                        isUpdatedData = true;
                    }
                }
            });
        }
        if (isUpdatedData) {
            this.props.onChangeFilterAndData(filter, data);
        } else {
            this.props.onChangeFilter(filter);
        }
    }

    isVisibleArea(area) {
        let filter = this.props.filter;
        return (filter.delivery_company_id === area.company_id) &&
            (0 <= filter.delivery_brand_ids.indexOf(area.brand_id));
    }

    onChangeStore(storeIds) {
        let data = this.props.data;
        data.delivery_store_ids = storeIds;
        this.props.onChangeData(data);
    }

    isVisibleStore(store) {
        let filter = this.props.filter;
        return (filter.delivery_company_id === store.company_id) &&
            (0 <= filter.delivery_brand_ids.indexOf(store.brand_id)) &&
            (filter.selectedAreas[AREA_TYPE_LARGE] == 0 || filter.selectedAreas[AREA_TYPE_LARGE] == store.store_area_L_id) &&
            (filter.selectedAreas[AREA_TYPE_MEDIUM] == 0 || filter.selectedAreas[AREA_TYPE_MEDIUM] == store.store_area_M_id) &&
            (filter.selectedAreas[AREA_TYPE_SMALL] == 0 || filter.selectedAreas[AREA_TYPE_SMALL] == store.store_area_S_id);
    }

    onCheckAllStore(isAllCheck) {
        let data = this.props.data;
        data.delivery_store_ids = [];
        if (isAllCheck) {
            data.delivery_store_ids = this.props.stores.map((store) => {return this.isVisibleStore(store) ? store.id : null});
        }
        this.setState({data: data});
    }

    render() {
        const { currentUser, companies, brands, areas, stores, filter, data, isNew } = this.props;
        return (
            <dt className="widget__page__input__contents">
                <dl className="widget__page__input__contents__subtitle mt15">
                    <span>{Globalize.localize('delivery_add_subtitle_target', Globalize.culture())}</span>
                </dl>
                <div className="widget__page__input__contents__table mb20">
                    <dl>
                        <dt>{Globalize.localize('map_company', Globalize.culture())}</dt>
                        <dd>
                            <div style={{display: 'inline-flex'}}>
                                {currentUser.authority >= USER_AUTHORITY_COMPANY ? currentUser.company_name :
                                    <DropDownList
                                        data={companies}
                                        defaultValue={filter.delivery_company_id}
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
                                    id="delivery__add__brand__check__list"
                                    data={brands}
                                    checkedItems={filter.delivery_brand_ids}
                                    onChangedSelection={(brandIds) => this.onChangeBrand(brandIds)}
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
                            {currentUser.authority >= USER_AUTHORITY_STORE ? currentUser.store_name : (
                                    <Selection
                                            data={stores}
                                            areas={areas}
                                            hasArea={true}
                                            isVisibleArea={(area) => this.isVisibleArea(area)}
                                            selectedAreas={filter.selectedAreas}
                                            onChangeArea={(type, areaId) => this.onChangeArea(type, areaId)}
                                            checkCondition={(store) => this.isVisibleStore(store)}
                                            checkedItems={data.delivery_store_ids}
                                            setCheckItems={(checkItems) => { data.publisher_stores_ids = checkItems }}
                                            checkAll={(isAllCheck) => this.onCheckAllStore(isAllCheck)}
                                            changeItem={(storeIds) => this.onChangeStore(storeIds)}
                                        />
                                )
                            }
                        </dd>
                    </dl>
                </div>
            </dt>
        );
    }
}

export default Target;
