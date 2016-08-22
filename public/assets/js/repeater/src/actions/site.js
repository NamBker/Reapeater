import * as request from 'superagent';
import * as Const from '../constants/Constants';
import moment from 'moment';
import Rpapi from './rpapi';
import { showNotification } from './notification';
import { RECEIVE_SITE_HEADER_FOOTER, RECEIVE_SITE_STORE_FREE, RECEIVE_SITE_STORE_INFO, RECEIVE_SITE_STORE_URL, RECEIVE_ERROR, RECEIVE_SITE_MAP, RECEIVE_SITE_COMPANY_SUMMARY, RECEIVE_SITE_STORE_FREE_ALL } from '../constants/ActionTypes'

export const fetchSiteHeaderFooter = (filterParams = {pattern: 3}) => {
    return dispatch => {
        request.get(apiHost + '/site/headers/footer')
            .query(Object.assign(filterParams, {token: accessToken}))
            .set('Accept', 'application/json')
            .end(function (err, res) {
                console.log('get site header footer called');
                if (res == undefined || res.body == null) {
                    return;
                }
                if (err || !res.ok || res.body.error_code) {
                    console.log(err);
                } else {
                    dispatch(receiveSiteHeaderFooter(res.body.site_headers_footers));
                }
            });
    }
};


const receiveSiteHeaderFooter = (site_headers_footers) => {
    return {
        type: RECEIVE_SITE_HEADER_FOOTER,
        site_headers_footers: site_headers_footers
    }
};

export const updateSiteHeaderFooter = (siteParams, history, whenFailure = (res) => {}, whenSuccess = (res) => {}) => {
    console.log(siteParams);
    return dispatch => {
        new Rpapi('put', '/site/headers/footer')
            .send(JSON.stringify(siteParams))
            .end(function (err, res) {
                if (err) {
                    whenFailure(err);
                } else {
                    whenSuccess(res);
                }
            })
    }
};

/* site store free */
export const fetchSiteFreeStore = (brandId = 0, storeId = 0, filterParams = {pattern: Const.GET_ALL_PATTERN}) => {
    return dispatch => {
        new Rpapi('get', '/site/brand/' + brandId + "/store/" + storeId)
            .query(filterParams)
            .end(function (err, res) {
                console.log('get site free called');
                if (err || res.error_code) {
                    alert(err);
                    dispatch(receiveError(err));
                } else {
                    dispatch(receiveStoreFree(res.site_store_free));
                }
            });
    }
};

const receiveStoreFree = (site_store_free) => {
    return {
        type: RECEIVE_SITE_STORE_FREE,
        site_store_free: site_store_free
    }
};

const receiveError = (err) => {
    return {
        type : RECEIVE_ERROR,
        error : err
    }
};

export const updateSiteStoreFree = (siteParams, history, whenFailure = (res) => {}, whenSuccess = (res) => {}) => {
    return dispatch => {
        new Rpapi('put', '/site/brand/' + siteParams.brand_id + '/store/' + siteParams.store_id)
            .send(JSON.stringify(siteParams))
            .end(function (err, res) {
                if (err) {
                    alert(err);
                    whenFailure(err);
                } else {
                    whenSuccess(res);
                }
            })
    }
};

export const updateSiteStoreFreeOrder = (siteParams, history, whenFailure = (res) => {}, whenSuccess = (res) => {}) => {
    return dispatch => {
        new Rpapi('put', '/site/map')
            .send(siteParams)
            .end(function (err, res) {
                if (err) {
                    alert(err);
                    whenFailure(err);
                } else {
                    whenSuccess(res);
                }
            })
    }
};

export const updateMultiSiteStoreFree = (siteParams, history, whenFailure = (res) => {}, whenSuccess = (res) => {}) => {
    console.log(siteParams);
    return dispatch => {
        new Rpapi('put', '/site/shoppage')
            .send(siteParams)
            .end(function (err, res) {
                if (err) {
                    alert(err);
                    whenFailure(err);
                } else {
                    whenSuccess(res);
                }
            })
    }
};

/* site store private */
export const fetchSiteStoreInfo = (brandId, storeId, filterParams = {pattern: 3}) => {
    return dispatch => {
        request.get(apiHost + '/site/detail/brand/' + brandId + '/store/' + storeId)
            .query(Object.assign(filterParams, {token: accessToken}))
            .set('Accept', 'application/json')
            .end(function (err, res) {
                console.log('site store private called');
                if (res == undefined || res.body == null) {
                    return;
                }
                if (err || !res.ok || res.body.error_code) {
                    console.log(err);
                } else {
                    dispatch(receiveSiteStoreInfo(res.body.store));
                }
            });
    }
};

const receiveSiteStoreInfo = (store) => {
    return {
        type: RECEIVE_SITE_STORE_INFO,
        store: store
    }
};

/* site store url */
export const fetchSiteFreeStoreUrl = (brandId = '', filterParams = {pattern: 1}) => {
    return dispatch => {
        new Rpapi('get', '/site/url/brand/' + brandId + "/")
            .query(filterParams)
            .end(function (err, res) {
                console.log('get site free url called');
                if (err || res.error_code) {
                    alert(err);
                    dispatch(receiveError(err));
                } else {
                    dispatch(receiveSiteFreeStoreUrl(res.site_store_free_url,res.count));
                }
            });
    }
};

const receiveSiteFreeStoreUrl = (site_store_free_url,count) => {
    return {
        type: RECEIVE_SITE_STORE_URL,
        site_store_free_url: site_store_free_url,
        count
    }
};

/* fetch site map */
export const fetchSiteMap = (filterParams = {pattern: 3}) => {
    return dispatch => {
        request.get(apiHost + '/site/map' + '?pattern=3')
            .query(Object.assign(filterParams, {token: accessToken}))
            .set('Accept', 'application/json')
            .end(function (err, res) {
                console.log('get site map called');
                if (res == undefined || res.body == null) {
                    return;
                }
                if (err || !res.ok || res.body.error_code) {
                    console.log(err);
                } else {
                    dispatch(receiveSiteMap(res.body.site_map));
                }
            });
    }
};

const receiveSiteMap = (site_map) => {
    return {
        type: RECEIVE_SITE_MAP,
        site_map: site_map
    }
};

/* delete site */
export const deleteSite = (siteParams, history) => {
    return dispatch => {
        request.delete(apiHost + '/site/map')
            .query({token: accessToken})
            .send(JSON.stringify(siteParams))
            .set('Accept', 'application/json')
            .end(function (err, res) {
                if (res == undefined) {
                    return;
                }
                if (!res.ok || res.body.error_code) {
                    if (res.body != undefined &&
                        res.body.error_code) {
                        alert(Globalize.localize('site_map_cant_delete', Globalize.culture()) + "\n" + res.body.user_message);
                    } else {
                        alert(Globalize.localize('site_map_cant_delete', Globalize.culture()));
                    }
                    console.log(err);
                } else {
                    alert(Globalize.localize('site_map_deleted', Globalize.culture()));
                }
            })
    }
};

/* site company summary */
export const fetchSiteCompanySummary = (brandId = '', filterParams = {pattern: Const.GET_ALL_PATTERN}) => {
    return dispatch => {
        new Rpapi('get', '/site/companysummary/brand/' + brandId)
            .query(filterParams)
            .end(function (err, res) {
                console.log('get site company summary called');
                if (err || res.error_code) {
                    //alert(err);
                    dispatch(receiveError(err));
                } else {
                    if (res.company != null) {
                        dispatch(receiveSiteCompanySummary(res.company));
                    }
                }
            });
    }
};

const receiveSiteCompanySummary = (company) => {
    return {
        type: RECEIVE_SITE_COMPANY_SUMMARY,
        company: company,
    }
};

/* site store free */
export const fetchSiteFreeStoreAll = (brandId = 0, filterParams = {pattern: Const.GET_ALL_PATTERN}) => {
    return dispatch => {
        new Rpapi('get', '/site/shoppage/' + brandId)
            .query(filterParams)
            .end(function (err, res) {
                console.log('get site free all called');
                if (err || res.error_code) {
                    alert(err);
                    dispatch(receiveError(err));
                } else {
                    dispatch(receiveStoreFreeAll(res.site_store_free));
                }
            });
    }
};

const receiveStoreFreeAll = (site_store_free) => {
    return {
        type: RECEIVE_SITE_STORE_FREE_ALL,
        site_store_free: site_store_free
    }
};

export const createSiteStoreFree = (siteParams, history, whenFailure = (res) => {}, whenSuccess = (res) => {}) => {
    return dispatch => {
        new Rpapi('post', '/site/linkage')
            .send(siteParams)
            .end(function (err, res) {
                if (err) {
                    alert(err);
                    whenFailure(err);
                } else {
                    whenSuccess(res);
                }
            })
    }
};

