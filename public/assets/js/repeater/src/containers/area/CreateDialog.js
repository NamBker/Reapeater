import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Modal from '../../components/commons/Modal'
import DropDownList from '../../components/commons/DropDownList'
import { USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND } from '../../constants/Constants'
import { createArea } from '../../actions/area'
import * as Const from '../../constants/Constants';
import { eachCompany, eachBrand } from '../../utils/CommonUtils'

class CreateDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCheckAll: false,
            data: props.data,
        };
        this.handleAreaNameChange = this.handleAreaNameChange.bind(this);
    }

    onChangeCompany(companyId) {
        var data = {};
        data['company_id'] = companyId;
        data['brand_id'] = '';

        this.setState({ data: data });
    }

    onChangeBrand(brandId) {
        var data = this.state.data;
        data['brand_id'] = brandId;

        this.setState({ data: data });
    }

    onChangeAreaType(areaType) {
        var data = this.state.data;
        data['status'] = areaType;

        this.setState({ data: data });
    }

    handleAreaNameChange(e){
        var data = this.state.data;
        data['area_name'] = e.target.value;

        this.setState({ data: data });
    }

    onSubmit(e) {
        let validateError = [];
        if (!this.state.data.company_id) {
            validateError.push(Globalize.localize('check_company', Globalize.culture()));
        }
        if (!this.state.data.brand_id) {
            validateError.push(Globalize.localize('check_brand', Globalize.culture()));
        }
        if (!this.state.data.status) {
            validateError.push(Globalize.localize('check_area', Globalize.culture()));
        }
        if (!this.state.data.area_name) {
            validateError.push(Globalize.localize('check_area_name', Globalize.culture()));
        }

        if (validateError.length > 0) {
            alert(validateError.join("\n"));
            return;
        }

        e.preventDefault();
        var data = this.state.data;
        data['datapage'] = 1;

        this.props.dispatch(createArea(data, this.props.filter));
    }

    render() {
        const { companies, brands, currentUser, areaTypes, onSubmit } =  this.props;
        const { data } = this.state;
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
                                                <div className="contents__container__dd dropdown__list">
                                                    {currentUser.authority >= USER_AUTHORITY_COMPANY ?
                                                        <span className="ml10">{currentUser.company_name}</span> :
                                                        <DropDownList
                                                            data={companies}
                                                            defaultValue={data.company_id}
                                                            hasEmptyOption={true}
                                                            onChange={(e) => this.onChangeCompany(e.target.value)}
                                                            eachCallback={eachCompany()}/>
                                                    }
                                                </div>
                                            </div>
                                            <div className="contents__container__dl clearfix">
                                                <div className="contents__container__dt">{Globalize.localize('map_brand_name', Globalize.culture())}</div>
                                                <div className="contents__container__dd dropdown__list">
                                                    {currentUser.authority >= USER_AUTHORITY_BRAND ?
                                                        <span className="ml10">{currentUser.brand_name}</span> :
                                                        <DropDownList
                                                            data={brands}
                                                            defaultValue={data.brand_id}
                                                            hasEmptyOption={true}
                                                            onChange={(e) => this.onChangeBrand(e.target.value)}
                                                            eachCallback={eachBrand(brand => brand.company_id == data.company_id)}/>
                                                    }
                                                </div>
                                            </div>
                                            <div className="contents__container__dl clearfix">
                                                <div className="contents__container__dt">{Globalize.localize('map_area', Globalize.culture())}</div>
                                                <div className="contents__container__dd dropdown__list">
                                                    <DropDownList
                                                        data={areaTypes}
                                                        defaultValue={data.status}
                                                        hasEmptyOption={true}
                                                        onChange={(e) => this.onChangeAreaType(e.target.value)}
                                                        eachCallback={(label, index) => <option key={"area_type_" + index} value={index + 1}>{label}</option>}/>
                                                </div>
                                            </div>
                                            <div className="contents__container__dl clearfix">
                                                <div className="contents__container__dt">{Globalize.localize('map_area_name', Globalize.culture())}</div>
                                                <div className="contents__container__dd"><input type="text" className="contents__container__input--text" placeholder="関東" onChange={this.handleAreaNameChange}/></div>
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

CreateDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    closeDialog: PropTypes.func.isRequired,
    data:PropTypes.object,

    filter:PropTypes.object,
};

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        companies : state.currentCompanies,
        brands: state.currentBrands,
    }
};

export default connect(mapStateToProps)(CreateDialog);
