import React, {Component, PropTypes} from 'react';
import { Pie as PieChart } from 'react-chartjs'

import { fetchDeliveryAnalysis, clearDeliveryAnalysis } from '../../actions/deliveryanalysis'

class MailmagagineChart extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchDeliveryAnalysis({}));
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch(clearDeliveryAnalysis());
    }

    render() {
        const { deliveryDataset, total } = this.props;
        return (
            <dl className="widget widget--half widget__mailmagazine">
                <dt className="widget__title">{Globalize.localize('home_mailmagagine_chart', Globalize.culture())}<div className="widget__info">
                    <a href="" data-balloon-length="medium" data-balloon={Globalize.localize('home_mailmagagine_chart_balloon', Globalize.culture())} data-balloon-pos="up" data-balloon-fukidashi="right"></a></div></dt>
                <dd className="widget__contents">
                    <p className="widget__contents__txt">{Globalize.localize('home_mailmagagine_chart_total', Globalize.culture())}<span>{total}</span>{Globalize.localize('through', Globalize.culture())}</p>
                    <PieChart data={deliveryDataset} options={pieOptions} height="190" width="345" style={{width: '345px', height: '190px'}} redraw/>
                    <div id="pieLegend"><ul className="pie-legend">
                        <li><span style={{backgroundColor: '#e5f3ff'}}>&nbsp;&nbsp;&nbsp;</span> {Globalize.localize('delivery_not_open', Globalize.culture())}</li>
                        <li><span style={{backgroundColor: '#0076de'}}>&nbsp;&nbsp;&nbsp;</span> {Globalize.localize('delivery_open', Globalize.culture())}</li></ul>
                    </div>
                </dd>
            </dl>
        );
    }
}

// オプション
var pieOptions = {
    // 凡例表示用の HTML テンプレート
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\">&nbsp;&nbsp;&nbsp;</span> <%if(datasets[i].legendName){%><%=datasets[i].legendName%><%}%></li><%}%></ul>",
    //animation : false,
    animationEasing : "easeOutQuad",
    tooltipTemplate: "<%if (label){%><%=label%><%}%>",
    onAnimationComplete: function(){
        this.showTooltip(this.segments, true);
    },
    tooltipEvents: [],
    showTooltips: true
};

export default MailmagagineChart