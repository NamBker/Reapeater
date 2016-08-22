import React, {Component, PropTypes} from 'react';

import { Pie as PieChart } from 'react-chartjs'

import { removeEmptyInDataset } from '../../../utils/CommonUtils'

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { couponDataset, latestCoupon, total } = this.props;
        return (
            <div className="contents__container mb20">
                <div className="contents__container__content">
                    <div className="contents__container__box--none">
                        <div className="contents__container__box--left">
                            <div className="contents__container__box--left--title">{Globalize.localize('analysis_coupon_latest', Globalize.culture())}</div>
                            <div className="coupon--title">{latestCoupon.coupon_title}</div>
                            <div className="coupon--cvr">{total != 0 ? Math.round(couponDataset[0].value * 100 / (total)) : 0}</div>
                        </div>
                        <div className="contents__container__box--right">
                            <div className="number-of-pv">{total}</div>
                            <div className="pie-graph">
                                <PieChart data={removeEmptyInDataset(couponDataset)} options={pieOptions} height="190" redraw/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// オプション
let pieOptions = {
    // 凡例表示用の HTML テンプレート
    legendTemplate : "<ul className=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\">&nbsp;&nbsp;&nbsp;</span> <%if(datasets[i].legendName){%><%=datasets[i].legendName%><%}%></li><%}%></ul>",
    animationEasing : "easeOutQuad",
    tooltipTemplate: "<%if (label){%><%=label%><%} %>",
    onAnimationComplete: function(){
        this.showTooltip(this.segments, true);
    },
    tooltipEvents: [],
    showTooltips: true,
    tooltipFillColor : "#fff",
    tooltipFontColor: "#000",
    segmentShowStroke: false,
};

export default Chart
