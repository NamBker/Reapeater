import React, { Component, PropTypes } from 'react';

import SearchDetail from './SearchDetail'

class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowSearchDetail: false,
        }
    }

    render() {
        const { filter, handleQuestionnaireReleaseFlgChange, handleQuestionnaireLimitFromChange, handleQuestionnaireLimitToChange, handleKeyWordChange , onSubmit }  = this.props;
        return (
            <dl className="widget widget__page__filter">
                <dt className="widget__page__title widget__page__search widget__title">
                    <img src="../assets/img/icon-search.png"/>
                    <span>{Globalize.localize('filter_search_condition', Globalize.culture())}</span>
                    <span>{Globalize.localize('filter_search_description', Globalize.culture())}</span>
                </dt>
                <dt className="widget__page__more__filter">

                    <div className="widget__page__more__filter__title">
                        <div>
                            <form onSubmit={onSubmit}>
                                <input className="" type="text" placeholder={Globalize.localize('filter_search_title', Globalize.culture())} onChange={handleKeyWordChange}/>
                                <input type="submit" value={Globalize.localize('search', Globalize.culture())}  className="btn-base"/>
                            </form>
                        </div>
                    </div>
                    {this.state.isShowSearchDetail ?
                        <SearchDetail filter={filter}
                                      onSubmit={onSubmit}
                                      handleQuestionnaireReleaseFlgChange={handleQuestionnaireReleaseFlgChange}
                                      handleQuestionnaireLimitFromChange={handleQuestionnaireLimitFromChange}
                                      handleQuestionnaireLimitToChange={handleQuestionnaireLimitToChange}/> : null}
                    <div className="widget__page__filter__detail" onClick={() => {this.setState({isShowSearchDetail : !this.state.isShowSearchDetail})}}>
                        <p>
                            <span className={!this.state.isShowSearchDetail ? 'plus' : 'minus'}></span><span>{Globalize.localize('filter_detail_condition_open', Globalize.culture())}</span>
                        </p>
                    </div>
                </dt>
            </dl>
        );
    }
}


export default Filter;
