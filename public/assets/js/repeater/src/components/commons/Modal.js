import React, { Component, PropTypes } from 'react';

class Modal extends Component {
    render() {
        if (this.props.isOpen) {
            return (
                <div className="modal">
                    <div className="masking" style={{opacity: 1, display: 'block'}}></div>
                    <section className="modal-window">
                        {this.props.children}
                    </section>
                </div>
            );
        } else {
            return null;
        }
    }
}

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    classModal: PropTypes.string,
};

export default Modal;
