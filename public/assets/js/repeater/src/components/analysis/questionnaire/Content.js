import React, {Component, PropTypes} from 'react';

import Chart from '../../../containers/analysis/questionnaire/Chart'
import Table from '../../../containers/analysis/questionnaire/Table'

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        const { year, month } = this.props;
        return (
            <div>
                <Chart/>
                <Table {...this.props}/>
            </div>
        );
    }
}

export default Content