import React, { Component } from 'react';
import CheckList from '../../components/commons/CheckList'
import { RANDOM_COUPON_STATUS_DISABLED, RANDOM_COUPON_STATUS_ENABLED } from '../../constants/Constants';

class SearchDetail extends Component {
    constructor(props) {
        super(props);
        this.statuses = [
            {'label': Globalize.localize('l_display_flag_yes', Globalize.culture()), 'key': RANDOM_COUPON_STATUS_ENABLED },
            {'label': Globalize.localize('l_display_flag_no', Globalize.culture()), 'key': RANDOM_COUPON_STATUS_DISABLED },
        ]
    }

    onChangeStatus(selectedValues) {
        let filter = this.props.filter;
        filter.statuses = selectedValues;
        this.props.onChangeFilter(filter);
    }

    render() {
        const { filter } = this.props;
        return (
            <div>
                <div className="widget__page__input__contents__table">
                    <dl className="checkbox__row">
                        <dt>{Globalize.localize('random_coupon_table_title_status', Globalize.culture())}</dt>
                        <dd className="widget__page__input__scroll">
                            <CheckList
                                id="random__coupon__list__random__coupon__status__check__list"
                                data={this.statuses}
                                checkedItems={filter.statuses}
                                onChangedSelection={(selectedValues) => this.onChangeStatus(selectedValues)}
                                dataLabelKey='label'
                                dataValueKey='key'
                                />
                        </dd>
                    </dl>
                </div>
                <dl className="widget__page__button">
                    <div className="button_clear"><button className="btn-base" onClick={this.props.onSearch}>{Globalize.localize('filter_search', Globalize.culture())}</button></div>
                </dl>
            </div>
        );
    }
}

export default SearchDetail;

