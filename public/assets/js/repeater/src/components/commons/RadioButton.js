import React, { Component, PropTypes } from 'react';

class RadioButton extends Component {


    render() {
        const { id, label, classRadio, radioName, isChecked, value, check, editable } = this.props;
        return (
            <label className={"contents__container__radio mr15 " + classRadio}>
                {editable ? <input type="radio" id={id} name={radioName} value={value} onChange={check} className="input__radio" /> : <input type="radio" id={id} name={radioName} checked={isChecked} value={value} onChange={check} className="input__radio" />}
                <span className="btn_label">{label}</span>
            </label>
        );
    }
}

RadioButton.propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    label: PropTypes.string,
    isChecked: PropTypes.bool,
    check: PropTypes.func,
    editable: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    radioName: PropTypes.string
};

RadioButton.defaultProps = {
    editable: false,
    isChecked: false,
    check: () => {},
};
export default RadioButton;