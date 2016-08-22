import React, { Component, PropTypes } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';

import { NOTIFICATION_DISPLAY_TIME } from '../../constants/Constants';

import { showNotification, hideNotification } from '../../actions/notification';
import createFragment from 'react-addons-create-fragment';

import { scrollToTop } from '../../utils/CommonUtils';

class Notification extends Component {
    componentWillMount() {
        this.isStart = false;
        this.interval = null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.notification.isShow) {
            scrollToTop();
        }
    }

    componentWillUnmount() {
        this.isStart = false;
        clearInterval(this.interval);
        if (this.props.path === this.props.notification.path) {
            this.props.dispatch(hideNotification(this.props.path));
        }
    }

    static showNotification(dispatch, path, message) {
        dispatch(showNotification(path, message));
    }

    show(message) {
        showNotification(this.props.path, message);
    }

    hide() {
        this.isStart = false;
        clearInterval(this.interval);
        if (this.props.notification.path === this.props.path) {
            this.props.dispatch(hideNotification(this.props.path));
        }
    }

    renderNotification() {
        const { notification } = this.props;
        let message = "";
        if (notification && notification.path === this.props.path && notification.message) {
            message = notification.message;
        }
        if (notification.isShow && 0 < message.length) {
            return <dt className="widget__page__notification mb20" key="widget__page__notification"><pre>{createFragment({message})}</pre></dt>;
        } else {
            return null;
        }
    }

    render() {
        const { notification } = this.props;
        if (notification.isShow && notification.path === this.props.path) {
            if (this.isStart) {
                clearInterval(this.interval);
            }
            this.isStart = true;
            this.interval = setInterval(() => this.hide(), NOTIFICATION_DISPLAY_TIME);
        } else {
            this.isStart = false;
            clearInterval(this.inverval);
        }
        return (
            <dl className={"widget__page" + (this.props.className ? " " + this.props.className : "")} ref="repeater_notification">
                <CSSTransitionGroup transitionName="widget__page__notification__animation" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
                    {this.renderNotification()}
                </CSSTransitionGroup>
            </dl>
        );
    }
}

Notification.propTypes = {
    path: PropTypes.string.isRequired,
    className: PropTypes.string,
}

const mapStateToProps = (state) => {
    return {
        notification: state.notification,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
