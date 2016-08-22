import * as request from 'superagent';
import * as types from '../constants/ActionTypes';
import Rpapi from './rpapi';

export const fetchMembers = (filterParams = {pattern: 1}, whenFailed, whenSucceeded) => {
    return dispatch => {
        new Rpapi('get', '/members')
            .query(filterParams)
            .end(function (err, res) {
                if (err) {
                    whenFailed(err);
                } else {
                    dispatch(receiveMembers(res.member, res.count));
                    whenSucceeded(res);
                }
            });
    }
};

const receiveMembers = (members, count) =>  {
    return {
        type: types.RECEIVE_MEMBER,
        members: members,
        member_count: count ? parseInt(count) : 0,
    }
};

export const deleteMembers = (deleteIds, whenFailed, whenSucceeded) => {
    return dispatch => {
        new Rpapi('delete', '/members')
            .send({delete_ids: deleteIds})
            .end(function (err, res) {
                if (err) {
                    whenFailed(err);
                } else {
                    whenSucceeded(res);
                }
            });
    }
}

export const checkMember = (params, whenFailed, whenSucceeded) => {
    new Rpapi('get', '/member/check')
        .query(params)
        .end(function (err, res) {
            if (err) {
                whenFailed(err);
            } else {
                whenSucceeded(res);
            }
        });
}

export const getMemberDetail = (storeId, memberId, whenFailed, whenSucceeded) => {
    new Rpapi('get', '/store/' + storeId + '/member/' + memberId)
        .end(function (err, res) {
            if (err) {
                whenFailed(err);
            } else {
                whenSucceeded(res);
            }
        });
}

export const createMember = (params, whenFailed, whenSucceeded) => {
    let tmp = {...params};
    if(tmp.member_registration_date){
        tmp.member_registration_date = tmp.member_registration_date.format("YYYY-MM-DD");
    }

    new Rpapi('post', '/member')
        .send(tmp)
        .end(function (err, res) {
            if (err) {
                whenFailed(err);
            } else {
                whenSucceeded(res);
            }
        })
}

export const updateMember = (storeId, memberId, params, whenFailed, whenSucceeded) => {
    let tmp = {...params};
    if(tmp.member_registration_date){
        tmp.member_registration_date = tmp.member_registration_date.format("YYYY-MM-DD");
    }

    new Rpapi('put', '/store/' + storeId + '/member/' + memberId)
        .send(tmp)
        .end(function (err, res) {
            if (err) {
                whenFailed(err);
            } else {
                whenSucceeded(res);
            }
        })
}

export const memberCSVUpload = (file, whenFailed, whenSucceeded) => {
    return dispatch => {
        new Rpapi('post', '/members/csv')
            .attach(file)
            .end(function (err, res) {
                if (err) {
                    whenFailed(err);
                } else {
                    whenSucceeded(res);
                }
            });
    }
}

export const clearMembers = () => {
    return dispatch => {
        dispatch(receiveMembers([]));
    }
}
