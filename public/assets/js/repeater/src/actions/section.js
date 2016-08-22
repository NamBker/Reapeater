import * as request from 'superagent';
import * as types from '../constants/ActionTypes';
import * as Const from '../constants/Constants';
import Rpapi from './rpapi';

var default_filters = {};
default_filters.pattern = Const.GET_DISPLAY_ITEMS_ONLY_PATTERN;

export const fetchSections = (filterParams = default_filters, whenFailed = (err) => {}, whenSucceeded = (res) => {}) => {
    return dispatch => {
        new Rpapi('get', '/sections')
            .query(filterParams)
            .end((err, res) => {
                if (err) {
                    whenFailed(err);
                } else {
                    console.log('section api called');
                    let count = res.count ? res.count : 0;
                    dispatch(receiveSections(res.section, count));
                    whenSucceeded(res);
                }
            });
    }
};


const receiveSections = (section, count) =>  {
    return {
        type: types.RECEIVE_SECTION,
        section: section,
        section_count: count,
    }
};

export const clearSections = () => {
    return dispatch => {
        dispatch(receiveSections([], 0));
    }
};

export const deleteSections = (section_ids, whenFailed, whenSucceeded) => {
    new Rpapi('delete', '/sections')
        .send({section_ids})
        .end((err, res) => {
            if (err) {
                whenFailed(err);
            } else {
                whenSucceeded(res);
            }
        })
};

export const createSection = (sectionParams, history) => {
    console.log(sectionParams);
    return dispatch => {
        request.post(apiHost + '/sections')
            .query({token: accessToken})
            .send(JSON.stringify(sectionParams))
            .end(function (err, res) {
                if (!res.ok || res.body.error_code) {
                    if (res.body.error_code) {
                        alert(Globalize.localize('section_cant_create', Globalize.culture()) + "\n" + res.body.user_message);
                    } else {
                        alert(Globalize.localize('section_cant_create', Globalize.culture()));
                    }
                    console.log(err);
                } else {
                    alert(Globalize.localize('section_created', Globalize.culture()));
                    history.push("/section")
                }
            })
    }
}

export const fetchSectionInfo = (sectionId = '') => {
    return dispatch => {
        request.get(apiHost + '/sections/' + sectionId)
            .query({token: accessToken, pattern: Const.GET_DISPLAY_ITEMS_ONLY_PATTERN})
            .set('Accept', 'application/json')
            .end(function (err, res) {
                console.log('section api called.');
                if (err || !res.ok || res.body.error_code) {
                    alert(Globalize.localize('section_cant_get', Globalize.culture()));
                    console.log(err);
                } else {
                    dispatch(receiveSectionInfo(res.body.section, types.RECEIVE_SECTION_INFO));
                }
            });
    }
};

const receiveSectionInfo = (section, type) => {
    return {
        type: type,
        section: section
    }
}

export const updateSection = (sectionParams, history) => {
    return dispatch => {
        request.put(apiHost + '/sections')
            .query({token: accessToken})
            .send(JSON.stringify(sectionParams))
            .set('Accept', 'application/json')
            .end(function (err, res) {
                if (!res.ok || res.body.error_code) {
                    if (res.body != undefined &&
                        res.body.error_code) {
                        alert(Globalize.localize('section_cant_update', Globalize.culture()) + "\n" + res.body.user_message);
                    } else {
                        alert(Globalize.localize('section_cant_update', Globalize.culture()));
                    }
                    console.log(err);
                } else {
                    alert(Globalize.localize('section_updated', Globalize.culture()));
                    history.push("/section")
                }
            })
    }
};
