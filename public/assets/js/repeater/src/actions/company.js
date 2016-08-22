import * as request from 'superagent';
import { RECEIVE_COMPANY } from '../constants/ActionTypes';

export const fetchCompanies = (filterParams = {pattern: 2}) => {
    return dispatch => {
        request.get(apiHost + '/companies')
            .query(Object.assign(filterParams, {token: accessToken}))
            .set('Accept', 'application/json')
            .end(function (err, res) {
                console.log('companies api called.');
                if (err || !res.ok || res.body.error_code) {
                    alert("企業を取得できません。");
                    console.log(err);
                } else {
                    dispatch(receiveCompanies(res.body.company));
                }
            });
    }
};


const receiveCompanies = (companies) => {
    return {
        type: RECEIVE_COMPANY,
        companies: companies
    }
};

export const clearCompanies = () => {
    return dispatch => {
        dispatch(receiveCompanies([]));
    }
}
