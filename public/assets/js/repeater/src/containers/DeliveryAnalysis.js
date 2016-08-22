import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import moment from 'moment'
import DeliveryAnalysis from '../components/analysis/DeliveryAnalysis'
import * as DeliveryAction from '../actions/deliveryanalysis'
import * as CouponAction from '../actions/couponanalysis'
import * as QuestionnaireAction from '../actions/questionnaireanalysis'

const mapStateToProps = (state, ownProps) => {
    let analysisData = [];
    let fileName;
    switch (ownProps.routes[ownProps.routes.length - 1].path) {
        case 'delivery':
            state.deliveryAnalysis.map((delivery, index) => {
                let obj = new Object();
                obj['No'] = index + 1;
                obj[Globalize.localize('delivery_l_date', Globalize.culture())] = moment(delivery.delivery.delivery_schedule).format('YYYY年MM月DD (ddd) HH:mm');
                obj[Globalize.localize('delivery_add_send_title', Globalize.culture())] = delivery.delivery.delivery_title;
                obj[Globalize.localize('delivery_l_count', Globalize.culture())] = delivery.delivery_total;
                obj[Globalize.localize('delivery_l_open_count', Globalize.culture())] = delivery.reach_count;
                obj[Globalize.localize('delivery_l_open_percent', Globalize.culture())] = Math.round(delivery.reach_count * 100/delivery.delivery_total) + '%';
                obj[Globalize.localize('delivery_l_visit_count', Globalize.culture())] = delivery.delivery_total - delivery.delivery.delivery_title;
                obj[Globalize.localize('delivery_l_visit_percent', Globalize.culture())] = Math.round((delivery.reach_count - delivery.reach_count) * 100/delivery.delivery_total) + '%';
                analysisData.push(obj);
            });
            fileName = Globalize.localize('menu_analyze_mail', Globalize.culture()) + '_';
            break;
        case 'coupon':
            state.couponAnalysis.map((coupon, index) => {
                let obj = new Object();
                obj['No'] = index + 1;
                obj['ID'] = coupon.id;
                obj[Globalize.localize('delivery_add_send_title', Globalize.culture())] = coupon.coupon_title;
                obj['PV'] = coupon.display_coupon_count;
                obj['UU'] = coupon.unique_user_count;
                obj[Globalize.localize('user', Globalize.culture())] = coupon.used_coupon_count;
                obj['CVR'] = Math.round(coupon.used_coupon_count * 100 / coupon.display_coupon_count) + '%';
                analysisData.push(obj);
            });
            fileName = Globalize.localize('menu_analyze_coupon', Globalize.culture()) + '_';
            break;
        case 'questionnaire':
            state.questionnaireAnalysis.map((questionnaire, index) => {
                let obj = new Object();
                obj['No'] = index + 1;
                obj['ID'] = questionnaire.id;
                obj[Globalize.localize('title', Globalize.culture())] = questionnaire.questionnaire_name;
                obj[Globalize.localize('questionnaire_answer_time', Globalize.culture())] = questionnaire.questionnaire_limit.substr(0, 10);
                obj[Globalize.localize('questionnaire_target', Globalize.culture())] = questionnaire.target_user_count;
                obj[Globalize.localize('questionnaire_answerer', Globalize.culture())] = questionnaire.answered_user_count;
                obj[Globalize.localize('questionnaire_answerer_percent', Globalize.culture())] = Math.round(questionnaire.answered_user_count * 100 / questionnaire.target_user_count) + '%';
                analysisData.push(obj);
            });
            fileName = Globalize.localize('menu_analyze_questionnaire', Globalize.culture()) + '_';
            break;
    }
    return {
        analysisData, fileName, currentUser: state.currentUser,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    switch (ownProps.routes[ownProps.routes.length - 1].path) {
        case 'delivery':
            const { fetchDeliveryAnalysis, clearDeliveryAnalysis } = bindActionCreators(DeliveryAction, dispatch);
            return {
                fetchAnalysis: fetchDeliveryAnalysis,
                clearAnalysis: clearDeliveryAnalysis
            };
        case 'coupon':
            const { fetchCouponAnalysis, clearCouponAnalysis } = bindActionCreators(CouponAction, dispatch);
            return {
                fetchAnalysis: fetchCouponAnalysis,
                clearAnalysis: clearCouponAnalysis
            };
        case 'questionnaire':
            const { fetchQuestionnaireAnalysis, clearQuestionnaireAnalysis } = bindActionCreators(QuestionnaireAction, dispatch);
            return {
                fetchAnalysis: fetchQuestionnaireAnalysis,
                clearAnalysis: clearQuestionnaireAnalysis
            }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryAnalysis)