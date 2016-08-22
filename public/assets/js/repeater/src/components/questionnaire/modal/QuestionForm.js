import React, { Component, PropTypes } from 'react';
import {arrayMove} from 'react-sortable-hoc';
import Toggle from 'react-toggle'
import RadioButton from '../../commons/RadioButton'
import Modal from '../../commons/Modal'
import Checkbox from '../../commons/Checkbox'
import DropDownList from '../../commons/DropDownList'
import DateSelect from '../../commons/DateSelect'
import AnswerList from './AnswerList'

import * as Const from '../../../constants/Constants'

class QuestionForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            question_body: props.isNew ? '': props.question.question_body,
            question_char_limit: props.isNew ? 0 : props.question.question_char_limit,
            canSelectCharLimit: props.isNew ? false : props.question.question_char_limit > 0,
            question_type: props.isNew ? null : props.question.question_type,
            checkbox: props.isNew || props.question.question_type != Const.QUESTION_TYPE_CHECK_BOX ? ['サンプル1', 'サンプル2'] : props.question.question_nos.split(','),
            radio: props.isNew || props.question.question_type != Const.QUESTION_TYPE_RADIO_BUTTON ? ['サンプル1', 'サンプル2'] : props.question.question_nos.split(','),
            selectbox: props.isNew || props.question.question_type != Const.QUESTION_TYPE_SELECT_BOX ? ['サンプル1', 'サンプル2'] : props.question.question_nos.split(','),
        };

        this.addCheckbox = this.addCheckbox.bind(this);
        this.onSortEndCheckbox = this.onSortEndCheckbox.bind(this);
        this.addRadio = this.addRadio.bind(this);
        this.onSortEndRadio = this.onSortEndRadio.bind(this);
        this.addSelectbox = this.addSelectbox.bind(this);
        this.onSortEndSelectbox = this.onSortEndSelectbox.bind(this);
        this.handleToggleCharLimitChange = this.handleToggleCharLimitChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.deleteCheckbox = this.deleteCheckbox.bind(this);
        this.deleteRadio = this.deleteRadio.bind(this);
        this.deleteSelectbox = this.deleteSelectbox.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isOpen) {
            this.setState({
                question_body: nextProps.isNew ? '': nextProps.question.question_body,
                question_char_limit: nextProps.isNew ? 0 : nextProps.question.question_char_limit,
                canSelectCharLimit: nextProps.isNew ? false : nextProps.question.question_char_limit > 0,
                question_type: nextProps.isNew ? null : nextProps.question.question_type,
                checkbox: nextProps.isNew || nextProps.question.question_type != Const.QUESTION_TYPE_CHECK_BOX ? ['サンプル1', 'サンプル2'] : nextProps.question.question_nos.split(','),
                radio: nextProps.isNew || nextProps.question.question_type != Const.QUESTION_TYPE_RADIO_BUTTON ? ['サンプル1', 'サンプル2'] : nextProps.question.question_nos.split(','),
                selectbox: nextProps.isNew || nextProps.question.question_type != Const.QUESTION_TYPE_SELECT_BOX ? ['サンプル1', 'サンプル2'] : nextProps.question.question_nos.split(','),
            });
        } else {
            this.setState({});
        }
    }

    addCheckbox() {
        let checkbox = this.state.checkbox;
        checkbox.push('サンプル' + (checkbox.length+1));
        this.setState({checkbox})
    }

    deleteCheckbox(index) {
        let checkbox = this.state.checkbox;
        checkbox.splice(index, 1);
        this.setState({checkbox});
    }

    onSortEndCheckbox({oldIndex, newIndex}) {
        let {checkbox} = this.state;
        this.setState({
            checkbox: arrayMove(checkbox, oldIndex, newIndex)
        });
    }

    addRadio() {
        let radio = this.state.radio;
        radio.push('サンプル' + (radio.length+1));
        this.setState({radio})
    }

    deleteRadio(index) {
        let radio = this.state.radio;
        radio.splice(index, 1);
        this.setState({radio})
    }

    onSortEndRadio({oldIndex, newIndex}) {
        let {radio} = this.state;
        this.setState({
            radio: arrayMove(radio, oldIndex, newIndex)
        });
    }

    addSelectbox() {
        let selectbox = this.state.selectbox;
        selectbox.push('サンプル' + (selectbox.length+1));
        this.setState({selectbox})
    }

    deleteSelectbox(index) {
        let selectbox = this.state.selectbox;
        selectbox.splice(index, 1);
        this.setState({selectbox})
    }


    onSortEndSelectbox({oldIndex, newIndex}) {
        let {selectbox} = this.state;
        this.setState({
            selectbox: arrayMove(selectbox, oldIndex, newIndex)
        });
    }

    handleToggleCharLimitChange(e) {
        let charLimit = this.state.question_char_limit;
        let canSelectCharLimit = !this.state.canSelectCharLimit;
        if (!canSelectCharLimit) {
            charLimit = 0;
        }
        this.setState({canSelectCharLimit: canSelectCharLimit, question_char_limit: charLimit})
    }

    handleSave() {
        const {question_body, question_char_limit, question_type, checkbox, radio, selectbox} = this.state;
        if (!question_body) {
            alert("質問文を入力してください。");
            return;
        }
        if (!question_type) {
            alert("解答欄を選択してください。");
            return;
        }
        let question_nos;
        switch (question_type) {
            case Const.QUESTION_TYPE_CHECK_BOX:
                question_nos = checkbox;
                break;
            case Const.QUESTION_TYPE_RADIO_BUTTON:
                question_nos = radio;
                break;
            case Const.QUESTION_TYPE_SELECT_BOX:
                question_nos = selectbox;
                break;
            default:
                question_nos = [];
        }
        question_nos = question_nos.join(',');
        if (this.props.isNew) {
            this.props.createQuestion({
                question_body,
                question_char_limit,
                question_type,
                question_nos,
                questionnaire_type: Const.QUESTIONNAIRE_TYPE_OTHER
            });
        } else {
            this.props.updateQuestion({
                id: this.props.question.id,
                question_body,
                question_char_limit,
                question_type,
                question_nos,
                questionnaire_type: Const.QUESTIONNAIRE_TYPE_OTHER
            });
        }
    }

    editCheckboxValue(index, value) {
        let checkbox = this.state.checkbox;
        checkbox[index] = value;
        this.setState({checkbox});
    }

    editRadioValue(index, value) {
        let radio = this.state.radio;
        radio[index] = value;
        this.setState({radio});
    }

    editSelectboxValue(index, value) {
        let selectbox = this.state.selectbox;
        selectbox[index] = value;
        this.setState({selectbox});
    }

    render() {
        const {isOpen, showModal, isNew} = this.props;
        return (
            <Modal isOpen={isOpen}>
                <div className="modal-window_page question_form">
                    <dl className="widget">
                        <dt className="contents__modal__h2">
                            <span className="contents__modal__h2--title">{isNew ? 'アンケート項目の作成' : 'アンケート項目の編集'}</span>
                            <div className="contents__modal__del" onClick={() => {showModal(Const.MODAL_CREATED_QUESTION_LIST)}}></div>
                        </dt>
                        <dd className="widget__page__information__select">
                            <dl>
                                <dt>質問文</dt>
                                <dd>
                                    <input type="text"
                                           value={this.state.question_body}
                                           onChange={(e) => {this.setState({question_body: e.target.value})}}/>
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>解答欄</dt>
                                <dd>
                                    <RadioButton id={'question_' + Const.QUESTION_TYPE_FREE_TEXT_ONLY_HALF_SIZE}
                                                 label="1行テキスト（半角英数）"
                                                 value={Const.QUESTION_TYPE_FREE_TEXT_ONLY_HALF_SIZE}
                                                 isChecked={this.state.question_type == Const.QUESTION_TYPE_FREE_TEXT_ONLY_HALF_SIZE}
                                                 check={() => {this.setState({question_type: Const.QUESTION_TYPE_FREE_TEXT_ONLY_HALF_SIZE})}}
                                                 name="question"/>
                                    <div className="example_answer_input">
                                        <input type="text" pattern="^[0-9A-Za-z]+$"/>
                                        <div className="group_input">
                                            <dl>
                                                <p>
                                                    文字数制限</p>
                                                <Toggle defaultChecked={this.state.canSelectCharLimit}
                                                        onChange={this.handleToggleCharLimitChange}/>
                                                <input type="number" min="0"
                                                       disabled={!this.state.canSelectCharLimit}
                                                       value={this.state.question_char_limit}
                                                       onChange={(e) => {this.setState({question_char_limit: e.target.value})}}/>
                                                <p>文字まで</p>
                                            </dl>
                                        </div>
                                    </div>
                                    <RadioButton id={'question_' + Const.QUESTION_TYPE_FREE_TEXT}
                                                 label="1行テキスト（全角＋半角英数）"
                                                 value={Const.QUESTION_TYPE_FREE_TEXT}
                                                 isChecked={this.state.question_type == Const.QUESTION_TYPE_FREE_TEXT}
                                                 check={() => {this.setState({question_type: Const.QUESTION_TYPE_FREE_TEXT})}}
                                                 name="question"/>
                                    <div className="example_answer_input">
                                        <input type="text"/>
                                    </div>
                                    <RadioButton id={'question_' + Const.QUESTION_TYPE_TEXTAREA}
                                                 label="複数行テキスト"
                                                 value={Const.QUESTION_TYPE_TEXTAREA}
                                                 isChecked={this.state.question_type == Const.QUESTION_TYPE_TEXTAREA}
                                                 check={() => {this.setState({question_type: Const.QUESTION_TYPE_TEXTAREA})}}
                                                 name="question"/>
                                    <div className="example_answer_input">
                                        <textarea>
                                        </textarea>
                                    </div>
                                    <RadioButton id={'question_' + Const.QUESTION_TYPE_CHECK_BOX}
                                                 label="複数選択（チェックボックス）"
                                                 value={Const.QUESTION_TYPE_CHECK_BOX}
                                                 isChecked={this.state.question_type == Const.QUESTION_TYPE_CHECK_BOX}
                                                 check={() => {this.setState({question_type: Const.QUESTION_TYPE_CHECK_BOX})}}
                                                 name="question"/>
                                    <div className="example_answer_input">
                                        <div className="example_checkbox">
                                            {this.state.checkbox.map((lebel, index) => <Checkbox id={'checkbox_' + index} label={lebel} editable={true} key={index}/>)}
                                        </div>
                                        <AnswerList items={this.state.checkbox}
                                                    btnText="チェックボックスの追加"
                                                    addItem={this.addCheckbox}
                                                    editItem={this.editCheckboxValue.bind(this)}
                                                    deleteItem={this.deleteCheckbox}
                                                    onSortEnd={this.onSortEndCheckbox}/>
                                    </div>
                                    <RadioButton id={'question_' + Const.QUESTION_TYPE_RADIO_BUTTON}
                                                 label="単一選択（ラジオボタン）"
                                                 value={Const.QUESTION_TYPE_RADIO_BUTTON}
                                                 isChecked={this.state.question_type == Const.QUESTION_TYPE_RADIO_BUTTON}
                                                 check={() => {this.setState({question_type: Const.QUESTION_TYPE_RADIO_BUTTON})}}
                                                 name="question"/>
                                    <div className="example_answer_input">
                                        <div className="example_radio">
                                            <form>
                                            {this.state.radio.map((lebel, index) => <RadioButton id={'radio_' + index} label={lebel} editable={true} key={index} radioName="radio"/>)}
                                            </form>
                                        </div>
                                        <AnswerList items={this.state.radio}
                                                    btnText="ラジオの追加"
                                                    addItem={this.addRadio}
                                                    editItem={this.editRadioValue.bind(this)}
                                                    deleteItem={this.deleteRadio}
                                                    onSortEnd={this.onSortEndRadio}/>
                                    </div>
                                    <RadioButton id={'question_' + Const.QUESTION_TYPE_SELECT_BOX}
                                                 label="単一選択（プルダウン）"
                                                 value={Const.QUESTION_TYPE_SELECT_BOX}
                                                 isChecked={this.state.question_type == Const.QUESTION_TYPE_SELECT_BOX}
                                                 check={() => {this.setState({question_type: Const.QUESTION_TYPE_SELECT_BOX})}}
                                                 name="question"/>
                                    <div className="example_answer_input">
                                        <div className="example_selectbox">
                                            <DropDownList data={this.state.selectbox} editable={true}/>
                                        </div>
                                        <AnswerList items={this.state.selectbox}
                                                    btnText="プルダウンの追加"
                                                    addItem={this.addSelectbox}
                                                    editItem={this.editSelectboxValue.bind(this)}
                                                    deleteItem={this.deleteSelectbox}
                                                    onSortEnd={this.onSortEndSelectbox}/>
                                    </div>
                                    <RadioButton id={'question_' + Const.QUESTION_TYPE_DATE}
                                                 label="年月日選択"
                                                 value={Const.QUESTION_TYPE_DATE}
                                                 isChecked={this.state.question_type == Const.QUESTION_TYPE_DATE}
                                                 check={() => {this.setState({question_type: Const.QUESTION_TYPE_DATE})}}
                                                 name="question"/>
                                    <div className="example_answer_input">
                                        <DateSelect/>
                                    </div>
                                </dd>
                            </dl>
                        </dd>
                        <div>
                            <a className="btn-base" onClick={this.handleSave}>{isNew ? 'アンケート項目の追加' : 'アンケート項目の変更'}</a>
                        </div>
                    </dl>
                </div>
            </Modal>
        );
    }
}

export default QuestionForm;
