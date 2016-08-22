import { RECEIVE_ANALYSIS_STORE_INFO } from '../constants/ActionTypes';
import Rpapi from './rpapi';



export const fetchDailyStoreInfo = (filterParams, isGroupByDate = true, pattern = 3 ) => {
    let params = {...filterParams, pattern};
    return dispatch => {
        new Rpapi('get', '/dailystore')
            .query(params)
            .end(function (err, res) {
                console.log('dailystore api called.');
                if (err || res.error_code) {
                    alert(Globalize.localize('member_analysis_cant_get', Globalize.culture()));
                    console.log(err);
                } else {
                    dispatch(receiveDailyStore(res.daily_store_info, isGroupByDate));
                }
            });
    }
};


export const fetchMonthlyStoreInfo = (filterParams, isGroupByMonth = true, pattern = 3) => {
    let params = {...filterParams, pattern};
    return dispatch => {
        new Rpapi('get', '/monthlystore')
            .query(params)
            .end(function (err, res) {
                console.log('monthlystore api called.');
                if (err || res.error_code) {
                    alert(Globalize.localize('member_analysis_cant_get', Globalize.culture()));
                    console.log(err);
                } else {
                    dispatch(receiveMonthlyStore(res.monthly_store_info, isGroupByMonth));
                }
            });
    }
};


const receiveDailyStore = (daily_store_info, isGroupByDate) => {
    return {
        type: RECEIVE_ANALYSIS_STORE_INFO,
        memberAnalysis: daily_store_info,
        isGroupByTime: isGroupByDate
    }
};

const receiveMonthlyStore = (monthly_store_info, isGroupByMonth) => {
    return {
        type: RECEIVE_ANALYSIS_STORE_INFO,
        memberAnalysis: monthly_store_info,
        isGroupByTime: isGroupByMonth
    }
};

export const clearDailyStore  = () => {
    return receiveDailyStore([], true);
}