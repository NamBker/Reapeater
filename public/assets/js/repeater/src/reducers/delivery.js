import { RECEIVE_DELIVERY, RECEIVE_DELIVERY_DETAIL, RECEIVE_COUNT_BY_DELIVERY_STATUS } from '../constants/ActionTypes';

export const deliveries = (state = [], action) => {
    switch (action.type) {
        case RECEIVE_DELIVERY:
            return action.deliveries;
        default:
            return state;
    }
};

export const delivery_detail = (state = {}, action) => {
    switch (action.type) {
        case RECEIVE_DELIVERY_DETAIL:
            return action.delivery_detail;
        default:
            return state;
    }
};

export const delivery_count = (state = 0, action) => {
    switch (action.type) {
        case RECEIVE_DELIVERY:
            return action.delivery_count;
        default:
            return state;
    }
};

export const delivery_count_per_status = (state = {}, action) => {
    switch (action.type) {
        case RECEIVE_COUNT_BY_DELIVERY_STATUS:
            return action.delivery_count_per_status;
        default:
            return state;
    }
}
