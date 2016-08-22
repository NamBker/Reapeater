import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as QuestionAction from '../../../actions/question'
import * as ModalAction from '../../../actions/modal'
import QuestionForm from '../../../components/questionnaire/modal/QuestionForm'

const mapStateToProps = (state, ownProps) => {
    return {

    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {...bindActionCreators(QuestionAction, dispatch), ...bindActionCreators(ModalAction, dispatch)}

};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(QuestionForm)