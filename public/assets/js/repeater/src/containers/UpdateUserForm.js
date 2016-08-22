import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateUser } from '../actions/user'
import UserForm from '../components/UserForm'

const mapStateToProps = (state, ownProps) => {
    return {
        isCreateNew: false,
        currentUser: state.currentUser,
        user: state.updateUser,
        companies: state.companies,
        brands: state.brands,
        stores: state.stores,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onSubmit(e) {
            e.preventDefault();
            dispatch(updateUser(this.state.user, ownProps.history));
        },
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(UserForm)



