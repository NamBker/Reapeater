import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Modal from '../../components/commons/Modal'
import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE, PER_PAGE } from '../../constants/Constants'
import { updatePicture } from '../../actions/picture'
import { deletePicture } from '../../actions/picture'
import * as Const from '../../constants/Constants';

class UpdateDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCheckAll: false,
            data: props.data,
            filter: props.filter,
            doUpdate: props.doUpdate,
        };
        this.handlePictureNameChange = this.handlePictureNameChange.bind(this);
        this.handleDeletePicture= this.handleDeletePicture.bind(this);
        this.handlePictureUpdate= this.handlePictureUpdate.bind(this);
    }

    handlePictureNameChange(e){
        var doUpdate = this.state.doUpdate;
        doUpdate.picture['picture_file_name'] = e.target.value;
        this.setState({ doUpdate: doUpdate });
    }

    handleDeletePicture(e){
        var checkedItems = [];
        checkedItems.push(this.state.doUpdate.picture["id"]);

        if(confirm("削除しますか?")){
            var filters = this.props.filter;
            var checkItems = checkedItems;
            filters.picture_ids = checkItems;
            
            this.props.dispatch(deletePicture(filters, this.props.closeDialog));
        }
    }

    handlePictureUpdate(e) {
        let validateError = [];
        if (!this.state.doUpdate.picture.picture_file_name) {
            validateError.push('- 画像名を入力してください。');
        }

        if (validateError.length > 0) {
            alert(validateError.join("\n"));
            return;
        }

        e.preventDefault();

        var doUpdate = this.state.doUpdate;
        doUpdate.picture['datapage'] = 1;
        var filter = this.props.filter;

        this.props.dispatch(updatePicture(doUpdate.picture, filter, this.props.closeDialog));
    }

    render() {
        const { companies, brands, currentUser } =  this.props;
        return (
            <Modal isOpen={this.props.isOpen}>

                <div className="modal-window_page">
                    <div className="widget">
                        <div className="widget__title modal_title">
                            <span>{this.props.title}</span>
                            <span className="cross" onClick={this.props.closeDialog}></span>
                        </div>
                        <div className="picture__updatedialog__form" acceptCharset="utf-8">
                            <div className="picture__updatedialog__left__contents">
                                <div className="picture__updatedialog__img__dummy__top"> </div>
                                <img className="picture__updatedialog__img" src={this.state.doUpdate.picture["picture_url"]}/>
                                <div className="picture__updatedialog__img__dummy__bottom"> </div>
                            </div>
                            <div className="picture__updatedialog__right__contents">
                                <div className="picture__updatedialog__content"> 
                                    <input value={this.state.doUpdate.picture["picture_file_name"]} onChange={this.handlePictureNameChange}/>
                                </div>
                                <div className="picture__updatedialog__size">
                                    <p>{this.state.doUpdate.picture["vertically_horizontally"]}</p>
                                </div>
                                <div className="picture__updatedialog__delete__btn">
                                    <button className="btn" value={this.state.doUpdate.picture["id"]} onClick={(e) => this.handleDeletePicture(e)}>画像を削除する</button>
                                </div>
                                <div className="picture__updatedialog__submit__btn">
                                    <button className="btn-base" onClick={(e) => this.handlePictureUpdate(e)}>変更する</button>
                                </div>
                            </div>
                            <div className="picture__updatedialog__clearfix"> </div>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}

UpdateDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    closeDialog: PropTypes.func.isRequired,
    data:PropTypes.object,
    filter:PropTypes.object,
    doUpdate:PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        brands: state.brands,
        companies : state.companies,
    }
};

export default connect(mapStateToProps)(UpdateDialog);
