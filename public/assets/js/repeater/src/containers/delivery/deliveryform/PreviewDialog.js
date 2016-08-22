import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Modal from '../../../components/commons/Modal';
import DropDownList from '../../../components/commons/DropDownList';

import { makeTimeArray } from '../../../utils/CommonUtils';

import { DELIVERY_GENDER_MAN, DELIVERY_GENDER_WOMAN, DELIVERY_GENDER_NOT_ANSWERED } from '../../../constants/Constants';
import { DELIVERY_STATUS_DRAFT, DELIVERY_STATUS_UNDELIVERED } from '../../../constants/Constants';

class PreviewDialog extends Component {
    constructor(props) {
        super(props);
        const { data } = props;
        let type = '';
        let schedule = null;
        let schedule_date = null;
        let schedule_time = '';
        switch(data.delivery_status) {
        case DELIVERY_STATUS_DRAFT:
            type = 'draft';
            break;
        case DELIVERY_STATUS_UNDELIVERED:
            type = 'time';
            schedule = data.delivery_schedule;
            let scheduleTime = new Date(schedule);
            if (new Date(scheduleTime) < new Date()) {
                type = 'fixed';
            } else {
                [schedule_date, schedule_time] = data.delivery_schedule.split(" ");
                schedule_date = moment(schedule_date);
                schedule_time = schedule_time.substring(0, 5)
            }
            break;
        default:
            type = 'fixed';
            schedule = data.delivery_schedule;
            break;
        }
        this.state = {
            delivery_type: type,
            delivery_schedule: schedule,
            delivery_schedule_date: schedule_date,
            delivery_schedule_time: schedule_time,
        };
    }

    getStoreNameList() {
        const { data, stores } = this.props;
        data.delivery_store_ids.sort((n1, n2) => {return n1 - n2});

        let nameList = [];

        stores.map(store => {
            if (0 <= data.delivery_store_ids.indexOf(store.id)) {
                nameList.push(store.store_name);
            }
        });
        return nameList.join("、");
    }

    selectedGenderList() {
        const { gender } = this.props.segment;
        let genderList = [];
        if (0 <= gender.selectedItems.indexOf(DELIVERY_GENDER_MAN)) {
            genderList.push(Globalize.localize('gender_man', Globalize.culture()));
        }
        if (0 <= gender.selectedItems.indexOf(DELIVERY_GENDER_WOMAN)) {
            genderList.push(Globalize.localize('gender_woman', Globalize.culture()));
        }
        if (0 <= gender.selectedItems.indexOf(DELIVERY_GENDER_NOT_ANSWERED)) {
            genderList.push(Globalize.localize('not_answered', Globalize.culture()));
        }
        return genderList.join(", ");
    }

    renderBirthdaySegment() {
        const { birthday } = this.props.segment;
        if (!birthday.isChecked) {
            return null;
        }
        let isSetTarget = birthday.target.year || birthday.target.month || birthday.target.day;
        let isSetRange = birthday.range.from && birthday.range.to;
        return (
            <dd>
                {isSetTarget ?
                <span>
                    {(birthday.target.year ? ('0000' + birthday.target.year).slice(-4) : 'XXXX') + '年'}
                    {(birthday.target.month ? ('00' + birthday.target.month).slice(-2) : 'XX') + '月'}
                    {(birthday.target.day ? ('00' + birthday.target.day).slice(-2) : 'XX') + '日'}
                </span>
                : null}
                {isSetRange ?
                <span>
                    {birthday.range.from ? birthday.range.from.format(Globalize.localize('display_date_format', Globalize.culture())) : ""}
                    〜
                    {birthday.range.to ? birthday.range.to.format(Globalize.localize('display_date_format', Globalize.culture())) : ""}
                </span>
                : null}
            </dd>
        );
    }

    onChangeScheduleDate(date) {
        let delivery_schedule = null;
        if (date && this.state.delivery_schedule_time) {
            delivery_schedule = date.format('YYYY-MM-DD') + ' ' + this.state.delivery_schedule_time;
        }
        this.setState({delivery_schedule_date: date, delivery_schedule: delivery_schedule});
    }

    onChangeScheduleTime(time) {
        let delivery_schedule = null;
        if (this.state.delivery_schedule_date && time) {
            delivery_schedule = this.state.delivery_schedule_date.format('YYYY-MM-DD') + ' ' + time;
        }
        this.setState({delivery_schedule_time: time, delivery_schedule: delivery_schedule});
    }

    onChangeScheduleType(type) {
        this.setState({delivery_type: type});
    }

    onRun() {
        if (this.state.delivery_type == 'time') {
            if (this.state.delivery_schedule == null) {
                window.alert(Globalize.localize('delivery_add_preview_error_not_set_schedule', Globalize.culture()));
                return;
            }
            this.props.onSave(this.state.delivery_schedule);
            return;
        }
        this.props.onSave(this.state.delivery_type);
    }

    replaceParameterToTmpString(content) {
        const { parameterNames } = this.props;
        return content.replace(/{([a-z][[a-z_]+[a-z])((: )([1-9][0-9]*)){0,1}}/g, (match, p1, p2, p3, p4, offset, string) => {
            switch(p1) {
            case 'left':
                return '{';
            case 'right':
                return '}';
            case 'user_registered_brand_name':
                return "【" + Globalize.localize('delivery_add_default_parameter_brand_name', Globalize.culture()) + "】";
            case 'user_registered_store_name':
                return "【" + Globalize.localize('delivery_add_default_parameter_store_name', Globalize.culture()) + "】";
            case 'user_registered_store_manager_name':
                return "【" + Globalize.localize('delivery_add_default_parameter_store_manager_name', Globalize.culture()) + "】";
            case 'user_registered_store_phone_no':
                return "【" + Globalize.localize('delivery_add_default_parameter_store_phone_no', Globalize.culture()) + "】";
            case 'picture':
                if (p4) {
                    let picture = this.props.pictures.find(picture => picture.id == p4);
                    if (picture) {
                        return "<img src='" + picture.picture_url + "' width='100%'/>";
                    }
                    return "【" + Globalize.localize('delivery_add_default_parameter_picture', Globalize.culture()) + p4 + "】";
                }
                break;
            case 'coupon':
                if (p4 && parameterNames['coupon'][p4]) {
                    return "<a target='_blank' 'href='#/coupon/edit/" + p4 + "'>【" + Globalize.localize('delivery_add_default_parameter_coupon', Globalize.culture()) + "「" + parameterNames['coupon'][p4] + "」" + "】</a>";
                }
                break;
            case 'random_coupon':
                if (p4 && parameterNames['random_coupon'][p4]) {
                    return "<a target='_blank' href='#/randomCoupon/edit/" + p4 + "'>【" + Globalize.localize('delivery_add_default_parameter_random_coupon', Globalize.culture()) + "「" + parameterNames['random_coupon'][p4] + "」" + "】</a>";
                }
                break;
            case 'questionnaire':
                if (p4 && parameterNames['questionnaire'][p4]) {
                    return "<a target='_blank' href='#/questionnaire/edit/" + p4 + "'>【" + Globalize.localize('delivery_add_default_parameter_questionnaire', Globalize.culture()) + "「" + parameterNames['questionnaire'][p4] + "」" + "】</a>";
                }
                break;
            }
            return "";
        });
    }

    render() {
        const { data, segment } = this.props;
        const times = makeTimeArray(15);
        return (
            <Modal isOpen={this.props.isOpen}>
                <div className="modal__w700a">
                    <dl className="widget question_list">
                        <dt className="contents__modal__h2">
                            <span className="contents__modal__h2--title">{Globalize.localize('delivery_add_preview_title', Globalize.culture())}</span>
                            <div className="contents__modal__del" onClick={this.props.onClose}/>
                        </dt>
                        <dd className="widget__contents modal__w700a_table mb100">
                            <div className="modal__w700a_table_left">
                                <Tabs className="modal__Preview widget__page__input__preview__tabs">
                                    <TabList>
                                        <Tab className="widget__page__input__preview__tab">{Globalize.localize('delivery_add_html_body', Globalize.culture())}</Tab>
                                        <Tab className="widget__page__input__preview__tab">{Globalize.localize('delivery_add_text_body', Globalize.culture())}</Tab>
                                    </TabList>
                                    <TabPanel className="widget__page__input__preview__tab__panel">
                                        <div>
                                            <p className="title">{data.delivery_title}</p>
                                            <div className="content"
                                                dangerouslySetInnerHTML={{__html: this.replaceParameterToTmpString(data.delivery_html_body)}}/>
                                        </div>
                                    </TabPanel>
                                    <TabPanel className="widget__page__input__preview__tab__panel">
                                        <div>
                                            <p className="title">{data.delivery_title}</p>
                                            <div className="content"
                                                dangerouslySetInnerHTML={{__html: this.replaceParameterToTmpString(data.delivery_text_body.replace(/\n/g, '<br/>'))}}/>
                                        </div>
                                    </TabPanel>
                                </Tabs>
                                <p className="modal__astalisk">
                                    {Globalize.localize('delivery_add_preview_asterisk', Globalize.culture())}
                                </p>
                            </div>
                            <div className="modal__w700a_table_right">
                                <div className="modal__w700a_right_scroll">
                                    <p className="caption mb10">
                                        {Globalize.localize('delivery_add_subtitle_target', Globalize.culture())}
                                    </p>
                                    <dl className="modal__w700a_right_scroll_list">
                                        <dt><span>{Globalize.localize('store', Globalize.culture())}</span></dt>
                                        <dd><span>{this.getStoreNameList()}</span></dd>
                                    </dl>
                                    <p className="caption mb10">
                                        {Globalize.localize('delivery_add_limit_target', Globalize.culture())}
                                    </p>
                                    {segment.memberRegisterDay.isChecked || segment.lastMailSentDay.isChecked || segment.gender.isChecked || segment.birthday.isChecked ?
                                    <dl className="modal__w700a_right_scroll_list">
                                        {segment.memberRegisterDay.isChecked ?
                                        <dt><span>{Globalize.localize('delivery_add_narrow_target_item_register_day', Globalize.culture())}</span></dt> : null}
                                        {segment.memberRegisterDay.isChecked ?
                                            <dd>
                                                <span>
                                                    {segment.memberRegisterDay.from ?
                                                    segment.memberRegisterDay.from.format(Globalize.localize('display_date_format', Globalize.culture())) :
                                                    null}
                                                </span>
                                                〜
                                                <span>
                                                    {segment.memberRegisterDay.to ?
                                                    segment.memberRegisterDay.to.format(Globalize.localize('display_date_format', Globalize.culture())) :
                                                    null}
                                                </span>
                                            </dd> : null}
                                        {segment.lastMailSentDay.isChecked ?
                                        <dt><span>{Globalize.localize('delivery_add_narrow_target_item_last_sent_day', Globalize.culture())}</span></dt> : null}
                                        {segment.lastMailSentDay.isChecked ?
                                            <dd>
                                                <span>
                                                    {segment.lastMailSentDay.from ?
                                                    segment.lastMailSentDay.from.format(Globalize.localize('display_date_format', Globalize.culture())) : null}
                                                </span>
                                                〜
                                                <span>
                                                    {segment.lastMailSentDay.to ?
                                                    segment.lastMailSentDay.to.format(Globalize.localize('display_date_format', Globalize.culture())) : null}
                                                </span>
                                            </dd> : null}
                                        {segment.gender.isChecked ?
                                        <dt><span>{Globalize.localize('delivery_add_narrow_questionnaire_gender', Globalize.culture())}</span></dt> : null}
                                        {segment.gender.isChecked ?
                                            <dd>
                                                <span>{this.selectedGenderList()}</span>
                                            </dd> : null}
                                        {segment.birthday.isChecked ?
                                            <dt>
                                                <div className="birthday__title__left">{Globalize.localize('delivery_add_narrow_questionnaire_birthday', Globalize.culture())}</div>
                                                <div className="birthday__title__right">
                                                    {segment.birthday.target.year || segment.birthday.target.month || segment.birthday.target.day ?
                                                    <div>{Globalize.localize('delivery_add_narrow_questionnaire_birthday_target', Globalize.culture()) + ":"}</div> : null}
                                                    {segment.birthday.range.from && segment.birthday.range.to ?
                                                    <div>{Globalize.localize('delivery_add_narrow_questionnaire_birthday_range', Globalize.culture()) + ":"}</div> : null}
                                                </div>
                                            </dt> : null}
                                        {this.renderBirthdaySegment()}
                                    </dl> : null}
                                </div>
                                <div className="modal__w700a_right_form">
                                    {this.state.delivery_type == 'fixed' ?
                                    <div className="widget__page__input__preview__sent">
                                        <p className="caption">
                                            {Globalize.localize('delivery_add_preview_delivery_sent', Globalize.culture())}
                                        </p>
                                        <dl className="modal__w700a_right_scroll_list">
                                            <dt><span>{Globalize.localize('delivery_add_preview_delivery_sent_time', Globalize.culture())}</span></dt>
                                            <dd><span>{this.state.delivery_schedule}</span></dd>
                                        </dl>
                                    </div>
                                        :
                                    <div>
                                        <p><label className="contents__container__radio mr15">
                                                <input className="widget__page__input__preview__send__option__radio"
                                                    type="radio"
                                                    value="now"
                                                    checked={this.state.delivery_type == "now"}
                                                    onChange={(e) => this.onChangeScheduleType(e.target.value)}/>
                                                {Globalize.localize('delivery_add_preview_delivery_now', Globalize.culture())}
                                        </label></p>
                                        <p><label className="contents__container__radio mr15">
                                                <input className="widget__page__input__preview__send__option__radio"
                                                    type="radio"
                                                    value="time"
                                                    checked={this.state.delivery_type == "time"}
                                                    onChange={(e) => this.onChangeScheduleType(e.target.value)}/>
                                                {Globalize.localize('delivery_add_preview_delivery_scheduled', Globalize.culture())}
                                        </label></p>
                                        <div className="widget__page__input__preview__send__option__schedule">
                                            <DatePicker
                                                className={"input__date" + (this.state.delivery_schedule_date ? " input__date__setted" : "")}
                                                dateFormat="YYYY年MM月DD日 (ddd)"
                                                locale='ja'
                                                dateFormatCalendar="YYYY年MM月"
                                                minDate={moment(Date.now())}
                                                tetherConstraints={[]}
                                                readOnly
                                                isClearable={true}
                                                selected={this.state.delivery_schedule_date}
                                                onChange={(date) => this.onChangeScheduleDate(date)}
                                            />
                                            <DropDownList
                                                className="delivery__birthday__targets"
                                                data={times}
                                                defaultValue={this.state.delivery_schedule_time}
                                                hasEmptyOption={true}
                                                onChange={(e) => this.onChangeScheduleTime(e.target.value)}
                                                eachCallback={(time) => {return <option value={time} key={"schedule_time_" + time}>{time}</option>}}
                                            />
                                        </div>
                                        <p>
                                            <label className="contents__container__radio mr15">
                                                <input className="widget__page__input__preview__send__option__radio"
                                                    type="radio"
                                                    value="draft"
                                                    checked={this.state.delivery_type == "draft"}
                                                    onChange={(e) => this.onChangeScheduleType(e.target.value)}/>
                                                {Globalize.localize('delivery_add_preview_delivery_draft', Globalize.culture())}
                                            </label>
                                            <span className="modal__astalisk mb20">
                                                {Globalize.localize('delivery_add_preview_delivery_draft_asterisk', Globalize.culture())}
                                            </span>
                                        </p>
                                    </div>}
                                    <div className="modal__btn__table">
                                        <div className="modal__btn__tablecell widget__page__input__preview__btn__group">
                                            <a className="btn-gray mr10 widget__page__input__preview__btn" onClick={this.props.onClose}>
                                                {Globalize.localize('close', Globalize.culture())}
                                            </a>
                                        </div>
                                        {this.state.delivery_type == 'fixed' ?
                                            null
                                        :
                                        <div className="modal__btn__tablecell">
                                            <a className="btn-base widget__page__input__preview__btn" onClick={() => this.onRun()}>
                                                {Globalize.localize('run', Globalize.culture())}
                                            </a>
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        </dd>
                    </dl>
                </div>
            </Modal>
        );
    }
}

PreviewDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    return {
        pictures: state.pictures,
    };
};

export default connect(mapStateToProps)(PreviewDialog);
