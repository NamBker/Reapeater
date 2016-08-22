import React, { Component, PropTypes } from 'react';
import moment from 'moment'
import Selection from '../../components/commons/Selection'
import DropDownList from '../../components/commons/DropDownList'
import CheckList from '../../components/commons/CheckList'
import { eachCompany } from '../../utils/CommonUtils'
import DatePicker from 'react-datepicker'
import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE } from '../../constants/Constants'
import { GET_DISPLAY_ITEMS_ONLY_PATTERN } from '../../constants/Constants'
import { AREA_TYPE_LARGE, AREA_TYPE_MEDIUM, AREA_TYPE_SMALL } from '../../constants/Constants'

class SearchDetail extends Component {

    onChangeCompany(companyId) {
        let filter = this.props.filter;
        companyId = companyId ? parseInt(companyId) : 0;
        filter.user_company_id = companyId;

        if (companyId != 0) {
            // ブランドの選択している項目チェック
            if (0 < filter.user_brand_ids.length) {
                this.props.brands.map((brand) => {
                    let idx = filter.user_brand_ids.indexOf(brand.id);
                    if (0 <= idx && brand.company_id != companyId) {
                        filter.user_brand_ids.splice(idx, 1);
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
            if (0 < filter.user_store_ids.length) {
                this.props.stores.map((store) => {
                    let idx = filter.user_store_ids.indexOf(store.id);
                    if (0 <= idx && store.company_id != companyId) {
                        filter.user_store_ids.splice(idx, 1);
                    }
                });
            }
        } else {
            filter.user_brand_ids = [];
            filter.selectedAreas = {
                1: 0,
                2: 0,
                3: 0,
            };
            filter.user_store_ids = [];
        }
        this.props.onChangeFilter(filter);
    }

    onChangeBrand(brandIds) {
        let filter = this.props.filter;
        filter.user_brands_ids = brandIds;

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
            if (0 < filter.user_store_ids.length) {
                this.props.stores.map((store) => {
                    let idx = filter.user_store_ids.indexOf(store.id);
                    if (0 <= idx && brandIds.indexOf(store.brand_id) < 0) {
                        filter.user_store_ids.splice(idx, 1);
                    }
                });
            }
        } else {
            filter.selectedAreas = {
                1: 0,
                2: 0,
                3: 0,
            };
            filter.user_store_ids = [];
        }
        this.props.onChangeFilter(filter);
    }

    onChangeArea(type, areaId) {
        let filter = this.props.filter;
        areaId = areaId ? parseInt(areaId) : 0;
        filter.selectedAreas[type] = areaId;

        if (areaId != 0) {
            this.props.stores.map((store) => {
                let idx = filter.user_store_ids.indexOf(store.id);
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
                        filter.user_store_ids.splice(idx, 1);
                    }
                }
            });
        }
        this.props.onChangeFilter(filter);
    }

    isVisibleArea(area) {
        let filter = this.props.filter;
        return (filter.user_company_id === area.company_id) &&
            (0 <= filter.user_brand_ids.indexOf(area.brand_id));
    }

    onChangeStore(storeIds) {
        let filter = this.props.filter;
        filter.user_store_ids = storeIds;
        this.props.onChangeFilter(filter);
    }

    isVisibleStore(store) {
        let filter = this.props.filter;
        return (filter.user_company_id === store.company_id) &&
            (0 <= filter.user_brand_ids.indexOf(store.brand_id)) &&
            (filter.selectedAreas[AREA_TYPE_LARGE] == 0 || filter.selectedAreas[AREA_TYPE_LARGE] == store.store_area_L_id) &&
            (filter.selectedAreas[AREA_TYPE_MEDIUM] == 0 || filter.selectedAreas[AREA_TYPE_MEDIUM] == store.store_area_M_id) &&
            (filter.selectedAreas[AREA_TYPE_SMALL] == 0 || filter.selectedAreas[AREA_TYPE_SMALL] == store.store_area_S_id);
    }

    onCheckAllStore(isAllCheck) {
        let filter = this.props.filter;
        filter.user_store_ids = [];
        if (isAllCheck) {
            filter.user_store_ids = this.props.stores.map((store) => {return this.isVisibleStore(store) ? store.id : null});
        }
        this.props.onChangeFilter(filter);
    }

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
                        <dt>{Globalize.localize('map_company', Globalize.culture())}</dt>
                        <dd>
                            <div style={{display: 'inline-flex'}}>
                                {currentUser.authority >= USER_AUTHORITY_COMPANY ? currentUser.company_name :
                                    <DropDownList
                                        data={companies}
                                        defaultValue={filter.user_company_id}
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
                                    id="delivery__list__brand__check__list"
                                    data={brands}
                                    checkedItems={filter.user_brand_ids}
                                    onChangedSelection={(brandIds) => this.onChangeBrand(brandIds)}
                                    dataLabelKey='brand_name'
                                    dataValueKey='id'
                                    isVisibleData={data => {return filter.user_company_id === data.company_id}}
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
                                    selectedAreas={filter.selectedAreas}
                                    onChangeArea={(type, areaId) => this.onChangeArea(type, areaId)}
                                    checkCondition={(store) => this.isVisibleStore(store)}
                                    checkedItems={filter.user_store_ids}
                                    setCheckItems={(checkItems) => { filter.publisher_stores_ids = checkItems }}
                                    checkAll={(isAllCheck) => this.onCheckAllStore(isAllCheck)}
                                    changeItem={(storeIds) => this.onChangeStore(storeIds)}
                                    />
                            }
                        </dd>
                    </dl>
                </div>
                <dl className="widget__page__button">
                    <div className="button_clear"><input className="btn-base" type="submit" style={{width: '150px'}} defaultValue={Globalize.localize('filter_search', Globalize.culture())} /></div>
                </dl>
            </form>
        );
    }
}

export default SearchDetail
