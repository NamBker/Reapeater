import * as types from '../constants/ActionTypes';

const initialState = [];
export const site_headers_footers = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_SITE_HEADER_FOOTER:
            return action.site_headers_footers;
        default:
            return state;
    }
};

export const site_store_free = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_SITE_STORE_FREE:
            return action.site_store_free;
        default:
            return state;
    }
};

export const site_store_info = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_SITE_STORE_INFO:
            return action.store;
        default:
            return state;
    }
};

export const site_map = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_SITE_MAP:
            return action.site_map;
        default:
            return state;
    }
};

export const site_store_free_url = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_SITE_STORE_URL:
            return action.site_store_free_url;
        default:
            return state;
    }
};

export const site_company_summary = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_SITE_COMPANY_SUMMARY:
            return action.company;
        default:
            return state;
    }
};

export const site_store_free_all = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_SITE_STORE_FREE_ALL:
            return action.site_store_free;
        default:
            return state;
    }
};