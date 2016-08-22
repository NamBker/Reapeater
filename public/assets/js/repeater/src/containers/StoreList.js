import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Filter from './store/Filter'
import Table from '../components/commons/Table'

// import Constants
import * as Const from '../constants/Constants';
import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE } from '../constants/Constants'

// import Actions
import { fetchUserInfo } from '../actions/user'
import { fetchStores, deleteStores, storeCSVUpload } from '../actions/store'
import Rpapi from '../actions/rpapi'

// import self defined components
import Notification from '../components/commons/Notification';
import CSVUploadDialog from '../components/commons/CSVUploadDialog';

var uploadFile = null;

class StoreList extends Component {
    constructor(props) {
        super(props);
        const { currentUser } = this.props;
        this.state= {
            filter: {
                company_id: currentUser.authority >= USER_AUTHORITY_COMPANY ? currentUser.company_id : 0,
                brand_id: currentUser.authority >= USER_AUTHORITY_BRAND ? currentUser.brand_id: 0,
                store_code: '',
                store_name: '',
                store_status: '',
                page: 1,
                per_page: Const.PER_PAGE,
                pattern: Const.GET_ALL_PATTERN,
            },
            showCSVDialog: false,
        };
        this.tableFormat = [
            {
                title: Globalize.localize('map_company_name', Globalize.culture()),
                valueKey: 'company_name',
                style: {
                    width: '100px',
                    marginLeft: '0px',
                    marginRight: '10px',
                    lineHeight: '50px',
                    height: '50px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    flexShrink: '0',
                },
            },
            {
                title: Globalize.localize('map_brand_name', Globalize.culture()),
                valueKey: 'brand_name',
                style: {
                    width: '100px',
                    marginLeft: '0px',
                    marginRight: '10px',
                    lineHeight: '50px',
                    height: '50px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    flexShrink: '0',
                },
            },
            {
                title: Globalize.localize('map_store_name', Globalize.culture()),
                valueKey: 'store_name',
                style: {
                    width: '100%',
                    marginLeft: '0px',
                    marginRight: '10px',
                    lineHeight: '50px',
                    height: '50px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                },
            },
            {
                title: Globalize.localize('map_store_code', Globalize.culture()),
                valueKey: 'store_code',
                style: {
                    width: '80px',
                    marginLeft: '0px',
                    marginRight: '10px',
                    lineHeight: '50px',
                    height: '50px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    flexShrink: '0',
                },
            },
            {
                title: Globalize.localize('map_status', Globalize.culture()),
                valueKey: 'store_status',
                style: {
                    width: '90px',
                    marginLeft: '0px',
                    marginRight: '80px',
                    lineHeight: '50px',
                    height: '50px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    flexShrink: '0',
                },
            },
        ];
        this.tableOptions = [
            {
                label: Globalize.localize('store_csv_upload', Globalize.culture()),
                func: (e) => {this.onOpenCSVDialog()},
            },
            {
                label: Globalize.localize('store_csv_download', Globalize.culture()),
                func: (e) => {e.preventDefault(); this.onDownloadCSV()},
            },
        ];
        this.statuses = [
            Globalize.localize('business_condition_delete', Globalize.culture()),
            Globalize.localize('business_condition_close', Globalize.culture()),
            Globalize.localize('business_condition_prepare', Globalize.culture()),
            Globalize.localize('business_condition_open', Globalize.culture()),
        ];
    }

    componentWillMount() {
        this.props.dispatch(fetchUserInfo());
        this.onSearch();
    }

    onOpenCSVDialog() {
        this.setState({showCSVDialog: true});
    }

    onCloseCSVDialog() {
        this.setState({showCSVDialog: false});
    }

    onUploadCSV(uploadFile) {
        let file = uploadFile;
        this.setState({showCSVDialog: false}, () => {
            storeCSVUpload(uploadFile, (err) => {
                this.showNotification(err.toString());
            }, (res) => {
                this.showNotification(Globalize.localize('csv_upload_succeeded_message', Globalize.culture()))
            });
        });
    }

    onDownloadCSV() {
        let rpapi = new Rpapi('get', '/stores/')
            .query(this.state.curFilter);
        let srcUrl = '/web/store/export' + '?' + rpapi.getQuery().join('&');
        $('body').append("<iframe src='" + srcUrl + "' style='display: none;'></iframe>");
    }

    cellForKey(key, element) {
        switch(key) {
        case 'company_name':
            return (
                <span>{element.company_name}</span>
            );
        case 'brand_name':
            return (
                <span>{element.brand_name}</span>
            );
        case 'store_name':
            return (
                <span>{element.store_name}</span>
            );
        case 'store_code':
            return (
                <span>{element.store_code}</span>
            );
        case 'store_status':
            return (
                <span>{this.statuses[element.store_status]}</span>
            );
        }
    }

    showNotification(message, isSuccess = true) {
        Notification.showNotification(this.props.dispatch, this.props.route.path, message);
    }

    onDelete(deleteIds) {
        if(confirm(Globalize.localize('confirm_delete', Globalize.culture()))) {
            let filter = this.state.curFilter;
            if (this.props.stores.length <= deleteIds.length && 1 < filter.page) {
                filter.page = filter.page - 1;
            }
            let titles = $.grep(this.props.stores.map((store) => {return 0 <= deleteIds.indexOf(store.id) ? store.store_name : null}), Boolean).join(", ");
            this.setState({curFilter: filter}, () => {
                deleteStores(deleteIds,
                    (err) => {
                        this.showNotification(Globalize.localize('store_cant_delete', Globalize.culture()) + '\n' + err.toString());
                    },
                    (res) => {
                        this.showNotification(Globalize.localize('store_deleted', Globalize.culture()) + '\n・' + titles);
                        this.onSearch();
                    }
                );
            });
        }
    }

    onClickRowEdit(element) {
        this.context.router.push("/store/edit/" + element.id);
    }

    onSubmit(e){
        e.preventDefault();
        this.onSearch();
    }

    onSearch() {
        let curFilter = Object.assign({}, this.state.filter);
        this.setState({curFilter}, () => {
            this.props.dispatch(fetchStores(curFilter))
        });
    }

    onChangePage(data) {
        let curFilter = this.state.curFilter;
        curFilter.page = data.selected + 1;
        this.setState({curFilter}, () => {
            this.props.dispatch(fetchStores(curFilter))
        });
    }

    onChangeFilter(filter) {
        this.setState({filter});
    }

    render() {
        return (
            <div>
                <Notification path={this.props.route.path}/>
                {this.state.showCSVDialog ?
                <CSVUploadDialog
                    isOpen={this.state.showCSVDialog}
                    description={Globalize.localize('store_csv_upload_modal_description', Globalize.culture())}
                    onClose={() => this.onCloseCSVDialog()}
                    onUpload={(uploadFile) => this.onUploadCSV(uploadFile)}
                /> : null}
                <Filter
                    filter={this.state.filter}
                    storeStatuses={this.statuses}
                    onChangeFilter={(filter) => this.onChangeFilter(filter)}
                    onSubmit = {(e) => this.onSubmit(e)}
                />
                <Table
                    data={this.props.stores}
                    formats={this.tableFormat}
                    totalCount={this.props.storeCount}
                    curPage={this.state.curFilter.page}
                    onDelete={(deleteIds) => this.onDelete(deleteIds)}
                    cellForKey={(key, element) => this.cellForKey(key, element)}
                    hasOptionFunc={true}
                    optionFuncs={this.tableOptions}
                    hasEditButtonForRow={(element) => true}
                    onClickEdit={(element) => this.onClickRowEdit(element)}
                    onChangePage={(data) => this.onChangePage(data)}
                />
            </div>
        )
    }
}

StoreList.contextTypes = {
    router: React.PropTypes.object,
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        stores: state.stores,
        storeCount: state.stores_count,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StoreList);
