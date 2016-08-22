import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import QuestionAnalysis from '../../../components/analysis/questionnaire/QuestionAnalysis'
import * as QuestionnaireAction from '../../../actions/questionnaireanalysis'

const mapStateToProps = (state) => {
    return {
        questionAnalysis: state.questionAnalysis,
    }
};

const mapDispatchToProps = (dispatch) => {
    const { fetchQuestionAnalysis, clearQuestionAnalysis } = bindActionCreators(QuestionnaireAction, dispatch);
    return {
        fecthAnnalysis: fetchQuestionAnalysis,
        clearAnalysis: clearQuestionAnalysis
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionAnalysis);