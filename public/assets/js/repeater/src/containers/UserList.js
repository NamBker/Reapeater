import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Filter from './user/Filter'
import Table from '../components/commons/Table'
import Notification from '../components/commons/Notification'

import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE } from '../constants/Constants';
import { PER_PAGE } from '../constants/Constants';
import { GET_DISPLAY_ITEMS_ONLY_PATTERN } from '../constants/Constants';

import { fetchUsers, deleteUsers, fetchUserInfo } from '../actions/user'

class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {
                user_name: '',
                user_company_id: USER_AUTHORITY_COMPANY <= props.currentUser.authority ? props.currentUser.company_id : 0,
                user_brand_ids: USER_AUTHORITY_BRAND <= props.currentUser.authority ? [props.currentUser.brand_id] : [],
                user_store_ids: USER_AUTHORITY_STORE <= props.currentUser.authority ? [props.currentUser.store_id] : [],
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
                user_name: '',
                user_company_id: USER_AUTHORITY_COMPANY <= props.currentUser.authority ? props.currentUser.company_id : 0,
                user_brand_ids: USER_AUTHORITY_BRAND <= props.currentUser.authority ? [props.currentUser.brand_id] : [],
                user_store_ids: USER_AUTHORITY_STORE <= props.currentUser.authority ? [props.currentUser.store_id] : [],
                page: 1,
                per_page: PER_PAGE,
                pattern: GET_DISPLAY_ITEMS_ONLY_PATTERN,
            },
            selectedIds: []
        }
        this.tableFormat = [
            {
                title: Globalize.localize('l_authority', Globalize.culture()),
                valueKey: 'authority',
                style: {
                    width: '60px',
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
                title: Globalize.localize('map_company_name', Globalize.culture()),
                valueKey: 'company_name',
                style: {
                    width: '120px',
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
                    width: '120px',
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
                    width: '120px',
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
                title: Globalize.localize('map_user_name', Globalize.culture()),
                valueKey: 'name',
                style: {
                    width: '100%',
                    marginLeft: '0px',
                    marginRight: '90px',
                    lineHeight: '50px',
                    height: '50px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                },
            },
        ];
        this.authorities = [
            Globalize.localize('map_admin', Globalize.culture()),
            Globalize.localize('map_company', Globalize.culture()),
            Globalize.localize('map_brand', Globalize.culture()),
            Globalize.localize('map_section', Globalize.culture()),
            Globalize.localize('map_store', Globalize.culture()),
        ];
    }

    cellForKey(key, element) {
        switch(key) {
        case 'authority':
            return (
                <span>{this.authorities[element.authority - 1]}</span>
            );
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
        case 'name':
            return (
                <span>{element.name}</span>
            );
        }
    }

    componentWillMount() {
        this.props.dispatch(fetchUserInfo('me', (err) => {}, (res) => {
            let filter = this.state.filter;
            filter.user_company_id = USER_AUTHORITY_COMPANY <= res.user.authority ? res.user.company_id : 0,
            filter.user_brand_ids = USER_AUTHORITY_BRAND <= res.user.authority ? [res.user.brand_id] : [],
            filter.user_store_ids = USER_AUTHORITY_STORE <= res.user.authority ? [res.user.store_id] : [],
            this.setState({filter}, () => {
                this.onSearchTitle();
            });
        }));
    }

    onSearchDetail() {
        this.onSearchTitle();
    }

    onSearchTitle() {
        let filter = Object.assign({}, this.state.filter);
        this.setState({curFilter: filter}, () => {
            this.props.dispatch(fetchUsers(filter, (err) => {
                this.showNotification(err, false);
            }));
        });
    }

    onChangeFilter(filter) {
        this.setState({filter});
    }

    showNotification(message, isSuccess = true) {
        Notification.showNotification(this.props.dispatch, this.props.route.path, message);
    }

    onDelete(deleteIds) {
        if(confirm(Globalize.localize('confirm_delete', Globalize.culture()))) {
            let filter = this.state.curFilter;
            if (this.props.users.length <= deleteIds.length && 1 < filter.page) {
                filter.page = filter.page - 1;
            }
            let titles = $.grep(this.props.users.map((user) => {return 0 <= deleteIds.indexOf(user.id) ? user.name : null}), Boolean).join(", ");
            this.setState({curFilter: filter}, () => {
                deleteUsers(deleteIds,
                    (err) => {
                        this.showNotification(Globalize.localize('user_cant_delete', Globalize.culture()) + '\n' + err.toString());
                    },
                    (res) => {
                        this.showNotification(Globalize.localize('user_deleted', Globalize.culture()) + '\n・' + titles);
                        this.onSearchTitle();
                    }
                );
            });
        }
    }

    onClickRowEdit(element) {
        this.context.router.push("/user/edit/" + element.id);
    }

    onChangePage(data) {
        let curFilter = this.state.curFilter;
        curFilter.page = data.selected + 1;
        this.setState({curFilter}, () => {
            this.props.dispatch(fetchUsers(curFilter));
        });
    }

    render() {
        return (
            <div>
                <Notification path={this.props.route.path}/>
                <Filter
                    currentUser={this.props.currentUser}
                    companies={this.props.companies}
                    brands={this.props.brands}
                    areas={this.props.areas}
                    stores={this.props.stores}
                    filter={this.state.filter}
                    onChangeFilter={(filter) => this.onChangeFilter(filter)}
                    onSearchTitle={() => this.onSearchTitle()}
                    onSearchDetail={() => this.onSearchDetail()}
                    />
                <Table
                    data={this.props.users}
                    formats={this.tableFormat}
                    totalCount={this.props.user_count}
                    curPage={this.state.curFilter.page}
                    onDelete={(deleteIds) => this.onDelete(deleteIds)}
                    cellForKey={(key, element) => this.cellForKey(key, element)}
                    hasOptionFunc={false}
                    hasEditButtonForRow={(element) => true}
                    onClickEdit={(element) => this.onClickRowEdit(element)}
                    onChangePage={(data) => this.onChangePage(data)}
                    isSelectableRow={element => this.props.currentUser.id != element.id}
                />
            </div>
        )
    }
}

UserList.contextTypes = {
    router: React.PropTypes.object,
};

const mapStateToProps = (state) => {
    return {
        users: state.users,
        user_count: state.user_count,
        currentUser: state.currentUser,
        companies: state.currentCompanies,
        brands: state.currentBrands,
        areas: state.currentAreas,
        stores: state.currentStores,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
