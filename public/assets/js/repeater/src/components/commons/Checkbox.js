import React, { Component, PropTypes } from 'react';

class Checkbox extends Component {

    onChange(e) {
        if (this.props.onChange) {
            this.props.onChange(this.props.checkValue, e.target.checked);
        } else {
            this.props.check(this.props.id.replace(/[^\d.]/g, ''));
        }
    }

    render() {
        const { id, label, className, isChecked, editable } = this.props;
        return (
            <div className={"d-checkbox " + className}>
                {editable ? <input type="checkbox" id={id} onChange={(e) => this.onChange(e)}/> : <input type="checkbox" id={id} onChange={(e) => this.onChange(e)} checked={isChecked}/>}
                <label htmlFor={id}><span>{label}</span></label>
            </div>
        );
    }
}

Checkbox.propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    label: PropTypes.string,
    check: PropTypes.func,
    onChange: PropTypes.func,
    editable: PropTypes.bool,
    isChecked: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    checkValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Checkbox.defaultProps = {
    editable: false,
    isChecked: false,
    check: () => {},
};

export default Checkbox;
