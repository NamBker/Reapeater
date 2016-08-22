import React, { Component, PropTypes } from 'react';
import DatePicker from 'react-datepicker'
import Toggle from 'react-toggle'
import moment from 'moment'

import DropDownList from  './commons/DropDownList'
import Checkbox from  './commons/Checkbox'
import ModalGroup from '../containers/questionnaire/ModalGroup'
import QuestionList from '../containers/questionnaire/QuestionList'
import Notification from './commons/Notification'

import { arrayMove } from 'react-sortable-hoc';
import { fetchQuestions } from '../actions/question'
import { fetchQuestionnaireInfo, createQuestionnaire, updateQuestionnaire } from '../actions/questionnaire'
import * as Const from '../constants/Constants'

import { makeTimeArray } from '../utils/CommonUtils';

class QuestionnaireForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questionnaire: {
                questionnaire_name: '',
                questionnaire_text: '',
                questionnaire_limit: null,
                questionnaire_type: Const.QUESTIONNAIRE_TYPE_OTHER,
                questionnaire_thank_text: '',
                questionnaire_agreement: Const.QUESTIONNAIRE_AGREEMENT_IS_NOT_SHOW,
                questionnaire_responds: [],
            },
            limit: {
                date: null,
                time: '',
            },
            checkedQuestions: [],
            isCheckAllQuestion: false,
            selectedQuestionIds: [],
        };
        this.times = makeTimeArray(30);

        this.handleQuestionnaireNameChange = this.handleQuestionnaireNameChange.bind(this);
        this.handleQuestionnaireTextChange = this.handleQuestionnaireTextChange.bind(this);
        this.handleQuestionnaireLimitChange = this.handleQuestionnaireLimitChange.bind(this);
        this.handleQuestionnaireThankTextChange = this.handleQuestionnaireThankTextChange.bind(this);
        this.handleQuestionnaireAgreementChange = this.handleQuestionnaireAgreementChange.bind(this);
    }

    componentDidMount() {
        if (!this.props.isNew) {
            fetchQuestionnaireInfo(this.props.params.questionnaireId, (err) => {
                this.showNotification(err.toString());
            }, (res) => {
                let questionnaire = Object.assign({}, res.questionnaire);
                questionnaire.questionnaire_text = questionnaire.questionnaire_text || '';
                questionnaire.questionnaire_thank_text = questionnaire.questionnaire_thank_text || '';
                let limit = this.state.limit;
                if (questionnaire.questionnaire_limit && 15 < questionnaire.questionnaire_limit.length) {
                    limit.date = moment(questionnaire.questionnaire_limit.substring(0, 10));
                    limit.time = questionnaire.questionnaire_limit.substring(11, 16);
                }
                this.setState({questionnaire, limit});
            })
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.questionnaire != undefined) {
            this.setState({questionnaire: nextProps.questionnaire});
        }
        if (this.props.questions != nextProps.questions) {
            this.setState({checkedQuestions: []});
        }
    }

    showNotification(message) {
        Notification.showNotification(this.props.dispatch, this.props.route.path, message);
    }

    handleQuestionnaireNameChange(e) {
        let questionnaire = {...this.state.questionnaire};
        questionnaire.questionnaire_name = e.target.value;
        this.setState({questionnaire});
    }

    handleQuestionnaireTextChange(e) {
        let questionnaire = {...this.state.questionnaire};
        questionnaire.questionnaire_text = e.target.value;
        this.setState({questionnaire});
    }

    handleQuestionnaireLimitChange(date) {
        let limit = this.state.limit;
        let questionnaire = this.state.questionnaire;
        limit.date = date;
        if (limit.date && limit.time) {
            questionnaire.questionnaire_limit = limit.date.format('YYYY-MM-DD') + " " + limit.time;
        } else {
            questionnaire.questionnaire_limit = '';
        }
        this.setState({questionnaire, limit});
    }

    onChangeLimitTime(e) {
        e.preventDefault();
        let limit = this.state.limit;
        let questionnaire = this.state.questionnaire;
        limit.time = e.target.value;
        if (limit.date && limit.time) {
            questionnaire.questionnaire_limit = limit.date.format('YYYY-MM-DD') + " " + limit.time;
        } else {
            questionnaire.questionnaire_limit = '';
        }
        this.setState({questionnaire, limit});
    }

    handleQuestionnaireThankTextChange(e) {
        let questionnaire = {...this.state.questionnaire};
        questionnaire.questionnaire_thank_text = e.target.value;
        this.setState({questionnaire});
    }

    handleQuestionnaireAgreementChange() {
        let questionnaire = {...this.state.questionnaire};
        questionnaire.questionnaire_agreement = !questionnaire.questionnaire_agreement;
        this.setState({questionnaire});
    }

    setQuestionnaireResponds(selectedQuestions) {
        let questionnaire = {...this.state.questionnaire};
        selectedQuestions.forEach(question => {
            if (!questionnaire.questionnaire_responds.find(respond => respond.question_id == question.id)) {
                questionnaire.questionnaire_responds.push({
                    question_id: question.id,
                    questionnaire_required: 0,
                    question_status: Const.QUESTIONNAIRE_STATUS_USING,
                    questionnaire_order: questionnaire.questionnaire_responds.reduce((maxOrder, respond) => Math.max(respond.questionnaire_order, maxOrder), -1) + 1,
                    question: {...question},
                });
            }
        });
        this.setState({questionnaire, selectedQuestionIds: []});
    }

    setQuestionState(questionId) {
        let questionnaire = {...this.state.questionnaire};
        let responds = this.state.questionnaire.questionnaire_responds;
        responds = responds.map((respond => {
            if (respond.question_id == questionId) {
                respond.question_status = (!respond.question_status) + 0;
            }
            return respond;
        }));
        questionnaire.questionnaire_responds = responds;
        this.setState({questionnaire});
    }

    setQuestionnaireRequired(questionId) {
        let questionnaire = {...this.state.questionnaire};
        let responds = this.state.questionnaire.questionnaire_responds;
        responds = responds.map((respond => {
            if (respond.question_id == questionId) {
                respond.questionnaire_required = (!respond.questionnaire_required) + 0;
            }
            return respond;
        }));
        questionnaire.questionnaire_responds = responds;
        this.setState({questionnaire});
    }

    onChangeSelectedQuestion(selectedIds) {
        this.setState({selectedQuestionIds: selectedIds});
    }

    openPreview() {
        let errors = [];
        if (!this.state.questionnaire.questionnaire_name) {
            errors.push(Globalize.localize('map_questionnaire_name', Globalize.culture()))
        }
        if (!this.state.questionnaire.questionnaire_limit) {
            errors.push(Globalize.localize('map_response_limit', Globalize.culture()))
        }
        if (0 < errors.length) {
            this.showNotification(Globalize.localize('alert_message_for_error_not_null', Globalize.culture()) + "\n・" + errors.join("\n・"))
            return;
        }
        this.props.openModal(Const.MODAL_PREVIEW)
    }

    saveQuestionnaire() {
        let questionnaire = this.state.questionnaire;
        this.props.closeModal();
        if (this.props.isNew) {
            createQuestionnaire(questionnaire, (err) => {
                this.showNotification(err.toString());
            }, (res) => {
                Notification.showNotification(this.props.dispatch, '/questionnaire', Globalize.localize('questionnaire_created', Globalize.culture()));
                this.context.router.push('/questionnaire');
            });
        } else {
            updateQuestionnaire(questionnaire.id, questionnaire, (err) => {
                this.showNotification(err.toString());
            }, (res) => {
                Notification.showNotification(this.props.dispatch, '/questionnaire', Globalize.localize('questionnaire_updated', Globalize.culture()));
                this.context.router.push('/questionnaire');
            });
        }
    }

    swapQuestion({oldIndex, newIndex}) {
        let { questionnaire } = this.state;
        let questionnaire_responds = [...questionnaire.questionnaire_responds];
        questionnaire_responds = [...arrayMove(questionnaire_responds, oldIndex, newIndex)];
        questionnaire.questionnaire_responds = questionnaire_responds;
        this.setState({questionnaire});
    }

    checkQuestion(questionId) {
        questionId = parseInt(questionId);
        let {checkedQuestions, isCheckAllQuestion} = this.state;
        let index = checkedQuestions.indexOf(questionId);
        if (index >= 0) {
            checkedQuestions.splice(index, 1);
            isCheckAllQuestion = false;
        } else {
            checkedQuestions.push(questionId);
        }
        this.setState({checkedQuestions, isCheckAllQuestion})
    }

    checkAllQuestion() {
        let checkedQuestions = [];
        let {isCheckAllQuestion, questionnaire} = this.state;
        if (!isCheckAllQuestion) {
            checkedQuestions = questionnaire.questionnaire_responds.map(respond => parseInt(respond.question_id));
        }
        this.setState({checkedQuestions, isCheckAllQuestion: !isCheckAllQuestion})
    }

    deleteRespond() {
        let {questionnaire, checkedQuestions} = this.state;
        var questionnaire_responds = [];
        questionnaire.questionnaire_responds.map(respond => {
            if (checkedQuestions.indexOf(parseInt(respond.question_id)) < 0) {
                questionnaire_responds.push(respond);
            }
        });
        questionnaire.questionnaire_responds = questionnaire_responds;
        this.setState({questionnaire, checkedQuestions: []});
    }

    render() {
        const { isNew } = this.props;
        const { questionnaire, limit } = this.state;
        return (
            <div>
                <Notification path={this.props.route.path}/>
                <ModalGroup setQuestionnaireResponds={(selectedQuestions) => {this.setQuestionnaireResponds(selectedQuestions)}}
                            selectedQuestionIds={this.state.selectedQuestionIds}
                            onChangeSelectedQuestion={(selectedIds) => this.onChangeSelectedQuestion(selectedIds)}
                            isNew={isNew}
                            saveQuestionnaire={() => {this.saveQuestionnaire()}}
                            questionnaireResponds={this.state.questionnaire.questionnaire_responds}/>
                <dl className="widget widget__page__input">
                    <dt className="widget__page__input__title">
                        <div className="widget__page__type__create"/>
                        <span className="widget__page__main_title font-base1">{Globalize.localize(isNew ? 'questionnaire_input_form_title_register' : 'questionnaire_input_form_title_update', Globalize.culture())}</span>
                    </dt>
                    <dd className="widget__page__input__contents">
                        <div className="widget__page__input__contents__table mt20 mb20">
                            <dl>
                                <dt>{Globalize.localize('map_questionnaire_name', Globalize.culture())}</dt>
                                <dd className="checkbox__row">
                                    <input type="text" size="50" maxLength="32" onChange={this.handleQuestionnaireNameChange}
                                        value={questionnaire.questionnaire_name}/>
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('map_questionnaire_title', Globalize.culture())}</dt>
                                <dd>
                                    <textarea
                                        className="widget__page__input__textarea"
                                        onChange={this.handleQuestionnaireTextChange}
                                        value={questionnaire.questionnaire_text}/>
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('map_questionnaire_thank_text', Globalize.culture())}</dt>
                                <dd>
                                    <textarea
                                        className="widget__page__input__textarea"
                                        onChange={this.handleQuestionnaireThankTextChange}
                                        value={questionnaire.questionnaire_thank_text}/>
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('map_response_limit', Globalize.culture())}</dt>
                                <dd>
                                    <div className="widget__page__input__questionnaire__limit">
                                        <DatePicker className={"input__date" + (limit.date ? " input__date__setted" : "")}
                                                    dateFormat={Globalize.localize('display_date_format', Globalize.culture())}
                                                    locale='ja'
                                                    dateFormatCalendar={Globalize.localize('display_date_year_and_month_format', Globalize.culture())}
                                                    tetherConstraints={[]}
                                                    readOnly
                                                    isClearable={true}
                                                    selected={limit.date}
                                                    onChange={this.handleQuestionnaireLimitChange}
                                                    />
                                        {"　"}
                                        <DropDownList
                                            className="questionnaire__response__limit__time"
                                            data={this.times}
                                            defaultValue={limit.time}
                                            hasEmptyOption={true}
                                            onChange={(e) => this.onChangeLimitTime(e)}
                                            eachCallback={(time) => <option value={time} key={"questionnaire__response__limit__time__" + time}>{time}</option>}
                                        />
                                    </div>
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('map_term_or_policy', Globalize.culture())}</dt>
                                <dd className="questionnaire_agreement">
                                    <Checkbox id="questionnaire_agreement"
                                        isChecked={this.state.questionnaire.questionnaire_agreement}
                                        label={Globalize.localize('l_display_on', Globalize.culture())}
                                        check={this.handleQuestionnaireAgreementChange}/>
                                </dd>
                            </dl>
                        </div>
                    </dd>
                </dl>
                <QuestionList questionnaireResponds={[...this.state.questionnaire.questionnaire_responds]}
                              checkQuestion={(questionId) => {this.checkQuestion(questionId)}}
                              checkedQuestions={this.state.checkedQuestions}
                              swapQuestion={({oldIndex, newIndex}) => this.swapQuestion({oldIndex, newIndex})}
                              setQuestionState={(questionId) => {this.setQuestionState(questionId)}}
                              isCheckAllQuestion={this.state.isCheckAllQuestion}
                              checkAllQuestion={() => {this.checkAllQuestion()}}
                              deleteRespond={() => {this.deleteRespond()}}
                              setQuestionnaireRequired={(questionId) => {this.setQuestionnaireRequired(questionId)}}/>
                <div className="question_submit_filter">
                    <a className="btn-base" onClick={() => {this.openPreview()}}>{Globalize.localize('questionnaire_show_preview', Globalize.culture())}</a>
                </div>
            </div>
        );
    }
}

export default QuestionnaireForm;
