import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment'
import { Line as LineChart} from 'react-chartjs'

class LineChartRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const {lineChartData, totalCount, selectedTabIndex} = this.props;

        return (
                <dl className="widget widget__wrapper memberanalysis__line__chart">
                    <dd className="widget__contents">
                        <span>会員{selectedTabIndex == 0 ? '登録' : selectedTabIndex == 1 ? '退会' : ''}数</span>
                        <span>期間の合計{totalCount}人</span>
                        <LineChart data={lineChartData} options={options} redraw/>
                    </dd>
                </dl>
        );
    }
};

let options = {
    scaleOverlay : true,
    scaleOverride : true,
    scaleSteps : 2,
    scaleStepWidth : 100,
    scaleStartValue : 0,
    scaleLineColor : "#cccccc",
    scaleLineWidth : 1,
    scaleShowLabels : true,
    scaleLabel : "<%=value%>",
    scaleFontFamily : "'Arial'",
    scaleFontSize : 10,
    scaleFontStyle : "normal",
    scaleFontColor : "#999999",
    scaleShowGridLines : false,
    scaleGridLineColor : "rgba(0, 0, 0, .05)",
    scaleGridLineWidth : 1,
    bezierCurve : false,
    pointDot : true,
    pointDotRadius : 4,
    pointDotStrokeWidth : 1,
    datasetStroke : true,
    datasetStrokeWidth : 5,
    datasetFill : true,
    animation : true,
    animationSteps : 60,
    animationEasing : "easeOutQuad",
    onAnimationComplete : () =>{},
    tooltipTemplate: "<%if (value){%><%=value%><%}%>",
    responsive: true
};


const mapStateToProps = (state, ownProps) => {
    let dataProperty = ownProps.selectedTabIndex == 0 ? 'register_count' : ownProps.selectedTabIndex == 1 ? 'leaver_count' : 'total_count';
    let lineChartData = {
        labels : [],
        datasets : [
            {
                label: "aa",
                fillColor : "#e5f3ff",
                strokeColor : "#0076de",
                pointColor : "#0076de",
                pointStrokeColor : "#0076de",
                data : [],
                pointHighlightFill : "#005bab",
                pointHighlightStroke : "#005bab",
            }
        ]
    };
    let totalCount = 0;
    state.memberAnalysis.analysisData.forEach((item, key) => {
        lineChartData.labels.unshift(moment(key).format(ownProps.isDaily ? "YYYY年MM月DD日" : "YYYY年MM月"));
        let numberMember = 0;
        item.map(store => {
            numberMember += store[dataProperty];
        });
        lineChartData.datasets[0].data.unshift(numberMember);
        totalCount += numberMember;
    });
    options.scaleStepWidth = Math.round((Math.max(...lineChartData.datasets[0].data) / (options.scaleSteps))) * 1.5;

    return {
        lineChartData, totalCount
    };
};


export default connect(mapStateToProps)(LineChartRegister);
