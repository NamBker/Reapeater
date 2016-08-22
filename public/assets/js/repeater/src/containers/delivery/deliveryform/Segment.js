import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import { GET_DISPLAY_ITEMS_ONLY_PATTERN } from '../../../constants/Constants';
import { DELIVERY_GENDER_MAN, DELIVERY_GENDER_WOMAN, DELIVERY_GENDER_NOT_ANSWERED } from '../../../constants/Constants';

import Checkbox from '../../../components/commons/Checkbox';
import DropDownList from '../../../components/commons/DropDownList';
import HelpButton from '../../../components/commons/HelpButton';

import { isLeapYear, makeNumberArray } from '../../../utils/CommonUtils';

class Segment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetail: false,
        }
    }

    onShowDetail() {
        this.setState({isShowDetail: !this.state.isShowDetail});
    }

    onCheckMemberRegisterDay(isChecked) {
        let segment = this.props.segment;
        segment.memberRegisterDay.isChecked = isChecked;
        this.props.onChangeSegment(segment);
    }

    onChangeMemberRegisterDayFrom(from) {
        let segment = this.props.segment;
        segment.memberRegisterDay.from = from;
        this.props.onChangeSegment(segment);
    }

    onChangeMemberRegisterDayTo(to) {
        let segment = this.props.segment;
        segment.memberRegisterDay.to = to;
        this.props.onChangeSegment(segment);
    }

    onCheckLastMailSentDay(isChecked) {
        let segment = this.props.segment;
        segment.lastMailSentDay.isChecked = isChecked;
        this.props.onChangeSegment(segment);
    }

    onChangeLastMailSentDayFrom(from) {
        let segment = this.props.segment;
        segment.lastMailSentDay.from = from;
        this.props.onChangeSegment(segment);
    }

    onChangeLastMailSentDayTo(to) {
        let segment = this.props.segment;
        segment.lastMailSentDay.to = to;
        this.props.onChangeSegment(segment);
    }

    onCheckGender(isChecked) {
        let segment = this.props.segment;
        segment.gender.isChecked = isChecked;
        this.props.onChangeSegment(segment);
    }

    onCheckGenderValue(gender) {
        let segment = this.props.segment;
        let idx = segment.gender.selectedItems.indexOf(gender);
        if (idx < 0) {
            segment.gender.selectedItems.push(gender);
        } else {
            segment.gender.selectedItems.splice(idx, 1);
        }
        this.props.onChangeSegment(segment);
    }

    getDays(year, month) {
        let maxDay = 31;
        if (month && 0 < month) {
            const maxDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            maxDay = maxDays[month - 1];
            if (year && month == 2 && !isLeapYear(year)) {
                maxDay--;
            }
        }
        return makeNumberArray(1, maxDay);
    }

    onCheckBirthday(isChecked) {
        let segment = this.props.segment;
        segment.birthday.isChecked = isChecked;
        this.props.onChangeSegment(segment);
    }

    onChangeBirthdayYear(year) {
        let segment = this.props.segment;
        segment.birthday.target.year = year;
        this.props.onChangeSegment(segment);
    }

    onChangeBirthdayMonth(month) {
        let segment = this.props.segment;
        segment.birthday.target.month = month;
        this.props.onChangeSegment(segment);
    }

    onChangeBirthdayDay(day) {
        let segment = this.props.segment;
        segment.birthday.target.day = day;
        this.props.onChangeSegment(segment);
    }

    onChangeBirthdayRangeFrom(from) {
        let segment = this.props.segment;
        segment.birthday.range.from = from;
        this.props.onChangeSegment(segment);
    }

    onChangeBirthdayRangeTo(to) {
        let segment = this.props.segment;
        segment.birthday.range.to = to;
        this.props.onChangeSegment(segment);
    }

    render() {
        const { segment } = this.props;
        const years = makeNumberArray(1900, 2099);
        const months = makeNumberArray(1, 12);
        const days = this.getDays(segment.birthday.target.year, segment.birthday.target.month);
        return (
            <dt className="widget__page__input__contents">
            <div className="mb20">
                {this.state.isShowDetail ?
                <div>
                <dl className="widget__page__input__contents__subtitle">
                    <span>{Globalize.localize('delivery_add_subtitle_narrow_target', Globalize.culture())}</span>
                </dl>
                <div className="widget__page__input__contents__table mb20">
                    <dl className="checkbox__row">
                        <dt className="checkable__row">
                            <Checkbox
                                id="widget__page__input__contents__table__check__box__member__register__day__id"
                                label={Globalize.localize('delivery_add_narrow_target_item_register_day', Globalize.culture())}
                                key="widget__page__input__contents__table__check__box__member__register__day__key"
                                onChange={(value, isChecked) => this.onCheckMemberRegisterDay(isChecked)}
                                isChecked={segment.memberRegisterDay.isChecked}
                                checkValue="member__register__day"
                            />
                        </dt>
                        <dd>
                            <DatePicker
                                className={"input__date" + (segment.memberRegisterDay.from ? " input__date__setted" : "")}
                                dateFormat="YYYY年MM月DD日 (ddd)"
                                locale='ja'
                                dateFormatCalendar="YYYY年MM月"
                                maxDate={segment.memberRegisterDay.to}
                                tetherConstraints={[]}
                                readOnly
                                isClearable={true}
                                selected={segment.memberRegisterDay.from}
                                onChange={(from) => this.onChangeMemberRegisterDayFrom(from)}
                            />
                            <span>　〜　</span>
                            <DatePicker
                                className={"input__date" + (segment.memberRegisterDay.to ? " input__date__setted" : "")}
                                dateFormat="YYYY年MM月DD日 (ddd)"
                                locale='ja'
                                dateFormatCalendar="YYYY年MM月"
                                minDate={segment.memberRegisterDay.from}
                                tetherConstraints={[]}
                                readOnly
                                isClearable={true}
                                selected={segment.memberRegisterDay.to}
                                onChange={(to) => this.onChangeMemberRegisterDayTo(to)}
                            />
                        </dd>
                    </dl>
                    <dl className="checkbox__row">
                        <dt className="checkable__row">
                            <Checkbox
                                id="widget__page__input__contents__table__check__box__last__mail__sent__day__id"
                                label={Globalize.localize('delivery_add_narrow_target_item_last_sent_day', Globalize.culture())}
                                key="widget__page__input__contents__table__check__box__last__mail__sent__day__key"
                                onChange={(value, isChecked) => this.onCheckLastMailSentDay(isChecked)}
                                isChecked={segment.lastMailSentDay.isChecked}
                                checkValue="last__mail__sent__day"
                            />
                        </dt>
                        <dd>
                            <DatePicker
                                className={"input__date" + (segment.lastMailSentDay.from ? " input__date__setted" : "")}
                                dateFormat="YYYY年MM月DD日 (ddd)"
                                locale='ja'
                                dateFormatCalendar="YYYY年MM月"
                                maxDate={segment.lastMailSentDay.to}
                                tetherConstraints={[]}
                                readOnly
                                isClearable={true}
                                selected={segment.lastMailSentDay.from}
                                onChange={(from) => this.onChangeLastMailSentDayFrom(from)}
                            />
                            <span>　〜　</span>
                            <DatePicker
                                className={"input__date" + (segment.lastMailSentDay.to ? " input__date__setted" : "")}
                                dateFormat="YYYY年MM月DD日 (ddd)"
                                locale='ja'
                                dateFormatCalendar="YYYY年MM月"
                                minDate={segment.lastMailSentDay.from}
                                tetherConstraints={[]}
                                readOnly
                                isClearable={true}
                                selected={segment.lastMailSentDay.to}
                                onChange={(to) => this.onChangeLastMailSentDayTo(to)}
                            />
                            <br/>
                            <span className="font-baseline2 gray-text">{Globalize.localize('delivery_add_narrow_target_item_last_sent_day_description', Globalize.culture())}</span>
                        </dd>
                    </dl>
                    <dl className="checkbox__row">
                        <dt className="checkable__row">
                            <Checkbox
                                id="widget__page__input__contents__table__check__box__gender__id"
                                label={Globalize.localize('delivery_add_narrow_questionnaire_gender', Globalize.culture())}
                                key="widget__page__input__contents__table__check__box__gender__key"
                                onChange={(value, isChecked) => this.onCheckGender(isChecked)}
                                isChecked={segment.gender.isChecked}
                                checkValue="check__gender"
                            />
                        </dt>
                        <dd className="delivery__add__select__gender">
                            <Checkbox
                                id="widget__page__input__contents__table__check__box__gender__man__id"
                                label={Globalize.localize('gender_man', Globalize.culture())}
                                key="widget__page__input__contents__table__check__box__gender__man__key"
                                onChange={(value, isChecked) => this.onCheckGenderValue(value)}
                                isChecked={0 <= segment.gender.selectedItems.indexOf(DELIVERY_GENDER_MAN)}
                                checkValue={DELIVERY_GENDER_MAN}
                            />
                            <Checkbox
                                id="widget__page__input__contents__table__check__box__gender__woman__id"
                                label={Globalize.localize('gender_woman', Globalize.culture())}
                                key="widget__page__input__contents__table__check__box__gender__woman__key"
                                onChange={(value, isChecked) => this.onCheckGenderValue(value)}
                                isChecked={0 <= segment.gender.selectedItems.indexOf(DELIVERY_GENDER_WOMAN)}
                                checkValue={DELIVERY_GENDER_WOMAN}
                            />
                            <Checkbox
                                id="widget__page__input__contents__table__check__box__gender__not__answered__id"
                                label={Globalize.localize('not_answered', Globalize.culture())}
                                key="widget__page__input__contents__table__check__box__gender__not__answered__key"
                                onChange={(value, isChecked) => this.onCheckGenderValue(value)}
                                isChecked={0 <= segment.gender.selectedItems.indexOf(DELIVERY_GENDER_NOT_ANSWERED)}
                                checkValue={DELIVERY_GENDER_NOT_ANSWERED}
                            />
                            <HelpButton helpContext={Globalize.localize('delivery_add_help_gender_context', Globalize.culture())}/>
                        </dd>
                    </dl>
                    <dl className="checkbox__row">
                        <dt className="checkable__row">
                            <Checkbox
                                id="widget__page__input__contents__table__check__box__birthday__id"
                                label={Globalize.localize('delivery_add_narrow_questionnaire_birthday', Globalize.culture())}
                                key="widget__page__input__contents__table__check__box__birthday__key"
                                onChange={(value, isChecked) => this.onCheckBirthday(isChecked)}
                                isChecked={segment.birthday.isChecked}
                                checkValue="check__birthday"
                            />
                        </dt>
                        <dd>
                            <div className="delivery__birthday__target">
                                <span>{Globalize.localize('delivery_add_narrow_questionnaire_birthday_target', Globalize.culture())}</span>
                                <DropDownList
                                    selectName="delivery__birthday__target__year"
                                    data={years}
                                    defaultValue={segment.birthday.target.year}
                                    hasEmptyOption={true}
                                    onChange={(e) => this.onChangeBirthdayYear(e.target.value)}
                                    eachCallback={(year) => {return <option value={year} key={"birthday_year_" + year}>{year + Globalize.localize('year', Globalize.culture())}</option>}}
                                />
                                <DropDownList
                                    selectName="delivery__birthday__target__month"
                                    data={months}
                                    defaultValue={segment.birthday.target.month}
                                    hasEmptyOption={true}
                                    onChange={(e) => this.onChangeBirthdayMonth(e.target.value)}
                                    eachCallback={(month) => {return <option value={month} key={"birthday_month_" + month}>{month + Globalize.localize('month', Globalize.culture())}</option>}}
                                />
                                <DropDownList
                                    selectName="delivery__birthday__target__day"
                                    data={days}
                                    defaultValue={segment.birthday.target.day}
                                    hasEmptyOption={true}
                                    onChange={(e) => this.onChangeBirthdayDay(e.target.value)}
                                    eachCallback={(day) => {return <option value={day} key={"birthday_day_" + day}>{day + Globalize.localize('day', Globalize.culture())}</option>}}
                                />
                            </div>
                            <div className="delivery__birthday__range">
                                <span>{Globalize.localize('delivery_add_narrow_questionnaire_birthday_range', Globalize.culture())}</span>
                                <DatePicker
                                    className={"input__date" + (segment.birthday.range.from ? " input__date__setted" : "")}
                                    dateFormat="YYYY年MM月DD日 (ddd)"
                                    locale='ja'
                                    dateFormatCalendar="YYYY年MM月"
                                    maxDate={segment.birthday.range.to}
                                    tetherConstraints={[]}
                                    readOnly
                                    isClearable={true}
                                    selected={segment.birthday.range.from}
                                    onChange={(from) => this.onChangeBirthdayRangeFrom(from)}
                                />
                                <span>　〜　</span>
                                <DatePicker
                                    className={"input__date" + (segment.birthday.range.to ? " input__date__setted" : "")}
                                    dateFormat="YYYY年MM月DD日 (ddd)"
                                    locale='ja'
                                    dateFormatCalendar="YYYY年MM月"
                                    minDate={segment.birthday.range.from}
                                    tetherConstraints={[]}
                                    readOnly
                                    isClearable={true}
                                    selected={segment.birthday.range.to}
                                    onChange={(to) => this.onChangeBirthdayRangeTo(to)}
                                />
                            </div>
                            <HelpButton
                                buttonTitle={Globalize.localize('delivery_add_narrow_questionnaire_birthday_help', Globalize.culture())}
                                helpContext={Globalize.localize('delivery_add_help_birthday_context', Globalize.culture())}
                            />
                        </dd>
                    </dl>
                </div>
                </div>
                : null}
                <div className="widget__page__input__more__btn mb20" onClick={() => this.onShowDetail()}>
                    <p>
                        <span className={this.state.isShowDetail ? 'minus' : 'plus'}></span><span>{Globalize.localize('delivery_target_detail', Globalize.culture())}</span>
                    </p>
                </div>
            </div>
            </dt>
        );
    }
}

export default Segment;
