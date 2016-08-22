import React, { Component, PropTypes } from 'react';
import DatePicker from 'react-datepicker'

import DropDownList from '../../components/commons/DropDownList'

class SearchDetail extends Component {
    constructor(props) {
        super(props);
        this.statuses = [
            Globalize.localize('l_display_flag_no', Globalize.culture()),
            Globalize.localize('l_display_flag_yes', Globalize.culture()),
        ];
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.filter != nextProps.filter;
    }

    render() {
        const {filter, areas, handleEffectivePeriodFromChange, handleEffectivePeriodToChange, handleStatusChange, onSubmit} = this.props;
        return (
            <form className="search" acceptCharset="utf-8">
                <div className="widget__page__information__select">
                    <dl>
                        <dt>{Globalize.localize('map_status', Globalize.culture())}</dt>
                        <dd>
                            <div style={{display: 'inline-flex'}}>
                               <DropDownList
                                        data={this.statuses}
                                        defaultValue={filter.coupon_status}
                                        hasEmptyOption={true}
                                        onChange={handleStatusChange}
                                        eachCallback={(couponStatus, index) => <option value={index} key={index}>{couponStatus}</option>}/>
                            </div>
                        </dd>
                    </dl>
                    <dl>
                        <dt>{Globalize.localize('map_available_period', Globalize.culture())}</dt>
                        <dd>
                            <DatePicker className={"input__date" + (filter.coupon_limit_from ? " input__date__setted" : "")}
                                        dateFormat={Globalize.localize('display_date_format', Globalize.culture())}
                                        locale='ja'
                                        dateFormatCalendar={Globalize.localize('display_date_year_and_month_format', Globalize.culture())}
                                        maxDate={filter.coupon_limit_to}
                                        tetherConstraints={[]}
                                        readOnly
                                        isClearable={true}
                                        selected={filter.coupon_limit_from}
                                        onChange={handleEffectivePeriodFromChange}
                                        />
                            <span>　〜　</span>
                            <DatePicker className={"input__date" + (filter.coupon_limit_to ? " input__date__setted" : "")}
                                        dateFormat={Globalize.localize('display_date_format', Globalize.culture())}
                                        locale='ja'
                                        dateFormatCalendar={Globalize.localize('display_date_year_and_month_format', Globalize.culture())}
                                        tetherConstraints={[]}
                                        minDate={filter.coupon_limit_from}
                                        readOnly
                                        isClearable={true}
                                        selected={filter.coupon_limit_to}
                                        onChange={handleEffectivePeriodToChange}
                                    />
                        </dd>
                    </dl>
                </div>
                <div className="widget__page__button">
                    <div className="button_clear">
                        <input style={{width: '120px'}} className="btn-base" type="submit"
                            onClick={onSubmit}
                            defaultValue={Globalize.localize('filter_search', Globalize.culture())} /></div>
                </div>
            </form>
        )
    }
}

export default SearchDetail;
