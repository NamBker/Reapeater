import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as ModalAction from '../actions/modal'

import QuestionnaireForm from '../components/QuestionnaireForm'

QuestionnaireForm.contextTypes = {
    router: React.PropTypes.object,
};

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        isNew: false
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        openModal: bindActionCreators(ModalAction, dispatch).showModal,
        closeModal: bindActionCreators(ModalAction, dispatch).closeModal,
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionnaireForm)
