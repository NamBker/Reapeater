import React, { Component, PropTypes } from 'react';
import DatePicker from 'react-datepicker'

import DropDownList from '../../components/commons/DropDownList'

class SearchDetail extends Component {
    constructor(props) {
        super(props);
        this.questionnaireReleaseFlgs = [
            Globalize.localize('flg_unpublished', Globalize.culture()),
            Globalize.localize('flg_published', Globalize.culture()),
        ];
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.filter != nextProps.filter;
    }

    render() {
        const { filter, onSubmit, handleQuestionnaireReleaseFlgChange, handleQuestionnaireLimitFromChange, handleQuestionnaireLimitToChange } = this.props;
        return (
            <form className="search" acceptCharset="utf-8" onSubmit={onSubmit}>
                <div className="widget__page__information__select">
                    <dl>
                        <dt>{Globalize.localize('map_status', Globalize.culture())}</dt>
                        <dd>
                            <div style={{display: 'inline-flex'}}>
                                <DropDownList
                                    data={this.questionnaireReleaseFlgs}
                                    defaultValue={filter.questionnaire_release_flg}
                                    hasEmptyOption={true}
                                    onChange={handleQuestionnaireReleaseFlgChange}
                                    eachCallback={(label, index) => <option key={"questionnaire_status_" + index} value={index}>{label}</option>}
                                />
                            </div>
                        </dd>
                    </dl>
                    <dl>
                        <dt>{Globalize.localize('map_end_date', Globalize.culture())}</dt>
                        <dd>
                            <DatePicker className={"input__date" + (filter.questionnaire_limit_from ? " input__date__setted" : "")}
                                        dateFormat={Globalize.localize('display_date_format', Globalize.culture())}
                                        locale='ja'
                                        dateFormatCalendar={Globalize.localize('display_date_year_and_month_format', Globalize.culture())}
                                        maxDate={filter.questionnaire_limit_to}
                                        tetherConstraints={[]}
                                        readOnly
                                        isClearable={true}
                                        selected={filter.questionnaire_limit_from}
                                        onChange={handleQuestionnaireLimitFromChange}
                                        />
                            <span> 〜 </span>
                            <DatePicker className={"input__date" + (filter.questionnaire_limit_to ? " input__date__setted" : "")}
                                        dateFormat={Globalize.localize('display_date_format', Globalize.culture())}
                                        locale='ja'
                                        dateFormatCalendar={Globalize.localize('display_date_year_and_month_format', Globalize.culture())}
                                        minDate={filter.questionnaire_limit_from}
                                        tetherConstraints={[]}
                                        readOnly
                                        isClearable={true}
                                        selected={filter.questionnaire_limit_to}
                                        onChange={handleQuestionnaireLimitToChange}
                                        />
                        </dd>
                    </dl>
                </div>
                <dl className="widget__page__button" style={{ border: '0px' }}>
                    <div className="button_clear"><input className="btn-base" type="submit" style={{width: '150px'}} defaultValue={Globalize.localize('filter_search', Globalize.culture())} /></div>
                </dl>
            </form>
        )
    }
}

export default SearchDetail;
