import { RECEIVE_ANALYSIS_STORE_INFO } from '../constants/ActionTypes';


const initialState = {analysisData: new Map(), storeNameList: []};

export const memberAnalysis = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_ANALYSIS_STORE_INFO:
            if (action.isGroupByTime) {
                let analysisData = new Map();
                let storeNameList = [];

                action.memberAnalysis.map((element) => {
                    if (!storeNameList.find(storeName => storeName == element.store_name)) {
                        storeNameList.push(element.store_name);
                    }
                    let keyProperty = element.date ? 'date' : 'month';
                    if (analysisData.has(element[keyProperty])) {
                        let storeData = analysisData.get(element[keyProperty]);
                        storeData.push(element);
                        analysisData.set(element[keyProperty], storeData);
                    } else {
                        analysisData.set(element[keyProperty], [element]);
                    }
                });
                return {analysisData, storeNameList}
            } else {
                let storeNameList = [];
                action.memberAnalysis.map((element) => {
                    if (!storeNameList.find(storeName => storeName == element.store_name)) {
                        storeNameList.push(element.store_name);
                    }
                });
                return {analysisData: action.memberAnalysis, storeNameList}
            }
        default:
            return state;
    }
};