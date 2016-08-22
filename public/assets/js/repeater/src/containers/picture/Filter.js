import React, { Component, PropTypes } from 'react';

class Filter extends Component {
    onSubmit(e) {
        e.preventDefault();
        this.props.onTitleSearch();
    }

    render() {
        const { handleSearchFromKeyWord } =  this.props;
        return (
                <dl className="widget widget__page__filter">
                    <dt className="widget__page__title widget__page__search widget__title">
                        <img src="../assets/img/icon-search.png" />
                        <span>画像検索</span>
                        <span>登録済みの画像一覧から、画像名で検索することができます。</span>
                    </dt>
                    <dt className="widget__page__more__filter">
                        <div className="widget__page__more__filter__title">
                            <div>
                                <form acceptCharset="utf-8" onSubmit={(e) => this.onSubmit(e)}>
                                    <input className="" type="text" placeholder="画像名で検索" onChange={handleSearchFromKeyWord} />
                                    <input type="submit" defaultValue="検索" className="btn-base"/>
                                </form>
                            </div>
                        </div>
                    </dt>
                </dl>
        );
    }
}

export default Filter;

