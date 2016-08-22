import { connect } from 'react-redux';
import MailmagagineChart from '../../components/home/MailmagagineChart'

import { removeEmptyInDataset } from '../../utils/CommonUtils'

const mapStateToProps = (state, ownProps) => {
    let deliveryDataset = [
        {
            color:     "#e5f3ff",
            lineColor: "#e5f3ff", // 凡例の色
            legendName:Globalize.localize('delivery_not_open', Globalize.culture()),
            highlight: "seagreen",
            value: 0,
        },
        {
            color:     "#0076de",
            lineColor: "#0076de", // 凡例の色
            legendName:Globalize.localize('delivery_open', Globalize.culture()),
            highlight: "yellow",
            value: 0,
        },
    ];
    let latestDelivery = null;
    if (state.deliveryAnalysis.length > 0) {
        latestDelivery = state.deliveryAnalysis[0];
        deliveryDataset[0].value = latestDelivery.delivery_total - latestDelivery.open_count;
        deliveryDataset[1].value = latestDelivery.open_count;
    }
    let total = deliveryDataset[0].value + deliveryDataset[1].value;
    if (total > 0) {
        deliveryDataset[0].label = Math.round(deliveryDataset[0].value * 100 / total) + "%";
        deliveryDataset[1].label = Math.round(deliveryDataset[1].value * 100 / total) + "%";
    }

    return {
        deliveryDataset: removeEmptyInDataset(deliveryDataset), total
    }
};

export default connect(mapStateToProps)(MailmagagineChart)