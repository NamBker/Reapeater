import React, { Component, PropTypes } from 'react';
import moment from 'moment'
import { connect } from 'react-redux';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCheckAll: false,
            isRender : false,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.memberAnalysis != nextProps.memberAnalysis;
    }

    render() {
        let index = 0;
        const {memberAnalysis, selectedTabIndex, isDaily, year, month} = this.props;
        let dataProperty = selectedTabIndex == 0 ? 'register_count' : selectedTabIndex == 1 ? 'leaver_count' : 'total_count';
        let totalCount = 0;
        let storeCount = new Array(memberAnalysis.storeNameList.length).fill(0);
        let dataList = [];
        memberAnalysis.analysisData.forEach((item, time) => {
            let rowTotalCount = 0;
            let storeList = memberAnalysis.storeNameList.map((storeName, index) => {
                let store = item.find((store => store.store_name == storeName));
                if (store) {
                    rowTotalCount += store[dataProperty];
                    storeCount[index] += store[dataProperty];
                    return <td key={index}>{store[dataProperty]}</td>
                } else {
                    return <td key={index}>0</td>
                }
            });
            totalCount += rowTotalCount;
            dataList.push(<tr key={index}>
                <td>{index+1}</td>
                <td>{time.length > 7 ? moment(time).format("YYYY年MM月DD日 (ddd)") :
                    moment(time).format("YYYY年MM月")}</td>
                <td>{rowTotalCount}</td>
                {storeList}
            </tr>);
            index++;
        });
        return (
            <div className="widget widget__wrapper widget__memberanalysis">
                <div className="widget__memberanalysis__table__label">
                    <div>{isDaily ? year + '年' + ("0" + month).slice(-2) + '月': year + '年'}</div>
                    <div><button className="btn btn-default move_to_left" onClick={() => {this.props.previous()}}></button></div>
                    <div><button className="btn btn-default move_to_right" onClick={() => {this.props.next()}}></button></div>
                </div>
                <div className="memberanalysis-table-wrap">
                    <table className="memberanalysis-table">
                        <thead>
                        <tr>
                            <th></th>
                            <th>{isDaily ? '日付' : '月付'}</th>
                            <th>{selectedTabIndex == 0 ? '登録数' : selectedTabIndex == 1 ? '退会数' : '会員数'}</th>
                            { memberAnalysis.storeNameList.map((item, index) => <th key={index}>{item}</th>)}
                        </tr>
                        </thead>
                        <tbody>
                        {dataList}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan={2}>会計</td>
                            <td className="bold-font-weight right-align">{totalCount}</td>
                            {storeCount.map((value, index) => <td className="normal-font-weight" key={index}>{value}</td>)}
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {

    return {
        memberAnalysis : state.memberAnalysis,
    }
};

export default connect(mapStateToProps)(Table);
