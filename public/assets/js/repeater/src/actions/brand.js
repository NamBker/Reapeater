import * as request from 'superagent';
import * as types from '../constants/ActionTypes';
import * as Const from '../constants/Constants';
import Rpapi from './rpapi';

var default_filters = {};
default_filters.pattern = Const.GET_DISPLAY_ITEMS_ONLY_PATTERN;

export const fetchBrands = (filterParams = default_filters) => {
    return dispatch => {
        request.get(apiHost + '/brands')
            .query(Object.assign(filterParams, {token: accessToken}))
            .set('Accept', 'application/json')
            .end(function (err, res) {
                console.log('brands api called.');
                if (err || !res.ok || res.body.error_code) {
                    alert(Globalize.localize('brand_cant_get', Globalize.culture()));
                    console.log(err);
                } else {
                    let count = res.body.count ? res.body.count : 0;
                    dispatch(receiveBrands(res.body.brand, count));
                }
            });
    }
};


const receiveBrands = (brand, count) =>  {
    return {
        type: types.RECEIVE_BRAND,
        brand: brand,
        brands_count: count
    }
};

export const createBrand = (brandParams, history, whenFailure = (err) => {}, whenSuccess = (res) => {}) => {
    return dispatch => {
        request.post(apiHost + '/brands')
            .query({token: accessToken})
            .send(JSON.stringify(brandParams))
            .set('Accept', 'application/json')
            .end(function (err, res) {
                if (err) {
                    whenFailure(err);
                } else {
                    whenSuccess(res);
                }
            });
    }
};


export const fetchBrandInfo = (brandId = '', pattern=Const.GET_DISPLAY_ITEMS_ONLY_PATTERN) => {
    return dispatch => {
        request.get(apiHost + '/brands/' + brandId+'?pattern='+pattern)
            .query({token: accessToken})
            .set('Accept', 'application/json')
            .end(function (err, res) {
                console.log('brand api called.');
                if (err || !res.ok || res.body.error_code) {
                    alert(Globalize.localize('brand_cant_get', Globalize.culture()));
                    console.log(err);
                } else {
                    dispatch(receiveBrandInfo(res.body.brand, types.RECEIVE_BRAND_INFO));
                }
            });
    }
};

const receiveBrandInfo = (brand, type) => {
    return {
        type: type,
        brand: brand
    }
};

export const updateBrand = (brandParams, history, whenFailure = (err) => {}, whenSuccess = (res) => {}) => {
    return dispatch => {
        request.put(apiHost + '/brands')
            .query({token: accessToken})
            .send(JSON.stringify(brandParams))
            .set('Accept', 'application/json')
            .end(function (err, res) {
                if (err) {
                    whenFailure(err);
                } else {
                    whenSuccess(res);
                    history.push("/brand")
                }
            });
    }
};

export const clearBrands = () => {
    return dispatch => {
        dispatch(receiveBrands([]));
    }
}

export const deleteBrands = (brand_ids, whenFailure = (err) => {}, whenSuccess = (res) => {}) => {
    new Rpapi('delete', '/brands/')
        .send({brand_ids})
        .end(function (err, res) {
            if (err) {
                whenFailure(err);
            } else {
                whenSuccess(res);
            }
        });
};
