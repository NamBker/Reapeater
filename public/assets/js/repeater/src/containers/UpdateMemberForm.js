import React from 'react';
import { connect } from 'react-redux';

import MemberInputForm from './member/MemberInputForm';

const mapStateToProps = (state) => {
    return {
        isNew: false,
    };
};

export default connect(mapStateToProps)(MemberInputForm);

