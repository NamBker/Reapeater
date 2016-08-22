import React, { Component, PropTypes } from 'react';
import CreatedQuestionList from '../../../containers/questionnaire/question/CreatedQuestionList'
import CreateQuestionForm from '../../../containers/questionnaire/question/CreateQuestionForm'
import ModalPreview from '../../../containers/questionnaire/ModalPreview'
import { MODAL_CREATED_QUESTION_LIST, MODAL_CREATE_QUESTION_FORM, MODAL_PREVIEW } from '../../../constants/Constants'


class ModalGroup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isNew: true,
            updateQuestion: null
        }
    }

    render() {
        return (
            <div>
                {this.props.modalType == MODAL_CREATED_QUESTION_LIST ?
                <CreatedQuestionList isOpen={this.props.modalType == MODAL_CREATED_QUESTION_LIST}
                                     clickUpdate={(question) => {this.setState({updateQuestion: question, isNew: false})}}
                                     questionnaireResponds={this.props.questionnaireResponds}
                                     setNew={()=> {this.setState({isNew: true})}}
                                     selectedIds={this.props.selectedQuestionIds}
                                     onChangeSelectedQuestion={this.props.onChangeSelectedQuestion}
                                     setQuestionnaireResponds={this.props.setQuestionnaireResponds}/> : null}
                {this.props.modalType == MODAL_CREATE_QUESTION_FORM ?
                <CreateQuestionForm isOpen={this.props.modalType == MODAL_CREATE_QUESTION_FORM} isNew={this.state.isNew} question={this.state.updateQuestion}/> : null}
                {this.props.modalType == MODAL_PREVIEW ?
                <ModalPreview isOpen={this.props.modalType == MODAL_PREVIEW}
                              isCreateNew={this.props.isNew}
                              questionnaireResponds={this.props.questionnaireResponds}
                              handleSubmitForm={this.props.saveQuestionnaire}/> : null}
            </div>
        );
    }
}

export default ModalGroup;
