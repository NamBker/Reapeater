import React, { Component, PropTypes } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import moment from 'moment'
import { convertToCsv } from '../../utils/CsvUtils'
import Filter from '../../containers/analysis/Filter';
import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY } from '../../constants/Constants'

class DeliveryAnalysis extends Component {
    constructor(props) {
        super(props);
        let currentDate = moment();
        this.state= {
            filter: {
                company_id: '',
                brand_ids: [],
                store_ids: [],
            },
            year : currentDate.year(),
            month : currentDate.month() + 1,
        };
        this.handleCompanyIdChange =this.handleCompanyIdChange.bind(this);
        this.handleBrandIdChange =this.handleBrandIdChange.bind(this);
        this.handleStoreIdChange =this.handleStoreIdChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleYearChange = this.handleYearChange.bind(this);
        this.handleMonthChange = this.handleMonthChange.bind(this);
    }

    componentWillMount() {
        const { fetchAnalysis } = this.props;
        let month = this.state.year + '-' + ("0" + this.state.month).slice(-2)
        fetchAnalysis({month})
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.year != nextState.year || this.state.month != nextState.month) {
            let month = nextState.year + '-' + ("0" + nextState.month).slice(-2);
            nextProps.fetchAnalysis({
                company_id: this.state.company_id,
                brand_ids: this.state.brand_ids,
                store_ids: this.state.store_ids,
                month
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.routes[this.props.routes.length - 1].path != nextProps.routes[nextProps.routes.length - 1].path) {
            let month = this.state.year + '-' + ("0" + this.state.month).slice(-2)
            this.props.clearAnalysis();
            nextProps.fetchAnalysis({month});
        }

        let filter = this.state.filter;
        if (nextProps.currentUser.authority > USER_AUTHORITY_ADMIN) {
            filter.company_id = USER_AUTHORITY_COMPANY <= nextProps.currentUser.authority ? nextProps.currentUser.company_id : 0;
            this.setState({ filter: filter });
        }
    }

    handleCompanyIdChange(e){
        let filter = {...this.state.filter};
        filter.company_id = e.target.value;
        filter.brand_ids = [];
        filter.store_ids = [];
        this.setState({filter: filter});
    }

    handleBrandIdChange(brandIds){
        let filter = {...this.state.filter};
        filter.brand_ids = brandIds;
        filter.store_ids = [];
        this.setState({filter: filter});
    }

    handleStoreIdChange(storeIds){
        let filter = {...this.state.filter};
        filter.store_ids = storeIds;
        this.setState({filter: filter});
    }

    handleYearChange(e) {
        let year = e.target.value;
        this.setState({
            year: year
        });
    }

    handleMonthChange(e) {
        let month = e.target.value;
        this.setState({
            month: month
        });
    }

    next() {
        this.setState({month: parseInt(this.state.month)+1})
    }
    previous() {
        this.setState({month: this.state.month-1})
    }

    downloadCsv() {
        let year = Globalize.localize('year', Globalize.culture());
        let month = Globalize.localize('month', Globalize.culture());
        let fileName = this.props.fileName + (this.state.isDaily ? (this.state.year + 'year' + ("0" + this.state.month).slice(-2) + 'month') : (this.state.year + '年'));
        convertToCsv(this.props.analysisData, (a) => a , fileName);
    }

    handleSubmit() {
        let month = this.state.year + '-' + ("0" + this.state.month).slice(-2);
        if (this.state.year && this.state.month) {
                this.props.fetchAnalysis({
                    company_id: this.state.filter.company_id,
                    brand_ids: this.state.filter.brand_ids,
                    store_ids: this.state.filter.store_ids,
                    month,
                });
        } else {
            alert(Globalize.localize('analysis_member_need_period', Globalize.culture()));
        }
    }

    componentWillUnmount() {
        this.props.clearAnalysis();
    }

    handleSelectTab(index, last) {
        const { router } = this.context;
        switch (index) {
            case 0:
                router.push('/analysis/delivery');
                break;
            case 1:
                router.push('/analysis/coupon');
                break;
            case 2:
                router.push('/analysis/questionnaire');
                break;
        }
    }

    render() {
        return (
            <div>
                <Tabs onSelect={this.handleSelectTab.bind(this)}
                      className="widget__page__delivery__select__tabs"
                      selectedIndex={['delivery', 'coupon', 'questionnaire'].indexOf(this.props.routes[this.props.routes.length - 1].path)}>
                    <TabList className="">
                        <Tab>{Globalize.localize('menu_analyze_mail', Globalize.culture())}</Tab>
                        <Tab>{Globalize.localize('menu_analyze_coupon', Globalize.culture())}</Tab>
                        <Tab>{Globalize.localize('menu_analyze_questionnaire', Globalize.culture())}</Tab>
                    </TabList>
                    <TabPanel></TabPanel>
                    <TabPanel></TabPanel>
                    <TabPanel></TabPanel>
                </Tabs>
                <Filter filter={this.state.filter}
                        isDelivery={true}
                        handleSubmit={this.handleSubmit}
                        handleCompanyIdChange={this.handleCompanyIdChange}
                        handleBrandIdChange={this.handleBrandIdChange}
                        handleStoreIdChange={this.handleStoreIdChange}
                        handleYearChange = {this.handleYearChange}
                        handleMonthChange={this.handleMonthChange}
                        downloadCsv={this.downloadCsv.bind(this)}
                        year={this.state.year} month={this.state.month}
                        fetchDailyStoreInfo={this.props.fetchDailyStoreInfo}/>
                {React.cloneElement(this.props.children, {
                    year: this.state.year,
                    month: this.state.month,
                    next: this.next.bind(this),
                    previous: this.previous.bind(this),
                })}
            </div>
        );
    }
}

DeliveryAnalysis.contextTypes = {
    router: React.PropTypes.object,
};

export default DeliveryAnalysis;