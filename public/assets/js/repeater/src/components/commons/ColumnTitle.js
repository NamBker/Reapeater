import React, { Component, PropTypes } from 'react';

class ColumnTitle extends Component {
    render() {
        const { title, style } = this.props;
        return (
            <div style={style}>
                <span>{title}</span>
            </div>
        );
    }
}

ColumnTitle.propTypes = {
    title: PropTypes.string.isRequired,
    style: PropTypes.object,
};
ColumnTitle.defaultProps = {
    style: {}
}
export default ColumnTitle;