import React, { Component, PropTypes } from 'react';
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import striptags from 'striptags';

import Selection from './commons/Selection'
import DropDownList from  './commons/DropDownList'
import Dialog from  './commons/Dialog'
import Checkbox from './commons/Checkbox'
import RadioButton from './commons/RadioButton'
import RadioGroup from './commons/RadioGroup';

import Modal from './commons/Modal'
import ModalTabPreview from './commons/ModalTabPreview'

import { fetchCompanies } from '../actions/company'
import { fetchBrands } from '../actions/brand'
import { fetchStores } from '../actions/store'
import { fetchAreas } from '../actions/area'
import { createCoupon, fetchCouponInfo, updateCoupon } from '../actions/coupon'
import Notification from '../components/commons/Notification';
import { hideNotification } from '../actions/notification';

import { eachArea, eachCompany, eachBrand, eachStore } from '../utils/CommonUtils'
import * as Const from '../constants/Constants'

class CouponForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coupon: {
                coupon_release_flg: 0,
                coupon_status: 1,
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
                coupon_two_step_confirmation : "こちらの画面をスタッフにお見せください。\n上記の有効時間を過ぎるとクーポンは無効となります。",
            },
            isOpenModal: false,
            isChecked: false,
            isCheckedUserCode: false,

        };
        this.check = this.check.bind(this);

        this.closeModal = this.closeModal.bind(this);
        this.handleCouponStatus = this.handleCouponStatus.bind(this);
        this.handleCouponName = this.handleCouponName.bind(this);
        this.handleCouponTitle = this.handleCouponTitle.bind(this);
        this.handleCouponDescription = this.handleCouponDescription.bind(this);
        this.handleCouponTwoStepButtonDescription = this.handleCouponTwoStepButtonDescription.bind(this);
        this.handleCouponOverDescription = this.handleCouponOverDescription.bind(this);
        this.handleCouponTwoStepConfirm = this.handleCouponTwoStepConfirm.bind(this);
        this.handleExpirationDate= this.handleExpirationDate.bind(this);
        this.handleCouponLimitFrom = this.handleCouponLimitFrom.bind(this);
        this.handleCouponLimitTo = this.handleCouponLimitTo.bind(this);
        this.handleCouponSendStart = this.handleCouponSendStart.bind(this);
        this.handleCouponSendCount = this.handleCouponSendCount.bind(this);
        this.handleUserCodeDisplay = this.handleUserCodeDisplay.bind(this);
        this.handleTwoStepLimitType = this.handleTwoStepLimitType.bind(this);
        this.handleLimitMin = this.handleLimitMin.bind(this);
        this.handleCreateCoupon = this.handleCreateCoupon.bind(this);
        this.showNotification = this.showNotification.bind(this);

        this.statuses = [
            { 'label': Globalize.localize('l_display_flag_yes', Globalize.culture()), 'key': 1},
            { 'label': Globalize.localize('l_display_flag_no', Globalize.culture()), 'key': 0},
        ];
    }

    componentDidMount() {
        if (!this.props.isCreateNew) {
            fetchCouponInfo(this.props.params.couponId, (err) => {
                this.showNotification();
            }, (res) => {
                let coupon = {...res.coupon};
                coupon.coupon_limit_from = coupon.coupon_limit_from && 10 < coupon.coupon_limit_from.length ? moment(coupon.coupon_limit_from) : null;
                coupon.coupon_limit_to = coupon.coupon_limit_to && 10 < coupon.coupon_limit_to.length ? moment(coupon.coupon_limit_to) : null;
                this.setState({coupon});
            });
        }
    }

    onSubmit(e) {
        e.preventDefault();
        let errors = [];
        if (this.state.coupon.coupon_name == '' || this.state.coupon.coupon_name == null || this.state.coupon.coupon_name.length < 0) {
            //errors.push(Globalize.localize('クーポン管理名', Globalize.culture()));
            errors.push('クーポン管理名');
        }
        if (this.state.coupon.coupon_title == '' || this.state.coupon.coupon_title == null || this.state.coupon.coupon_title.length < 0) {
            //errors.push(Globalize.localize('クーポンタイトル', Globalize.culture()));
            errors.push('クーポンタイトル');
        }
        if (this.state.coupon.coupon_description == '' || this.state.coupon.coupon_description == null || this.state.coupon.coupon_description.length < 0) {
            //errors.push(Globalize.localize('クーポン内容', Globalize.culture()));
            errors.push('クーポン内容');
        }
        if (0 < errors.length) {
            this.showNotification(Globalize.localize('alert_message_for_error_not_null', Globalize.culture()) + '\n・' + errors.join('\n・'));
            return;
        }
        this.setState({ isOpenModal: true });
    }

    check(itemId) {
        console.log(itemId);
        let id = parseInt(itemId);
        let checkedItems = this.state.checkedItemsBrand;
        let index = checkedItems.indexOf(id);
        if (index >= 0) {
            checkedItems.splice(index, 1);
        } else {
            checkedItems.push(id);
        }
        this.setState({ checkedItemsBrand: checkedItems });
    }

    closeModal() {
        this.setState({ isOpenModal: false });
    }

    handleCouponStatus(value) {
        let coupon = this.state.coupon;
        coupon.coupon_status = value;
        this.setState({coupon});
    }

    handleCouponName(e) {
        let coupon = this.state.coupon;
        coupon.coupon_name = e.target.value;
        this.setState({ coupon: coupon });
    }

    handleCouponTitle(e) {
        let coupon = this.state.coupon;
        coupon.coupon_title = e.target.value;
        this.setState({ coupon: coupon });
    }

    handleCouponDescription(e) {
        let coupon = this.state.coupon;
        coupon.coupon_description = e.target.value;
        this.setState({ coupon : coupon });
    }

    handleCouponTwoStepButtonDescription(e) {
        let coupon = this.state.coupon;
        coupon.coupon_two_step_button_description = e.target.value;
        this.setState({ coupon: coupon });
    }

    handleCouponOverDescription(e) {
        let coupon = this.state.coupon;
        coupon.coupon_two_step_over_description = e.target.value;
        this.setState({ coupon: coupon });
    }

    handleCouponTwoStepConfirm(e) {
        let coupon = this.state.coupon;
        coupon.coupon_two_step_confirmation = e.target.value;
        this.setState({ coupon: coupon });
    }

    handleExpirationDate(e) {
        this.setState({ CheckedExpirationValue: e.target.value });
        let coupon = this.state.coupon;
        coupon.coupon_limit_type = e.target.value;
        console.log(coupon);
        if (coupon.coupon_limit_from != null && coupon.coupon_limit_to != null) {
            if (!this.props.isCreateNew && e.target.value == 1 && this.state.coupon.coupon_limit_from._i == "0000-00-00 00:00:00"
                || !this.props.isCreateNew && e.target.value == 1 && this.state.coupon.coupon_limit_to == "0000-00-00 00:00:00") {
                coupon.coupon_limit_from = coupon.coupon_limit_to = null;
            }
        }
        this.setState({ coupon: coupon });
    }

    handleCouponLimitFrom(date) {
        let coupon = this.state.coupon;
        coupon.coupon_limit_from = date;
        this.setState({ coupon: coupon });
        if (this.state.coupon.coupon_limit_type != 1) {
            coupon.coupon_limit_from = null;
            this.setState({ coupon: coupon })
        }
    }

    handleCouponLimitTo(date) {
        let coupon = this.state.coupon;
        coupon.coupon_limit_to = date;
        this.setState({ coupon: coupon });
        if (this.state.coupon.coupon_limit_type != 1) {
            coupon.coupon_limit_to = null;
            this.setState({ coupon: coupon })
        }
    }

    handleCouponSendStart(e) {
        let coupon = this.state.coupon;
        coupon.coupon_limit_send_start = e.target.value;
        this.setState({ coupon: coupon });
        if (this.state.coupon.coupon_limit_type != 2) {
            coupon.coupon_limit_send_start = '';
            this.setState({coupon: coupon});
        }
    }

    handleCouponSendCount(e) {
        let coupon = this.state.coupon;
        coupon.coupon_limit_send_count = e.target.value;
        this.setState({ coupon: coupon });
        if (this.state.coupon.coupon_limit_type != 2) {
            coupon.coupon_limit_send_count = '';
            this.setState({coupon: coupon});
        }
    }

    handleUserCodeDisplay(v) {
        let coupon = this.state.coupon;
        coupon.coupon_user_code_display = v ? 1 : 0;
        this.setState({ coupon: coupon });
    }

    handleTwoStepLimitType(e) {
        let coupon = this.state.coupon;
        coupon.coupon_two_step_limit_type = e.target.value;
        this.setState({ coupon: coupon });
    }

    handleLimitMin(e) {
        let coupon = this.state.coupon;
        coupon.coupon_two_step_limit_min = e.target.value;
        this.setState({ coupon: coupon });
    }

    handleCreateCoupon() {
        let coupon = this.state.coupon;
        if (coupon.coupon_limit_type != 1) {
            coupon.coupon_limit_from = coupon.coupon_limit_to = null;
        }
        if (coupon.coupon_limit_type != 2) {
            coupon.coupon_limit_send_start = coupon.coupon_limit_send_count = '';
        }
        this.setState({ isOpenModal : false }, () => {
            if (this.props.isCreateNew) {
                createCoupon(coupon,
                    (err) => {
                        this.showNotification(err.toString(), false);
                    },
                    (res) => {
                        Notification.showNotification(this.props.dispatch, '/coupon', "クーポンを作成しました。");
                        this.context.router.push('/coupon');
                    }
                );
            } else {
                updateCoupon(this.props.params.couponId, coupon,
                    (err) => {
                        this.showNotification(err.toString(), false);
                    },
                    (res) => {
                        Notification.showNotification(this.props.dispatch, '/coupon', "クーポンを編集しました。");
                        this.context.router.push('/coupon');
                    }
                );
            }
        });
    }

    showNotification(message, isSuccess = true) {
        Notification.showNotification(this.props.dispatch, this.props.route.path, message);
    }

    render() {
        const { isCreateNew } = this.props;
        const { coupon } = this.state;
        return (
            <div>
                <Notification path={this.props.route.path}/>
                <dl className="widget">
                    <ModalTabPreview
                        title={isCreateNew ? "新規クーポンのプレビュー" : "クーポンのプレビュー"}
                        msg={"携帯電話の種類によって\n表示が違う場合があります。"}
                        content={coupon.coupon_description}
                        isOpen={this.state.isOpenModal}
                        closeModal={this.closeModal}
                        isCreateNew={isCreateNew}
                        handleSubmitForm={this.handleCreateCoupon}>
                        <div className="smartphone_question_preview_content">
                            <div className="content" dangerouslySetInnerHTML={{__html: coupon.coupon_description}}>
                            </div>
                        </div>
                        <div className="garake_question_preview_content">
                            <div className="content">
                                {striptags(coupon.coupon_description.replace(/<a.*href="(.*?)".*>.*?<\/a>/gi, "  $1"))}
                            </div>
                        </div>
                    </ModalTabPreview>
                    <form acceptCharset="utf-8" onSubmit={this.onSubmit.bind(this)} autoComplete="off">
                        <dt className="widget__page__input__title">
                            <div className="widget__page__type__create"/>
                            <span>{Globalize.localize(isCreateNew ? "coupon_create_message" : "coupon_update_message", Globalize.culture())}</span>
                        </dt>
                        <dd className="widget__contents">
                            <div className="widget__page__input__contents__table mt10">
                                <dl className="checkbox__row widget__page__radio__form">
                                    <dt>状態</dt>
                                    <dd>
                                        <RadioGroup
                                            data={this.statuses}
                                            groupName="coupon_status"
                                            dataLabelKey='label'
                                            dataValueKey='key'
                                            value={coupon.coupon_status}
                                            onChange={this.handleCouponStatus}
                                        />
                                    </dd>
                                </dl>
                                <dl className="checkbox__row">
                                    <dt>クーポン管理名</dt>
                                    <dd><input type="text" name="coupon_name" className="widget__page__input_form" onChange={this.handleCouponName} value={coupon.coupon_name || ''}  /></dd>
                                </dl>
                                <dl className="checkbox__row">
                                    <dt>クーポンタイトル</dt>
                                    <dd><textarea className="widget__page__textarea_form mt10 mb10" onChange={this.handleCouponTitle} value={coupon.coupon_title} /></dd>
                                </dl>
                                <dl className="checkbox__row widget__page__wrapper">
                                    <dt>クーポン内容</dt>
                                    <dd>
                                        <textarea className="widget__page__textarea_form mt10" onChange={this.handleCouponDescription} value={coupon.coupon_description} />
                                        <p className="gray-text">※クーポン内容はHTMLが使用可能です</p>
                                    </dd>
                                </dl>
                                <dl className="checkbox__row">
                                    <dt>クーポン説明</dt>
                                    <dd>
                                        <div className="widget__page__input__coupon__input__description">
                                            <label>「クーポンを使う」ボタンの説明</label>
                                            <textarea onChange={this.handleCouponTwoStepButtonDescription}
                                                className="widget__page__textarea_form text_area_form_group text_area_element"
                                                value={coupon.coupon_two_step_button_description || ''} />
                                            <label>説明・注意事項</label>
                                            <textarea onChange={this.handleCouponTwoStepConfirm}
                                                className="widget__page__textarea_form text_area_form_group text_area_element"
                                                value={coupon.coupon_two_step_confirmation || ''} />
                                            <label>使用済み・有効期限切れメッセージ</label>
                                            <textarea onChange={this.handleCouponOverDescription}
                                                className="widget__page__textarea_form text_area_form_group text_area_element"
                                                value={coupon.coupon_two_step_over_description || ''} />
                                        </div>
                                    </dd>
                                </dl>
                                <dl className="checkbox__row widget__page__wrapper">
                                    <dt>有効期限</dt>
                                    <dd className="widget__page__input__coupon__input__limit">
                                        <div className="">
                                            <RadioButton id={"limit_" + 0}
                                                label="なし"
                                                radioName="coupon_limit_type"
                                                value="0"
                                                isChecked={this.state.coupon.coupon_limit_type == 0}
                                                check={this.handleExpirationDate}
                                                classRadio="group_radio" />
                                            <div className="widget__page__input__coupon__input__limit__split"></div>
                                            <RadioButton id={"limit_" + 1}
                                                label={"日付設定"}
                                                radioName="coupon_limit_type"
                                                value="1"
                                                isChecked={this.state.coupon.coupon_limit_type == 1}
                                                check={this.handleExpirationDate}
                                                classRadio="group_radio" />
                                            <div className="form_date_picker">
                                                <DatePicker className={"input__date" + (coupon.coupon_limit_type ==1 && coupon.coupon_limit_from ? " input__date__setted" : "")}
                                                            dateFormat={Globalize.localize('display_date_format', Globalize.culture())}
                                                            locale='ja'
                                                            dateFormatCalendar={Globalize.localize('display_date_year_and_month_format', Globalize.culture())}
                                                            maxDate={coupon.coupon_limit_to}
                                                            tetherConstraints={[]}
                                                            readOnly
                                                            isClearable={true}
                                                            selected={coupon.coupon_limit_type == 1 ? coupon.coupon_limit_from : null}
                                                            onChange={this.handleCouponLimitFrom}
                                                            />
                                                <span>　〜　</span>
                                                <DatePicker className={"input__date" + (coupon.coupon_limit_type ==1 && coupon.coupon_limit_to ? " input__date__setted" : "")}
                                                            dateFormat={Globalize.localize('display_date_format', Globalize.culture())}
                                                            locale="ja"
                                                            dateFormatCalendar={Globalize.localize('display_date_year_and_month_format', Globalize.culture())}
                                                            tetherConstraints={[]}
                                                            minDate={coupon.coupon_limit_from}
                                                            readOnly
                                                            isClearable={true}
                                                            selected={coupon.coupon_limit_type == 1 ? coupon.coupon_limit_to : null}
                                                            onChange={this.handleCouponLimitTo}
                                                            />
                                            </div>
                                            <div className="widget__page__input__coupon__input__limit__split"></div>
                                            <RadioButton id={"limit_" + 2}
                                                label={"期限設定"}
                                                radioName="coupon_limit_type"
                                                value="2"
                                                isChecked={coupon.coupon_limit_type == 2}
                                                check={this.handleExpirationDate}
                                                classRadio="group_radio" />
                                            <div className="group_from_text">
                                                <span>メルマガ送信日（会員登録日）の&#160;&#160;</span>
                                                <input
                                                    type="number"
                                                    name="limit_from"
                                                    min="0"
                                                    onChange={this.handleCouponSendStart}
                                                    value={coupon.coupon_limit_type == 2 && coupon.coupon_limit_send_start ? coupon.coupon_limit_send_start : ''}/>
                                                <span>&#160;&#160;日後から&#160;&#160;</span>
                                                <input
                                                    type="number"
                                                    name="limit_to"
                                                    min="0"
                                                    onChange={this.handleCouponSendCount}
                                                    value={coupon.coupon_limit_type == 2 && coupon.coupon_limit_send_count ? coupon.coupon_limit_send_count : ''}/>
                                                <span>&#160;&#160;日間有効</span><br />
                                                <span className="gray-text">※期限の開催日を『０日後』にすると、登録日から　使用可能です。</span><br />
                                                <div><span className="gray-text">※期限の期間を「０日間」とすると、期限の開催担当日のみ有効となります。</span></div>
                                            </div>
                                        </div>
                                    </dd>
                                </dl>
                                <dl className="checkbox__row">
                                    <dt className="widget__page__input__coupon__input__two__step__limit__title">
                                        <div>クーポン表示後の有効時間</div>
                                    </dt>
                                    <dd>
                                        <div className="widget__page__input__coupon__input__two__step__limit">
                                            <RadioButton
                                                id={"code_display_" + 0}
                                                label={"クーポンの有効期限まで"}
                                                radioName="coupon_user_code_display"
                                                value="0"
                                                isChecked={coupon.coupon_two_step_limit_type == 0}
                                                check={this.handleTwoStepLimitType}
                                                classRadio="group_radio_code" />
                                            <RadioButton
                                                id={"code_display_" + 1}
                                                label={"表示後"}
                                                radioName="coupon_user_code_display"
                                                value="1"
                                                isChecked={coupon.coupon_two_step_limit_type == 1}
                                                check={this.handleTwoStepLimitType}
                                                classRadio="group_radio_code"/>
                                            <div>
                                            <input
                                                onChange={this.handleLimitMin}
                                                value={coupon.coupon_two_step_limit_min || ''}
                                                type="number"
                                                min="0"/>
                                            </div>
                                            <span>&#160;&#160;分問&#160;&#160;</span>
                                            <span className="gray-text">※有効時間がある場合は１度の使用になります</span>
                                        </div>
                                    </dd>
                                </dl>
                                <dl className="checkbox__row">
                                    <dt>会員コード</dt>
                                    <dd>
                                        <div className="widget__page__input__coupon__input__user__code__display">
                                            <Checkbox
                                                id="coupon__user__code__display"
                                                label="表示する"
                                                key="coupon__user__code__display"
                                                onChange={(v, isChecked) => this.handleUserCodeDisplay(isChecked)}
                                                isChecked={coupon.coupon_user_code_display}
                                                checkValue="user_code_display"
                                            />
                                            <span className="gray-text">同一会員による同じクーポンの複数回使用を阻止する場合など</span>
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </dd>
                        <div className="widget__page__input__coupon__submit">
                            <input className="btn-base" value="クーポンの確認" type="submit" />
                        </div>
                    </form>
                </dl>
            </div>
        )
    }
}

export default CouponForm
