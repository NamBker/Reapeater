import * as request from 'superagent';
import * as types from '../constants/ActionTypes';
import Rpapi from './rpapi';

export const fetchUsers = (filter = {pattern: GET_DISPLAY_ITEMS_ONLY_PATTERN}, whenFailure = (err) => {}, whenSuccess = (res) => {}) => {
    return dispatch => {
        new Rpapi('get', '/users')
            .query(filter)
            .end(function (err, res) {
                if (err) {
                    whenFailure(err);
                } else {
                    let count = res.count ? res.count : 0;
                    dispatch(receiveUsers(res.user, count));
                    whenSuccess(res);
                }
            });
    }
};

const receiveUsers = (users, total_count) =>  {
    return {
        type: types.RECEIVE_USER,
        users: users,
        user_count: total_count
    }
};


export const fetchUserInfo = (userId = 'me', whenFailed = (err) => {}, whenSucceeded = (res) => {}) => {
    return dispatch => {
        new Rpapi('get', '/users/' + userId)
            .query({pattern: 3})
            .end((err, res) => {
                console.log('user api called.');
                if (err) {
                    console.log(err);
                    whenFailed(err);
                } else {
                    if (userId === 'me') {
                        dispatch(receiveUserInfo(res));
                    } else {
                        dispatch(receiveUpdateUser(res.user));
                    }
                    whenSucceeded(res);
                }
            });
    }
};

const receiveUserInfo = (res) => {
    return {
        type: types.RECEIVE_USER_INFO,
        user: res.user,
        companies: res.companies,
        brands: res.brands,
        areas: res.areas,
        stores: res.stores,
    }
};

const receiveUpdateUser = (user) => {
    return {
        type: types.RECEIVE_UPDATE_USER,
        user: user,
    }
}

export const createUser = (userParams, history) => {
    return dispatch => {
        request.post(apiHost + '/users')
            .query({token: accessToken})
            .send(JSON.stringify(userParams))
            .set('Accept', 'application/json')
            .end(function (err, res) {
                if (!res.ok || res.body.error_code) {
                    if (res.body.error_code) {
                        alert("ユーザを作成できません。\n" + res.body.user_message);
                    } else {
                        alert("ユーザを作成できません。");
                    }
                    console.log(err);
                } else {
                    alert("ユーザを作成しました。");
                    history.push("/user")
                }
            })
    }
};

export const updateUser = (userParams, history) => {
    return dispatch => {
        request.put(apiHost + '/users')
            .query({token: accessToken})
            .send(JSON.stringify(userParams))
            .set('Accept', 'application/json')
            .end(function (err, res) {
                if (!res.ok || res.body.error_code) {
                    if (res.body != undefined &&
                        res.body.error_code) {
                        alert("ユーザを編集できません。\n" + res.body.user_message);
                    } else {
                        alert("ユーザを編集できません。");
                    }
                    console.log(err);
                } else {
                    alert("ユーザを編集しました。");
                    history.push("/user")
                }
            })
    }
};

export const deleteUsers = (user_ids, whenFailed, whenSucceeded) => {
    new Rpapi('delete', '/users/')
        .send({user_ids})
        .end((err, res) => {
            if (err) {
                whenFailed(err);
            } else {
                whenSucceeded(res);
            }
        });
};

