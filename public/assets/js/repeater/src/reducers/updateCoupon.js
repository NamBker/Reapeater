import * as types from '../constants/ActionTypes';
import moment from 'moment'

const initialState = {
    id: '',
    company_id: '',
    brand_id: '',
    section_id: '',
    store_id: '',
    coupon_release_flg: 0,
    coupon_status: 0,
    coupon_user_code_display: 0,
    coupon_two_step_limit_type: 0,
    coupon_two_step_limit_min: '',
    coupon_name: '',
    coupon_limit_type: 0,
    coupon_description: '',
    coupon_title: '',
    coupon_limit_from: null,
    coupon_limit_to: null,
    coupon_limit_send_start: '',
    coupon_limit_send_count: '',
    coupon_two_step_button_description: "クーポンを使用する場合、以下の「クーポンを使う」ボタンを会計時に押してください。\n使用の確認後に表示された画面を提示してください。",
    coupon_two_step_over_description: "このクーポンは既に有効期限を過ぎています。",
};

export const updateCoupon = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_COUPON_INFO:
            let coupon = action.coupon;
            coupon.coupon_limit_from = moment(coupon.coupon_limit_from);
            coupon.coupon_limit_to = moment(coupon.coupon_limit_to);
            return coupon;
        default:
            return state;
    }
};
