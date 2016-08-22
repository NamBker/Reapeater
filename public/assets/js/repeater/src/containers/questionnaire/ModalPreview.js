import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import ModalTabsPreview from '../../components/commons/ModalTabPreview'
import * as ModalAction from '../../actions/modal'
import QuestionAnswer from '../../components/questionnaire/QuestionAnswer';
import { QUESTION_TYPE_SELECT_BOX, QUESTIONNAIRE_STATUS_USING } from '../../constants/Constants'

class ModalPreview extends Component {
    render() {
        const { questionnaireResponds } = this.props;
        return (
            <ModalTabsPreview {...this.props} title="新規アンケートのプレビュー" backBtn="閉じる" msg={"携帯電話の種類によって\n表示が違う場合があります。"}>
                <div className="smartphone_question_preview" key="smartphone_quesiton_preview">
                    {questionnaireResponds.map((respond) => {
                        let question = respond.question;
                        if (!question) return null;
                        let itemCount = (question.question_nos.match(/,/g) || []).length;
                        let style = {display: 'flex', flexDirection: 'column'};
                        if (question.question_nos && question.question_type != QUESTION_TYPE_SELECT_BOX) {
                            style = {minHeight: (itemCount * 25 + 20) + "px", ...style};
                        }
                        return <div
                            style={style}
                            key={"smartphone_preview_" + question.id}>
                            <p>
                                {question.question_body}
                                <span className="orange-text">{respond.questionnaire_required ? '[必須]' : ''}</span>
                            </p>
                            <QuestionAnswer type={question.question_type} labels={question.question_nos}/>
                        </div>
                    })}
                </div>
                <div className="garake_question_preview" key="garake_question_preview">
                    {questionnaireResponds.map((respond) => {
                        let question = respond.question;
                        if (!question) return null;
                        let itemCount = (question.question_nos.match(/,/g) || []).length;
                        return <div
                            style={question.question_nos && question.question_type != QUESTION_TYPE_SELECT_BOX ? {minHeight: (itemCount * 25 + 25) + "px"} : {minHeight: '50px'}}
                            key={"garake_preview_" + question.id}>
                            <p>
                                {question.question_body}
                                <span className="orange-text">{respond.questionnaire_required ? '[必須]' : ''}</span>
                            </p>
                            <QuestionAnswer type={question.question_type} labels={question.question_nos} isGarake={true}/>
                        </div>
                    })}
                </div>
            </ModalTabsPreview>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        closeModal: bindActionCreators(ModalAction, dispatch).closeModal,
    }
};

export default connect(
    null, mapDispatchToProps
)(ModalPreview)
