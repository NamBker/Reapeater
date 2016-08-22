import React, { Component, PropTypes } from 'react';
import { uuid } from '../../utils/CommonUtils';

class RadioGroup extends Component {
    render() {
        const { id, data, groupName, dataLabelKey, dataValueKey, isVisibleData, value, className, onChange, editable } = this.props;
        return (
            <div className={"radio__button__group__contents" + (className ? " " + className : "")}>
                {data.map((element) => {
                    return isVisibleData == null || isVisibleData(element) ?
                        <label key={id + '_' + element[dataValueKey]} className="contents__container__radio">
                            {editable ?
                            <input type="radio"
                                id={id + '_' + element[dataValueKey]}
                                name={groupName}
                                value={element[dataValueKey]}
                                onChange={(e) => onChange(e.target.value)}
                                className="input__radio"
                            />
                            :
                            <input type="radio"
                                id={id + '_' + element[dataValueKey]}
                                name={groupName}
                                value={element[dataValueKey]}
                                checked={element[dataValueKey] == value}
                                onChange={(e) => onChange(e.target.value)}
                                className="input__radio"
                            />}
                            <span className="btn_label">{element[dataLabelKey]}</span>
                        </label> : null})}
            </div>
        );
    }
}

RadioGroup.propTypes = {
    id: PropTypes.string,
    data: PropTypes.array.isRequired,
    groupName: PropTypes.string.isRequired,
    dataLabelKey: PropTypes.string.isRequired,
    dataValueKey: PropTypes.string.isRequired,
    isVisibleData: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    className: PropTypes.string,
    editable: PropTypes.bool,
};

RadioGroup.defaultProps = {
    isVisibleData: null,
    id: uuid(),
    editable: false,
};

export default RadioGroup;
