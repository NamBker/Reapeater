import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Filter from './information/Filter'
import Table from './information/Table'
import * as Const from '../constants/Constants';
import { fetchInformation } from '../actions/information'
import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE } from '../constants/Constants'

class InformationList extends Component {

    constructor(props) {
        super(props);
        let filter = {
            company_id: props.currentUser.authority < USER_AUTHORITY_COMPANY ? 0 : props.currentUser.company_id,
                title: '',
                brand_ids: props.currentUser.authority < USER_AUTHORITY_BRAND ? [] : [props.currentUser.brand_id],
                store_ids: [],
                status: '',
                effective_period_from: null,
                effective_period_to: null,
                page: 1,
                per_page: Const.PER_PAGE,
                pattern: Const.GET_ALL_PATTERN,
                brand_arr: [],
                store_arr: [],
        };
        this.state= {
            filter,
            submitFilter: {...filter}
        };

        this.handleCompanyIdChange = this.handleCompanyIdChange.bind(this);
        this.handlePublisherBrandIds = this.handlePublisherBrandIds.bind(this);
        this.handlePublisherStoreIds = this.handlePublisherStoreIds.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleEffectivePeriodFromChange = this.handleEffectivePeriodFromChange.bind(this);
        this.handleEffectivePeriodToChange = this.handleEffectivePeriodToChange.bind(this);
        this.handleSearchFromKeyWord = this.handleSearchFromKeyWord.bind(this);
    }

    handleCompanyIdChange(e) {
        let filter = {...this.state.filter};
        filter.company_id = e.target.value ? parseInt(e.target.value) : 0;
        if (0 < filter.company_id) {
            this.props.brands.map(brand => {
                let index = filter.brand_ids.indexOf(brand.id);
                if (index >= 0 && brand.company_id != filter.company_id) {
                    filter.brand_ids.splice(index, 1);
                }
            });
            this.props.stores.map(store => {
                let index = filter.store_ids.indexOf(store.id);
                if (index >= 0 && store.company_id != filter.company_id) {
                    filter.store_ids.splice(index, 1)
                }
            });
        }
        this.setState({ filter: filter });
    }

    handlePublisherBrandIds(brandIds) {
        let filter = {...this.state.filter};
        filter.brand_ids = brandIds;
        if (0 < brandIds.length) {
            this.props.stores.map(store => {
                let index = filter.store_ids.indexOf(store.id);
                if (index >= 0 && brandIds.indexOf(store.brand_id) < 0) {
                    filter.store_ids.splice(index, 1);
                }
            });
        }
        this.setState({ filter: filter });
    }

    handlePublisherStoreIds(storeIds) {
        let filter = {...this.state.filter};
        filter.store_ids = storeIds;
        this.setState({ filter: filter });
    }

    handleStatusChange(e) {
        let filter = {...this.state.filter};
        filter.status = e.target.value;
        this.setState({filter: filter});
    }

    handleEffectivePeriodFromChange(date) {
        let filter = {...this.state.filter};
        filter.effective_period_from = date;
        this.setState({ filter: filter });
    }

    handleEffectivePeriodToChange(date) {
        let filter = {...this.state.filter};
        filter.effective_period_to = date;
        this.setState({ filter: filter });
    }

    handleSearchFromKeyWord(e) {
        let filter = this.state.filter;
        filter.title = e.target.value;
        this.setState({ filter: filter });
    }

    onTitleSearch() {
        let filter = this.state.filter;
        filter.page = 1;
        this.setState({filter: filter, submitFilter: {...filter}}, () => {
            this.props.dispatch(fetchInformation(filter));
        });
    }

    onDetailSearch() {
        let filter = this.state.filter;
        filter.page = 1;
        this.setState({filter: filter, submitFilter: {...filter}}, () => {
            this.props.dispatch(fetchInformation(filter));
        });
    }

    render() {
        return (
            <div>
                <Filter filter={this.state.filter}
                        handleCompanyIdChange={this.handleCompanyIdChange}
                        handlePublisherBrandIds={this.handlePublisherBrandIds}
                        handlePublisherStoreIds={this.handlePublisherStoreIds}
                        handleStatusChange={this.handleStatusChange}
                        handleEffectivePeriodFromChange={this.handleEffectivePeriodFromChange}
                        handleEffectivePeriodToChange={this.handleEffectivePeriodToChange}
                        handleSearchFromKeyWord={this.handleSearchFromKeyWord}
                        onTitleSearch={() => this.onTitleSearch()}
                        onDetailSearch={() => this.onDetailSearch()}
                    />
                <Table filter={this.state.submitFilter} />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        companies: state.companies,
        brands: state.brands,
        stores: state.stores
    }
};

export default connect(mapStateToProps)(InformationList);