import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SectionForm from '../components/SectionForm'
import { createSection } from '../actions/section'

const mapStateToProps = (state) => {
    return {
        isCreateNew: true,
        currentUser: state.currentUser,
        companies: state.companies,
        brands: state.brands,
        stores: state.stores,
        isConfirm: false,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        submitSection(section, history) {
            dispatch(createSection(section, history))
        },
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionForm)



