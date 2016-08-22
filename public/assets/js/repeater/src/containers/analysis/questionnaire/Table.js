import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Table from '../../../components/analysis/questionnaire/Table'

const mapStateToProps = (state, ownProps) => {
    return {
        questionnaires: state.questionnaireAnalysis,
    }
};


export default connect(mapStateToProps)(Table)