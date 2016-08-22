import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import striptags from 'striptags';
import LoadingIndicator from 'react-loading-indicator';

import { USER_AUTHORITY_SECTION, GET_NAME_ONLY_PATTERN, GET_DISPLAY_ITEMS_ONLY_PATTERN } from '../../../constants/Constants';
import HelpButton from '../../../components/commons/HelpButton';
import DropDownMenu from '../../../components/commons/DropDownMenu';
import Dialog from '../../../components/commons/Dialog';
import TestMailSendDialog from './TestMailSendDialog';
import SelectPicture from '../../../components/SelectPicture';

import { fetchPictures } from '../../../actions/picture';
import { fetchCoupons } from '../../../actions/coupon';
import { fetchRandomCoupons } from '../../../actions/randomCoupon';
import { fetchQuestionnaires } from '../../../actions/questionnaire';

class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showHTMLCopy: false,
            showSendTestMail: false,
            selectedTab: 0,
            body: {
                html: '',
                text: '',
            },
            isShowSelectPicture: false,
        };
        this.formalParameterMenuItems = [
            {'label': Globalize.localize('delivery_add_add_formal_parameter_brand_name', Globalize.culture()),
             'value': '{user_registered_brand_name}'},
            {'label': Globalize.localize('delivery_add_add_formal_parameter_store_name', Globalize.culture()),
             'value': '{user_registered_store_name}'},
            {'label': Globalize.localize('delivery_add_add_formal_parameter_store_manager_name', Globalize.culture()),
             'value': '{user_registered_store_manager_name}'},
            {'label': Globalize.localize('delivery_add_add_formal_parameter_store_phone_no', Globalize.culture()),
             'value': '{user_registered_store_phone_no}'},
        ]
    }

    componentDidMount() {
        if (this.props.currentUser.authority <= USER_AUTHORITY_SECTION) {
            this.props.dispatch(fetchPictures({pattern: GET_DISPLAY_ITEMS_ONLY_PATTERN}));
            this.props.dispatch(fetchCoupons({pattern: GET_NAME_ONLY_PATTERN}), (err) => {
            }, (res) => {});
            this.props.dispatch(fetchRandomCoupons({pattern: GET_NAME_ONLY_PATTERN}, (err) => {
            }, (res) => {}));
            this.props.dispatch(fetchQuestionnaires({pattern: GET_NAME_ONLY_PATTERN}, (err) => {
            }, (res) => {}));
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.isNew && Object.keys(this.props.data.delivery_html_body).length < 1 && 0 < Object.keys(nextProps.data.delivery_html_body).length) {
            let body = {
                html: nextProps.data.delivery_html_body,
                text: nextProps.data.delivery_text_body,
            }
            this.setState({body: body});
        }
    }

    onClickShowSelectPicture() {
        this.setState({isShowSelectPicture: true});
    }

    onSelectedPicture(pictureInfo) {
        this.addStringToBody("{picture: " + pictureInfo.id + "}");
    }

    onSelectedFormalParameter(param) {
        this.addStringToBody(param);
    }

    onSelectedCoupon(couponId) {
        this.addStringToBody("{coupon: " + couponId + "}");
    }

    onSelectedRandomCoupon(randomCouponId) {
        this.addStringToBody("{random_coupon: " + randomCouponId + "}");
    }

    onSelectedQuestionnaire(questionnaireId) {
        this.addStringToBody("{questionnaire: " + questionnaireId + "}");
    }

    addStringToBody(string) {
        let bodyNode = ReactDOM.findDOMNode(this.refs.delivery__add__body);
        let pos = bodyNode.selectionStart
        let context = bodyNode.value;
        bodyNode.value = context.substring(0, pos) + string + context.substring(pos, context.length);

        let newPos = pos + string.length;
        if (bodyNode.setSelectionRange) {
            bodyNode.focus();
            bodyNode.setSelectionRange(newPos, newPos);
        } else {
            let range = bodyNode.createTextRange();
            range.collapse(true);
            range.moveEnd('character', newPos);
            range.moveStart('character', newPos);
            range.select();
        }
        this.onChangeBody(bodyNode.value);
    }

    onClickTab(selectedTab) {
        if (selectedTab === this.state.selectedTab) {
            return;
        }
        this.setState({selectedTab: selectedTab}, () => {
            let bodyNode = ReactDOM.findDOMNode(this.refs.delivery__add__body);
            let body = this.state.body;
            bodyNode.value = selectedTab == 0 ? body.html : body.text;
        });
    }

    onCloseConfirm() {
        this.setState({showHTMLCopy: false});
    }

    onClickTextCopy() {
        // アラートを表示する。
        this.setState({showHTMLCopy: true});
    }

    onCopyHTMLToText() {
        let body = this.state.body;
        let bodyNode = ReactDOM.findDOMNode(this.refs.delivery__add__body);
        if (this.state.selectedTab == 0) {
            body.html = bodyNode.value;
        }
        body.text = striptags(body.html);
        // 画像を削除
        body.text = body.text.replace(/{picture: [1-9][0-9]*}/g, (match) => {return ""});
        this.setState({selectedTab: 1, body: body, showHTMLCopy: false});
    }

    onChangeBody(value) {
        let body = this.state.body;
        if (this.state.selectedTab == 0) {
            body.html = value;
        } else {
            body.text = value;
        }
        this.setState({body: body});
    }

    onClickSendTestMail() {
        if (this.props.checkSendable(this.state.body)) {
            this.setState({showSendTestMail: true});
        }
    }

    onCloseSendTestMail() {
        this.setState({showSendTestMail: false});
    }

    onSendTestMail(addresses) {
        this.setState({showSendTestMail: false}, () => {
            this.props.onSendTestMail(this.state.body, addresses);
        });
    }

    onClickShowPreview() {
        if (this.props.checkSendable(this.state.body)) {
            let parameterNames = {
                coupon: {},
                random_coupon: {},
                questionnaire: {},
            };
            this.getParameterName(this.state.body.html, parameterNames);
            this.getParameterName(this.state.body.text, parameterNames);
            this.props.onClickShowPreview({
                html: this.state.body.html,
                text: striptags(this.state.body.text).replace(/{picture: [1-9][0-9]*}/g, (match) => {return ""}),
            }, parameterNames);
        }
    }

    getParameterName(content, matched) {
        content.replace(/{([a-z][[a-z_]+[a-z])((: )([1-9][0-9]*)){0,1}}/g, (match, p1, p2, p3, p4, offset, string) => {
            switch(p1) {
            case 'coupon':
                if (this.props.coupons && p4) {
                    this.props.coupons.map((coupon) => {if (coupon.id == p4) matched['coupon'][p4] = coupon.coupon_name;});
                }
                break;
            case 'random_coupon':
                if (this.props.randomCoupons && p4) {
                    this.props.randomCoupons.map((random_coupon) => {if (random_coupon.id == p4) matched['random_coupon'][p4] = random_coupon.random_coupon_name;});
                }
                break;
            case 'questionnaire':
                if (this.props.questionnaires && p4) {
                    this.props.questionnaires.map((questionnaire) => {if (questionnaire.id == p4) matched['questionnaire'][p4] = questionnaire.questionnaire_name;});
                }
                break;
            }
        });
    }

    onCloseSelectPicture() {
        this.setState({isShowSelectPicture: false});
    }

    render() {
        const { data } = this.props;
        return (
            <dt className="widget__page__input__contents">
                {this.state.isShowSelectPicture ?
                <SelectPicture
                    isOpen={this.state.isShowSelectPicture}
                    title={Globalize.localize('select_picture_title', Globalize.culture())}
                    closeDialog={() => this.onCloseSelectPicture()}
                    onSelectedPicture={(pictureInfo) => this.onSelectedPicture(pictureInfo)}
                /> : null}
                <div>
                    <Dialog
                        isOpen={this.state.showHTMLCopy}
                        title={Globalize.localize('delivery_add_html_copy_confirm_message', Globalize.culture())}
                        content=""
                        closeDialog={() => this.onCloseConfirm()}
                        confirmOK={() => this.onCopyHTMLToText()}
                    />
                </div>
                <div>
                    <TestMailSendDialog
                        isOpen={this.state.showSendTestMail}
                        onClose={() => this.onCloseSendTestMail()}
                        onSend={(address) => this.onSendTestMail(address)}
                    />
                </div>
                <div className="delivery__add__body__options mb20">
                    <div className="delivery__add__body__picture" onClick={() => this.onClickShowSelectPicture()}>
                        {Globalize.localize('delivery_add_add_picture', Globalize.culture())}
                    </div>
                    <DropDownMenu
                        buttonTitle={Globalize.localize('delivery_add_add_formal_parameter', Globalize.culture())}
                        menuItems={this.formalParameterMenuItems}
                        onMenuSelected={(value) => this.onSelectedFormalParameter(value)}
                    />
                    {this.props.currentUser.authority <= USER_AUTHORITY_SECTION ?
                        /* クーポン */
                    <DropDownMenu
                        buttonTitle={Globalize.localize('delivery_add_add_coupon', Globalize.culture())}
                        menuItems={this.props.coupons}
                        disableWhenNoData={true}
                        labelKey={"coupon_name"}
                        valueKey={"id"}
                        onMenuSelected={(value) => this.onSelectedCoupon(value)}
                    />
                    : null}
                    {this.props.currentUser.authority <= USER_AUTHORITY_SECTION ?
                        /* ランダムクーポン*/
                    <DropDownMenu
                        buttonTitle={Globalize.localize('deiivery_add_add_random_coupon', Globalize.culture())}
                        menuItems={this.props.randomCoupons}
                        disableWhenNoData={true}
                        labelKey={"random_coupon_name"}
                        valueKey={"id"}
                        onMenuSelected={(value) => this.onSelectedRandomCoupon(value)}
                    />
                    : null}
                    {this.props.currentUser.authority <= USER_AUTHORITY_SECTION ?
                        /* アンケート */
                    <DropDownMenu
                        buttonTitle={Globalize.localize('delivery_add_add_questionnaire', Globalize.culture())}
                        menuItems={this.props.questionnaires}
                        disableWhenNoData={true}
                        labelKey={"questionnaire_name"}
                        valueKey={"id"}
                        onMenuSelected={(value) => this.onSelectedQuestionnaire(value)}
                    />
                    : null}
                </div>
                <div className="widget__page__input__contents__table mb20">
                    <dl className="delivery__add__body__title">
                        <div>
                            <div
                                className={"delivery__add__body__tab" + (this.state.selectedTab == 0 ? " body__tab__selected" : "")}
                                onClick={() => this.onClickTab(0)}>
                                <span>{Globalize.localize('delivery_add_html_body', Globalize.culture())}</span>
                            </div>
                            <div
                                className={"delivery__add__body__tab"  + (this.state.selectedTab == 1 ? " body__tab__selected" : "")}
                                onClick={() => this.onClickTab(1)}>
                                <span>{Globalize.localize('delivery_add_text_body', Globalize.culture())}</span>
                            </div>
                            <div
                                className="delivery__add__body__copy__btn"
                                onClick={() => this.onClickTextCopy()}>
                                <span>{Globalize.localize('delivery_add_copy_html_to_text', Globalize.culture())}</span>
                            </div>
                        </div>
                    </dl>
                    <textarea
                        className="delivery__add__body"
                        ref="delivery__add__body"
                        onChange={(e) => this.onChangeBody(e.target.value)}
                        value={this.state.selectedTab == 0 ? this.state.body.html : this.state.body.text}
                    />
                </div>
                <HelpButton
                    buttonTitle={Globalize.localize('delivery_add_help_mail_rule', Globalize.culture())}
                    helpContext={Globalize.localize('delivery_add_help_mail_rule_context', Globalize.culture())}
                />
                <div className="delivery__submit__buttons">
                    <div>
                        <div className={"btn-gray" + (this.state.isSending ? " disabled" : "")}
                            onClick={() => this.onClickSendTestMail()}>
                            {this.state.isSending ?
                                <LoadingIndicator />
                             : Globalize.localize('delivery_add_sending_test_mail', Globalize.culture())}
                        </div>
                        <div className="btn-base" onClick={() => this.onClickShowPreview()}>
                            {Globalize.localize('delivery_add_confirm_with_preview', Globalize.culture())}
                        </div>
                    </div>
                </div>
            </dt>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        coupons: state.coupons,
        randomCoupons: state.randomCoupons,
        questionnaires: state.questionnaires,
        currentUser: state.currentUser,
    }
};

export default connect(mapStateToProps)(Body);
