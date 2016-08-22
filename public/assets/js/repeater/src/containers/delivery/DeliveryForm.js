import React, { Component, PropTypes } from 'react';
import moment from 'moment';

// import constants
import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE } from '../../constants/Constants';
import { DELIVERY_STATUS_DRAFT, DELIVERY_STATUS_UNDELIVERED } from '../../constants/Constants';
import { DELIVERY_TYPE_MAIL } from '../../constants/Constants';
import { DELIVERY_DEVICE_ALL } from '../../constants/Constants';

// import actions
import { fetchUserInfo } from '../../actions/user';
import { sendTestMail } from '../../actions/mail';
import { fetchDeliveryDetail, createDelivery, updateDelivery } from '../../actions/delivery';
import { isEmailAddress } from '../../utils/CommonUtils';

// import self defined components
import Dialog from '../../components/commons/Dialog';
import Target from './deliveryform/Target';
import Segment from './deliveryform/Segment';
import Head from './deliveryform/Head';
import Body from './deliveryform/Body';
import PreviewDialog from './deliveryform/PreviewDialog';
import Notification from '../../components/commons/Notification';
import Routes from '../../constants/Routes';

class DeliveryForm extends Component {

    initState() {
        const { currentUser } = this.props;
        return {
            isNew:false,
            data: {
                delivery_store_ids: currentUser && USER_AUTHORITY_STORE <= currentUser.authority ? [currentUser.store_id] : [],
                delivery_segment: '',
                delivery_sender_name: '',
                delivery_sender_address: '',
                delivery_title: '',
                delivery_html_body: '',
                delivery_text_body: '',
                delivery_schedule: '',
                delivery_status: DELIVERY_STATUS_DRAFT,
                delivery_type: DELIVERY_TYPE_MAIL,
                delivery_device: DELIVERY_DEVICE_ALL,
            },
            parameterNames: {},
            segment: {
                memberRegisterDay: {
                    isChecked: false,
                    from: null,
                    to: null,
                },
                lastMailSentDay: {
                    isChecked: false,
                    from: null,
                    to: null,
                },
                gender: {
                    isChecked: false,
                    selectedItems: [],
                },
                birthday: {
                    isChecked: false,
                    target: {
                        year: "",
                        month: "",
                        day: "",
                    },
                    range: {
                        from: null,
                        to: null,
                    },
                },
            },
            filter: {
                delivery_company_id: currentUser && USER_AUTHORITY_COMPANY <= currentUser.authority ? currentUser.company_id : 0,
                delivery_brand_ids: currentUser && USER_AUTHORITY_BRAND <= currentUser.authority ? [currentUser.brand_id] : [],
                selectedAreas: {
                    1 : 0,
                    2 : 0,
                    3 : 0,
                },
            },
            popup: {
                showPreview: false,
                showSendTestMail: false,
            },
            confirm: {
                showTargetReset: false,
                showPreview: false,
            },
            isSending: false,
            isShowSegment: false,
        };
    }

    constructor(props) {
        super(props);
        this.state = this.initState();
        this.state.isNew = props.isNew;
    }

    componentDidMount() {
        this.props.dispatch(fetchUserInfo());
        if (this.props.params.hasOwnProperty('deliveryId')) {
            fetchDeliveryDetail(this.props.params.deliveryId, (err) => {
                this.showNotification(err.toString());
            }, (res) => {
                let filter = this.state.filter;
                let data = Object.assign({}, res.delivery);
                data.delivery_store_ids.forEach((store_id) => {
                    let store = this.props.stores.find(store => store.id == store_id);
                    if (store) {
                        if (filter.delivery_company_id == 0) {
                            filter.delivery_company_id = store.company_id;
                        } else if (filter.delivery_company_id != store.company_id) {
                            // エラー企業をまたいた設定はできない
                            this.showNotification(Globalize.localize('delivery_add_error_for_cross_company', Globalize.culture()));
                        }
                        if (filter.delivery_brand_ids.indexOf(store.brand_id) < 0) {
                            filter.delivery_brand_ids.push(store.brand_id);
                        }
                    }
                });
                data.delivery_html_body = data.delivery_html_body.replace(/<br\/>/g, '\n');
                let tmp = JSON.parse(res.delivery.delivery_segment);
                let segment = this.initState().segment;
                if (tmp.hasOwnProperty('memberRegisterDay')) {
                    segment.memberRegisterDay.isChecked = true;
                    if (tmp['memberRegisterDay'].hasOwnProperty('from')) {
                        segment.memberRegisterDay.from = moment(tmp['memberRegisterDay']['from'], 'YYYY-MM-DD');
                    }
                    if (tmp['memberRegisterDay'].hasOwnProperty('to')) {
                        segment.memberRegisterDay.to = moment(tmp['memberRegisterDay']['to'], 'YYYY-MM-DD');
                    }
                }
                if (tmp.hasOwnProperty('lastMailSentDay')) {
                    segment.lastMailSentDay.isChecked = true;
                    if (tmp['lastMailSentDay'].hasOwnProperty('from')) {
                        segment.lastMailSentDay.from = moment(tmp['lastMailSentDay']['from'], 'YYYY-MM-DD');
                    }
                    if (tmp['lastMailSentDay'].hasOwnProperty('to')) {
                        segment.lastMailSentDay.to = moment(tmp['lastMailSentDay']['to'], 'YYYY-MM-DD');
                    }
                }
                if (tmp.hasOwnProperty('gender')) {
                    segment.gender.isChecked = true;
                    segment.gender.selectedItems = Object.assign([], tmp['gender']);
                }
                if (tmp.hasOwnProperty('birthday')) {
                    segment.birthday.isChecked = true;
                    segment.birthday.target = Object.assign({}, tmp['birthday']['target']);
                    if (tmp['birthday'].hasOwnProperty('range')) {
                        segment.birthday.range.from = moment(tmp['birthday']['range']['from'], 'YYYY-MM-DD');
                        segment.birthday.range.to = moment(tmp['birthday']['range']['to'], 'YYYY-MM-DD');
                    }
                }
                this.setState({filter, data, segment});
            });
        }
    }

    componentWillUnmount() {
    }

    onClosePopup() {
        let state = this.initState();
        this.setState({popup: state.popup});
    }

    onCloseConfirm() {
        let state = this.initState();
        this.setState({confirm: state.confirm});
    }

    onResetTarget() {
        let state = this.initState();
        state.data.delivery_store_ids = this.state.data.delivery_store_ids;
        state.filter = this.state.filter;
        this.setState(state);
    }

    onChangeFilter(filter) {
        this.setState({filter: filter});
    }

    onChangeFilterAndData(filter, data) {
        this.setState({filter: filter, data: data});
    }

    onChangeSegment(segment) {
        this.setState({segment: segment});
    }

    onChangeData(data) {
        this.setState({data: data});
    }

    checkSendable(body) {
        let errors_not_null = [];
        let errors_format = [];
        const { segment, data } = this.state;
        if (data.delivery_store_ids.length < 1) {
            errors_not_null.push(Globalize.localize('map_store', Globalize.culture()));
        }
        if (segment.birthday.isChecked) {
            if ((segment.birthday.range.from == null || segment.birthday.range.to == null) && segment.birthday.range.from != segment.birthday.range.to) {
                errors_format.push(Globalize.localize('delivery_add_error_birthday_range', Globalize.culture()))
            }
        }
        if (data.delivery_sender_name.length < 1) {
            errors_not_null.push(Globalize.localize('delivery_add_send_name', Globalize.culture()));
        }
        if (data.delivery_sender_address.length < 1) {
            errors_not_null.push(Globalize.localize('delivery_add_send_address', Globalize.culture()));
        } else if (!isEmailAddress(data.delivery_sender_address)) {
            errors_format.push(Globalize.localize('delivery_add_send_address', Globalize.culture()));
        }
        if (data.delivery_title.length < 1) {
            errors_not_null.push(Globalize.localize('delivery_add_send_title', Globalize.culture()));
        }
        if (body.html.length < 1) {
            errors_not_null.push(Globalize.localize('delivery_add_html_body', Globalize.culture()));
        }
        if (body.text.length < 1) {
            errors_not_null.push(Globalize.localize('delivery_add_text_body', Globalize.culture()));
        }
        let errorMessage = '';
        if (0 < errors_not_null.length) {
            errorMessage += Globalize.localize('delivery_add_error_for_not_null', Globalize.culture()) + '\n・' + errors_not_null.join('\n・');
        }
        if (0 < errors_format.length) {
            if (0 < errorMessage.length) {
                errorMessage += '\n\n';
            }
            errorMessage += Globalize.localize('delivery_add_error_for_format', Globalize.culture()) + '\n・' + errors_format.join('\n・');
        }
        if (0 < errorMessage.length) {
            this.showNotification(errorMessage);
            return false;
        }
        return true;
    }

    onSendTestMail(body, toAddresses) {
        this.setState({isSending: true}, () => {
            const { data } = this.state;
            let parameters = {
                delivery_sender_name: data.delivery_sender_name,
                delivery_sender_address: data.delivery_sender_address,
                delivery_title: data.delivery_title,
                delivery_html_body: body.html.replace(/\n/g, '<br/>'),
                delivery_text_body: body.text,
                delivery_send_to_addresses: toAddresses,
                delivery_store_ids: data.delivery_store_ids,
            };
            this.props.dispatch(sendTestMail(parameters, (err) => {
                    this.setState({isSending: false}, () => this.showNotification(err, false));
                },
                (res) => {
                    this.setState({isSending: false}, () => this.showNotification(Globalize.localize('delivery_add_send_test_mail_success_message', Globalize.culture()) + '\n' + toAddresses.join(", ")));
                })
            );
        });
    }

    onClickShowPreview(body, parameterNames) {
        let confirm = this.state.confirm;
        confirm.showPreview = true;
        let data = this.state.data;
        data.delivery_html_body = body.html.replace(/\n/g, '<br/>');
        data.delivery_text_body = body.text;
        let segment = this.state.segment;
        if (segment.memberRegisterDay.isChecked && segment.memberRegisterDay.from == null && segment.memberRegisterDay.to == null) {
            segment.memberRegisterDay.isChecked = false;
        }
        if (segment.lastMailSentDay.isChecked && segment.lastMailSentDay.from == null && segment.lastMailSentDay.to == null) {
            segment.lastMailSentDay.isChecked = false;
        }
        if (segment.gender.isChecked && segment.gender.selectedItems.length < 1) {
            segment.gender.isChecked = false;
        }
        if (segment.birthday.isChecked) {
            if (segment.birthday.target.year == '' && segment.birthday.target.month == '' && segment.birthday.target.day == '' &&
                segment.birthday.range.from == null && segment.birthday.range.to == null) {
                segment.birthday.isChecked = false;
            }
        }
        this.setState({confirm: confirm, data: data, segment: segment, parameterNames: parameterNames});
    }

    onClosePreview() {
        let confirm = this.state.confirm;
        confirm.showPreview = false;
        this.setState({confirm: confirm});
    }

    onSaveDelivery(delivery_schedule) {
        let data = this.state.data;
        switch(delivery_schedule) {
        case 'draft':
            data.delivery_status = DELIVERY_STATUS_DRAFT;
            data.delivery_schedule = '';
            break;
        case 'now':
        default:
            data.delivery_status = DELIVERY_STATUS_UNDELIVERED;
            data.delivery_schedule = delivery_schedule;
            break;
        }
        const { segment } = this.state;
        let segmentJSONData = {};
        if (segment.memberRegisterDay.isChecked) {
            segmentJSONData['memberRegisterDay'] = {};
            if (segment.memberRegisterDay.from) {
                segmentJSONData['memberRegisterDay']['from'] = segment.memberRegisterDay.from.format('YYYY-MM-DD');
            }
            if (segment.memberRegisterDay.to) {
                segmentJSONData['memberRegisterDay']['to'] = segment.memberRegisterDay.to.format('YYYY-MM-DD');
            }
        }
        if (segment.lastMailSentDay.isChecked) {
            segmentJSONData['lastMailSentDay'] = {};
            if (segment.lastMailSentDay.from) {
                segmentJSONData['lastMailSentDay']['from'] = segment.lastMailSentDay.from.format('YYYY-MM-DD');
            }
            if (segment.lastMailSentDay.to) {
                segmentJSONData['lastMailSentDay']['to'] = segment.lastMailSentDay.to.format('YYYY-MM-DD');
            }
        }
        if (segment.gender.isChecked) {
            segmentJSONData['gender'] = Object.assign([], segment.gender.selectedItems);
        }
        if (segment.birthday.isChecked) {
            segmentJSONData['birthday'] = {};
            if (segment.birthday.target.year || segment.birthday.target.month || segment.birthday.target.day) {
                segmentJSONData['birthday']['target'] = {};
                if (segment.birthday.target.year) {
                    segmentJSONData['birthday']['target']['year'] = segment.birthday.target.year;
                }
                if (segment.birthday.target.month) {
                    segmentJSONData['birthday']['target']['month'] = segment.birthday.target.month;
                }
                if (segment.birthday.target.day) {
                    segmentJSONData['birthday']['target']['day'] = segment.birthday.target.day;
                }
            }
            if (segment.birthday.range.from || segment.birthday.range.to) {
                segmentJSONData['birthday']['range'] = {};
                if (segment.birthday.range.from) {
                    segmentJSONData['birthday']['range']['from'] = segment.birthday.range.from.format('YYYY-MM-DD');
                }
                if (segment.birthday.range.to) {
                    segmentJSONData['birthday']['range']['to'] = segment.birthday.range.to.format('YYYY-MM-DD');
                }
            }
        }
        data.delivery_segment = JSON.stringify(segmentJSONData);
        let confirm = this.state.confirm;
        confirm.showPreview = false;
        this.setState({data: data, confirm: confirm}, () => {
            if (this.props.isNew) {
                this.props.dispatch(createDelivery(data,
                    (err) => {
                        this.showNotification(err.toString());
                    },
                    (res) => this.onSaved(res))
                );
            } else {
                this.props.dispatch(updateDelivery(this.props.params.deliveryId, data,
                    (err) => {
                        this.showNotification(err.toString());
                    },
                    (res) => this.onSaved(res))
                );
            }
        });
    }

    onSaved(res) {
        const route = Routes[this.props.route.path];
        let parentPath = route.parent;
        Notification.showNotification(this.props.dispatch, parentPath, Globalize.localize(this.props.isNew ? 'delivery_add_successed_to_add' : 'delivery_add_successed_to_update', Globalize.culture()));
        this.context.router.push('/delivery');
    }

    showNotification(message, isSuccess = true) {
        Notification.showNotification(this.props.dispatch, this.props.route.path, message, isSuccess);
    }

    render() {
        return (
            <div>
                <Notification path={this.props.route.path}/>
                <dl className="widget widget__page__input">
                    <div>
                        <Dialog
                            isOpen={this.state.confirm.showTargetReset}
                            title={Globalize.localize('delivery_add_unfix_target_confirm', Globalize.culture())}
                            content=""
                            closeDialog={() => this.onCloseConfirm()}
                            confirmOK={() => this.onResetTarget()}
                        />
                    </div>
                    <div>
                        {this.state.confirm.showPreview ?
                        <PreviewDialog
                            stores={this.props.stores}
                            data={this.state.data}
                            parameterNames={this.state.parameterNames}
                            segment={this.state.segment}
                            isOpen={this.state.confirm.showPreview}
                            onClose={() => this.onClosePreview()}
                            onSave={(schedule) => this.onSaveDelivery(schedule)}
                        />
                        : null}
                    </div>
                    <dt className="widget__page__input__title">
                        <div className="widget__page__type__create"></div>
                        <span className="widget__page__main__title font-base1">
                            {Globalize.localize(this.props.isNew ? 'delivery_add_description' : 'delivery_edit_description', Globalize.culture())}
                        </span>
                    </dt>
                    <Target
                        isNew={this.state.isNew}
                        currentUser={this.props.currentUser}
                        companies={this.props.companies}
                        brands={this.props.brands}
                        areas={this.props.areas}
                        stores={this.props.stores}
                        filter={this.state.filter}
                        data={this.state.data}
                        onChangeFilter={(filter) => this.onChangeFilter(filter)}
                        onChangeData={(data) => this.onChangeData(data)}
                        onChangeFilterAndData={(filter, data) => this.onChangeFilterAndData(filter, data)}
                    />
                    <Segment
                        segment={this.state.segment}
                        errors={this.state.errors}
                        onChangeSegment={(segment) => this.onChangeSegment(segment)}
                    />
                    <Head
                        data={this.state.data}
                        errors={this.state.errors}
                        onChangeData={(data) => this.onChangeData(data)}
                    />
                    <Body
                        isNew={this.state.isNew}
                        data={this.state.data}
                        onSendTestMail={(body, toAddresses) => this.onSendTestMail(body, toAddresses)}
                        onClickShowPreview={(body, parameterNames) => this.onClickShowPreview(body, parameterNames)}
                        checkSendable={(body) => this.checkSendable(body)}
                        isSending={this.state.isSending}
                    />
                </dl>
            </div>
        );
    }
}

export default DeliveryForm;
