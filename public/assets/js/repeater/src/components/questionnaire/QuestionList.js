import React, { Component, PropTypes } from 'react';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
import Toggle from 'react-toggle'
import { MODAL_CREATED_QUESTION_LIST } from '../../constants/Constants'
import Checkbox from  '../commons/Checkbox'
import QuestionAnswer from './QuestionAnswer'

const DragHandle = SortableHandle(() => <span className="drap_handle"></span>);

const SortableItem = SortableElement(({value, respond, index, setQuestionState, setQuestionnaireRequired, checkQuestion, isCheckedQuestion}) => {
    return (
        <dd>
            <ul>
                <Checkbox id={"respond_" + value.id} check={checkQuestion} isChecked={isCheckedQuestion}/>
                <li className="no-number">{index + 1}</li>
                <li className="question_status">
                    <Toggle checked={respond.question_status == 1}
                            onChange={() => {setQuestionState(value.id)}}/>
                </li>
                <li className="question_body">{value.question_body}</li>
                <li className="question_answer">
                    <QuestionAnswer type={value.question_type} labels={value.question_nos}/>
                </li>
                <li className="questionnaire_required">
                    <Toggle checked={respond.questionnaire_required == 1} onChange={() => {setQuestionnaireRequired(value.id)}}/>
                </li>
                <DragHandle />
            </ul>
        </dd>
    )
});

const SortableList = SortableContainer(({items, questionnaireResponds , setQuestionState, setQuestionnaireRequired, checkedQuestions, checkQuestion}) => {
    return (
        <div>
            {questionnaireResponds.map((respond, index) => {
                return <SortableItem key={`item-${index}`}
                                     index={index}
                                     value={respond.question}
                                     respond={respond}
                                     setQuestionState={setQuestionState}
                                     checkQuestion={checkQuestion}
                                     isCheckedQuestion={checkedQuestions.indexOf(parseInt(respond.question_id)) >= 0}
                                     setQuestionnaireRequired={setQuestionnaireRequired}/>
            })}
        </div>
    );
});
class QuestionList extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const { questions, openModal, questionnaireResponds,
            setQuestionState, setQuestionnaireRequired, swapQuestion,
            checkedQuestions, checkQuestion, checkAllQuestion, isCheckAllQuestion, deleteRespond} = this.props;
        let checkboxAll = <span className="check-all" onClick={checkAllQuestion}>
                                <input type="checkbox" id="checkbox_all" checked={isCheckAllQuestion}/>
                                <label htmlFor="checkbox_all pulldown"></label>
                            </span>;
        return (
            <dl className="widget widget__page__input question_list">
                <dt className="widget__page__input__title">
                    <div className="widget__page__type__create"/>
                    <span className="widget__page__main_title font-base1">{Globalize.localize('questionnaire_input_form_question_title', Globalize.culture())}</span>
                </dt>
                <dd className="widget__contents">
                    <dl className="widget widget__page__table">
                        {checkedQuestions.length > 0 ? <dt className="widget__title">
                            {checkboxAll}
                            <div className="section_button_delete" onClick={deleteRespond}>
                            </div>
                        </dt> : <dt className="widget__title">
                            {checkboxAll}
                            <span>{Globalize.localize('map_use', Globalize.culture())}</span>
                            <span>{Globalize.localize('map_question_text', Globalize.culture())}</span>
                            <span>{Globalize.localize('map_answer_field', Globalize.culture())}</span>
                            <span>{Globalize.localize('map_required', Globalize.culture())}</span>
                        </dt>}
                        <SortableList items={questions}
                                      questionnaireResponds={questionnaireResponds}
                                      checkedQuestions={checkedQuestions}
                                      checkQuestion={checkQuestion}
                                      onSortEnd={swapQuestion}
                                      useDragHandle={true}
                                      setQuestionState={setQuestionState}
                                      setQuestionnaireRequired={setQuestionnaireRequired}/>
                        <dd className="widget__page__table__pagination">
                            <div className="widget__page__table__add__button" onClick={() => {openModal(MODAL_CREATED_QUESTION_LIST)}}>
                                <span className="plus"></span>
                                <span>{Globalize.localize('questionnaire_input_add_question', Globalize.culture())}</span>
                            </div>
                        </dd>
                    </dl>
                </dd>
            </dl>
        );
    }
}

export default QuestionList;
