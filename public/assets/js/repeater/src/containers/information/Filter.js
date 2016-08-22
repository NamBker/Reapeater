import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import SearchDetail from './SearchDetail'

class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            childVisible : false,
            informations: props.informations
        };
        this.showSearchDetail = this.showSearchDetail.bind(this);
    }

    showSearchDetail() {
        this.setState({ childVisible: !this.state.childVisible });
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.onTitleSearch();
    }


    render() {
        const { handleSearchFromKeyWord, informations, companies ,brands, stores, currentUser, filter, handleCompanyIdChange, handlePublisherBrandIds, handlePublisherStoreIds, handleStatusChange, checkAllStore, checkConditionShowStore, handleEffectivePeriodFromChange, handleEffectivePeriodToChange, onDetailSearch } =  this.props;
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
                                            <input className="" type="text" placeholder={Globalize.localize('filter_search_title', Globalize.culture())} onChange={handleSearchFromKeyWord} />
                                            <input type="submit" defaultValue={Globalize.localize('filter_search', Globalize.culture())} className="btn-base"/>
                                        </form>
                                    </div>
                            </div>
                            {this.state.childVisible ? <SearchDetail companies={this.props.companies}
                                                                     currentUser={currentUser}
                                                                     brands={brands}
                                                                     stores={stores}
                                                                     filter={filter}
                                                                     handleCompanyIdChange={handleCompanyIdChange}
                                                                     handlePublisherBrandIds={handlePublisherBrandIds}
                                                                     handlePublisherStoreIds={handlePublisherStoreIds}
                                                                     handleStatusChange={handleStatusChange}
                                                                     checkAllStore={checkAllStore}
                                                                     checkConditionShowStore={checkConditionShowStore}
                                                                     handleEffectivePeriodFromChange={handleEffectivePeriodFromChange}
                                                                     handleEffectivePeriodToChange={handleEffectivePeriodToChange}
                                                                     onDetailSearch={onDetailSearch}

                                /> : null}
                            <div className="widget__page__filter__detail" onClick={this.showSearchDetail}>
                                <p>
                                    <span className={!this.state.childVisible ? 'plus' : 'minus'}></span><span>{Globalize.localize('filter_detail_condition_open', Globalize.culture())}</span>
                                </p>
                            </div>
                        </dt>
                </dl>
        );
    }
}


Filter.propTypes = {
    informations: PropTypes.array
};

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        stores: state.stores,
        brands: state.brands,
        companies : state.companies,
        childVisible : false,
        informations: state.informations,
    }
};

export default connect(mapStateToProps)(Filter);
