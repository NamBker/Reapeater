import * as Const from '../constants/Constants'
export const authorities = ["管理", "企業", "ブランド", "事業部", "店舗"];
export const brand_status = ["削除", "閉店・休店", "準備中", "営業中"];
export const storeStatus = ["削除", "閉店・休店", "準備中", "営業中"];
export const informationStatus = ["非公開", "公開", "削除"];
export const informationType = ["全体", "企業以下", "ブランド以下", "店舗以下", "選択店舗のみ"];
export const areaNames = ["大エリア", "中エリア", "小エリア"];

export const sectionStatus = ["削除", "閉店・休店", "準備中", "営業中"];
export const couponStatus = ['無効','有効'];

export const storeDisplayType = ['全店舗1ページ表示','エリア（大分類）表示'];

export const prefectureCodes = {
    '01': '北海道',
    '02': '青森県',
    '03': '岩手県',
    '04': '宮城県',
    '05': '秋田県',
    '06': '山形県',
    '07': '福島県',
    '08': '茨城県',
    '09': '栃木県',
    '10': '群馬県',
    '11': '埼玉県',
    '12': '千葉県',
    '13': '東京都',
    '14': '神奈川県',
    '15': '新潟県',
    '16': '富山県',
    '17': '石川県',
    '18': '福井県',
    '19': '山梨県',
    '20': '長野県',
    '21': '岐阜県',
    '22': '静岡県',
    '23': '愛知県',
    '24': '三重県',
    '25': '滋賀県',
    '26': '京都府',
    '27': '大阪府',
    '28': '兵庫県',
    '29': '奈良県',
    '30': '和歌山県',
    '31': '鳥取県',
    '32': '島根県',
    '33': '岡山県',
    '34': '広島県',
    '35': '山口県',
    '36': '徳島県',
    '37': '香川県',
    '38': '愛媛県',
    '39': '高知県',
    '40': '福岡県',
    '41': '佐賀県',
    '42': '長崎県',
    '43': '熊本県',
    '44': '大分県',
    '45': '宮崎県',
    '46': '鹿児島県',
    '47': '沖縄県',
};

export const timeList = {
    '00:00': '午前00:00', '12:00': '午後01:00',
    '00:30': '午前00:30', '12:30': '午後01:30',
    '01:00': '午前01:00', '13:00': '午後02:00',
    '01:30': '午前01:30', '13:30': '午後02:30',
    '02:00': '午前02:00', '14:00': '午後03:00',
    '02:30': '午前02:30', '14:30': '午後03:30',
    '03:00': '午前03:00', '15:00': '午後04:00',
    '03:30': '午前03:30', '15:30': '午後04:30',
    '04:00': '午前04:00', '16:00': '午後05:00',
    '04:30': '午前04:30', '16:30': '午後05:30',
    '05:00': '午前05:00', '17:00': '午後06:00',
    '05:30': '午前05:30', '17:30': '午後06:30',
    '06:00': '午前06:00', '18:00': '午後07:00',
    '06:30': '午前06:30', '18:30': '午後07:30',
    '07:00': '午前07:00', '19:00': '午後08:00',
    '07:30': '午前07:30', '19:30': '午後08:30',
    '08:00': '午前08:00', '20:00': '午後09:00',
    '08:30': '午前08:30', '20:30': '午後09:30',
    '09:00': '午前09:00', '21:00': '午後10:00',
    '09:30': '午前09:30', '21:30': '午後10:30',
    '10:00': '午前10:00', '22:00': '午後11:00',
    '10:30': '午前10:30', '22:30': '午後11:30',
    '11:00': '午前11:00', '23:00': '午後11:00',
    '11:30': '午前11:30', '23:30': '午後11:30',
};

// return fumction
export const eachArea = (areaType, checkCondition = (v) => true) => {
    return (area) => {
        return (area.area_type === areaType) && checkCondition(area) ? <option value={area.id} key={area.id}>{area.area_name}</option> : null;
    }
};

export const eachCompany = (checkCondition = (v) => true) => {
    return (company) => {
        return checkCondition(company) ? <option value={company.id} key={company.id}>{company.company_name}</option> : null
    };
};

export const eachBrand = (checkCondition = (v) => true) => {
    return (brand) => {
        return checkCondition(brand) ? <option value={brand.id} key={brand.id}>{brand.brand_name}</option> : null
    };
};

export const eachStore = (checkCondition = (v) => true) => {
    return (store) => {
        return checkCondition(store) ? <option value={store.id} key={store.id}>{store.store_name}</option> : null
    };
};

export const uuid = () => {
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function"){
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

export const getUrl = (pageType, brandId, storeId, siteId) => {
    switch (pageType)
    {
        case Const.PAGE_TYPE_HOME_TOP:
            return "/site/config/" + brandId;
        case Const.PAGE_TYPE_STORE_TOP:
            return "/site/config/" + brandId + "/" + storeId;
        case Const.PAGE_TYPE_STORE_LIST:
            return "/site/storelist/" + brandId + "/" + storeId;
        case Const.PAGE_TYPE_MENU_TOP:
            return "/site/menutop/" + brandId + "/" + storeId;
        case Const.PAGE_TYPE_MENU_DETAIL:
            return "/site/menudetail/" + brandId + "/" + storeId + "/" + siteId;
        case Const.PAGE_TYPE_COMPANY_SUMMARY:
            return "/site/profile/" + brandId + "/" + storeId;
        case Const.PAGE_TYPE_NO_MEMNU_LAYOUT:
            return "/site/menufree/" + brandId + "/" + storeId + "/" + siteId;
        case Const.PAGE_TYPE_NO_LAYOUT:
            return "/site/nolayout/" + brandId + "/" + storeId + "/" + siteId;
        default:
            return "/site/map";
    }
}

export const removeDuplicatesBy = (keyFn,  array) => {
    var mySet = new Set();
    return array.filter(function(x) {
        var key = keyFn(x), isNew = !mySet.has(key);
        if (isNew) mySet.add(key);
        return isNew;
    });
}

export const isLeapYear = (year) => {
    return ((year % 400) == 0) || ((year % 100) != 0 && (year % 4) == 0);
};

export const makeNumberArray = (from, to) => {
    return Object.keys(new Int8Array(to - from + 1)).map(num => {return from + parseInt(num);});
};

export const makeTimeArray = (interval) => {
    var res = [];
    for (let hour = 0; hour < 24; ++hour) {
        for (let minute = 0; minute < 60; minute += interval) {
            res.push(("0" + String(hour)).slice(-2) + ":" + ("0" + String(minute)).slice(-2));
        }
    }
    return res;
};

export const isEmailAddress = (address) => {
    let emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRe.test(address);
};

export const scrollToTop = () => {
    let body = document.body;
    body.scrollTop = 0;
};

export const getDays = (year, month) => {
    let maxDay = 31;
    if (month && 0 < month) {
        const maxDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        maxDay = maxDays[month - 1];
        if (year && month == 2 && !isLeapYear(year)) {
            maxDay--;
        }
    }
    return makeNumberArray(1, maxDay);
};

export const removeEmptyInDataset = (dataset) => {
    let newDataset = [];
    dataset.map(data => {
        if (data.value > 0) {
            newDataset.push(data);
        }
    });
    return newDataset;
};

