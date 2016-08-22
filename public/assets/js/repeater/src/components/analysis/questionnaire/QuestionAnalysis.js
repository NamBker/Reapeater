import React, {Component, PropTypes} from 'react';
import moment from 'moment'
import { Link } from 'react-router'
import QuestionContent from './answer/Question'


class QuestionAnalysis extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentWillMount() {
        this.props.fecthAnnalysis(this.props.params.questionnaireId);
    }

    render() {
        const { questionAnalysis } = this.props;
        if (!questionAnalysis.id) return null;
        return (
            <div className="contents__container mb20">
                <div className="contents__h2 contents__icon--enquete">
                    <span className="contents__container__h2--note">{Globalize.localize('questionnaire_analysis_setting', Globalize.culture())}</span>
                    <span className="contents__container__h2__btn_edit"><Link to={"/questionnaire/edit/" + questionAnalysis.id} className="btn_edit">{Globalize.localize('questionnaire_move_to_detail', Globalize.culture())}</Link></span>
                </div>

                <div className="contents__container__content">
                    <div className="contents__container__box mb20">
                        <div className="contents__container__dl clearfix">
                            <div className="contents__container__dt">{Globalize.localize('questionnaire_id', Globalize.culture())}</div>
                            <div className="contents__container__dd">{questionAnalysis.id}</div>
                        </div>
                        <div className="contents__container__dl clearfix">
                            <div className="contents__container__dt">{Globalize.localize('questionnaire_name', Globalize.culture())}</div>
                            <div className="contents__container__dd">{questionAnalysis.questionnaire_name}</div>
                        </div>
                        <div className="contents__container__dl clearfix">
                            <div className="contents__container__dt">{Globalize.localize('questionnaire_answer_time', Globalize.culture())}</div>
                            <div className="contents__container__dd">{moment(questionAnalysis.questionnaire_limit).format('LL')}</div>
                        </div>
                    </div>
                    {questionAnalysis.question.map((question, index) => {
                        return <QuestionContent question={question} index={index} key={index}/>
                    })}


                    <div className="widget__welcome__contents__bottom widget__page__register__button">
                        <Link to="/analysis/questionnaire" className="btn-gray padding_btn_sub">{Globalize.localize('questionnaire_back_to_analysis', Globalize.culture())}</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default QuestionAnalysis