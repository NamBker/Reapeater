import React, { Component, PropTypes } from 'react';
import DropDownList from './DropDownList'
import moment from 'moment'

class DateSelect extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        var currentYear = moment().year();
        for (var years = ['----'], year = currentYear - 20; year < currentYear; years[++year] = year);
        for (var months = ['--'], month = 0; month < 12; months[++month] = month);
        for (var days = ['--'], day = 0; day < 31; days[++day] = day);
        if (this.props.isGarake) {
            return (
                <dl>
                    <select>
                        {years.map((year) => <option key={year}>{year}</option>)}
                    </select>
                    {Globalize.localize('year', Globalize.culture())}<br/>
                    <select>
                        {months.map((month) => <option key={month}>{month}</option>)}
                    </select>
                    {Globalize.localize('month', Globalize.culture())}<br/>
                    <select>
                        {days.map((day) => <option key={day}>{day}</option>)}
                    </select>
                    {Globalize.localize('day', Globalize.culture())}
                </dl>
            )
        }
        return (
            <div className={"select_date" + (this.props.className ? " " + this.props.className : "")}>
                <DropDownList data={years} editable={true}/>{Globalize.localize('year', Globalize.culture())}
                <DropDownList data={months} editable={true}/>{Globalize.localize('month', Globalize.culture())}
                <DropDownList data={days} editable={true}/>{Globalize.localize('day', Globalize.culture())}
            </div>
        );
    }
}

DateSelect.propTypes = {
    isGarake: PropTypes.bool,
    className: PropTypes.string,
}
DateSelect.defaultProps = {
    isGarake: false,
};

export default DateSelect;
