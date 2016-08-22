import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Modal from '../../commons/Modal';
import Table from '../../commons/Table';
import QuestionAnswer from '../QuestionAnswer';
import { MODAL_CREATED_QUESTION_LIST, MODAL_CREATE_QUESTION_FORM, QUESTIONNAIRE_TYPE_INITIAL_REGISTRATION, QUESTIONNAIRE_STATUS_UNUSED, QUESTIONNAIRE_STATUS_USING } from '../../../constants/Constants';
import { QUESTION_USED_FLG_UNPUBLISHED, QUESTION_USED_FLG_PUBLISHED } from '../../../constants/Constants';

import { fetchQuestions, deleteQuestions } from '../../../actions/question';

class CreatedQuestionList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            questionnaireResponds: props.questionnaireResponds,
            inUseQuestionIds: [],
            isCheckAll: false
        }
        this.tableFormat = [
            {
                title: Globalize.localize('map_use', Globalize.culture()),
                valueKey: 'question_status',
                style: {
                    marginLeft: '1px',
                    marginRight: '5px',
                    width: '50px',
                    height: '40px',
                    lineHeight: '50px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    flexShrink: '0',
                }
            },
            {
                title: Globalize.localize('map_question_text', Globalize.culture()),
                valueKey: 'question_body',
                style: {
                    marginLeft: '5px',
                    width: '180px',
                    height: '40px',
                    lineHeight: '50px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    flexShrink: '0',
                }
            },
            {
                title: Globalize.localize('map_answer_field', Globalize.culture()),
                valueKey: 'question_type',
                style: {
                    marginLeft: '5px',
                    marginRight: '10px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                }
            },
            {
                title: '',
                valueKey: 'question_used_flg',
                style: {
                    width: '60px',
                    marginLeft: '10px',
                    marginRight: '10px',
                    flexShrink: '0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            }
        ];
    }

    componentWillMount() {
        this.props.dispatch(fetchQuestions());
        this.setState({
            questionnaireResponds: this.props.questionnaireResponds,
            inUseQuestionIds: this.props.questionnaireResponds.map((respond) => parseInt(respond.question_id))
        });
    }

    setQuestionnaireResponds() {
        let selectedQuestions = this.props.selectedIds.map(selectedId => this.props.questions.find(question => question.id == selectedId));
        this.props.setQuestionnaireResponds(selectedQuestions);
        this.props.closeModal();
    }

    cellForKey(key, element) {
        switch (key) {
        case 'question_status':
            return (
                this.state.inUseQuestionIds.indexOf(parseInt(element.id)) < 0 ?
                    Globalize.localize('no_use', Globalize.culture()) :
                    <span className="orange-text">
                        {Globalize.localize('in_use', Globalize.culture())}
                    </span>
            );
        case 'question_body':
            return (
                <span>{element.question_body}</span>
            );
        case 'question_type':
            return (
                <QuestionAnswer type={element.question_type} labels={element.question_nos}/>
            );
        case 'question_used_flg':
            return (
                <span>{element.question_used_flg == QUESTION_USED_FLG_PUBLISHED ? Globalize.localize('flg_published', Globalize.culture()) : ''}</span>
            );
        }
    }

    onChangeCheck(selectedIds) {
        this.props.onChangeSelectedQuestion(selectedIds);
    }

    onClickEdit(element) {
        this.props.clickUpdate(element);
        this.props.showModal(MODAL_CREATE_QUESTION_FORM);
    }

    tableAdditionalRow() {
        return (
            <div className="widget__page__input__question__list__create__new__question">
                <div className="widget__page__table__add__button" onClick={(e) => {e.preventDefault();this.props.setNew();this.props.showModal(MODAL_CREATE_QUESTION_FORM)}}>
                    <span className="plus"></span>
                    <span>{Globalize.localize('questionnaire_create_new_question', Globalize.culture())}</span>
                </div>
            </div>
        );
    }

    isSelectableRow(element) {
        return this.state.inUseQuestionIds.indexOf(parseInt(element.id)) < 0;
    }

    closeModal(e) {
        e.preventDefault();
        this.props.onChangeSelectedQuestion([]);
        this.props.closeModal();
    }

    onDelete(deleteIds) {
        deleteQuestions(deleteIds, (err) => {
            alert(Globalize.localize('question_cant_delete', Globalize.culture()));
        }, (res) => {
            this.props.dispatch(fetchQuestions());
        });
    }

    hasEditButtonForRow(element) {
        return element.question_used_flg == QUESTION_USED_FLG_UNPUBLISHED;
    }

    render() {
        const { isOpen, questions } = this.props;
        return (
            <Modal isOpen={isOpen}>
                {isOpen ?
                <div className="modal-window_page">
                    <dl className="widget">
                        <dt className="contents__modal__h2">
                            <span className="contents__modal__h2--title">{Globalize.localize('questionnaire_created_question')}</span>
                            <div className="contents__modal__del" onClick={(e) => this.closeModal(e)}/>
                        </dt>
                        <dd className="mt20 ml20 mr20 mb20">
                            <Table
                                initSelection={this.props.selectedIds}
                                className="widget__page__input__question__list__table"
                                data={questions}
                                cellForKey={(key, element) => this.cellForKey(key, element)}
                                formats={this.tableFormat}
                                curPage={1}
                                onDelete={(deleteIds) => this.onDelete(deleteIds)}
                                onClickEdit={(element) => this.onClickEdit(element)}
                                onChangeCheck={(selectId) => this.onChangeCheck(selectId)}
                                isShowPagenate={false}
                                additionalRow={() => this.tableAdditionalRow()}
                                isSelectableRow={(element) => this.isSelectableRow(element)}
                                hasEditButtonForRow={(element) => this.hasEditButtonForRow(element)}
                            />
                        </dd>
                        <div className="widget__page__input__question__list__add__questions">
                            <p>{Globalize.localize('questionnaire_add_question_description', Globalize.culture())}</p>
                            <a className="btn-base" onClick={() => {this.setQuestionnaireResponds()}}>{Globalize.localize('questionnaire_add_question', Globalize.culture())}</a>
                        </div>
                    </dl>
                </div> : null}
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        questions: state.questions,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatedQuestionList);
