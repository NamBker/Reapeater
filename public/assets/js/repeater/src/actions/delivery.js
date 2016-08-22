import Rpapi from './rpapi';
import { RECEIVE_DELIVERY, RECEIVE_DELIVERY_DETAIL, RECEIVE_COUNT_BY_DELIVERY_STATUS } from '../constants/ActionTypes'
import { GET_DISPLAY_ITEMS_ONLY_PATTERN } from '../constants/Constants'

export const fetchDeliveries = (filter = {pattern: GET_DISPLAY_ITEMS_ONLY_PATTERN}, whenFailure = (err) => {}, whenSuccess = (res) => {}) => {
    return dispatch => {
        new Rpapi('get', '/deliveries')
            .query(filter)
            .end(function (err, res) {
                if (err) {
                    whenFailure(err);
                } else {
                    let count = res.count ? res.count : 0;
                    dispatch(receiveDeliveries(res.delivery, count));
                    whenSuccess(res);
                }
            });
    }
};

const receiveDeliveries = (deliveries, total_count) =>  {
    return {
        type: RECEIVE_DELIVERY,
        deliveries: deliveries,
        delivery_count: total_count,
    }
};

export const fetchDeliveryDetail = (deliveryId, whenFailure = (err) => {}, whenSuccess = (res) => {}) => {
    new Rpapi('get', '/delivery/' + deliveryId)
        .end((err, res) => {
            if (err) {
                whenFailure(err);
            } else {
                whenSuccess(res);
            }
        });
}

export const countByDeliveryStatus = (whenFailure = (err) => {}, whenSuccess = (res) => {}) => {
    return dispatch => {
        new Rpapi('get', '/delivery/count')
            .end(function (err, res) {
                if (err) {
                    whenFailure(err);
                } else {
                    dispatch(receiveCountByDeliveryStatus(res.delivery_counts));
                    whenSuccess(res);
                }
            });
    }
}

const receiveCountByDeliveryStatus = (counts) => {
    return {
        type: RECEIVE_COUNT_BY_DELIVERY_STATUS,
        delivery_count_per_status: counts,
    }
}

export const deleteDeliveries = (deliveryIds, filter, whenFailure = (err) => {}, whenSuccess = (res) => {}) => {
    return dispatch => {
        new Rpapi('delete', '/deliveries')
            .send({delivery_ids: deliveryIds})
            .end(function (err, res) {
                if (err) {
                    whenFailure(err);
                } else {
                    dispatch(fetchDeliveries(filter));
                    whenSuccess(res);
                }
            });
    }
};

export const createDelivery = (data, whenFailure = (err) => {}, whenSuccess = (res) => {}) => {
    return dispatch => {
        new Rpapi('post', '/delivery')
            .send(data)
            .end(function (err, res) {
                if (err) {
                    whenFailure(err);
                } else {
                    whenSuccess(res);
                }
            });
    }
}

export const updateDelivery = (deliveryId, data, whenFailure = (err) => {}, whenSuccess = (res) => {}) => {
    return dispatch => {
        new Rpapi('put', '/delivery/' + deliveryId)
            .send(data)
            .end(function (err, res) {
                if (err) {
                    whenFailure(err);
                } else {
                    whenSuccess(res);
                }
            });
    }
}

