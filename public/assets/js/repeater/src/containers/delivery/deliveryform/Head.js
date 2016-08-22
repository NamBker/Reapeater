import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import DropDownList from '../../../components/commons/DropDownList';

import { makeTimeArray } from '../../../utils/CommonUtils';

class Head extends Component {
    constructor(props) {
        super(props);
    }

    onChangeSenderName(name) {
        let data = this.props.data;
        data.delivery_sender_name = name;
        this.props.onChangeData(data);
    }

    onChangeSenderAddress(address) {
        let data = this.props.data;
        data.delivery_sender_address = address;
        this.props.onChangeData(data);
    }

    onChangeTitle(title) {
        let data = this.props.data;
        data.delivery_title = title;
        this.props.onChangeData(data);
    }

    render() {
        const { data } = this.props;
        const times = makeTimeArray(15);
        const today = Date.now()
        return (
            <dt className="widget__page__input__contents">
                <dl className="widget__page__input__contents__subtitle">
                    <span>{Globalize.localize('delivery_add_subtitle_context', Globalize.culture())}</span>
                </dl>
                <div className="widget__page__input__contents__table mb20">
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('delivery_add_send_name', Globalize.culture())}</dt>
                        <dd>
                            <input className="widget__page__delivery__header__input" type="text" value={data.delivery_sender_name} onChange={(e) => this.onChangeSenderName(e.target.value)} maxLength="32"/>
                        </dd>
                    </dl>
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('delivery_add_send_address', Globalize.culture())}</dt>
                        <dd>
                            <input className="widget__page__delivery__header__input" type="text" value={data.delivery_sender_address} onChange={(e) => this.onChangeSenderAddress(e.target.value)} maxLength="32"/>
                        </dd>
                    </dl>
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('delivery_add_send_title', Globalize.culture())}</dt>
                        <dd>
                            <input className="widget__page__delivery__header__input" type="text" value={data.delivery_title} onChange={(e) => this.onChangeTitle(e.target.value)} maxLength="32"/>
                        </dd>
                    </dl>
                </div>
            </dt>
        );
    }
}

export default Head;
