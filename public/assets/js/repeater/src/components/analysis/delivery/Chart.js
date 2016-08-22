import React, { Component, PropTypes } from 'react';
import moment from 'moment'

import { Pie as PieChart } from 'react-chartjs'

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        const { deliveryDataset, latestDelivery, total } = this.props;
        return (
            <div className="contents__container mb20">
                <div className="contents__container__content">
                    <div className="contents__container__box--none">
                        <div className="contents__container__box--left">
                            <div className="contents__container__box--left--title">{Globalize.localize('analysis_delivery_latest', Globalize.culture())}</div>
                            <div className="date">{latestDelivery ? moment(latestDelivery.delivery.delivery_schedule).format('LL (ddd) HH:mm') : ""}</div>
                            <div className="title">{latestDelivery ? latestDelivery.delivery.delivery_title : ""}</div>
                            <div className="mailmagazine--note">{Globalize.localize('analysis_delivery_note', Globalize.culture())}</div>
                        </div>
                        <div className="contents__container__box--right">
                            <div className="number-of-distribution">{total}</div>
                            <div className="pie-graph">
                                <PieChart data={deliveryDataset} options={pieOptions} height="190" redraw/>
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
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\">&nbsp;&nbsp;&nbsp;</span> <%if(datasets[i].legendName){%><%=datasets[i].legendName%><%}%></li><%}%></ul>",
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
