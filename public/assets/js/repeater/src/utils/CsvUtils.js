import { storeStatus } from './CommonUtils'
import moment from 'moment'


export const convertToCsv = (stores, selectByField, fileName, isShowLabel = true) => {
    var storeList = selectByField(stores);
    var CSV = '';
    if (isShowLabel) {
        let row = "";
        for (var index in storeList[0]) {
            row += index + ',';
        }
        row = row.slice(0, -1);
        CSV += row + (navigator.msSaveBlob ? '\r\n' : escape('\r\n'));
    }
    for (var i = 0; i < storeList.length; i++) {
        var row = "";
        for (var index in storeList[i]) {
            row += storeList[i][index] + ',';
        }
        row = row.slice(0, -1);
        row.slice(0, row.length - 1);
        CSV += row + (navigator.msSaveBlob ? '\r\n' : escape('\r\n'));
    }
    if (CSV == '') {
        alert("データが無効です。");
        return;
    }

    if(navigator.msSaveBlob) {
        var blob = new Blob(["\ufeff" ,CSV], { type: 'application/csv;charset=utf-8;' });
        console.log(blob);
        window.navigator.msSaveOrOpenBlob(blob, fileName + '.csv');
    } else {
        var uri = 'data:attachment/csv;charset=utf-8,\ufeff' + CSV;
        var link = document.createElement("a");
        link.href = uri;
        link.setAttribute('download', fileName + ".csv");
        var event = document.createEvent("MouseEvents");
        event.initEvent('click', true, true);
        link.dispatchEvent(event);
    }

};

export const selectByFieldStore = (stores) => {
    var storeList = [];
    stores.map((storeData, index) => {
        var store = new Object();
        //store['No'] = index + 1;
        store['ブランドコード'] = storeData['brand_code'];
        store['店舗コード'] = storeData['store_code'];
        store['店舗名'] = storeData['store_name'];
        store['状態'] = storeData['store_status'];
        store['郵便番号'] = storeData['store_postal_code'];
        store['都道府県'] = storeData['store_prefectures'];
        store['市区町村'] = storeData['store_address'];
        store['ビル名等'] = storeData['store_building'];
        store['アクセス'] = storeData['store_access'];
        store['電話番号'] = storeData['store_phone_no'] != null ? storeData['store_phone_no'] : '';
        store['FAX'] = storeData['store_fax_no']!= null ? storeData['store_fax_no'] : '';
        store['店長名'] = storeData['store_manager_name'];
        store['営業時間'] = storeData['store_business_hours'];
        store['定休日'] = storeData['store_regular_holiday'];
        store['駐車場情報'] = storeData['store_parking_lot'];
        store['席情報'] = storeData['store_seat'];
        store['キッズルーム'] = storeData['store_kids_room'];
        store['メール署名'] = storeData['store_signature_block'];
        store['利用規約'] = storeData['store_terms_of_use'];
        store['プライバシーポリシー'] = storeData['store_privacy_policy'];
        store['フリーワード'] = storeData['store_freeword'];
        store['店舗ヘッダ画像'] = storeData['store_header_picture_id'];
        store['SEOキーワード1'] = storeData['store_seo_key1'];
        store['SEOキーワード2'] = storeData['store_seo_key2'];
        store['SEOキーワード3'] = storeData['store_seo_key3'];
        storeList.push(store);
    })
    return storeList;
};

export const getAnalysisMemberData = (memberAnalysis, isDaily, selectType) => {
    var data = [];
    var index = 1;
    let dataProperty = selectType == 0 ? 'register_count' : selectType == 1 ? 'leaver_count' : 'total_count';
    let totalLabel = selectType == 0 ? '登録数' : selectType == 1 ? '退会数' : '会員数';

    memberAnalysis.analysisData.forEach((element, time) => {
        var analysis = new Object();
        analysis['No'] = index;
        if (isDaily) {
            analysis['日付'] = moment(time).format("YYYY年MM月DD日 (ddd)")
        } else {
            analysis['月付'] = moment(time).format("YYYY年MM月")
        }
        let totalInTime = 0;
        element.map((item) => {
            totalInTime += item[dataProperty];
        });
        analysis[totalLabel] = totalInTime;

        memberAnalysis.storeNameList.map((storeName, index) => {
            let store = element.find((item) => item.store_name == storeName);
            if (store) {
                analysis[storeName] = store[dataProperty];
            } else {
                analysis[storeName] = 0;
            }
        });
        index++;
        data.push(analysis);
    });
    return data;
};
