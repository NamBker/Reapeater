import { connect } from 'react-redux';
import ModalGroup from '../../components/questionnaire/modal/ModalGroup'

const mapStateToProps = (state) => {
    return {
        modalType: state.modalType
    }
};

export default connect(
    mapStateToProps
)(ModalGroup)
