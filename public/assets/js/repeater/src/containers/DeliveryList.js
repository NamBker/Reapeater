import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

// import Constants
import { GET_NAME_ONLY_PATTERN } from '../constants/Constants'
import { DELIVERY_STATUS_DRAFT, DELIVERY_STATUS_UNDELIVERED, DELIVERY_STATUS_DELIVERED, DELIVERY_STATUS_DELIVERING, DELIVERY_STATUS_FAILED } from '../constants/Constants'

// import Actions
import { fetchUserInfo } from '../actions/user';
import { countByDeliveryStatus } from '../actions/delivery';
import { hideNotification } from '../actions/notification';

// import self defined components
import ListForm from './delivery/ListForm';
import Notification from '../components/commons/Notification';

class DeliveryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTabIndex: 0,
        }
    }

    componentDidMount() {
        this.props.dispatch(fetchUserInfo());
        this.props.dispatch(countByDeliveryStatus());
    }

    componentWillUnmount() {
        this.props.dispatch(hideNotification(this.props.route.path));
    }

    onSelectTab(index, last) {
        this.setState({selectedTabIndex: index});
    }

    countString(status) {
        if (this.props.countsEachStatus && this.props.countsEachStatus[status]) {
            return "(" + this.props.countsEachStatus[status] + ")";
        }
        return "";
    }

    render() {
        return (
            <div>
                <Notification path={this.props.route.path}/>
                <Tabs
                    className="widget__page__delivery__select__tabs"
                    onSelect={(index, last) => this.onSelectTab(index, last)}
                    selectedIndex={this.state.selectedTabIndex}
                >
                    <TabList>
                        <Tab>{Globalize.localize('delivery_status_done', Globalize.culture())}</Tab>
                        <Tab>{Globalize.localize('delivery_status_doing', Globalize.culture()) + this.countString(DELIVERY_STATUS_DELIVERING)}</Tab>
                        <Tab>{Globalize.localize('delivery_status_wait', Globalize.culture()) + this.countString(DELIVERY_STATUS_UNDELIVERED)}</Tab>
                        <Tab>{Globalize.localize('delivery_status_draft', Globalize.culture()) + this.countString(DELIVERY_STATUS_DRAFT)}</Tab>
                    </TabList>
                    <TabPanel>
                        <ListForm
                            route={this.props.route}
                            history={this.props.history}
                            currentUser={this.props.currentUser}
                            companies={this.props.companies}
                            brands={this.props.brands}
                            areas={this.props.areas}
                            stores={this.props.stores}
                            deliveryStatuses={[DELIVERY_STATUS_DELIVERED, DELIVERY_STATUS_FAILED]}
                        />
                    </TabPanel>
                    <TabPanel>
                        <ListForm
                            route={this.props.route}
                            history={this.props.history}
                            currentUser={this.props.currentUser}
                            companies={this.props.companies}
                            brands={this.props.brands}
                            areas={this.props.areas}
                            stores={this.props.stores}
                            deliveryStatuses={[DELIVERY_STATUS_DELIVERING]}
                        />
                    </TabPanel>
                    <TabPanel>
                        <ListForm
                            route={this.props.route}
                            history={this.props.history}
                            currentUser={this.props.currentUser}
                            companies={this.props.companies}
                            brands={this.props.brands}
                            areas={this.props.areas}
                            stores={this.props.stores}
                            deliveryStatuses={[DELIVERY_STATUS_UNDELIVERED]}
                        />
                    </TabPanel>
                    <TabPanel>
                        <ListForm
                            route={this.props.route}
                            history={this.props.history}
                            currentUser={this.props.currentUser}
                            companies={this.props.companies}
                            brands={this.props.brands}
                            areas={this.props.areas}
                            stores={this.props.stores}
                            deliveryStatuses={[DELIVERY_STATUS_DRAFT]}
                        />
                    </TabPanel>
                </Tabs>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        companies: state.currentCompanies,
        brands: state.currentBrands,
        areas: state.currentAreas,
        stores: state.currentStores,
        countsEachStatus: state.delivery_count_per_status,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryList);
