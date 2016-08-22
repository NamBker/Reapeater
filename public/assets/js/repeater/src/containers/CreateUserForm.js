import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import UserForm from '../components/UserForm'
import { createUser } from '../actions/user'

const mapStateToProps = (state) => {
    return {
        isCreateNew: true,
        currentUser: state.currentUser,
        companies: state.companies,
        brands: state.brands,
        stores: state.stores,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onSubmit(e) {
            e.preventDefault();
            dispatch(createUser(this.state.user, ownProps.history));
        },
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(UserForm)



