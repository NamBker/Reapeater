import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

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

    onChangeTitle(e) {
        this.props.onChangeTitle(e.target.value);
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.onSearchTitle();
    }

    render() {
        return (
                <dl className="widget widget__page__filter">
                    <dt className="widget__page__title widget__page__search widget__title widget__page__input__title">
                        <div className="widget__page__type__search"/>
                        <span>{Globalize.localize('filter_search_condition', Globalize.culture())}</span>
                        <span>{Globalize.localize('filter_search_description', Globalize.culture())}</span>
                    </dt>
                    <dt className="widget__page__more__filter">
                        <div className="widget__page__more__filter__title">
                                <div>
                                    <form acceptCharset="utf-8" onSubmit={(e) => this.onSubmit(e)}>
                                        <input className="" type="text" placeholder={Globalize.localize('filter_search_title', Globalize.culture())} onChange={(e) => this.onChangeTitle(e)} />
                                        <input type="submit" defaultValue={Globalize.localize('search', Globalize.culture())} className="btn-base"/>
                                    </form>
                                </div>
                        </div>
                        {this.state.detailVisible ? <SearchDetail currentUser={this.props.currentUser}
                                                                 companies={this.props.companies}
                                                                 brands={this.props.brands}
                                                                 stores={this.props.stores}
                                                                 areas={this.props.areas}
                                                                 filter={this.props.filter}
                                                                 onChangeCompany={this.props.onChangeCompany}
                                                                 onChangeBrand={this.props.onChangeBrand}
                                                                 onChangeArea={this.props.onChangeArea}
                                                                 onChangeStore={this.props.onChangeStore}
                                                                 isVisibleArea={this.props.isVisibleArea}
                                                                 isVisibleStore={this.props.isVisibleStore}
                                                                 onCheckAllStore={this.props.isCheckAllStore}
                                                                 onChangeDeliveryScheduleFrom={this.props.onChangeDeliveryScheduleFrom}
                                                                 onChangeDeliveryScheduleTo={this.props.onChangeDeliveryScheduleTo}
                                                                 onSearchDetail={this.props.onSearchDetail}

                            /> : null}
                            <div className="widget__page__filter__detail" onClick={() => this.showSearchDetail()}>
                            <p>
                                <span className={!this.state.detailVisible ? 'plus' : 'minus'}></span><span>{Globalize.localize('filter_detail_condition_open', Globalize.culture())}</span>
                            </p>
                        </div>
                    </dt>
                </dl>
        );
    }
}

export default Filter;
