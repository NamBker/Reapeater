import { connect } from 'react-redux';
import Menu from '../../components/commons/Menu'

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
    }
};

export default connect(mapStateToProps)(Menu);