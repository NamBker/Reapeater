import React, { Component, PropTypes } from 'react';

import Modal from './Modal';

class HelpButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openHelpModal: false,
        };
    }

    onShowHelpModal(e) {
        this.setState({openHelpModal: true});
    }

    onCloseHelpModal(e) {
        this.setState({openHelpModal: false});
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.state.openHelpModal}>
                    <div className="dialog widget common__component__help__dialog">
                            <pre>{this.props.helpContext}</pre>
                            <div className="btn-gray" onClick={(e) => this.onCloseHelpModal(e)}>{Globalize.localize('close', Globalize.culture())}</div>
                    </div>
                </Modal>
                <div className="common__component__help__btn" onClick={(e) => this.onShowHelpModal(e)}>
                    <img src="/assets/img/help.png" srcSet="/assets/img/help@2x.png 2x"/>
                    {0 < this.props.buttonTitle.length ?
                        <span>{this.props.buttonTitle}</span>
                        : null
                    }
                </div>
            </div>
        );
    }
}

HelpButton.propTypes = {
    buttonTitle: PropTypes.string,
    helpContext: PropTypes.string.isRequired,
};

HelpButton.defaultProps = {
    buttonTitle: "",
}

export default HelpButton;
