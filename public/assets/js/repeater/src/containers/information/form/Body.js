import { connect } from 'react-redux'

import Body from '../../../components/information/Body'

const mapStateToProps = (state) => {
    return {
        coupons: state.coupons,
        random_coupons: state.random_coupons,
        questionnaires: state.questionnaires,
        questions: state.questions,
        currentUser: state.currentUser,
    }
};

export default connect(mapStateToProps)(Body);