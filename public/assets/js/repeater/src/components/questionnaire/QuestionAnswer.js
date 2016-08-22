import React, { Component, PropTypes } from 'react';

import { uuid } from '../../utils/CommonUtils';

import CheckList from '../commons/CheckList';
import RadioGroup from '../commons/RadioGroup';
import DropDownList from '../commons/DropDownList';
import DateSelect from '../commons/DateSelect';

import { QUESTION_TYPE_FREE_TEXT_ONLY_HALF_SIZE, QUESTION_TYPE_FREE_TEXT, QUESTION_TYPE_TEXTAREA, QUESTION_TYPE_CHECK_BOX, QUESTION_TYPE_RADIO_BUTTON, QUESTION_TYPE_SELECT_BOX, QUESTION_TYPE_DATE } from '../../constants/Constants';

class QuestionAnswer extends Component {
    render() {
        const { type, labels, isGarake } = this.props;
        switch (type) {
            case QUESTION_TYPE_FREE_TEXT_ONLY_HALF_SIZE:
                return <input
                    className="widget__page__input__question__answer"
                    type="text"
                    pattern="^[0-9A-Za-z]+$"/>;
            case QUESTION_TYPE_FREE_TEXT:
                return <input
                    className="widget__page__input__question__answer"
                    type="text"
                    pattern="^[0-9A-Za-z]+$"/>;
            case QUESTION_TYPE_TEXTAREA:
                return <textarea
                    className="widget__page__input__question__answer"/>
            case QUESTION_TYPE_CHECK_BOX:
                let keyPrefix = uuid();
                let checkListData = labels.split(',').map((label, index) => {return {label: label, key: keyPrefix + "_" + index}});
                return <CheckList
                    className="widget__page__input__question__answer"
                    data={checkListData}
                    onChangedSelection={(keys) => {}}
                    dataLabelKey='label'
                    dataValueKey='key'
                    editable={true}
                    />;
            case QUESTION_TYPE_RADIO_BUTTON:
                let radioGroupData = labels.split(',').map((label, index) => {return {label: label, key: index}});
                return <RadioGroup
                    className="widget__page__input__question__answer"
                    data={radioGroupData}
                    value={radioGroupData[0].key}
                    groupName={uuid()}
                    dataLabelKey='label'
                    dataValueKey='key'
                    onChange={(value) => {}}
                    editable={true}
                    />;
            case QUESTION_TYPE_SELECT_BOX:
                let labels = [Globalize.localize('no_selection_message', Globalize.culture()) ,...labels.split(',')]
                if (isGarake) {
                    return <select className="widget__page__input__question__answer">
                        {labels.map((label, index) => <option key={index}>{label}</option>)}
                    </select>
                }
                return <DropDownList
                    className="widget__page__input__question__answer"
                    data={labels}
                    editable={true}
                    />;
            case QUESTION_TYPE_DATE:
                return <DateSelect
                    className="widget__page__input__question__answer"
                    isGarake={isGarake}/>;
        }
    }
}

QuestionAnswer.propTypes = {
    type: PropTypes.number.isRequired,
    labels: PropTypes.string,
    isOrigin: PropTypes.bool,
};

QuestionAnswer.defaultProps = {
    isOrigin: false,
}

export default QuestionAnswer;
