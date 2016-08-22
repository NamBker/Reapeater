import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Chart from '../../../components/analysis/delivery/Chart'

import { removeEmptyInDataset } from '../../../utils/CommonUtils'

const mapStateToProps = (state, ownProps) => {
    let deliveryDataset = [
        {
            color:     "#0076de",
            lineColor: "#0076de", // 凡例の色
            legendName:Globalize.localize('delivery_open', Globalize.culture()),
            value: 0,
        },
        {
            color:     "#61b0f5",
            lineColor: "#61b0f5", // 凡例の色
            legendName:Globalize.localize('delivery_not_open', Globalize.culture()),
            value: 0,
        },
        {
            color:     "#e5f3ff",
            lineColor: "#e5f3ff", // 凡例の色
            legendName:Globalize.localize('delivery_not_visit', Globalize.culture()),
            value: 0,
        }
    ];
    let latestDelivery = null;
    if (state.deliveryAnalysis.length > 0) {
        latestDelivery = state.deliveryAnalysis[0];
        deliveryDataset[0].value = latestDelivery.open_count;
        deliveryDataset[1].value = latestDelivery.reach_count - latestDelivery.open_count;
        deliveryDataset[2].value = latestDelivery.delivery_total - latestDelivery.reach_count;
    }
    let total = deliveryDataset[0].value + deliveryDataset[1].value + deliveryDataset[2].value;
    if (total > 0) {
        deliveryDataset[0].label = deliveryDataset[0].legendName + deliveryDataset[0].value + Globalize.localize('through', Globalize.culture()) + "(" + Math.round(deliveryDataset[0].value * 100 / total) + "%)";
        deliveryDataset[1].label = deliveryDataset[1].legendName + deliveryDataset[1].value + Globalize.localize('through', Globalize.culture()) + "(" + Math.round(deliveryDataset[1].value * 100 / total) + "%)";
        deliveryDataset[2].label = deliveryDataset[2].legendName + deliveryDataset[2].value + Globalize.localize('through', Globalize.culture()) + "(" + Math.round(deliveryDataset[2].value * 100 / total) + "%)";
    }

    return {
        deliveryDataset: removeEmptyInDataset(deliveryDataset), latestDelivery, total
    }
};


export default connect(mapStateToProps)(Chart)