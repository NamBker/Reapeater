import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router'
import moment from 'moment';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const {year, month, questionnaires,
            previous, next} = this.props;
        console.log(questionnaires);
        return (
            <div className="widget widget__wrapper widget__memberanalysis">
                <div className="widget__memberanalysis__table__label">
                    <div>{year + '年' + ("0" + month).slice(-2) + '月'}</div>
                    <div><button className="btn btn-default move_to_left" onClick={previous}></button></div>
                    <div><button className="btn btn-default move_to_right" onClick={next}></button></div>
                </div>
                <div className="questionnaireAnalysis-table-wrap">
                    <table className="questionnaireAnalysis-table">
                        <thead>
                        <tr>
                            <th></th>
                            <th>ID</th>
                            <th>{Globalize.localize('title', Globalize.culture())}</th>
                            <th>{Globalize.localize('questionnaire_answer_time', Globalize.culture())}</th>
                            <th>{Globalize.localize('questionnaire_target', Globalize.culture())}</th>
                            <th>{Globalize.localize('questionnaire_answerer', Globalize.culture())}</th>
                            <th>{Globalize.localize('questionnaire_answerer_percent', Globalize.culture())}</th>
                            <th></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {questionnaires.map((questionnaire, index) => {
                            return <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{questionnaire.id}</td>
                                <td>{questionnaire.questionnaire_name}</td>
                                <td>{moment(questionnaire.questionnaire_limit).format('LL')}</td>
                                <td>{questionnaire.target_user_count}</td>
                                <td>{questionnaire.answered_user_count}</td>
                                <td>{Math.round(questionnaire.answered_user_count * 100 / questionnaire.target_user_count)}%</td>
                                <td><Link to={"/questionnaire/edit/" + questionnaire.id} className="btn btn-default">{Globalize.localize('detail', Globalize.culture())}</Link></td>
                                <td><Link className="btn btn-default" to={`/analysis/questionnaire/${questionnaire.id}/answer`}>{Globalize.localize('result', Globalize.culture())}</Link></td>
                            </tr>
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Table
