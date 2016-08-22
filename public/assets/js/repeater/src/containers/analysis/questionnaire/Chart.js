import { connect } from 'react-redux';
import Chart from '../../../components/analysis/questionnaire/Chart'

import { removeEmptyInDataset } from '../../../utils/CommonUtils'

const mapStateToProps = (state, ownProps) => {
    let questionnaireDataset = [
        {
            color:     "#0076de",
            lineColor: "#0076de", // 凡例の色
            legendName:Globalize.localize('questionnaire_answerer', Globalize.culture()),
            value: 0,
        },
        {
            color:     "#e5f3ff",
            lineColor: "#e5f3ff", // 凡例の色
            legendName:Globalize.localize('questionnaire_not_answerer', Globalize.culture()),
            value: 0,
        }
    ];
    let latestQuestionnaire = null;
    if (state.questionnaireAnalysis.length > 0) {
        latestQuestionnaire = state.questionnaireAnalysis[0];
        questionnaireDataset[0].value = latestQuestionnaire.answered_user_count;
        questionnaireDataset[1].value = latestQuestionnaire.target_user_count - latestQuestionnaire.answered_user_count;
    }
    let total = questionnaireDataset[0].value + questionnaireDataset[1].value;
    if (total > 0) {
        questionnaireDataset[0].label = questionnaireDataset[0].legendName + questionnaireDataset[0].value + Globalize.localize('people', Globalize.culture()) + "(" + Math.round(questionnaireDataset[0].value * 100 / total) + "%)";
        questionnaireDataset[1].label = questionnaireDataset[1].legendName + questionnaireDataset[1].value + Globalize.localize('people', Globalize.culture()) + "(" + Math.round(questionnaireDataset[1].value * 100 / total) + "%)";
    }
    return {
        questionnaireDataset: removeEmptyInDataset(questionnaireDataset), latestQuestionnaire, total
    }
};


export default connect(mapStateToProps)(Chart)