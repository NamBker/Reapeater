import * as request from 'superagent';
import moment from 'moment'
import * as types from '../constants/ActionTypes';
import * as Const from '../constants/Constants';
import { selectByFieldStore } from '../utils/CsvUtils'
import Rpapi from './rpapi';

var default_filters  = {};
default_filters.pattern = Const.GET_DISPLAY_ITEMS_ONLY_PATTERN;

export const fetchStores = (filterParams = default_filters, convertToCsv = () => {}) => {
    return dispatch => {
        request.get(apiHost + '/stores')
            .query(Object.assign(filterParams, {token: accessToken}))
            .set('Accept', 'application/json')
            .end(function (err, res) {
                console.log('stores api called.');
                if (err || !res.ok || res.body.error_code) {
                    alert("店舗を取得できません。");
                    console.log(err);
                } else {
                    let count = res.body.count ? res.body.count : 0;
                    dispatch(receiveStores(res.body.store, count));
                    let fileName = moment().format('YYYYMMDD');
                    convertToCsv(res.body.store, selectByFieldStore, fileName);
                }
            });
    }
};


const receiveStores = (stores, count) =>  {
    return {
        type: types.RECEIVE_STORE,
        stores: stores,
        stores_count: count
    }
};

export const fetchStoreInfo = (storeId) => {
    return dispatch => {
        new Rpapi('get', '/store/' + storeId)
            .end(function (err, res) {
                if (err) {
                    console.log('Fail to get store information. error:' + err.toString());
                } else {
                    dispatch(receiveStoreInfo(res.store, types.RECEIVE_STORE_INFO));
                }
            });
    }
};

const receiveStoreInfo = (store, type) => {
    return {
        type: type,
        storeDetail: store
    }
};

export const createStore = (storeParams, whenFailed, whenSucceeded) => {
    return dispatch => {
        new Rpapi('post', '/stores')
            .send(storeParams)
            .end(function (err, res) {
                if (err) {
                    whenFailed(err);
                } else {
                    whenSucceeded(res);
                }
            });
    }
};

export const updateStore = (storeId, storeParams, whenFailed, whenSucceeded) => {
    return dispatch => {
        new Rpapi('put', '/store/' + storeId)
            .send(storeParams)
            .end(function (err, res) {
                if (err) {
                    whenFailed(err);
                } else {
                    whenSucceeded(res);
                }
            })
    }
};

export const clearStores = () => {
    return dispatch => {
        dispatch(receiveStores([]));
    }
}

export const storeCSVUpload = (file, whenFailed, whenSucceeded) => {
    new Rpapi('post', '/stores/csv')
        .attach(file)
        .end((err, res) => {
            if (err) {
                whenFailed(err);
            } else {
                whenSucceeded(res);
            }
        });
}

export const deleteStores = (store_ids, whenFailed, whenSucceeded) => {
    new Rpapi('delete', '/stores')
        .send({store_ids})
        .end((err, res) => {
            if (err) {
                whenFailed(err);
            } else {
                whenSucceeded(res);
            }
        });
};
