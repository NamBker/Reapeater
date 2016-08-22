import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Modal from '../../components/commons/Modal'
import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE, PER_PAGE } from '../../constants/Constants'
import * as Const from '../../constants/Constants';

import { pictureUpload } from '../../actions/picture';
var uploadPicture = null;
var filter = null;
var closeDialog = null;

class CreateDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            picture_preview_url: '',
        };
        this.onClickPictureImport      = this.onClickPictureImport.bind(this);
    }

        componentWillReceiveProps(nextProps) {
            if (this.props.isOpen != nextProps.isOpen) {
                this.setState({picture_preview_url: ''});
            }
        }

    onClickPictureImport(e) {
        e.preventDefault();

        let limit = 3145728;
        uploadPicture = e.target.files[0];

        if (uploadPicture.type !== 'image/jpeg' && uploadPicture.type !== 'image/png' && uploadPicture.type !== 'image/gif') {
            alert('png, gif, jpeg, jpg 以外のファイルは扱えません。')
            uploadPicture = '';
            retrun;
        }

        if (limit < uploadPicture.size) {
            alert('3MBを超えています。 3MB以下のファイルを選択してください。')
            uploadPicture = '';
            retrun;
        }

        if (!uploadPicture) {
            this.state.picture_preview_url = null;
        }

        let reader = new FileReader();
        let picture = this.state.picture;

        reader.onloadend = () => {
            this.state.picture_preview_url = reader.result; 
            this.setState({picture: picture});
        }

        reader.readAsDataURL(uploadPicture);
    }

    onClickUpload(e) {
        filter = this.props.filter;
        closeDialog = this.props.closeDialog;

        this.props.pictureUpload();
    }

    render() {

        const { companies, brands, currentUser, onSubmit } =  this.props;
        let previewPicture = null;
        if (!this.state.picture_preview_url) {
            uploadPicture  = null;
            previewPicture = null;
        } else {
            previewPicture = (<img src={this.state.picture_preview_url} width="200" height="auto" />);
        }

        return (
            <div className="widget__contents">
                <div className="picutre_create_contents">
                    <label className="btn">
                        ファイルを選択
                        <input type="file" accept='image/*' style={{display: 'none'}} onChange={e => this.onClickPictureImport(e)} />
                    </label>
                </div>
                <div className="picutre_create_contents">
                    { previewPicture }
                </div>
                <div className="picutre_create_contents">
                    <button className="btn" onClick={e => this.onClickUpload(e)} filter={this.state.filter} >
                        アップロード
                    </button>
                    <p>最大アップロードサイズ : 3MB</p>
                </div>
            </div>
        )
    }
}

CreateDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    closeDialog: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => {
    return {
        pictureUpload: () => {
            if (!uploadPicture) {
                return;
            }
            dispatch(pictureUpload(uploadPicture, filter, closeDialog));
        },
        dispatch
    };
};

export default connect(null, mapDispatchToProps)(CreateDialog);
