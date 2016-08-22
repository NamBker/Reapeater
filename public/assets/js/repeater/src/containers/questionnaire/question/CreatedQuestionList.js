import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as QuestionAction from '../../../actions/question'
import * as ModalAction from '../../../actions/modal'
import CreatedQuestionList from '../../../components/questionnaire/modal/CreatedQuestionList'

const mapStateToProps = (state, ownProps) => {
    return {
        questions: state.questions,
        count: state.count
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {...bindActionCreators(QuestionAction, dispatch), ...bindActionCreators(ModalAction, dispatch)}
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreatedQuestionList)