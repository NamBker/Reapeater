import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router'

import Routes from '../../constants/Routes'

class Navigator extends Component {
    render() {
        const route = Routes[this.props.path];
        return (
            <dl className="widget__page mb10">
                <Link to="/">HOME</Link>
                {route.parent ? <span className="widget__page__arrow"> > </span> : null}
                {route.parent ? <Link to={route.parent}>{ Globalize.localize(Routes[route.parent].title, Globalize.culture()) }</Link> : null}
                <span className="widget__page__arrow"> > </span>
                <span className="widget__page__title">{ this.props.pathTitle + Globalize.localize(route.title, Globalize.culture()) }</span>
            </dl>
        );
    }
}

Navigator.propType = {
    path: PropTypes.string.isRequired,
};


export default Navigator;