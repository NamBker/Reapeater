import React, { Component, PropTypes } from 'react';

import SearchDetail from './SearchDetail'

class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailVisible : false,
        };
    }

    showSearchDetail() {
        this.setState({ detailVisible: !this.state.detailVisible });
    }

    onChangeTitle(title) {
        let filter = this.props.filter;
        filter.member_mail_address = title;
        this.props.onChangeFilter(filter);
    }

    render() {
        return (
            <div>
                <div className="widget__page__input__contents">
                    <div className="widget__page__input__contents__search__main mt20 mb20">
                        <input type="text" placeholder={Globalize.localize('member_email_search_placeholder', Globalize.culture())} onChange={(e) => this.onChangeTitle(e.target.value)} />
                        <button className="btn-base" onClick={this.props.onSearch}>{Globalize.localize('search', Globalize.culture())}</button>
                    </div>
                    {this.state.detailVisible ?
                    <SearchDetail
                        currentUser={this.props.currentUser}
                        filter={this.props.filter}
                        onChangeFilter={this.props.onChangeFilter}
                        onSearch={this.props.onSearch}
                    /> : null}
                    <div className="widget__page__input__contents__search__show__detail mb20" onClick={() => this.showSearchDetail()}>
                        <div className={!this.state.detailVisible ? 'plus' : 'minus'}/>
                        <span>{Globalize.localize('filter_detail_condition_open', Globalize.culture())}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Filter;
