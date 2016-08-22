import React, {Component, PropTypes} from 'react';
import { Pie as PieChart } from 'react-chartjs'
import {
    QUESTION_TYPE_FREE_TEXT_ONLY_HALF_SIZE,
    QUESTION_TYPE_FREE_TEXT,
    QUESTION_TYPE_TEXTAREA,
    QUESTION_TYPE_RADIO_BUTTON,
    QUESTION_TYPE_SELECT_BOX,
    QUESTION_TYPE_CHECK_BOX,
    QUESTION_TYPE_DATE
} from '../../../../constants/Constants'
import AnswerList from './AnswerList'

import { removeEmptyInDataset } from '../../../../utils/CommonUtils'

let questionType = {
    1: Globalize.localize('question_type_text_alphabeta', Globalize.culture()),
    2: Globalize.localize('question_type_text', Globalize.culture()),
    3: Globalize.localize('question_type_textarea', Globalize.culture()),
    4: Globalize.localize('question_type_checkbox', Globalize.culture()),
    5: Globalize.localize('question_type_radio', Globalize.culture()),
    6: Globalize.localize('question_type_dropdown', Globalize.culture()),
    7: Globalize.localize('question_type_date', Globalize.culture())
};

class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }


    render() {
        const {question, index} = this.props;
        let responseCount = 0;
        question.daily_question.map((answer) => {
            responseCount += answer.question_response_count;
        });
        let questionDataset = [
            {
                color:     "#0076de",
                lineColor: "#0076de", // 凡例の色
                value: 0,
            },
            {
                color:     "#2f93eb",
                lineColor: "#2f93eb", // 凡例の色
                value: 0,
            },
            {
                color:     "#61b0f5",
                lineColor: "#61b0f5", // 凡例の色
                value: 0,
            },
            {
                color:     "#99cffe",
                lineColor: "#99cffe", // 凡例の色
                value: 0,
            },
            {
                color:     "#cce8ff",
                lineColor: "#cce8ff", // 凡例の色
                value: 0,
            },
            {
                color:     "#e5f3ff",
                lineColor: "#e5f3ff", // 凡例の色
                value: 0,
            }
        ];
        let answers = [...question.daily_question];
        answers.sort((a, b) => b.question_response_count - a.question_response_count);
        for (let i = 0; i < 5 && i < answers.length; i++) {
            questionDataset[i].value = answers[i].question_response_count;
            questionDataset[i].label = answers[i].question_response + answers[i].question_response_count + Globalize.localize('count', Globalize.culture()) + "(" + Math.round(answers[i].question_response_count*100/responseCount) +  "%)";
        }
        for (let i = 5; i < answers.length; i++) {
            questionDataset[5].value += answers[i].question_response_count;
        }
        questionDataset[5].label = Globalize.localize('other', Globalize.culture()) + questionDataset[5].value + Globalize.localize('count', Globalize.culture()) + "(" + Math.round(questionDataset[5].value *100/responseCount) +  "%)";

        if (question.question_type == QUESTION_TYPE_RADIO_BUTTON || question.question_type == QUESTION_TYPE_SELECT_BOX || question.question_type == QUESTION_TYPE_CHECK_BOX) {
            return (
                <div className="contents__container__box mb20">
                    <div className="contents__container__dl clearfix">
                        <div className="contents__container__agg lineR width__half">
                            <div className="contents__container__dl__agg clearfix">
                                <div className="contents__container__dt__inner">{Globalize.localize('question', Globalize.culture())}{index+1}</div>
                                <div className="contents__container__dd__inner">{question.question_body}</div>
                            </div>
                            <div className="contents__container__dl__inner clearfix">
                                <div className="contents__container__dt__inner_add">
                                    <div className="contents__container__dl__inner clearfix">
                                        <div className="contents__container__dt__inner">{Globalize.localize('question_answer_field', Globalize.culture())}</div>
                                        <div className="contents__container__dd__inner">{questionType[question.question_type]}</div>
                                    </div>
                                </div>
                                <div className="contents__container__add_graph">
                                    <span className="contents__container__add_graph__total">
                                    {Globalize.localize('answer_count', Globalize.culture())}<span>{responseCount}</span>{Globalize.localize('count', Globalize.culture())}
                                    </span>
                                    <div className="pie-graph">
                                        {responseCount > 0 ? <PieChart data={removeEmptyInDataset(questionDataset)} options={pieOptions} height="240" redraw/> : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="contents__container__agg width__half">
                            <table className="contents__container__dl__agg_table">
                                <thead>
                                <tr>
                                    <th></th>
                                    <th>{Globalize.localize('answer', Globalize.culture())}</th>
                                    <th>{Globalize.localize('number', Globalize.culture())}</th>
                                    <th>{Globalize.localize('rate', Globalize.culture())}</th>
                                </tr>
                                </thead>
                            </table>
                            <div className="contents__container__dl__agg_table_scroll">
                                <table className="contents__container__dl__agg_table">
                                    <tbody>
                                    {question.daily_question.map((daily_question, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{daily_question.question_response}</td>
                                                <td>{daily_question.question_response_count}</td>
                                                <td>{Math.round(daily_question.question_response_count*100/responseCount)}%</td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                            <table className="contents__container__dl__agg_table">
                                <tfoot>
                                <tr>
                                    <th></th>
                                    <th>{Globalize.localize('map_total', Globalize.culture())}</th>
                                    <th>{responseCount}</th>
                                    <th>100%</th>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="contents__container__box mb20">
                    <AnswerList isOpen={this.state.isOpen} questionOrder={index} question={question} closeModal={() => {this.setState({isOpen: false})}} responseCount={responseCount}/>
                    <div className="contents__container__dl clearfix">
                        <div className="contents__container__agg">
                            <div className="contents__container__dl__agg clearfix">
                                <div className="contents__container__dt__inner">{Globalize.localize('question', Globalize.culture())}{index+1}</div>
                                <div className="contents__container__dd__inner">{question.question_body}<span
                                    className="contents__container__add_graph__total">{Globalize.localize('answer_count', Globalize.culture())}<span>{question.daily_question.length}</span>{Globalize.localize('count', Globalize.culture())}</span>
                                </div>
                            </div>
                            <div className="contents__container__dl__inner clearfix">
                                <div className="contents__container__dt__inner_add">
                                    <div className="contents__container__dl__inner clearfix">
                                        <div className="contents__container__dt__inner">{Globalize.localize('question_answer_field', Globalize.culture())}</div>
                                        <div className="contents__container__dd__inner">{responseCount}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="contents__container__dd icon__cell">
                            <input type="button" value={Globalize.localize('answer_list', Globalize.culture())} className="btn_edit" onClick={() => {this.setState({isOpen: true})}}/>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

// オプション
let pieOptions = {
    // 凡例表示用の HTML テンプレート
    legendTemplate : "<ul className=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\">&nbsp;&nbsp;&nbsp;</span> <%if(datasets[i].legendName){%><%=datasets[i].legendName%><%}%></li><%}%></ul>",
    animationEasing : "easeOutQuad",
    tooltipTemplate: "<%if (label){%><%=label%><%} %>",
    onAnimationComplete: function(){
        this.showTooltip(this.segments, true);
    },
    tooltipEvents: [],
    showTooltips: true,
    tooltipFillColor : "#fff",
    tooltipFontColor: "#000",
    segmentShowStroke: false,
};

export default Question