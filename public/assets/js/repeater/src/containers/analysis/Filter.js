import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SearchDetail from './SearchDetail'
import DropDownList from '../../components/commons/DropDownList'
import moment from 'moment'

import {getAnalysisMemberData, convertToCsv} from '../../utils/CsvUtils'


class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowSearchDetail: false,
        };
        this.isActiveDaily = this.isActiveDaily.bind(this);
    }

    isActiveDaily(value) {
        let isDaily = (this.props.isDaily==true)?'daily':'monthly';
        return "btn btn-default " + value +((value==isDaily)?" active":"");
    }

    convertData() {
        return getAnalysisMemberData(this.props.memberAnalysis, this.props.isDaily, this.props.selectedTabIndex);
    }

    downloadCsv() {
        let fileName = '会員分析_' + (this.props.isDaily ? (this.props.year + '年' + ("0" + this.props.month).slice(-2) + '月') : (this.props.year + '年'))
        convertToCsv(this.props.memberAnalysis, this.convertData.bind(this), fileName);
    }

    render() {
        const {filter,
                handleCompanyIdChange,handleBrandIdChange, handleStoreIdChange,
                handleSubmit, fetchDailyStoreInfo,handleYearChange, handleMonthChange,
                fetchMonthlyStoreInfo, handleSetActiveDaily, handleSetActiveMonthly,
                year, month, isDaily, isDelivery} = this.props;
        return (
            <dl className="widget widget__page__filter">
                <dt className="widget__page__memberanalysis__select">
                    <dl>
                        <dd className="analysis__filter__top">
                            <div>期間</div>
                            {!isDelivery ? <div>
                                <button type="button" onClick={handleSetActiveDaily} className={this.isActiveDaily('daily')}>日次</button>
                                <button type="button" onClick={handleSetActiveMonthly} className={this.isActiveDaily('monthly')}>月次</button>
                            </div>: null}
                            <div>
                               <DropDownList
                                        data={listyears}
                                        defaultValue={year}
                                        hasEmptyOption={true}
                                        onChange={handleYearChange}
                                        eachCallback={(element, index) => <option value={element} key={index}>{element}年</option>}/>
                            </div>
                            <div>
                                {isDaily || isDelivery ? <DropDownList
                                    data={listmonths}
                                    defaultValue={("0" + month).slice(-2)}
                                    hasEmptyOption={true}
                                    onChange={handleMonthChange}
                                    eachCallback={(element, index) => <option value={element} key={index}>{element}月</option>}/> : null}
                            </div>
                            <div>
                                <button className="btn btn-default" onClick={() => {this.props.isMember ? this.downloadCsv() : this.props.downloadCsv()}}>ダウンロード</button>
                            </div>
                        </dd>
                    </dl>
                </dt>
                <dt className="widget__page__more__filter">
                    <div className="widget__page__title widget__page__search widget__title_memberanalysis" >
                        <img src="/assets/img/icon-search.png"/>
                        <span>検索条件</span>
                        <span>検索条件を選択して、クーポンー覧を絞り込むことができます。</span>
                    </div>
                    {this.state.isShowSearchDetail ? <SearchDetail filter={filter} handleSubmit={handleSubmit}
                    handleCompanyIdChange={handleCompanyIdChange} handleBrandIdChange={handleBrandIdChange}
                    handleStoreIdChange={handleStoreIdChange} fetchDailyStoreInfo={fetchDailyStoreInfo}
                    fetchMonthlyStoreInfo ={fetchMonthlyStoreInfo}
                    isDaily={isDaily} year={year} month={month}/> : null}
                    <div className="widget__page__filter__detail" onClick={() => {this.setState({isShowSearchDetail : !this.state.isShowSearchDetail})}}>
                        <p>
                            <span className={!this.state.isShowSearchDetail ? 'plus' : 'minus'}></span><span>{!this.state.isShowSearchDetail ? '検索条件の詳細' : '検索条件の詳細を閉じる'}</span>
                        </p>
                    </div>
                </dt>

            </dl>
        );
    }
}



let currentYear = moment().format("YYYY");
let listyears = [];
for(let i=0;i < 20; i++) {
    listyears.push(currentYear);
    currentYear = moment(currentYear,"YYYY").subtract(1, 'years').format("YYYY");
}

let listmonths = Array.apply(0, Array(12)).map(function(_,i){
    return moment().month(i).format('MM');
});


const mapStateToProps = (state,ownProps) => {
    return {
        currentUser: state.currentUser,
        companies: state.companies,
        brands: state.brands,
        stores: state.stores,
        memberAnalysis : state.memberAnalysis,
    }
};


export default connect(mapStateToProps)(Filter);