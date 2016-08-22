import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';


import DropDownList from '../../../components/commons/DropDownList'

class Table extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.memberAnalysis != nextProps.memberAnalysis ||
            this.props.showBy != nextProps.showBy ||
            this.props.analysis != nextProps.analysis;
    }

    render() {
        const {memberAnalysis, selectedTabIndex, isDaily, year, month} = this.props;
        let totalCount = 0;
        let storeCount = new Array(memberAnalysis.storeNameList.length).fill(0);

        let row = [], index = 1;
        this.props.analysis.forEach((dataList, attr) => {
            let col = [];
            let totalInRow = 0;
            memberAnalysis.storeNameList.map((storeName, i) => {
                if (dataList.has(storeName)) {
                    col.push(<td key={i}>{dataList.get(storeName)}</td>)
                    totalInRow += dataList.get(storeName);
                    storeCount[i] += dataList.get(storeName);
                } else {
                    col.push(<td key={i}>0</td>)
                }
            });
            totalCount += totalInRow;
            row.push(<tr key={index}><td>{index}</td><td>{attr}</td><td>{totalInRow}</td>{col}</tr>);
            index++;
        });

        return (
            <div className="widget widget__wrapper widget__memberanalysis">
                <div className="widget__memberanalysis2__table__label">
                    <div className="select__attribute"><span>表示</span><DropDownList data={['男女', '年代', '職業', '都道府県']} defaultValue={this.props.showBy} onChange={this.props.handleChangeAttribute}/></div>
                    <div>{isDaily ? year + '年' + ("0" + month).slice(-2) + '月': year + '年'}</div>
                    <div><button className="btn btn-default move_to_left" onClick={() => {this.props.previous()}}></button></div>
                    <div><button className="btn btn-default move_to_right" onClick={() => {this.props.next()}}></button></div>
                </div>
                <div style={{width: '100%', overflowX: 'scroll'}}>
                    <table className="memberanalysis-table">
                        <thead>
                        <tr>
                            <th></th>
                            <th>{['属性', '年代', '職業', '都道府県'][this.props.showBy]}</th>
                            <th>{selectedTabIndex == 0 ? '登録数' : selectedTabIndex == 1 ? '退会数' : '会員数'}</th>
                            { memberAnalysis.storeNameList.map((item, index) => <th key={index}>{item}</th>)}
                        </tr>
                        </thead>
                        <tbody>{row}</tbody>
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
