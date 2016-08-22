import { connect } from 'react-redux';
import MemberChart from '../../components/home/MemberChart'

import moment from 'moment'

const mapStateToProps = (state) => {
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
        lineChartData.labels.unshift(moment(key).format("MM/DD"));
        let numberMember = 0;
        item.map(store => {
            numberMember += store.register_count;
        });
        lineChartData.datasets[0].data.unshift(numberMember);
        totalCount += numberMember;
    });
    let scaleStepWidth = Math.round((Math.max(...lineChartData.datasets[0].data) / 2)) * 1.5;
    return {
        lineChartData, totalCount, scaleStepWidth
    }
};

export default connect(mapStateToProps)(MemberChart)