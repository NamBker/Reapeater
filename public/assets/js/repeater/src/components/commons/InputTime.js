import React, { Component, PropTypes } from 'react';
import { timeList } from '../../utils/CommonUtils'

class InputTime extends Component {
    render() {
        return (
            <select {...this.props}>
                {Object.keys(timeList).map((time, index) => <option value={time} key={index}>{timeList[time]}</option>)}
            </select>
        );
    }
}

export default InputTime;
