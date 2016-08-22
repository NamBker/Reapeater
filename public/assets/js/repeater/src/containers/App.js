import { connect } from 'react-redux';
import App from '../components/App'


const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
    }
};

export default connect(mapStateToProps)(App);