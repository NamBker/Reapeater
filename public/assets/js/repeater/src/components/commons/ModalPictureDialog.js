import React, { Component, PropTypes } from 'react';

class ModalPictureDialog extends Component {
    render() {
        if (this.props.isOpen) {
            return (
                <div className="modal">
                    <div className="masking" style={{opacity: 1, display: 'block'}}></div>
                    <section className="modal-picturedialog-window">
                        <div className="wrap">
                            {this.props.children}
                        </div>
                    </section>
                </div>
            );
        } else {
            return null;
        }
    }
}

ModalPictureDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired
};

export default ModalPictureDialog;
