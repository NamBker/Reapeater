import React, { Component, PropTypes } from 'react';
import { authorities } from '../utils/CommonUtils'
import { fetchUserInfo } from '../actions/user'
import { fetchCompanies } from '../actions/company'
import { fetchBrands } from '../actions/brand'
import { fetchStores } from '../actions/store'
import * as Const from '../constants/Constants'
import DropDownList from  './commons/DropDownList'

class UserForm extends Component {
    constructor(props) {
        super(props);
        this.state =  {
            user: this.props.isCreateNew ? {
                mail_address: '',
                password: '',
                authority: '',
                company_id: '',
                brand_id: '',
                store_id: '',
                name: '',
                address: '',
                phone_no: ''
            } : this.props.user
        };
        this.handleEmailChange     = this.handleEmailChange.bind(this);
        this.handlePasswordChange  = this.handlePasswordChange.bind(this);
        this.handleAuthorityChange = this.handleAuthorityChange.bind(this);
        this.handleCompanyIdChange = this.handleCompanyIdChange.bind(this);
        this.handleBrandIdChange   = this.handleBrandIdChange.bind(this);
        this.handleStoreIdChange   = this.handleStoreIdChange.bind(this);
        this.handleNameChange      = this.handleNameChange.bind(this);
        this.handleAddressChange   = this.handleAddressChange.bind(this);
        this.handlePhoneNoChange   = this.handlePhoneNoChange.bind(this);

    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchCompanies({pattern: 1}));
        dispatch(fetchBrands({pattern: 1}));
        dispatch(fetchStores({pattern: 1}));
        if (!this.props.isCreateNew) {
            dispatch(fetchUserInfo(this.props.params.userId));
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user != undefined) {
            this.setState({
                user: nextProps.user
            });
        }
    }

    handleEmailChange(e) {
        let user = this.state.user;
        user.mail_address = e.target.value;
        this.setState({user: user});
    }

    handlePasswordChange(e){
        let user = this.state.user;
        user.password = e.target.value;
        this.setState({user: user});
    }

    handleAuthorityChange(e){
        let user = this.state.user;
        user.authority = e.target.value;
        this.setState({user: user});
    }

    handleCompanyIdChange(e){
        let user = this.state.user;
        user.company_id = e.target.value;
        user.brand_id = '';
        user.store_id = '';
        this.setState({user: user});
    }

    handleBrandIdChange(e){
        let user = this.state.user;
        user.brand_id = e.target.value;
        user.store_id = '';
        this.props.brands.map(brand => {
            if (brand.id == user.brand_id) {
                user.company_id = brand.company_id;
            }
        });
        this.setState({user: user});
    }

    handleStoreIdChange(e){
        let user = this.state.user;
        user.store_id = e.target.value;
        this.props.stores.map(store => {
            if (store.id == user.store_id) {
                user.brand_id = store.brand_id;
            }
            this.props.brands.map(brand => {
                if (brand.id == user.brand_id) {
                    user.company_id = brand.company_id;
                }
            });
        });
        this.setState({user: user});
    }

    handleNameChange(e){
        let user = this.state.user;
        user.name = e.target.value;
        this.setState({user: user});
    }

    handleAddressChange(e){
        let user = this.state.user;
        user.address = e.target.value;
        this.setState({user: user});
    }

    handlePhoneNoChange(e){
        let user = this.state.user;
        user.phone_no = e.target.value;
        this.setState({user: user});
    }

    render() {
        const { currentUser, onSubmit, companies, brands, stores } = this.props;
        if (!currentUser.mail_address) return null;
        return (
            <div className="col-sm-8 col-sm-offset-2">
                <form className="form-horizontal" acceptCharset="utf-8" onSubmit={onSubmit.bind(this)} autoComplete="off">
                <dl className="widget widget__page__input">
                    <dt className="widget__page__input__title">
                        <div className="widget__page__type__create"></div>
                        <span className="widget__page__main__title font-base1">
                        
                        </span>
                    </dt>
                    <dt className="widget__page__input__contents">
                        <div className="widget__page__input__contents__table mt20 mb20">
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('l_user_email', Globalize.culture())}</dt>
                                <dd>
                                    <input type="email" size="34" maxLength="32" className="form-control" id="mail_address" name="mail_address"
                                       value={this.state.user.mail_address}
                                       onChange={this.handleEmailChange}
                                       style={{imeMode: 'inactive'}}/>
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('l_user_password', Globalize.culture())}</dt>
                                <dd>
                                    <input type="password" size="34" maxLength="32" className="form-control" id="password" name="password"
                                   value={this.state.user.password}
                                   onChange={this.handlePasswordChange}
                                   style={{imeMode: 'inactive'}}/>
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('l_authority', Globalize.culture())}</dt>
                                <dd className="widget__page__input__select__target">     
                                    <div className="dropdown__list">
                                        <select className="form-control" id="authority" required name="authority"
                                            value={this.state.user.authority}
                                            onChange={this.handleAuthorityChange}>
                                            <option></option>
                                            {authorities.map((authority_name, index) => {
                                                let authority = index + 1;
                                                if (currentUser.authority == Const.USER_AUTHORITY_ADMIN || authority > currentUser.authority) {
                                                    return <option value={authority} key={authority}>{authority_name}</option>;
                                                } else {
                                                    return null;
                                                }
                                            })}
                                        </select>
                                    </div>
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('l_comapny_id', Globalize.culture())}</dt>
                                <dd className="widget__page__input__select__target">
                                    <div className="dropdown__list">
                                        <select className="form-control" id="company_id" name="company_id"
                                            value={this.state.user.company_id || ''}
                                            onChange={this.handleCompanyIdChange}>
                                            {currentUser.authority < Const.USER_AUTHORITY_COMPANY ? <option></option> : null}
                                            {companies.map(company => <option value={company.id} key={company.id}>{company.company_name}</option>)}
                                        </select>
                                    </div>
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('l_brand_id', Globalize.culture())}</dt>
                                <dd className="widget__page__input__select__target">
                                    <div className="dropdown__list">
                                        <select className="form-control" id="brand_id" name="brand_id" value={this.state.user.brand_id || ''} onChange={this.handleBrandIdChange}>
                                            {currentUser.authority < Const.USER_AUTHORITY_BRAND ? <option></option> : null}
                                            {companies.map( company => {
                                            if (!this.state.user.company_id || this.state.user.company_id == company.id) {
                                            return <optgroup label={company.company_name} style={{textIndent: '20px'}} key={company.id}>
                                                        {brands.map(brand => {
                                                            if (brand.company_id == company.id) {
                                                                return <option value={brand.id} key={brand.id}
                                                                               tyle={{textIndent: '10px'}}>{brand.brand_name}</option>
                                                            } else {
                                                                return null;
                                                            }
                                                            })}
                                                    </optgroup>
                                                } else {
                                                    return null
                                                }
                                            })}
                                        </select>
                                    </div>
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('l_store_id', Globalize.culture())}</dt>
                                <dd className="widget__page__input__select__target">
                                    <div className="dropdown__list">
                                        <select className="form-control" id="store_id" name="store_id" value={this.state.user.store_id || ''} onChange={this.handleStoreIdChange}>
                                            {currentUser.authority < Const.USER_AUTHORITY_STORE ? <option></option> : null}
                                            {brands.map(brand => {
                                            if (!this.state.user.brand_id || this.state.user.brand_id == brand.id) {
                                            return <optgroup label={brand.brand_name} style={{textIndent: '20px'}}
                                                             key={brand.id}>
                                                        {stores.map(store => {
                                                            if (store.brand_id == brand.id) {
                                                                return <option value={store.id} key={store.id}>{store.store_name}</option>
                                                            }
                                                        })};
                                                    </optgroup>
                                                } else {
                                                    return null;
                                                }
                                            })}
                                        </select>
                                    </div>
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('member_search_condition_name', Globalize.culture())}</dt>
                                <dd>
                                    <input type="text" size="34" maxLength="32" className="form-control" id="name" name="name" required
                                       value={this.state.user.name}
                                       onChange={this.handleNameChange}/>
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('map_address', Globalize.culture())}</dt>
                                <dd>
                                    <input type="text" size="34" maxLength="32" className="form-control" id="address" name="address"
                                        value={this.state.user.address || ''}
                                        onChange={this.handleAddressChange}/>
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('map_phone_no', Globalize.culture())}</dt>
                                <dd>
                                    <input type="text" size="34" maxLength="32" className="form-control" id="phone_no" name="phone_no"
                                        value={this.state.user.phone_no || ''}
                                        onChange={this.handlePhoneNoChange}
                                        style={{imeMode: 'inactive'}}/>
                                </dd>
                            </dl>
                        </div>
                    </dt>
                    <div className="contents__btn--save">
                        <input type="submit" className="btn-base" value={Globalize.localize('b_register', Globalize.culture())} />
                    </div>
                </dl>                    
                </form>
            </div>
        );
    }
}

export default UserForm;
