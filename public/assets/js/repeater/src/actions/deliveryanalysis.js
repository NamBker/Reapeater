import { RECEIVE_DELIVERY_ANALYSIS } from '../constants/ActionTypes';
import Rpapi from './rpapi';

export const fetchDeliveryAnalysis = (filterParams, pattern = 3) => {
    let params = {...filterParams, pattern};
    return dispatch => {
        new Rpapi('get', '/delivery/analysis')
            .query(params)
            .end(function (err, res) {
                console.log('dailydelivery api called.');
                if (err || res.error_code) {
                    alert(Globalize.localize('delivery_analysis_cant_get', Globalize.culture()));
                    console.log(err);
                } else {
                    dispatch(receiveDeliveryAnalysis(res.daily_delivery));
                }
            });
    }
};

const receiveDeliveryAnalysis = (dailyDelivery) => {
    return {
        type: RECEIVE_DELIVERY_ANALYSIS,
        dailyDelivery,
    };
};

export const clearDeliveryAnalysis = () => {
    return receiveDeliveryAnalysis([]);
};