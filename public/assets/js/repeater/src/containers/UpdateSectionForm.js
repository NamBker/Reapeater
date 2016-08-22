import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SectionForm from '../components/SectionForm'
import { updateSection } from '../actions/section'

const mapStateToProps = (state) => {
    return {
        isCreateNew: false,
        currentUser: state.currentUser,
        companies: state.companies,
        brands: state.brands,
        stores: state.stores,
        isConfirm: false,
        section: state.updateSection
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        submitSection(section, history) {
            dispatch(updateSection(section, history))
        },
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionForm)



