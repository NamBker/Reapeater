import * as request from 'superagent';
import Rpapi from './rpapi';
import { RECEIVE_AREA } from '../constants/ActionTypes';
import { GET_DISPLAY_ITEMS_ONLY_PATTERN } from '../constants/Constants'
import { doneCustomCreate } from './routes'

export const fetchAreas = (params = {pattern: GET_DISPLAY_ITEMS_ONLY_PATTERN}, whenFailed = (err) => {}, whenSucceeded = (res) => {}) => {
    return dispatch => {
        new Rpapi('get', '/areas')
            .query(params)
            .end((err, res) => {
                if (err) {
                    whenFailed(err);
                } else {
                    let count = res.count ? res.count : 0;
                    dispatch(receiveAreas(res.area, count));
                    whenSucceeded(res);
                }
            });
    }
};

const receiveAreas = (areas, count) => {
    return {
        type: RECEIVE_AREA,
        areas: areas,
        areas_count: count
    }
};

export const clearAreas = () => {
    return dispatch => {
        dispatch(receiveAreas([], 0));
    }
}

export const createArea = (areaParams, filterParams, history) => {
    console.log(areaParams);
    return dispatch => {
        request.post(apiHost + '/areas')
            .query({token: accessToken})
            .send(JSON.stringify(areaParams))
            .end(function (err, res) {
                if (!res.ok || res.body.error_code) {
                    if (res.body.error_code) {
                        alert(Globalize.localize('area_cant_create', Globalize.culture()) + "\n" + res.body.user_message);
                    } else {
                        alert(Globalize.localize('area_cant_create', Globalize.culture()));
                    }
                    console.log(err);
                } else {
                    alert(Globalize.localize('area_created', Globalize.culture()));
                    dispatch(doneCustomCreate());
                    dispatch(fetchAreas(filterParams));
                }
            })
    }
}

export const updateArea = (areaParams, filterParams, closeDialog, history) => {
    return dispatch => {
        request.put(apiHost + '/areas')
            .query({token: accessToken})
            .send(JSON.stringify(areaParams))
            .end(function (err, res) {
                if (!res.ok || res.body.error_code) {
                    if (res.body.error_code) {
                        alert(Globalize.localize('area_cant_update', Globalize.culture()) + "\n" + res.body.user_message);
                    } else {
                        alert(Globalize.localize('area_cant_update', Globalize.culture()));
                    }
                    console.log(err);
                } else {
                    alert(Globalize.localize('area_updated', Globalize.culture()));
                    closeDialog();
                    dispatch(fetchAreas(filterParams));
                }
            })
    }
};

export const deleteAreas = (area_ids, whenFailed, whenSucceeded) => {
    new Rpapi('delete', '/areas')
        .send({area_ids})
        .end((err, res) => {
            if (err) {
                whenFailed(err);
            } else {
                whenSucceeded(res);
            }
        });
};
