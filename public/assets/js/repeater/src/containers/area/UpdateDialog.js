import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Modal from '../../components/commons/Modal'
import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE, PER_PAGE } from '../../constants/Constants'
import { createArea, updateArea } from '../../actions/area'
import * as Const from '../../constants/Constants';
import { areaNames } from '../../utils/CommonUtils'

class UpdateDialog extends Component {
    constructor(props) {
        console.log("POINT:");
        super(props);
        this.state = {
            isCheckAll: false,
            data: props.data,
            doUpdate: props.doUpdate,
        };
        this.handleAreaNameChange = this.handleAreaNameChange.bind(this);
    }

    handleAreaNameChange(e){
        var doUpdate = this.state.doUpdate;
        doUpdate.area['area_name'] = e.target.value;

        this.setState({ doUpdate: doUpdate });
    }

    onSubmit(e) {
        let validateError = [];
        if (!this.state.doUpdate.area.company_id) {
            validateError.push(Globalize.localize('check_company', Globalize.culture()));
        }
        if (!this.state.doUpdate.area.brand_id) {
            validateError.push(Globalize.localize('check_brand', Globalize.culture()));
        }
        if (!this.state.doUpdate.area.area_type) {
            validateError.push(Globalize.localize('check_area', Globalize.culture()));
        }
        if (!this.state.doUpdate.area.area_name) {
            validateError.push(Globalize.localize('check_area_name', Globalize.culture()));
        }

        if (validateError.length > 0) {
            alert(validateError.join("\n"));
            return;
        }

        e.preventDefault();

        var doUpdate = this.state.doUpdate;
        doUpdate.area['datapage'] = 1;
        doUpdate.area['status'] = doUpdate.area['area_type']

        this.props.dispatch(updateArea(doUpdate.area, this.props.filter, this.props.closeDialog));
    }

    render() {
        const { companies, brands, currentUser, onSubmit } =  this.props;
        return (
            <Modal isOpen={this.props.isOpen}>
                <div className="modal__w450a">
                    <dl className="widget widget__page__filter">
                        <dt className="contents__modal__h2"><span className="contents__modal__h2--title">{this.props.title}</span><div className="contents__modal__del" onClick={this.props.closeDialog}/></dt>
                        <dd className="widget__page__more__filter">
                            <div className="mb10">
                                <div className="contents__container__content">
                                    <form className="" acceptCharset="utf-8" onSubmit={this.onSubmit.bind(this)}>
                                        <div className="contents__container__box">
                                            <div className="contents__container__dl clearfix">
                                                <div className="contents__container__dt">{Globalize.localize('map_company_name', Globalize.culture())}</div>
                                                <div className="contents__container__dd">{this.state.doUpdate.area["company_name"]}</div>
                                            </div>
                                            <div className="contents__container__dl clearfix">
                                                <div className="contents__container__dt">{Globalize.localize('map_brand_name', Globalize.culture())}</div>
                                                <div className="contents__container__dd">{this.state.doUpdate.area["brand_name"]}</div>
                                            </div>
                                            <div className="contents__container__dl clearfix">
                                                <div className="contents__container__dt">{Globalize.localize('map_area', Globalize.culture())}</div>
                                                <div className="contents__container__dd">{areaNames[this.state.doUpdate.area["area_type"] - 1]}</div>
                                            </div>
                                            <div className="contents__container__dl clearfix">
                                                <div className="contents__container__dt">{Globalize.localize('map_area_name', Globalize.culture())}</div>
                                                <div className="contents__container__dd"><input type="text" className="contents__container__input--text" placeholder="関東" value={this.state.doUpdate.area["area_name"]} onChange={this.handleAreaNameChange}/></div>
                                            </div>
                                        </div>
                                        <div className="modal__btn__table">
                                            <div className="modal__btn__tablecell"><button className="btn-gray mr10" onClick={this.props.closeDialog}>{Globalize.localize('filter_close', Globalize.culture())}</button></div>
                                            <div className="modal__btn__tablecell"><button className="btn-base">{Globalize.localize('filter_setting', Globalize.culture())}</button></div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </dd>
                    </dl>
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
