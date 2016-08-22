import * as request from 'superagent';
import * as types from '../constants/ActionTypes';

import { fetchUserInfo, fetchUsers } from './user';
import { fetchCompanies } from './company'
import { fetchBrands } from './brand'
import { fetchStores } from './store'
import { fetchAreas } from './area'

import { GET_NAME_ONLY_PATTERN } from '../constants/Constants';

export const fetchData = () => {
    return dispatch => {
        dispatch(fetchUserInfo());
        dispatch(fetchCompanies({pattern: GET_NAME_ONLY_PATTERN}));
        dispatch(fetchBrands({pattern: GET_NAME_ONLY_PATTERN}));
        dispatch(fetchStores({pattern: GET_NAME_ONLY_PATTERN}));
        dispatch(fetchAreas({pattern: GET_NAME_ONLY_PATTERN}));
    }
};
