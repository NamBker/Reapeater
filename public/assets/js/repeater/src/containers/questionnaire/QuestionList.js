import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as ModalAction from '../../actions/modal'
import * as QuestionAction from '../../actions/question'
import QuestionList from '../../components/questionnaire/QuestionList'

const mapStateToProps = (state) => {
    return {
        questions: state.questions,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        openModal: bindActionCreators(ModalAction, dispatch).showModal,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionList)
