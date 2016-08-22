import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
class DropDownList extends Component {
    render() {
        const { className, data, eachCallback, hasEmptyOption, onChange, defaultValue, isRequired, selectName, editable } =  this.props;
        return (
            <div className={"dropdown__list" + (className ? " " + className : "")}>
                {editable ?
                    <select onChange={onChange} required={isRequired}
                            name={selectName}>
                        {hasEmptyOption ? <option></option> : null}
                        {data.map(eachCallback)}
                    </select> :
                    <select onChange={onChange} value={defaultValue} required={isRequired}
                            name={selectName}>
                        {hasEmptyOption ? <option></option> : null}
                        {data.map(eachCallback)}
                    </select>}
            </div>
        );
    }
}

DropDownList.propTypes = {
    hasEmptyOption: PropTypes.bool,
    isRequired: PropTypes.bool,
    editable: PropTypes.bool,
    data: PropTypes.array.isRequired,
    eachCallback: PropTypes.func,
    onChange: PropTypes.func,
    defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    selectName: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
};

DropDownList.defaultProps = {
    style: {},
    isRequired: false,
    editable: false,
    data: [],
    hasEmptyOption: false,
    eachCallback: (element, index) => <option value={index} key={index}>{element}</option>,
    defaultValue: '',
    selectName: ''
};


export default DropDownList;
