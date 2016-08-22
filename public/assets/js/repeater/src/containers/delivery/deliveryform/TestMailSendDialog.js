import React, { Component, PropTypes } from 'react';

import Modal from '../../../components/commons/Modal';

import { isEmailAddress } from '../../../utils/CommonUtils';

class TestMailSendDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sendMailAddress: '',
            errorMessage: '',
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isOpen != this.props.isOpen) {
            this.setState({sendMailAddress: '', errorMessage: ''});
        }
    }

    onSendTestMail() {
        // メールアドレスチェック
        let inputMailAddress = this.state.sendMailAddress;
        let errors = [];
        let mailAddresses = inputMailAddress.split(',').map((term) => {
            let tmp = term.trim();
            if (isEmailAddress(tmp)) {
                return tmp;
            } else {
                errors.push(tmp);
            }
        });
        if (errors.length < 1) {
            this.props.onSend(mailAddresses);
        } else {
            // メールアドレスにエラーがある
            let errorMessage = Globalize.localize('delivery_add_send_test_mail_dialog_email_validation_error', Globalize.culture()) + "\n" + errors.join(", ");
            this.setState({errorMessage: errorMessage});
        }
    }

    onChangeMailAddress(address) {
        this.setState({sendMailAddress: address});
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen}>
                <div className="dialog widget widget__page__input__dialog__send__test__mail">
                    <div className="widget__page__input__dialog__title">
                        <span>{Globalize.localize('delivery_add_send_test_mail_dialog_title', Globalize.culture())}</span>
                        <div className="widget__page__input__close__btn" onClick={this.props.onClose}/>
                    </div>
                    <div className="widget__page__input__dialog__body">
                        <pre className="message">
                            {Globalize.localize('delivery_add_send_test_mail_dialog_message', Globalize.culture())}
                        </pre>
                        <pre className="detail mb20">
                            {Globalize.localize('delivery_add_send_test_mail_dialog_message_detail', Globalize.culture())}
                        </pre>
                        {0 < this.state.errorMessage.length ?
                        <div className="error__message mb10">
                            <pre>
                                {this.state.errorMessage}
                            </pre>
                        </div>
                        : null}
                        <div className="send__input__and__button mb20">
                            <input className="" type="text" onChange={(e) => this.onChangeMailAddress(e.target.value)} value={this.state.sendMailAddress}/>
                            <div className={"btn-base" + (this.state.sendMailAddress.length < 1 ? " disabled" : "")} onClick={() => this.onSendTestMail()}>{Globalize.localize('send', Globalize.culture())}</div>
                        </div>
                        <div className="btn-gray" onClick={this.props.onClose}>{Globalize.localize('close', Globalize.culture())}</div>
                    </div>
                </div>
            </Modal>
        );
    }
}

TestMailSendDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSend: PropTypes.func.isRequired,
};

export default TestMailSendDialog;
