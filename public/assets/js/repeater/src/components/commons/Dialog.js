import React, { Component, PropTypes } from 'react';
import Modal from './Modal'

class Dialog extends Component {
    render() {
        return (
            <Modal isOpen={this.props.isOpen}>
                <div className="wrap">
                    <div className="dialog">
                        <div className="dialog__title"><pre>{this.props.title}</pre></div>
                        <div className="dialog__content"><pre>{this.props.content}</pre></div>
                        <div className="dialog__button">
                            <a onClick={this.props.closeDialog}>いいえ</a>
                            <a onClick={this.props.confirmOK}>はい</a>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}

Dialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    closeDialog: PropTypes.func.isRequired,
    confirmOK: PropTypes.func.isRequired,
};

export default Dialog;
