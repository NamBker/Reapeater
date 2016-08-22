import React, { Component, PropTypes } from 'react';
import Filter from '../../containers/analysis/Filter';
import MemberTable from '../../containers/analysis/member/Table';
import AttributeTable from '../../containers/analysis/attribute/Table';
import LineChartRegister from '../../containers/analysis/member/LineChartRegister';
import PieChartRegister from '../../containers/analysis/member/PieChartRegister';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import moment from 'moment'
import {PREFECTURE_ARRAY, JOB_ARRAY, USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY} from '../../constants/Constants'
import { convertToCsv } from '../../utils/CsvUtils'
import { clearDailyStore } from '../../actions/memberanalysis'

class StoreAnalysis extends Component {
    constructor(props) {
        super(props);
        let currentDate = moment();
        this.state= {
            filter: {
                brand_id: '',
                company_id: USER_AUTHORITY_COMPANY <= props.currentUser.authority ? props.currentUser.company_id : 0,
                brand_ids: [],
                store_ids: [],
                store_id: '',
            },
            year : currentDate.year(),
            month : currentDate.month() + 1,
            isDaily: true,
            selectedTabIndex: 0,
            showBy: 0,
            analysisData: new Map()
        };

        this.handlePeriodFromChange = this.handlePeriodFromChange.bind(this);
        this.handlePeriodToChange = this.handlePeriodToChange.bind(this);
        this.handleCompanyIdChange =this.handleCompanyIdChange.bind(this);
        this.handleBrandIdChange =this.handleBrandIdChange.bind(this);
        this.handleStoreIdChange =this.handleStoreIdChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleYearChange = this.handleYearChange.bind(this);
        this.handleMonthChange = this.handleMonthChange.bind(this);
        this.handleSetActiveDaily = this.handleSetActiveDaily.bind(this);
        this.handleSetActiveMonthly = this.handleSetActiveMonthly.bind(this);
    }

    componentDidMount() {
        this.props.fetchDailyStoreInfo({...this.state.filter, month: this.state.year + '-' + ("0" + this.state.month).slice(-2)});
    }

    componentWillUpdate(nextProps, nextState) {
        if ((this.state.isDaily != nextState.isDaily || this.state.year != nextState.year || this.state.month != nextState.month) &&
            nextState.year &&
            (!nextState.isDaily || nextState.month) > 0) {
            if (nextState.isDaily) {
                nextProps.fetchDailyStoreInfo({...nextState.filter, month: nextState.year + '-' + ("0" + nextState.month).slice(-2)});
            } else {
                nextProps.fetchMonthlyStoreInfo({...nextState.filter, year: nextState.year});
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.memberAnalysis != nextProps.memberAnalysis && !nextProps.isMember) {
            this.changeAttribute(this.state.showBy, nextProps.memberAnalysis);
        }
        if (this.props.route.path != nextProps.route.path) {
            nextProps.fetchDailyStoreInfo({...this.state.filter, month: this.state.year + '-' + ("0" + this.state.month).slice(-2)});
        }

        let filter = this.state.filter;
        if (nextProps.currentUser.authority > USER_AUTHORITY_ADMIN) {
            filter.company_id = USER_AUTHORITY_COMPANY <= nextProps.currentUser.authority ? nextProps.currentUser.company_id : 0;
            this.setState({ filter: filter });
        }
    }

    componentWillUnmount() {
        this.props.dispatch(clearDailyStore());
    }

    changeAttribute(selectedAttribute, memberAnalysis) {
        if (!memberAnalysis) {
            memberAnalysis = this.props.memberAnalysis;
        }
        let analysisData = new Map();
        switch (parseInt(selectedAttribute)) {
            case 0:
                memberAnalysis.analysisData.map(item => {
                    let answerTotal = item.register_count - item.men_count - item.women_count;
                    if (analysisData.has('男性')) {
                        let dailyList = analysisData.get('男性');
                        if (dailyList.has(item.store_name)) {
                            dailyList.set(item.store_name, dailyList.get(item.store_name) + item.men_count);
                        } else {
                            dailyList.set(item.store_name, item.men_count);
                        }
                        analysisData.set('男性', dailyList);
                    } else {
                        let dailyList = new Map();
                        dailyList.set(item.store_name, item.men_count);
                        analysisData.set('男性', dailyList);
                    }
                    if (analysisData.has('女性')) {
                        let dailyList = analysisData.get('女性');
                        if (dailyList.has(item.store_name)) {
                            dailyList.set(item.store_name, dailyList.get(item.store_name) + item.women_count);
                        } else {
                            dailyList.set(item.store_name, item.women_count);
                        }
                        analysisData.set('女性', dailyList);
                    } else {
                        let dailyList = new Map();
                        dailyList.set(item.store_name, item.women_count);
                        analysisData.set('女性', dailyList);
                    }
                    if (analysisData.has('未回答')) {
                        let dailyList = analysisData.get('未回答');
                        if (dailyList.has(item.store_name)) {
                            dailyList.set(item.store_name, dailyList.get(item.store_name) + answerTotal);
                        } else {
                            dailyList.set(item.store_name, answerTotal);
                        }
                        analysisData.set('未回答', dailyList);
                    } else {
                        let dailyList = new Map();
                        dailyList.set(item.store_name, answerTotal);
                        analysisData.set('未回答', dailyList);
                    }
                });
                break;
            case 1:
                this.props.memberAnalysis.analysisData.map(item => {
                    let answerTotal = 0;
                    for (let i = 1; i <= 9; i++) {
                        answerTotal += item[i+'0s_count'];
                        if (analysisData.has(i + '0台会員数')) {
                            let dailyList = analysisData.get(i + '0台会員数');
                            if (dailyList.has(item.store_name)) {
                                dailyList.set(item.store_name, dailyList.get(item.store_name) + item[i+'0s_count']);
                            } else {
                                dailyList.set(item.store_name, item[i+'0s_count']);
                            }
                            analysisData.set(i + '0台会員数', dailyList);
                        } else {
                            let dailyList = new Map();
                            dailyList.set(item.store_name, item[i+'0s_count']);
                            analysisData.set(i + '0台会員数', dailyList);
                        }
                    }
                    answerTotal = item.register_count - answerTotal;
                    if (analysisData.has('未回答')) {
                        let dailyList = analysisData.get('未回答');
                        if (dailyList.has(item.store_name)) {
                            dailyList.set(item.store_name, dailyList.get(item.store_name) + answerTotal);
                        } else {
                            dailyList.set(item.store_name, answerTotal);
                        }
                        analysisData.set('未回答', dailyList);
                    } else {
                        let dailyList = new Map();
                        dailyList.set(item.store_name, answerTotal);
                        analysisData.set('未回答', dailyList);
                    }

                });
                break;
            case 2:
                this.props.memberAnalysis.analysisData.map(item => {
                    let answerTotal = 0;
                    JOB_ARRAY.map((jobName, index) => {
                        answerTotal += item[`job${index+1}_count`];
                        if (analysisData.has(jobName)) {

                            let dailyList = analysisData.get(jobName);
                            if (dailyList.has(item.store_name)) {
                                dailyList.set(item.store_name, dailyList.get(item.store_name) + item[`job${index+1}_count`]);
                            } else {
                                dailyList.set(item.store_name, item[`job${index+1}_count`]);
                            }
                            analysisData.set(jobName, dailyList);
                        } else {
                            let dailyList = new Map();
                            dailyList.set(item.store_name, item[`job${index+1}_count`]);
                            analysisData.set(jobName, dailyList);
                        }
                    });
                    answerTotal = item.register_count - answerTotal;
                    if (analysisData.has('未回答')) {
                        let dailyList = analysisData.get('未回答');
                        if (dailyList.has(item.store_name)) {
                            dailyList.set(item.store_name, dailyList.get(item.store_name) + answerTotal);
                        } else {
                            dailyList.set(item.store_name, answerTotal);
                        }
                        analysisData.set('未回答', dailyList);
                    } else {
                        let dailyList = new Map();
                        dailyList.set(item.store_name, answerTotal);
                        analysisData.set('未回答', dailyList);
                    }
                });
                break;
            case 3:
                this.props.memberAnalysis.analysisData.map(item => {
                    let answerTotal = 0;
                    PREFECTURE_ARRAY.map((prefecture, index) => {
                        let property = 'prefecture' + ("0" + (index+1)).slice(-2);
                        answerTotal += item[property];
                        if (analysisData.has(prefecture)) {
                            let dailyList = analysisData.get(prefecture);
                            if (dailyList.has(item.store_name)) {
                                dailyList.set(item.store_name, dailyList.get(item.store_name) + item[property]);
                            } else {
                                dailyList.set(item.store_name, item[property]);
                            }
                            analysisData.set(prefecture, dailyList);
                        } else {
                            let dailyList = new Map();
                            dailyList.set(item.store_name, item[property]);
                            analysisData.set(prefecture, dailyList);
                        }
                    });
                    answerTotal = item.register_count - answerTotal;
                    if (analysisData.has('未回答')) {
                        let dailyList = analysisData.get('未回答');
                        if (dailyList.has(item.store_name)) {
                            dailyList.set(item.store_name, dailyList.get(item.store_name) + answerTotal);
                        } else {
                            dailyList.set(item.store_name, answerTotal);
                        }
                        analysisData.set('未回答', dailyList);
                    } else {
                        let dailyList = new Map();
                        dailyList.set(item.store_name, answerTotal);
                        analysisData.set('未回答', dailyList);
                    }
                });
                break;

        }
        this.setState({analysisData, showBy: selectedAttribute});
    }

    convertData() {
        let dailyStore = [];
        let index = 1;
        let attrs =['属性', '年代', '職業', '都道府県']
        this.state.analysisData.forEach((rowData, attr) => {
            var store = new Object();
            store['No'] = index;
            store[attrs[this.state.showBy]] = attr;
            let rowTotal = 0;
            rowData.forEach((item) => {
                rowTotal += item;
            });
            store['登録数'] = rowTotal;
            rowData.forEach((item, storeName) => {
                store[storeName] = item;
            });
            dailyStore.push(store);
        });
        return dailyStore;
    }

    downloadCsv() {
        let fileName = Globalize.localize('menu_attribute_analysis', Globalize.culture()) + '_' + (this.state.isDaily ? (this.state.year + '年' + ("0" + this.state.month).slice(-2) + '月') : (this.state.year + '年'));
        convertToCsv(this.state.analysisData, this.convertData.bind(this), fileName);
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

    handlePeriodFromChange(date) {
        let filter = {...this.state.filter};
        filter.from = date;
        this.setState({
            filter: filter
        });
    }

    handlePeriodToChange(date) {
        let filter = {...this.state.filter};
        filter.to = date;
        this.setState({
            filter: filter
        });
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

    handleSetActiveDaily(e) {
        this.setState({
            isDaily: true
        });
    }

    handleSetActiveMonthly(e) {
        this.setState({
            isDaily: false
        });
    }
    next() {
        if (this.state.isDaily) {
            this.setState({month: parseInt(this.state.month)+1})
        } else {
            this.setState({year: parseInt(this.state.year)+1})
        }
    }
    previous() {
        if (this.state.isDaily) {
            this.setState({month: this.state.month-1})
        } else {
            this.setState({year: this.state.year-1})
        }
    }

    handleSubmit() {
        if (this.state.year && (!this.state.isDaily || this.state.month)) {
            if (this.state.isDaily) {
                this.props.fetchDailyStoreInfo({...this.state.filter, month: this.state.year + '-' + ("0" + this.state.month).slice(-2)});
            } else {
                this.props.fetchMonthlyStoreInfo({...this.state.filter, year: this.state.year});
            }
        } else {
            alert(Globalize.localize('analysis_member_need_period', Globalize.culture()));
        }
    }

    renderTabPanel() {
        return (
            <TabPanel>
                <Filter filter={this.state.filter}
                        handleSubmit={this.handleSubmit}
                        handlePeriodFromChange={this.handlePeriodFromChange}
                        handlePeriodToChange={this.handlePeriodToChange}
                        handleCompanyIdChange={this.handleCompanyIdChange}
                        handleBrandIdChange={this.handleBrandIdChange}
                        handleStoreIdChange={this.handleStoreIdChange}
                        selectedTabIndex={this.state.selectedTabIndex}
                        handleYearChange = {this.handleYearChange} handleMonthChange={this.handleMonthChange}
                        year={this.state.year} month={this.state.month}
                        fetchDailyStoreInfo={this.props.fetchDailyStoreInfo}
                        downloadCsv={this.downloadCsv.bind(this)}
                        isMember={this.props.isMember}
                        fetchMonthlyStoreInfo={this.props.fetchMonthlyStoreInfo} isDaily={this.state.isDaily}
                        handleSetActiveDaily={this.handleSetActiveDaily} handleSetActiveMonthly={this.handleSetActiveMonthly}/>
                <LineChartRegister selectedTabIndex={this.state.selectedTabIndex} isDaily={this.state.isDaily}/>
                <PieChartRegister selectedTabIndex={this.state.selectedTabIndex}/>
                <MemberTable filter={this.state.filter} submitfilter={this.state.submitfilter}
                       next={this.next.bind(this)}
                       previous={this.previous.bind(this)}
                       year={this.state.year} month={this.state.month}
                       selectedTabIndex={this.state.selectedTabIndex}
                       isDaily={this.state.isDaily}/>
            </TabPanel>
        );
    }

    render() {
        if (this.props.isMember) {
            return (
                <Tabs onSelect={(index, last) => {this.setState({selectedTabIndex: index})}}
                      className="widget__page__delivery__select__tabs"
                      selectedIndex={this.state.selectedTabIndex}>
                    <TabList className="">
                        <Tab>{Globalize.localize('analysis_register_count', Globalize.culture())}</Tab>
                        <Tab>{Globalize.localize('analysis_leaver_count', Globalize.culture())}</Tab>
                        <Tab>{Globalize.localize('analysis_member_count', Globalize.culture())}</Tab>
                    </TabList>
                    {this.renderTabPanel()}
                    {this.renderTabPanel()}
                    {this.renderTabPanel()}
                </Tabs>
            );
        }
        return (
            <div>
                <Filter filter={this.state.filter}
                        handleSubmit={this.handleSubmit}
                        handlePeriodFromChange={this.handlePeriodFromChange}
                        handlePeriodToChange={this.handlePeriodToChange}
                        handleCompanyIdChange={this.handleCompanyIdChange}
                        handleBrandIdChange={this.handleBrandIdChange}
                        handleStoreIdChange={this.handleStoreIdChange}
                        selectedTabIndex={this.state.selectedTabIndex}
                        handleYearChange = {this.handleYearChange} handleMonthChange={this.handleMonthChange}
                        year={this.state.year} month={this.state.month}
                        fetchDailyStoreInfo={this.props.fetchDailyStoreInfo}
                        downloadCsv={this.downloadCsv.bind(this)}
                        isMember={this.props.isMember}
                        fetchMonthlyStoreInfo={this.props.fetchMonthlyStoreInfo} isDaily={this.state.isDaily}
                        handleSetActiveDaily={this.handleSetActiveDaily} handleSetActiveMonthly={this.handleSetActiveMonthly}/>
                <AttributeTable filter={this.state.filter} submitfilter={this.state.submitfilter}
                                next={this.next.bind(this)}
                                previous={this.previous.bind(this)}
                                year={this.state.year} month={this.state.month}
                                selectedTabIndex={this.state.selectedTabIndex}
                                handleChangeAttribute={(e) => {this.changeAttribute(e.target.value)}}
                                analysis={this.state.analysisData}
                                showBy={this.state.showBy}
                                isDaily={this.state.isDaily}/>
            </div>
        )
    }
}

export default StoreAnalysis