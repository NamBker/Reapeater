import React, {Component, PropTypes} from 'react';
import ReactPaginate from 'react-paginate';
import Modal from '../../../commons/Modal'
import { PER_PAGE } from '../../../../constants/Constants'

class AnswerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
        };

        this.handlePageClick = this.handlePageClick.bind(this);
    }

    handlePageClick(data) {
        let page = data.selected + 1;
        this.setState({page});
    }

    render() {
        const { isOpen, questionOrder, question, closeModal, responseCount} = this.props;
        const { page } = this.state;
        if (!isOpen) return null;
        let answerList = [];
        for (let i = (page - 1) * PER_PAGE; i < page * PER_PAGE && i < question.daily_question.length; i++) {
            let dq = question.daily_question[i];
            answerList.push(
                <div className="contents__modal__menu--list" key={i}>
                    <div className="list-box">
                        <div className="answer">{dq.question_response}</div>
                        <div className="response">{dq.question_response_count + Globalize.localize('count', Globalize.culture())}</div>
                    </div>
                </div>
            );
        }

        return (
            <Modal isOpen={true}>
                <div className="contents__modal__menu">
                    <div className="contents__modal__h2">
                        <div className="contents__modal__h2--title">
                            <span className="blue">{Globalize.localize('question', Globalize.culture())}{questionOrder + 1}</span>{question.question_body}</div>
                        <div className="contents__modal__del">
                            <a onClick={closeModal}><img src="/assets/img/cross2.png" className="vertical-middle"/></a>
                        </div>
                    </div>
                    <div className="contents__modal__content">
                        <div className="clearfix">
                            <div className="contents__modal__menu--box clearfix">
                                <div className="scroll">
                                    {answerList}
                                </div>
                                <div className="contents__modal__menu--list2 line">
                                    <div className="contents__pagination">
                                        <div className="number child">{responseCount}</div>
                                        <ReactPaginate
                                            previousLabel={" "}
                                            forceSelected={page - 1}
                                            nextLabel={" "}
                                            breakLabel={<a>...</a>}
                                            pageNum={Math.ceil(question.daily_question.length / PER_PAGE)}
                                            marginPagesDisplayed={2}
                                            pageRangeDisplayed={5}
                                            clickCallback={this.handlePageClick}
                                            containerClassName={"pagination information_paginate"}
                                            subContainerClassName={"pages pagination"}
                                            activeClassName={"active"}/>
                                        <div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center"><a className="btn-base contents__btn--save" onClick={closeModal}>{Globalize.localize('filter_close', Globalize.culture())}</a></div>
                    </div>

                </div>
            </Modal>
        );
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
    responsive : true,
};

export default AnswerList