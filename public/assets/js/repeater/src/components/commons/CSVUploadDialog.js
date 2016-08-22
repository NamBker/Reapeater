import React, { Component, PropTypes } from 'react';

import Modal from './Modal';

class CSVUploadDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadFile: null,
        };
    }

    componentWillUnmount() {
        this.setState({uploadFile: null});
    }

    onChangeFile(e) {
        this.setState({uploadFile: e.target.files[0]});
    }

    onClickUpload(e) {
        e.preventDefault();
        if (this.state.uploadFile) {
            this.props.onUpload(this.state.uploadFile);
        }
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen}>
                <div className="dialog widget widget__page__input__dialog__csv__upload">
                    <div className="widget__page__input__dialog__title">
                        <span>{Globalize.localize('csv_upload_modal_title', Globalize.culture())}</span>
                        <div className="widget__page__input__close__btn" onClick={this.props.onClose}/>
                    </div>
                    <div className="widget__page__input__dialog__body">
                        <pre className="message">
                            {this.props.description}
                        </pre>
                        <div className="widget__page__input__dialog__csv__upload__buttons">
                            <div className="widget__page__input__dialog__csv__upload__select__file">
                                <label>
                                    {Globalize.localize('csv_upload_modal_select_file', Globalize.culture())}
                                    <input type="file" accept=".csv" onChange={(e) => this.onChangeFile(e)}/>
                                </label>
                                <span>{this.state.uploadFile ? this.state.uploadFile.name : Globalize.localize('csv_upload_modal_no_select_file', Globalize.culture())}</span>
                            </div>
                            <button className={"btn-base" + (this.state.uploadFile ? "" : " disabled")} onClick={(e) => this.onClickUpload(e)}>
                                {Globalize.localize('upload', Globalize.culture())}
                            </button>
                        </div>
                        <div className="btn-gray" onClick={this.props.onClose}>{Globalize.localize('close', Globalize.culture())}</div>
                    </div>
                </div>
            </Modal>
        );
    }
}

CSVUploadDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onUpload: PropTypes.func.isRequired,
};

export default CSVUploadDialog;
