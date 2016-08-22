import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import AreaSortForm from '../components/AreaSortForm';
import { bindActionCreators } from 'redux';
import * as storeAction from '../actions/store';
import * as notificationAction from '../actions/notification';

class AreaSort {
    constructor() {
        this.data = new Map();
        this.arrData = [];
        this.submitStores = [];
    }

    getData(large_area,medium_area,small_area,store) {
        let data = this.data;
        if(!large_area) {
            if(!data.has("no_l_area")) {
                data.set("no_l_area", {stores : [store]});
            }
            else {
                data.get("no_l_area").stores.push(store);
            }   
        } 
        else if(!medium_area) {
            if(!data.has(large_area.area_name)) {
                data.set(large_area.area_name, new Map([["no_m_area", {stores : [store]}]]))
            }
            else if (!(data.get(large_area.area_name).has("no_m_area"))){
                data.get(large_area.area_name).set("no_m_area",{stores:[store]});
            }
            else {
                data.get(large_area.area_name).get("no_m_area").stores.push(store);
            }
        }
        else if(!small_area) {
            if(!data.has(large_area.area_name)) {
                data.set(large_area.area_name, new Map([[medium_area.area_name,new Map([["no_s_area",{stores:[store]}]])]]))   
            }
            else if(!(data.get(large_area.area_name).has(medium_area.area_name))) {
                data.get(large_area.area_name).set(medium_area.area_name,new Map([["no_s_area",{stores: [store]}]]));
            }
            else if(!(data.get(large_area.area_name).get(medium_area.area_name).has("no_s_area"))) {
                data.get(large_area.area_name).get(medium_area.area_name).set("no_s_area", {stores: [store]});
            }
            else {
                data.get(large_area.area_name).get(medium_area.area_name).get("no_s_area").stores.push(store);
            }
        }
        else {
            if(!data.has(large_area.area_name)) {
                data.set(large_area.area_name,new Map([[medium_area.area_name, new Map([[small_area.area_name, {stores:[store]}]])]]));
            }
            else if(!(data.get(large_area.area_name).has(medium_area.area_name))) {
                data.get(large_area.area_name).set(medium_area.area_name,new Map([[small_area.area_name,{stores:[store]}]]));
            }
            else if(!(data.get(large_area.area_name).get(medium_area.area_name).has(small_area.area_name))) {
                data.get(large_area.area_name).get(medium_area.area_name).set(small_area.area_name,{stores:[store]});
            }
            else {
                data.get(large_area.area_name).get(medium_area.area_name).get(small_area.area_name).stores.push(store);
            }
        }
    };

    toArray() {
        let data = this.data;
        let result = [];
        data.forEach((value,key) => {
            if(key=="no_l_area") {
                let large_area_index = value.stores[0].store_area_L_sort_index == null ? 0 : value.stores[0].store_area_L_sort_index;
                result.push({large_area_name: key, large_area_index: large_area_index , stores: value.stores});
            }
            else {
                let medium_area = [];
                let large_area_index = 0;
                let medium_area_index = 0;
                let small_area_index = 0;
                value.forEach((medium_item,medium_key) => {
                    if(medium_key == "no_m_area") {
                        large_area_index = medium_item.stores[0].store_area_L_sort_index == null ? 0 : medium_item.stores[0].store_area_L_sort_index;
                        medium_area_index = medium_item.stores[0].store_area_M_sort_index == null ? 0 : medium_item.stores[0].store_area_M_sort_index;
                        medium_area.push({medium_area_name:medium_key, medium_area_index: medium_area_index, stores : medium_item.stores});
                    }
                    else {
                        let small_area = [];
                        medium_item.forEach((small_item,small_key) => {
                            large_area_index = small_item.stores[0].store_area_L_sort_index == null ? 0 : small_item.stores[0].store_area_L_sort_index;
                            medium_area_index = small_item.stores[0].store_area_M_sort_index == null ? 0 : small_item.stores[0].store_area_M_sort_index;
                            small_area_index = small_item.stores[0].store_area_S_sort_index == null ? 0 : small_item.stores[0].store_area_S_sort_index;
                            small_area.push({small_area_name:small_key,small_area_index:small_area_index ,stores: small_item.stores});
                        });
                        medium_area.push({medium_area_name:medium_key,medium_area_index:medium_area_index, small_area : small_area});
                    }
                });
                result.push({large_area_name:key,large_area_index : large_area_index, medium_area : medium_area});
            }
        });
        this.arrData = result;
    };

    toSubmitStores() {
        let arrData = this.arrData;
        let result = [];
        arrData.map((value,index) => {
            if(value.large_area_name == "no_l_area") {
                let stores = [].concat(value.stores);
                stores.forEach((store,store_index)=> {
                    store.store_area_L_sort_index = value.large_area_index;
                });
                result = result.concat(stores);
            }
            else {
                value.medium_area.map((medium_item,medium_index) => {
                    if(medium_item.medium_area_name == "no_m_area") {
                        let stores = [].concat(medium_item.stores);
                        stores.forEach((store,store_index)=> {
                            store.store_area_L_sort_index = value.large_area_index;
                            store.store_area_M_sort_index = medium_item.medium_area_index;
                        });
                        result = result.concat(stores);
                    }
                    else {
                        medium_item.small_area.map((small_item,small_index) => {
                            let stores = [].concat(small_item.stores);
                            stores.forEach((store,store_index)=> {
                                store.store_area_L_sort_index = value.large_area_index;
                                store.store_area_M_sort_index = medium_item.medium_area_index;
                                store.store_area_S_sort_index = small_item.small_area_index;
                            });
                            result = result.concat(stores);
                        });
                    }
                });
            }
        });
        this.submitStores = result;
    }

    sortIndexOrder() {
        let arrData = this.arrData;
        arrData.sort((a,b) => a.large_area_index-b.large_area_index);
        arrData.forEach((value,index) => {
            if(value.large_area_name == "no_l_area") {
                value.stores.sort((a,b) => a.store_sort_index-b.store_sort_index);
            }
            else {
                value.medium_area.sort((a,b) => a.medium_area_index-b.medium_area_index);
                value.medium_area.forEach((medium_item,medium_index)=> {
                    if(medium_item.medium_area_name == "no_m_area") {
                        medium_item.stores.sort((a,b) => a.store_sort_index-b.store_sort_index);
                    }
                    else {
                        medium_item.small_area.sort((a,b) => a.small_area_index-b.small_area_index);
                        medium_item.small_area.forEach((small_item,small_index)=> {
                            small_item.stores.sort((a,b) => a.store_sort_index-b.store_sort_index);
                        });
                    }
                });
            }
        });
        this.arrData = arrData;
    }
}

const mapStateToProps = (state) => {
    let area = new AreaSort();
    if(typeof(state.stores) != "undefined" && state.stores.length > 0 && typeof(state.areas) != "undefined" && state.areas.length > 0) {
        state.stores.forEach((store) => {
            let large_area = state.areas.find((area) => area.id == store.store_area_L_id);
            let medium_area = state.areas.find((area) => area.id == store.store_area_M_id);
            let small_area = state.areas.find((area) => area.id == store.store_area_S_id);
            area.getData(large_area,medium_area,small_area,store);
        });
    }
    return {
        isCreateNew: true,
        currentUser: state.currentUser,
        error : state.error,
        companies : state.companies,
        brands : state.brands,
        areaSort : area
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        storeAction : bindActionCreators(storeAction,dispatch),
        notificationAction : bindActionCreators(notificationAction,dispatch),
    }
};


export default connect(mapStateToProps,mapDispatchToProps)(AreaSortForm)
