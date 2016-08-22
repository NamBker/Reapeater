import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE } from '../../constants/Constants';
import { GET_DISPLAY_ITEMS_ONLY_PATTERN } from '../../constants/Constants';
import { eachCompany, eachBrand, eachStore, isEmailAddress, makeNumberArray, getDays } from '../../utils/CommonUtils';

import { MEMBER_DELIVERY_CONDITION_PERMITTED, MEMBER_DELIVERY_CONDITION_DENIED } from '../../constants/Constants';
import { MEMBER_DELIVERY_STATUS_NORMAL, MEMBER_DELIVERY_STATUS_ERROR } from '../../constants/Constants';
import { MEMBER_STATUS_REGISTERED, MEMBER_STATUS_WITHDRAW } from '../../constants/Constants';
import { GENDER_MAN, GENDER_WOMAN } from '../../constants/Constants';
import { PREFECTURE_ARRAY, JOB_ARRAY } from '../../constants/Constants';
import { MEMBER_EMAIL_CHECK_RESULT_NOT_EXIST, MEMBER_EMAIL_CHECK_RESULT_EXIST_IN_OTHER_BRAND, MEMBER_EMAIL_CHECK_RESULT_ALREADY_EXIST } from '../../constants/Constants';
import Routes from '../../constants/Routes';

import DropDownList from '../../components/commons/DropDownList';
import Notification from '../../components/commons/Notification';
import CSVUploadDialog from '../../components/commons/CSVUploadDialog';

import { fetchUserInfo } from '../../actions/user';
import { checkMember, memberCSVUpload, createMember, getMemberDetail, updateMember } from '../../actions/member';
import { doneCustomCreate } from '../../actions/routes';

class MemberInputForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                company_id: props.currentUser.authority >= USER_AUTHORITY_COMPANY ? props.currentUser.company_id : 0,
                brand_id: props.currentUser.authority >= USER_AUTHORITY_BRAND ? props.currentUser.brand_id : 0,
                store_id: props.currentUser.authority >= USER_AUTHORITY_STORE ? props.currentUser.store_id : 0,
                mail_address: '',
                mail_reception: MEMBER_DELIVERY_CONDITION_PERMITTED,
                mail_delivery_status: MEMBER_DELIVERY_STATUS_NORMAL,
                store_member_status: MEMBER_STATUS_REGISTERED,
                member_registration_date: props.isNew ? moment(new Date()) : null,
                member_leave_date: null,
                name: '',
                tel_no: '',
                birthday: null,
                gender: '',
                prefecture: '',
                job: '',
            },
            isConfirm: false,
            birthday: {
                year: 0,
                month: 0,
                day: 0,
            },
            mailCheck: {
                status: 0,
                mail_address: '',
            }
        };
        this.memberStatuses = [
            { 'label': Globalize.localize('registered', Globalize.culture()), 'key': MEMBER_STATUS_REGISTERED },
            { 'label': Globalize.localize('withdraw', Globalize.culture()), 'key': MEMBER_STATUS_WITHDRAW },
        ];
        this.deliveryConditions = [
            { 'label': Globalize.localize('member_delivery_condition_permitted', Globalize.culture()), 'key': MEMBER_DELIVERY_CONDITION_PERMITTED },
            { 'label': Globalize.localize('member_delivery_condition_denied', Globalize.culture()), 'key': MEMBER_DELIVERY_CONDITION_DENIED },
        ];
        this.deliveryStatuses = [
            { 'label': Globalize.localize('normal', Globalize.culture()), 'key': MEMBER_DELIVERY_STATUS_NORMAL },
            { 'label': Globalize.localize('error', Globalize.culture()), 'key': MEMBER_DELIVERY_STATUS_ERROR },
        ];
        this.genders = [
            { 'label': Globalize.localize('gender_man', Globalize.culture()), 'key': GENDER_MAN},
            { 'label': Globalize.localize('gender_woman', Globalize.culture()), 'key': GENDER_WOMAN},
        ];
        this.prefectures = PREFECTURE_ARRAY.map((prefecture, index) => {return {'label': prefecture, 'key': ('0' + (index + 1)).slice(-2)}});
        this.jobs = JOB_ARRAY.map((job, index) => {return {'label': job, 'key': index + 1}});
        this.years = makeNumberArray(1900, 2099);
        this.months = makeNumberArray(1, 12);
    }

    componentWillMount() {
        this.props.dispatch(fetchUserInfo());
        if (!this.props.isNew) {
            getMemberDetail(this.props.params.storeId, this.props.params.memberId, (err) => {
                this.showNotification(err.toString());
            }, (res) => {
                const member = res.member;
                let data = this.state.data;
                let birthday = {year: 0, month: 0, day: 0};
                let tmp = null;
                data.company_id = member.company_id;
                data.brand_id = member.brand_id;
                data.store_id = member.store_id;
                data.mail_address = member.mail_address;
                data.mail_reception = member.mail_reception || MEMBER_DELIVERY_CONDITION_PERMITTED;
                data.mail_delivery_status = member.mail_delivery_status || MEMBER_DELIVERY_STATUS_NORMAL;
                data.store_member_status = member.store_member_status || MEMBER_STATUS_REGISTERED;
                tmp = moment(member.member_registration_date.substring(0, 10), "YYYY-MM-DD");
                data.member_registration_date = tmp.isValid() ? tmp : null;
                tmp = moment(member.member_leave_date.substring(0, 10), "YYYY-MM-DD");
                data.member_leave_date = tmp.isValid() ? tmp : null;
                data.name = member.name;
                data.tel_no = member.tel_no;
                tmp = moment(member.birthday, "YYYYMMDD");
                data.birthday = tmp.isValid() ? tmp : null;
                if (tmp.isValid()) {
                    birthday.year = tmp.year();
                    birthday.month = tmp.month() + 1;
                    birthday.day = tmp.date();
                }
                data.gender = member.gender || '';
                data.prefecture = member.prefecture ? ('0' + member.prefecture).slice(-2) : '';
                data.job = member.job || '';
                this.setState({data, birthday});
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.currentUser.id && nextProps.currentUser.id) {
            const { currentUser } = nextProps;
            let data = this.state.data;
            data.company_id = currentUser.authority >= USER_AUTHORITY_COMPANY ? currentUser.company_id : 0;
            data.brand_id = currentUser.authority >= USER_AUTHORITY_BRAND ? currentUser.brand_id : 0;
            data.store_id = currentUser.authority >= USER_AUTHORITY_STORE ? currentUser.store_id : 0;
            this.setState({data});
        }
    }

    onChangeCompany(companyId) {
        let data = this.state.data;
        companyId = companyId ? parseInt(companyId) : 0;
        data.company_id = companyId;

        if (companyId != 0) {
            // ブランドの選択している項目チェック
            if (0 != data.brand_id) {
                this.props.brands.some((brand) => {
                    if (brand.id != data.brand_id) {
                        return false;
                    }
                    if (brand.company_id != companyId) {
                        data.brand_id = 0;
                        data.store_id = 0;
                    }
                    return true;
                });
            }
        } else {
            data.brand_id = 0;
            data.store_id = 0;
        }
        this.setState({data});
    }

    onChangeBrand(brandId) {
        let data = this.state.data;
        brandId = brandId ? parseInt(brandId) : 0;
        data.brand_id = brandId;

        if (0 != brandId) {
            // 店舗の選択している項目チェック
            if (0 != data.store_id) {
                this.props.stores.some((store) => {
                    if (store.id != data.store_id) {
                        return false;
                    }
                    if (store.brand_id != brandId) {
                        data.store_id = 0;
                    }
                    return true;
                });
            }
        } else {
            data.store_id = 0;
        }
        this.setState({data});
    }

    onChangeStore(storeId) {
        let data = this.state.data;
        storeId = storeId ? parseInt(storeId) : 0;
        data.store_id = storeId;
        this.setState({data});
    }

    onChangeEmailAddress(value) {
        let data = this.state.data;
        data.mail_address = value;
        this.setState({data});
    }

    onClickEmailCheck() {
        const { data } = this.state;
        let errors = [];
        if (data.brand_id == 0) {
            errors.push(Globalize.localize('map_brand', Globalize.culture()));
        }
        if (data.store_id == 0) {
            errors.push(Globalize.localize('map_store', Globalize.culture()));
        }
        if (data.mail_address.length < 1) {
            errors.push(Globalize.localize('member_table_title_mail_address', Globalize.culture()));
        }
        if (0 < errors.length) {
            let message = Globalize.localize('member_input_form_error_for_mail_check_required', Globalize.culture());
            message += '\n' + errors.join('\n');
            this.showNotification(message);
            return;
        }
        if (!isEmailAddress(data.mail_address)) {
            this.showNotification(Globalize.localize('member_input_form_error_for_mail_check_mail_address_format', Globalize.culture()));
            return;
        }
        checkMember({company_id: data.company_id, brand_id: data.brand_id, store_id: data.store_id, mail_address: data.mail_address}, (err) => {
            this.showNotification(err.toString());
        }, (res) => {
            let mailCheck = this.state.mailCheck;
            mailCheck.status = res.status;
            mailCheck.mail_address = data.mail_address;
            this.setState({mailCheck});
        });
    }

    onChangeDeliveryCondition(value) {
        let data = this.state.data;
        data.mail_reception = value;
        this.setState({data});
    }

    onChangeMailDeliveryStatus(value) {
        let data = this.state.data;
        data.mail_delivery_status = value;
        this.setState({data});
    }

    onChangeMemberStatus(value) {
        let data = this.state.data;
        data.store_member_status = value;
        this.setState({data});
    }

    onChangeRegistrationDate(date) {
        let data = this.state.data;
        data.member_registration_date = date;
        this.setState({data});
    }

    onChangeLeaveDate(date) {
        let data = this.state.data;
        data.member_leave_date = date;
        this.setState({data});
    }

    onChangeBirthday(date) {
        let data = this.state.data;
        data.birthday = date;
        this.setState({data});
    }

    onChangeGender(value) {
        let data = this.state.data;
        data.gender = value;
        this.setState({data});
    }

    onChangePrefecture(value) {
        let data = this.state.data;
        data.prefecture = value;
        this.setState({data});
    }

    onChangeJob(value) {
        let data = this.state.data;
        data.job = value;
        this.setState({data});
    }

    checkRequiredItems() {
        const { data } = this.state;
        let errors = [];
        if (data.company_id < 1) {
            errors.push(Globalize.localize('map_company', Globalize.culture()));
        }
        if (data.brand_id < 1) {
            errors.push(Globalize.localize('map_brand', Globalize.culture()));
        }
        if (data.store_id < 1) {
            errors.push(Globalize.localize('map_store', Globalize.culture()));
        }
        if (data.mail_address.length < 1) {
            errors.push(Globalize.localize('member_table_title_mail_address', Globalize.culture()));
        }
        return errors;
    }

    onClickBack(e) {
        e.preventDefault();
        if (this.state.isConfirm) {
            this.setState({isConfirm: false});
        }
    }

    onClickSubmit(e) {
        e.preventDefault();
        if (this.state.isConfirm) {
            let params = Object.assign({}, this.state.data);
            if (params.birthday) {
                params.birthday = params.birthday.format('YYYYMMDD');
            }
            if (this.props.isNew) {
                createMember(params, (err) => {
                    this.showNotification(err.toString());
                }, (res) => {
                    const route = Routes[this.props.route.path];
                    Notification.showNotification(this.props.dispatch, route.parent, Globalize.localize('member_created_notification', Globalize.culture()));
                    this.context.router.push(route.parent);
                });
            } else {
                params.update_type = 1;
                updateMember(this.props.params.storeId, this.props.params.memberId, params, (err) => {
                    this.showNotification(err.toString());
                }, (res) => {
                    const route = Routes[this.props.route.path];
                    Notification.showNotification(this.props.dispatch, route.parent, Globalize.localize('member_updated_notification', Globalize.culture()));
                    this.context.router.push(route.parent);
                });
            }
        } else {
            // 必須項目チェック
            let errors = this.checkRequiredItems();
            if (0 < errors.length) {
                let message = Globalize.localize('member_input_form_error_for_required', Globalize.culture());
                message += "\n・" + errors.join("\n・");
                this.showNotification(message);
                return;
            }
            if (this.props.isNew) {
                if (this.state.data.mail_address != this.state.mailCheck.mail_address) {
                    this.showNotification(Globalize.localize('member_input_form_error_for_do_check_mail', Globalize.culture()));
                    return;
                }
                if (this.state.mailCheck.status == MEMBER_EMAIL_CHECK_RESULT_ALREADY_EXIST) {
                    this.showNotification(Globalize.localize('member_input_form_error_for_duplicate_mail', Globalize.culture()));
                    return;
                }
            }

            this.setState({isConfirm: true});
        }
    }

    showNotification(message) {
        Notification.showNotification(this.props.dispatch, this.props.route.path, message);
    }

    getCompanyName() {
        let company = this.props.companies.find((company) => {return company.id == this.state.data.company_id});
        return company ? company.company_name : '';
    }

    getBrandName() {
        let brand = this.props.brands.find((brand) => {return brand.id == this.state.data.brand_id});
        return brand ? brand.brand_name : '';
    }

    getStoreName() {
        let store = this.props.stores.find((store) => {return store.id == this.state.data.store_id});
        return store ? store.store_name : '';
    }

    onChangeBirthdayYear(year) {
        let birthday = this.state.birthday;
        birthday.year = year;
        let data = this.state.data;
        if (birthday.year && birthday.month && birthday.day) {
            data.birthday = moment([birthday.year, birthday.month - 1, birthday.day]);
        } else {
            data.birthday = null;
        }
        this.setState({birthday, data});
    }

    onChangeBirthdayMonth(month) {
        let birthday = this.state.birthday;
        birthday.month = month;
        let data = this.state.data;
        if (birthday.year && birthday.month && birthday.day) {
            data.birthday = moment([birthday.year, birthday.month - 1, birthday.day]);
        } else {
            data.birthday = null;
        }
        this.setState({birthday, data});
    }

    onChangeBirthdayDay(day) {
        let birthday = this.state.birthday;
        birthday.day = day;
        let data = this.state.data;
        if (birthday.year && birthday.month && birthday.day) {
            data.birthday = moment([birthday.year, birthday.month - 1, birthday.day]);
        } else {
            data.birthday = null;
        }
        this.setState({birthday, data});
    }

    getLabel(data, key) {
        let target = data.find((element) => {return element.key == key});
        return target ? target.label : '';
    }

    onUploadCSV(uploadFile) {
        let file = uploadFile;
        this.props.dispatch(doneCustomCreate());
        this.props.dispatch(memberCSVUpload(file, (err) => {
            this.showNotification(err.toString());
        }, (res) => {
            this.showNotification(Globalize.localize('member_csv_upload_succeeded_message', Globalize.culture()));
        }));
    }

    render() {
        const { currentUser, companies, brands, stores, isNew } = this.props;
        const { data, isConfirm, mailCheck, birthday } = this.state;
        let days = getDays(birthday.year, birthday.month);
        return (
            <div>
                <Notification path={this.props.route.path}/>
                {this.props.doCreate ?
                <CSVUploadDialog
                    isOpen={this.props.doCreate}
                    description={Globalize.localize('member_csv_upload_modal_description', Globalize.culture())}
                    onClose={() => {this.props.dispatch(doneCustomCreate())}}
                    onUpload={(uploadFile) => {this.onUploadCSV(uploadFile)}}
                /> : null}
                <dl className="widget widget__page__input">
                    <dt className="widget__page__input__title">
                        <div className="widget__page__type__create"></div>
                        <span className="widget__page__main__title font-base1">
                            {Globalize.localize(isNew ? 'member_input_form_title_register' : 'member_input_form_title_update', Globalize.culture())}
                        </span>
                    </dt>
                    <dt className="widget__page__input__contents">
                        <div className="widget__page__input__contents__table mt20 mb20">
                            <dl>
                                <dt>{Globalize.localize('map_company', Globalize.culture())}</dt>
                                <dd className="widget__page__input__select__target">
                                    {isConfirm || !isNew ? this.getCompanyName() : (currentUser.authority >= USER_AUTHORITY_COMPANY ? currentUser.company_name :
                                        <DropDownList
                                            data={companies}
                                            defaultValue={data.company_id}
                                            hasEmptyOption={true}
                                            onChange={(e) => this.onChangeCompany(e.target.value)}
                                            eachCallback={eachCompany()}/>
                                        )}
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('map_brand', Globalize.culture())}</dt>
                                <dd className="widget__page__input__select__target">
                                    {isConfirm || !isNew ? this.getBrandName() : (currentUser.authority >= USER_AUTHORITY_BRAND ? currentUser.brand_name :
                                        <DropDownList
                                            data={brands}
                                            defaultValue={data.brand_id}
                                            hasEmptyOption={true}
                                            onChange={(e) => this.onChangeBrand(e.target.value)}
                                            eachCallback={eachBrand((brand) => {return brand.company_id === data.company_id})}/>
                                        )}
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('map_store', Globalize.culture())}</dt>
                                <dd className="widget__page__input__select__target">
                                    {isConfirm || !isNew ? this.getStoreName() : (currentUser.authority >= USER_AUTHORITY_STORE ? currentUser.store_name :
                                        <DropDownList
                                            data={stores}
                                            defaultValue={data.store_id}
                                            hasEmptyOption={true}
                                            onChange={(e) => this.onChangeStore(e.target.value)}
                                            eachCallback={eachStore((store) => {return store.brand_id === data.brand_id})}/>
                                        )}
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('member_table_title_mail_address', Globalize.culture())}</dt>
                                <dd>
                                    {isConfirm || !isNew ? data.mail_address :
                                    <div className="widget__page__input__member__register__mail__address">
                                        <input type="text" size="34" maxLength="32" value={data.mail_address} onChange={(e) => this.onChangeEmailAddress(e.target.value)}/>
                                        <div className="widget__page__button__detail" onClick={() => this.onClickEmailCheck()}>
                                            {Globalize.localize('member_input_form_duplicate_check', Globalize.culture())}
                                        </div>
                                        {mailCheck && mailCheck.mail_address && mailCheck.mail_address == data.mail_address ?
                                        <div className="widget__page__input__member__register__mail__address__check__result">
                                            {mailCheck.status == MEMBER_EMAIL_CHECK_RESULT_ALREADY_EXIST ?
                                                <img src="/assets/img/icon-cancel.png" srcSet="/assets/img/icon-cancel@2x.png"/> :
                                                <img src="/assets/img/icon-ok.png" srcSet="/assets/img/icon-ok@2x.png"/>}
                                            {mailCheck.status == MEMBER_EMAIL_CHECK_RESULT_ALREADY_EXIST ?
                                                <span>{Globalize.localize('member_input_form_duplicate_check_duplicate', Globalize.culture())}</span> :
                                                <span>{Globalize.localize('ok', Globalize.culture())}</span>}
                                        </div> : null}
                                    </div>}
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('member_table_title_delivery_condition', Globalize.culture())}</dt>
                                <dd>
                                    {isConfirm ? this.getLabel(this.deliveryConditions, data.mail_reception) :
                                    <DropDownList
                                        data={this.deliveryConditions}
                                        defaultValue={data.mail_reception}
                                        hasEmptyOption={false}
                                        onChange={(e) => this.onChangeDeliveryCondition(e.target.value)}
                                        eachCallback={(element) => <option value={element.key} key={element.key}>{element.label}</option>}/>}
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('member_table_title_delivery_status', Globalize.culture())}</dt>
                                <dd>
                                    {isConfirm ? this.getLabel(this.deliveryStatuses, data.mail_delivery_status) :
                                    <DropDownList
                                        data={this.deliveryStatuses}
                                        defaultValue={data.mail_delivery_status}
                                        hasEmptyOption={false}
                                        onChange={(e) => this.onChangeMailDeliveryStatus(e.target.value)}
                                        eachCallback={(element) => <option value={element.key} key={element.key}>{element.label}</option>}/>}
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('member_table_title_member_status', Globalize.culture())}</dt>
                                <dd>
                                    {isConfirm ? this.getLabel(this.memberStatuses, data.store_member_status) :
                                    <DropDownList
                                        data={this.memberStatuses}
                                        defaultValue={data.store_member_status}
                                        hasEmptyOption={false}
                                        onChange={(e) => this.onChangeMemberStatus(e.target.value)}
                                        eachCallback={(element) => <option value={element.key} key={element.key}>{element.label}</option>}/>}
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('member_search_condition_registered_day', Globalize.culture())}</dt>
                                <dd>
                                    {isConfirm ? (data.member_registration_date ? data.member_registration_date.format(Globalize.localize('display_date_format', Globalize.culture())) : '') :
                                    <DatePicker className={"input__date" + (data.member_registration_date ? " input__date__setted" : "")}
                                                dateFormat={Globalize.localize('display_date_format', Globalize.culture())}
                                                locale='ja'
                                                dateFormatCalendar={Globalize.localize('display_date_year_and_month_format', Globalize.culture())}
                                                tetherConstraints={[]}
                                                readOnly
                                                isClearable={true}
                                                selected={data.member_registration_date}
                                                onChange={(date) => this.onChangeRegistrationDate(date)}
                                                />}
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('member_table_title_member_withdraw_date', Globalize.culture())}</dt>
                                <dd>
                                    {isConfirm ? (data.member_leave_date ? data.member_leave_date.format(Globalize.localize('display_date_format', Globalize.culture())) : '') :
                                    <DatePicker className={"input__date" + (data.member_leave_date ? " input__date__setted" : "")}
                                                dateFormat={Globalize.localize('display_date_format', Globalize.culture())}
                                                locale='ja'
                                                dateFormatCalendar={Globalize.localize('display_date_year_and_month_format', Globalize.culture())}
                                                tetherConstraints={[]}
                                                readOnly
                                                isClearable={true}
                                                selected={data.member_leave_date}
                                                onChange={(date) => this.onChangeLeaveDate(date)}
                                                />}
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('member_search_condition_birthday', Globalize.culture())}</dt>
                                <dd>
                                    {isConfirm ? (data.birthday ? data.birthday.format(Globalize.localize('display_date_format', Globalize.culture())) : '') :
                                    <div className="delivery__birthday__target">
                                        <DropDownList
                                            selectName="delivery__birthday__target__year"
                                            data={this.years}
                                            defaultValue={birthday.year}
                                            hasEmptyOption={true}
                                            onChange={(e) => this.onChangeBirthdayYear(e.target.value)}
                                            eachCallback={(year) => {return <option value={year} key={"birthday_year_" + year}>{year + Globalize.localize('year', Globalize.culture())}</option>}}
                                        />
                                        <DropDownList
                                            selectName="delivery__birthday__target__month"
                                            data={this.months}
                                            defaultValue={birthday.month}
                                            hasEmptyOption={true}
                                            onChange={(e) => this.onChangeBirthdayMonth(e.target.value)}
                                            eachCallback={(month) => {return <option value={month} key={"birthday_month_" + month}>{month + Globalize.localize('month', Globalize.culture())}</option>}}
                                        />
                                        <DropDownList
                                            selectName="delivery__birthday__target__day"
                                            data={days}
                                            defaultValue={birthday.day}
                                            hasEmptyOption={true}
                                            onChange={(e) => this.onChangeBirthdayDay(e.target.value)}
                                            eachCallback={(day) => {return <option value={day} key={"birthday_day_" + day}>{day + Globalize.localize('day', Globalize.culture())}</option>}}
                                        />
                                    </div>}
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('member_search_condition_gender', Globalize.culture())}</dt>
                                <dd>
                                    {isConfirm ? this.getLabel(this.genders, data.gender) :
                                    <DropDownList
                                        data={this.genders}
                                        defaultValue={data.gender}
                                        hasEmptyOption={true}
                                        onChange={(e) => this.onChangeGender(e.target.value)}
                                        eachCallback={(element) => <option value={element.key} key={element.key}>{element.label}</option>}/>}
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('member_search_condition_prefecture', Globalize.culture())}</dt>
                                <dd>
                                    {isConfirm ? this.getLabel(this.prefectures, data.prefecture) :
                                    <DropDownList
                                        data={this.prefectures}
                                        defaultValue={data.prefecture}
                                        hasEmptyOption={true}
                                        onChange={(e) => this.onChangePrefecture(e.target.value)}
                                        eachCallback={(element) => <option value={element.key} key={element.key}>{element.label}</option>}/>}
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('member_search_condition_job', Globalize.culture())}</dt>
                                <dd>
                                    {isConfirm ? this.getLabel(this.jobs, data.job) :
                                    <DropDownList
                                        data={this.jobs}
                                        defaultValue={data.job}
                                        hasEmptyOption={true}
                                        onChange={(e) => this.onChangeJob(e.target.value)}
                                        eachCallback={(element) => <option value={element.key} key={element.key}>{element.label}</option>}/>}
                                </dd>
                            </dl>
                        </div>
                    </dt>
                    <div className="widget__page__input__bottom mb20">
                        {isConfirm ?
                        <button className="btn-gray mr10" onClick={(e) => this.onClickBack(e)}>
                            {Globalize.localize('back', Globalize.culture())}
                        </button> : null}
                        <button className="btn-base" onClick={(e) => this.onClickSubmit(e)}>
                            {Globalize.localize(
                                (this.props.isNew ?
                                    (this.state.isConfirm ? 'confirm_member_create' : 'check_member_create') :
                                    (this.state.isConfirm ? 'confirm_member_update' : 'check_member_update')),
                                Globalize.culture())}
                        </button>
                    </div>
                </dl>
            </div>
        );
    }
}

MemberInputForm.contextTypes = {
    router: React.PropTypes.object,
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        companies: state.currentCompanies,
        brands: state.currentBrands,
        stores: state.currentStores,
        doCreate: state.doCreate,
    };
};

export default connect(mapStateToProps)(MemberInputForm);
