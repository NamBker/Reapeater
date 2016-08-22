import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Filter from './brand/Filter'
import Table from '../components/commons/Table'
import { Link } from 'react-router'

// import Constants
import * as Const from '../constants/Constants';
import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE } from '../constants/Constants'

// import Actions
import { fetchUserInfo } from '../actions/user'
import { fetchBrands, deleteBrands } from '../actions/brand'

// import self defined components
import Notification from '../components/commons/Notification';

class BrandList extends Component {

    constructor(props) {
        super(props);
        this.state= {
            filter: {
                company_id: props.currentUser.company_id ? props.currentUser.company_id : 0,
                brand_code: '',
                brand_name: '',
                brand_status: '',
                page: 1,
                per_page: Const.PER_PAGE,
                pattern: Const.GET_ALL_PATTERN,
            },
            submitFilter: {
                company_id: props.currentUser.company_id ? props.currentUser.company_id : 0,
                brand_code: '',
                brand_name: '',
                brand_status: '',
                page: 1,
                pattern: Const.GET_ALL_PATTERN,
            }
        };
        this.tableFormat = [
            {
                title: Globalize.localize('map_company_name', Globalize.culture()),
                valueKey: 'company_name',
                style: {
                    width: '120px',
                    marginLeft: '0px',
                    marginRight: '20px',
                    lineHeight: '50px',
                    flexShrink: '0',
                    overflow: 'hidden',
                    height: '50px',
                    lineHeight: '50px',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                },
            },
            {
                title: Globalize.localize('map_brand_name', Globalize.culture()),
                valueKey: 'brand_name',
                style: {
                    width: 'auto',
                    marginLeft: '0px',
                    marginRight: 'auto',
                    lineHeight: '50px',
                    flexShrink: '0',
                },
            },
            {
                title: Globalize.localize('map_brand_code', Globalize.culture()),
                valueKey: 'brand_code',
                style: {
                    width: '100px',
                    marginLeft: '0px',
                    marginRight: '10px',
                    flexShrink: '0',
                    overflow: 'hidden',
                    height: '50px',
                    lineHeight: '50px',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                },
            },
            {
                title: Globalize.localize('map_status', Globalize.culture()),
                valueKey: 'brand_status',
                style: {
                    width: '160px',
                    marginLeft: '10px',
                    marginRight: '0px',
                    lineHeight: '50px',
                    flexShrink: '0',
                },
            },
        ];
        this.statuses = [
            Globalize.localize('business_condition_delete', Globalize.culture()),
            Globalize.localize('business_condition_close', Globalize.culture()),
            Globalize.localize('business_condition_prepare', Globalize.culture()),
            Globalize.localize('business_condition_open', Globalize.culture()),
        ];
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchUserInfo());
        this.onSearch();
    }

    handleCompanyIdChange(e) {
        let filter = Object.assign({}, this.state.filter);
        filter.company_id = e.target.value;
        filter.brand_id = '';
        filter.brand_status = '';

        this.setState({ filter: filter });
    }

    handleBrandCodeChange(e){
        let filter = Object.assign({}, this.state.filter);
        filter.brand_code = e.target.value;
        this.setState({filter: filter});
    }

    handleBrandCodeName(e){
        let filter = Object.assign({}, this.state.filter);
        filter.brand_name = e.target.value;
        this.setState({filter: filter});
    }

    handleStatusChange(e){
        let filter = Object.assign({}, this.state.filter);
        filter.brand_status = e.target.value;
        this.setState({filter: filter});
    }

    showNotification_local(message, isSuccess = true) {
        Notification.showNotification(this.props.dispatch, this.props.route.path, message);
    }

    deleteSelectedBrands(e){
    }

    onSubmit(e){
        e.preventDefault();
        this.onSearch();
    }

    onSearch() {
        let submitFilter = Object.assign({}, this.state.filter);
        this.setState({submitFilter}, () => {this.props.dispatch(fetchBrands(submitFilter))});
    }

    cellForKey(key, element) {
        switch (key) {
        case 'company_name':
            return (
                <span>{element.company_name}</span>
            );
        case 'brand_name':
            return (
                <span>{element.brand_name}</span>
            );
        case 'brand_code':
            return (
                <span>{element.brand_code}</span>
            );
        case 'brand_status':
            return (
                <span>{this.statuses[element.brand_status]}</span>
            );
        }
    }

    onDelete(deleteIds) {
        let titles = this.props.brands.map((brand) => {
            if (0 <= deleteIds.indexOf(brand.id)) {
                return brand.brand_name;
            }
        }).filter(name => name);
        if(confirm(Globalize.localize('confirm_delete', Globalize.culture()))){
            deleteBrands(deleteIds, (err) => {
                this.showNotification_local(Globalize.localize('brand_cant_delete', Globalize.culture()) + '\n' + err.toString());
            }, (res) => {
                this.showNotification_local(Globalize.localize('brand_deleted', Globalize.culture()) + '\n' + titles.join(", "));
                let submitFilter = this.state.submitFilter;
                if (this.props.brands.length <= deleteIds.length && 1 < submitFilter.page) {
                    submitFilter.page = submitFilter.page - 1;
                }
                this.setState({submitFilter}, () => {
                    this.props.dispatch(fetchBrands(submitFilter));
                });
            });
        }
    }

    onClickRowEdit(element) {
        this.context.router.push('/brand/edit/' + element.id);
    }

    onChangePage(data) {
        let submitFilter = this.state.submitFilter;
        submitFilter.page = data.selected + 1;
        this.setState({submitFilter}, () => {
            this.props.dispatch(fetchBrands(submitFilter))
        });
    }


    render() {
        return (
            <div>
                <Notification path={this.props.route.path}/>
                <Filter
                    filter={this.state.filter}
                    handleCompanyIdChange = {(e) => this.handleCompanyIdChange(e)}
                    handleBrandCodeChange = {(e) => this.handleBrandCodeChange(e)}
                    handleBrandCodeName = {(e) => this.handleBrandCodeName(e)}
                    handleStatusChange = {(e) => this.handleStatusChange(e)}
                    onSubmit = {(e) => this.onSubmit(e)}
                />
                <Table
                    data={this.props.brands}
                    formats={this.tableFormat}
                    totalCount={this.props.count}
                    curPage={this.state.submitFilter.page}
                    onDelete={(deleteIds) => this.onDelete(deleteIds)}
                    cellForKey={(key, element) => this.cellForKey(key, element)}
                    hasEditButtonForRow={(element) => true}
                    onClickEdit={(element) => this.onClickRowEdit(element)}
                    onChangePage={(data) => this.onChangePage(data)}
                />
            </div>
        )
    }
}

BrandList.contextTypes = {
    router: React.PropTypes.object,
};

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        companies: state.currentCompanies,
        brands: state.brands,
        count: state.brands_count,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(BrandList);
