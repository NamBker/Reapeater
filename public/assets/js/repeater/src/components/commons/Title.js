import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Routes from '../../constants/Routes'
import { doCustomCreate } from '../../actions/routes'

class Title extends Component {
    onCustomCreateClick(e) {
        this.props.dispatch(doCustomCreate());
    }

    render() {
        const route = Routes[this.props.path];
        return (
            <dl className="widget__page label mb20">
                <dt className="widget__page__label">{ this.props.pathTitle + Globalize.localize(route.title, Globalize.culture()) }</dt>
                <dd className="widget__page__label__button">
                    <div className="button_clear">
                        {route.createBtn ? (route.doCustomCreate ?
                            <div onClick={e => this.onCustomCreateClick(e)} className="btn-base create__btn">{ Globalize.localize(route.createBtn, Globalize.culture()) }</div> :
                            <Link to={this.props.path + '/create'} className="btn-base create__btn">{ Globalize.localize(route.createBtn, Globalize.culture()) }</Link>) :
                            null}
                    </div>
                </dd>
            </dl>
        );
    }
}

Title.propType = {
    path: PropTypes.string.isRequired
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
    }
};

export default connect(null, mapDispatchToProps)(Title);
