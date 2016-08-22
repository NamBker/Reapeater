import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Filter from './Filter';
import Table from './Table';
import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE } from '../../constants/Constants';
import { AREA_TYPE_LARGE, AREA_TYPE_MEDIUM, AREA_TYPE_SMALL } from '../../constants/Constants';
import { PER_PAGE } from '../../constants/Constants';
import { GET_DISPLAY_ITEMS_ONLY_PATTERN } from '../../constants/Constants';
import { DELIVERY_STATUS_DRAFT, DELIVERY_STATUS_UNDELIVERED } from '../../constants/Constants';

import { fetchDeliveries, deleteDeliveries, countByDeliveryStatus } from '../../actions/delivery';
import { showNotification } from '../../actions/notification';

class DeliveryListForm extends Component {
    constructor(props) {
        super(props);
        const { currentUser } = this.props;
        this.state = {
            filter: {
                delivery_title: '',
                delivery_company_id: USER_AUTHORITY_COMPANY <= props.currentUser.authority ? currentUser.company_id : 0,
                delivery_brand_ids: USER_AUTHORITY_BRAND <= props.currentUser.authority ? [currentUser.brand_id] : [],
                delivery_store_ids: USER_AUTHORITY_STORE <= props.currentUser.authority ? [currentUser.store_id] : [],
                delivery_schedule_from: null,
                delivery_schedule_to: null,
                delivery_status: this.props.deliveryStatuses,
                page: 1,
                per_page: PER_PAGE,
                pattern: GET_DISPLAY_ITEMS_ONLY_PATTERN,
                selectedAreas: {
                    1: 0,
                    2: 0,
                    3: 0,
                },
            },
            curFilter: {
                delivery_title: '',
                delivery_company_id: USER_AUTHORITY_COMPANY <= props.currentUser.authority ? currentUser.company_id : 0,
                delivery_brand_ids: USER_AUTHORITY_BRAND <= props.currentUser.authority ? [currentUser.brand_id] : [],
                delivery_store_ids: USER_AUTHORITY_STORE <= props.currentUser.authority ? [currentUser.store_id] : [],
                delivery_schedule_from: null,
                delivery_schedule_to: null,
                delivery_status: this.props.deliveryStatuses,
                page: 1,
                per_page: PER_PAGE,
                pattern: GET_DISPLAY_ITEMS_ONLY_PATTERN,
            },
            selectedIds: []
        };
    }

    componentDidMount() {
        this.props.dispatch(fetchDeliveries(this.state.curFilter, (err) => {
            this.showNotification(err, false);
        }));
    }

    onChangeTitle(title) {
        let filter = this.state.filter;
        filter.delivery_title = title;
        this.setState({filter: filter});
    }

    onChangeCompany(companyId) {
        let filter = this.state.filter;
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
            if (0 < filter.delivery_store_ids.length) {
                this.props.stores.map((store) => {
                    let idx = filter.delivery_store_ids.indexOf(store.id);
                    if (0 <= idx && store.company_id != companyId) {
                        filter.delivery_store_ids.splice(idx, 1);
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
            }
            filter.delivery_store_ids = [];
        }
        this.setState({filter: filter});
    }

    onChangeBrand(brandIds) {
        let filter = this.state.filter;
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
            if (0 < filter.delivery_store_ids.length) {
                this.props.stores.map((store) => {
                    let idx = filter.delivery_store_ids.indexOf(store.id);
                    if (0 <= idx && brandIds.indexOf(store.brand_id) < 0) {
                        filter.delivery_store_ids.splice(idx, 1);
                        isUpdatedData = true;
                    }
                });
            }
        } else {
            filter.selectedAreas = {
                1: 0,
                2: 0,
                3: 0,
            }
            filter.delivery_store_ids = [];
        }
        this.setState({filter: filter});
    }

    onChangeArea(type, areaId) {
        let filter = this.state.filter;
        areaId = areaId ? parseInt(areaId) : 0;
        filter.selectedAreas[type] = areaId;
        let isUpdatedData = false;

        if (areaId != 0) {
            this.props.stores.map((store) => {
                let idx = filter.delivery_store_ids.indexOf(store.id);
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
                        filter.delivery_store_ids.splice(idx, 1);
                        isUpdatedData = true;
                    }
                }
            });
        }
        this.setState({filter: filter});
    }

    onChangeStore(storeIds) {
        let filter = this.state.filter;
        filter.delivery_store_ids = storeIds;
        this.setState({filter: filter});
    }

    isVisibleArea(area) {
        let filter = this.state.filter;
        return (filter.delivery_company_id === area.company_id) &&
            (0 <= filter.delivery_brand_ids.indexOf(area.brand_id));
    }

    isVisibleStore(store) {
        let filter = this.state.filter;
        return (filter.delivery_company_id === store.company_id) &&
            (0 <= filter.delivery_brand_ids.indexOf(store.brand_id)) &&
            (filter.selectedAreas[AREA_TYPE_LARGE] == 0 || filter.selectedAreas[AREA_TYPE_LARGE] == store.store_area_L_id) &&
            (filter.selectedAreas[AREA_TYPE_MEDIUM] == 0 || filter.selectedAreas[AREA_TYPE_MEDIUM] == store.store_area_M_id) &&
            (filter.selectedAreas[AREA_TYPE_SMALL] == 0 || filter.selectedAreas[AREA_TYPE_SMALL] == store.store_area_S_id);
    }

    onCheckAllStore(isAllCheck) {
        let filter = this.state.filter;
        filter.delivery_store_ids = [];
        if (isAllCheck) {
            filter.delivery_store_ids = this.props.stores.map((store) => {return this.isVisibleStore(store) ? store.id : null});
        }
        this.setState({filter: filter});
    }

    onChangeDeliveryScheduleFrom(deliveryScheduleFrom) {
        let filter = this.state.filter;
        filter.delivery_schedule_from = deliveryScheduleFrom;
        this.setState({filter: filter});
    }

    onChangeDeliveryScheduleTo(deliveryScheduleTo) {
        let filter = this.state.filter;
        filter.delivery_schedule_to = deliveryScheduleTo;
        this.setState({filter: filter});
    }

    onSearchTitle() {
        let filter = Object.assign({}, this.state.filter);
        this.setState({curFilter: filter}, () => {
            this.props.dispatch(fetchDeliveries(filter, (err) => {
                this.showNotification(err, false);
            }));
        });
    }

    onSearchDetail() {
        this.onSearchTitle();
    }

    onCheckRow(id) {
        let selectedIds = this.state.selectedIds;
        let idx = selectedIds.indexOf(id);
        if (0 <= idx) {
            selectedIds.splice(idx, 1);
        } else {
            selectedIds.push(id);
        }
        this.setState({selectedIds: selectedIds});
    }

    onCheckAll(isCheckAll) {
        let selectedIds = [];
        if (isCheckAll) {
            selectedIds = this.props.deliveries.map((delivery) => {return delivery.id});
        }
        this.setState({selectedIds: selectedIds});
    }

    onChangePage(data) {
        let filter = this.state.curFilter;
        filter.page = data.selected + 1;
        this.setState({curFilter: filter, selectedIds: []}, () => {
            this.props.dispatch(fetchDeliveries(filter, (err) => {
                this.showNotification(err, false);
            }));
        });
    }

    onClickDelete() {
        let selectedIds = this.state.selectedIds;
        let filter = this.state.curFilter;
        if (this.props.deliveries.length <= selectedIds.length && 1 < filter.page) {
            filter.page = filter.page - 1;
        }
        let titles = $.grep(this.props.deliveries.map((delivery) => {return 0 <= selectedIds.indexOf(delivery.id) ? delivery.delivery_title : null}), Boolean).join(", ");
        this.setState({selectedIds: [], curFilter: filter}, () => {
            this.props.dispatch(deleteDeliveries(selectedIds, this.state.curFilter,
                (err) => {
                    this.showNotification(err, false);
                },
                (res) => {
                    this.showNotification('メールマガジン「' + titles + '」を削除しました。');
                    this.props.dispatch(countByDeliveryStatus());
                }
            ));
        });
    }

    onClickCopy() {
        const { selectedIds } = this.state;
        if (selectedIds.length != 1) {
            return;
        }
        this.props.history.push('/delivery/create/' + selectedIds[0]);
    }

    showNotification(message, isSuccess = true) {
        this.props.dispatch(showNotification(this.props.route.path, message, isSuccess));
    }

    render() {
        let canEdit = 0 <= this.props.deliveryStatuses.indexOf(DELIVERY_STATUS_DRAFT) ||
            0 <= this.props.deliveryStatuses.indexOf(DELIVERY_STATUS_UNDELIVERED);
        return (
            <div>
                <Filter
                    currentUser={this.props.currentUser}
                    companies={this.props.companies}
                    brands={this.props.brands}
                    stores={this.props.stores}
                    areas={this.props.areas}
                    filter={this.state.filter}
                    onChangeTitle={(title) => this.onChangeTitle(title)}
                    onChangeCompany={(companyId) => this.onChangeCompany(companyId)}
                    onChangeBrand={(brandIds) => this.onChangeBrand(brandIds)}
                    onChangeArea={(type, areaId) => this.onChangeArea(type, areaId)}
                    onChangeStore={(storeIds) => this.onChangeStore(storeIds)}
                    isVisibleArea={(area) => this.isVisibleArea(area)}
                    isVisibleStore={(store) => this.isVisibleStore(store)}
                    onCheckAllStore={(isAllChecked) => this.onCheckAllStore(isAllChecked)}
                    onChangeDeliveryScheduleFrom={(deliveryScheduleFrom) => this.onChangeDeliveryScheduleFrom(deliveryScheduleFrom)}
                    onChangeDeliveryScheduleTo={(deliveryScheduleTo) => this.onChangeDeliveryScheduleTo(deliveryScheduleTo)}
                    onSearchTitle={() => this.onSearchTitle()}
                    onSearchDetail={() => this.onSearchDetail()}
                />
                <Table
                    data={this.props.deliveries}
                    canEdit={canEdit}
                    total_count={this.props.delivery_count}
                    cur_page={this.state.filter.page}
                    selectedIds={this.state.selectedIds}
                    onCheckRow={(id) => this.onCheckRow(id)}
                    onCheckAll={(isCheckAll) => this.onCheckAll(isCheckAll)}
                    onChangePage={(data) => this.onChangePage(data)}
                    onClickDelete={() => this.onClickDelete()}
                    onClickCopy={() => this.onClickCopy()}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        deliveries: state.deliveries,
        delivery_count: state.delivery_count,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryListForm);
