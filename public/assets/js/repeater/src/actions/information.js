import * as request from 'superagent';
import moment from 'moment'
import * as types from '../constants/ActionTypes';
import * as Const from '../constants/Constants';
import { RECEIVE_INFORMATION_INFO } from '../constants/ActionTypes'
var default_filters  = {};
default_filters.pattern = Const.GET_DISPLAY_ITEMS_ONLY_PATTERN;

export const fetchInformation = (filter = default_filters) => {
    let filterParams = Object.assign({}, filter);
    if (filterParams.effective_period_from) {
        filterParams.effective_period_from = filterParams.effective_period_from.format('YYYY-MM-DD');
    }
    if (filterParams.effective_period_to) {
        filterParams.effective_period_to   = filterParams.effective_period_to.format('YYYY-MM-DD');
    }
    var filter_params_brands = 0 < filterParams.brand_ids.length ? 'brand_ids[]=' + filterParams.brand_ids.join("&brand_ids[]=") : '';
    delete filterParams.brand_ids;
    var filter_params_stores = 0 < filterParams.store_ids.length ? 'store_ids[]=' + filterParams.store_ids.join("&store_ids[]=") : '';
    delete filterParams.store_ids;
    return dispatch => {
        request.get(apiHost + '/information')
            .query(Object.assign(filterParams, {token: accessToken}))
            .query(filter_params_brands)
            .query(filter_params_stores)
            .set('Accept', 'application/json')
            .end(function (err, res) {
                console.log('information api called.');
                if (err || !res.ok || res.body.error_code) {
                    alert(Globalize.localize('information_cant_get', Globalize.culture()));
                    console.log(err);
                } else {
                    let total_count = res.body.count ? res.body.count : 0;
                    dispatch(receiveInformation(res.body.informations, total_count));
                }
            });
    }
};

const receiveInformation = (informations, total_count) =>  {
    return {
        type: types.RECEIVE_INFORMATION,
        informations: informations,
        information_count: total_count,
    }
};


export const deleteInformation = (filterParams = [], history) => {
    console.log(filterParams);
    return dispatch  => {
        request.delete(apiHost + '/information')
            .query({token: accessToken})
            .send(JSON.stringify(filterParams))
            .set('Accept', 'application/json')
            .end(function (err, res) {
                if (res == undefined) {
                    return;
                }
                if (!res.ok || res.body.error_code) {
                    if (res.body != undefined && res.body.error_code) {
                        alert(Globalize.localize('information_cant_delete', Globalize.culture()) + "\n" + res.body.user_message);
                    } else {
                        alert(Globalize.localize('information_cant_delete', Globalize.culture()));
                    }
                    console.log(err);
                } else {
                    alert(Globalize.localize('information_deleted', Globalize.culture()));
                    filterParams = Object.assign(res.body.information, {pattern: Const.GET_ALL_PATTERN});
                    dispatch(fetchInformation(filterParams));
                }
            })
    }
};

export const createInformation = (params, history) => {
    let informationParams = {...params};
    informationParams.effective_period_from = informationParams.effective_period_from.format("YYYY-MM-DD HH:mm:ss");
    informationParams.effective_period_to = informationParams.effective_period_to.format("YYYY-MM-DD HH:mm:ss");
    return dispatch => {
        request.post(apiHost + '/information')
            .query({token: accessToken})
            .send(JSON.stringify(informationParams))
            .end(function (err, res) {
                if (!res.ok || res.body.error_code) {
                    if (res.body.error_code) {
                        alert(Globalize.localize('information_cant_create', Globalize.culture()) + "\n" + res.body.user_message);
                    } else {
                        alert(Globalize.localize('information_cant_create', Globalize.culture()));
                    }
                    console.log(err);
                } else {
                    alert(Globalize.localize('information_created', Globalize.culture()));
                    history.push("/information")
                }
            })
    }
};

export const updateInformation = (params, history) => {
    let informationParams = {...params};
    informationParams.effective_period_from = informationParams.effective_period_from.format("YYYY-MM-DD HH:mm:ss");
    informationParams.effective_period_to = informationParams.effective_period_to.format("YYYY-MM-DD HH:mm:ss");
    return dispatch => {
        request.put(apiHost + '/information')
            .query({token: accessToken})
            .send(JSON.stringify(informationParams))
            .end(function (err, res) {
                if (!res.ok || res.body.error_code) {
                    if (res.body.error_code) {
                        alert(Globalize.localize('information_cant_update', Globalize.culture()) + "\n" + res.body.user_message);
                    } else {
                        alert(Globalize.localize('information_cant_update', Globalize.culture()));
                    }
                    console.log(err);
                } else {
                    alert(Globalize.localize('information_updated', Globalize.culture()));
                    history.push("/information")
                }
            })
    }
};

export const fetchInformationInfo = (informationId = 'me') => {
    return dispatch => {
        request.get(apiHost + '/information/' + informationId)
            .query({token: accessToken, pattern: 3})
            .set('Accept', 'application/json')
            .end(function (err, res) {
                console.log('information api called.');
                if (err || !res.ok || res.body.error_code) {
                    alert(Globalize.localize('information_cant_get', Globalize.culture()));
                    console.log(err);
                } else {
                    dispatch(receiveInformationInfo(res.body.information));
                }
            });
    }
};

const receiveInformationInfo = (information) => {
    return {
        type: RECEIVE_INFORMATION_INFO,
        information
    }
}
