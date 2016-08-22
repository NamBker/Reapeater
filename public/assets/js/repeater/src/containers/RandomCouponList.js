import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Toggle from 'react-toggle';

import Filter from './randomCoupon/Filter';
import Table from '../components/commons/Table';
import Notification from '../components/commons/Notification';
import { PER_PAGE } from '../constants/Constants';
import { GET_DISPLAY_ITEMS_ONLY_PATTERN } from '../constants/Constants';
import { RANDOM_COUPON_STATUS_ENABLED, RANDOM_COUPON_STATUS_DISABLED } from '../constants/Constants';

import { fetchRandomCoupons, updateRandomCoupon, deleteRandomCoupons } from '../actions/randomCoupon';

class RandomCouponList extends Component {
    constructor(props) {
        super(props);
        const { currentUser } = this.props;
        this.state = {
            filter: {
                random_coupon_title: '',
                statuses: [],
                page: 1,
                per_page: PER_PAGE,
                pattern: GET_DISPLAY_ITEMS_ONLY_PATTERN,
            },
            curFilter: {
                page: 1,
            },
            selectedIds: [],
        };
        this.tableFormat = [
            {
                title: Globalize.localize('random_coupon_table_title_status', Globalize.culture()),
                valueKey: 'random_coupon_status',
                style: {
                    width: '75px',
                    marginLeft: '2px',
                    marginRight: '2px',
                    textAlign: 'center',
                },
            },
            {
                title: Globalize.localize('random_coupon_table_title_title', Globalize.culture()),
                valueKey: 'random_coupon_name',
                style: {
                    width: 'auto',
                    marginLeft: '25px',
                    marginRight: 'auto',
                    lineHeight: '50px',
                },
            },
        ];
    }

    componentDidMount() {
        let curFilter = this.state.filter;
        this.setState({curFilter: this.state.filter});
        this.onSearch();
    }

    onChangeRandomCouponEnabled(element, checked) {
        let status = checked ? RANDOM_COUPON_STATUS_ENABLED : RANDOM_COUPON_STATUS_DISABLED;
        updateRandomCoupon(element.id, {random_coupon_status: status}, (err) => {
            this.showNotification(err.toString());
        }, (res) => {
            this.onSearch();
        });
    }

    onChangeFilter(newFilter) {
        this.setState({filter: newFilter});
    }

    onSearch(isRefresh = true) {
        let filter = Object.assign({}, this.state.filter);
        if (isRefresh) {
            this.props.dispatch(fetchRandomCoupons(filter, (err) => {
                this.showNotification(err.toString())
            }, (res) => {}));
        } else {
            this.setState({curFilter: filter}, () => {
                this.props.dispatch(fetchRandomCoupons(filter, (err) => {
                    this.showNotification(err.toString())
                }, (res) => {}));
            });
        }
    }

    cellForKey(key, element) {
        switch(key) {
        case 'random_coupon_status':
            return (
                <div className="widget__page__input__contents__table__toggle">
                    <Toggle checked={element.random_coupon_status == RANDOM_COUPON_STATUS_ENABLED}
                        onChange={(e) => this.onChangeRandomCouponEnabled(element, e.target.checked)}/>
                </div>
            );
        case 'random_coupon_name':
            return (
                <Link to={"/randomCoupon/edit/" + element.id}>{element.random_coupon_name}</Link>
            );
        }
    }

    hasEditButtonForRow(element) {
        return true;
    }

    onChangePage(data) {
        let filter = this.state.curFilter;
        filter.page = data.selected + 1;
        this.setState({curFilter: filter, selectedIds: []}, () => {
            this.props.dispatch(fetchRandomCoupons(filter, (err) => {
                this.showNotification(err.toString(), false);
            }, (res) => {}));
        });
    }

    onDelete(deleteIds) {
        let filter = this.state.curFilter;
        if (this.props.randomCoupons.length <= deleteIds.length && 1 < filter.page) {
            filter.page = filter.page - 1;
        }
        let titles = $.grep(this.props.randomCoupons.map((randomCoupon) => {return 0 <= deleteIds.indexOf(randomCoupon.id) ? randomCoupon.random_coupon_name: null}), Boolean).join(", ");
        deleteRandomCoupons(deleteIds,
            (err) => {
                this.showNotification(err.toString(), false);
            },
            (res) => {
                this.showNotification('ランダムクーポン「' + titles + '」を削除しました。');
                this.onSearch();
            }
        );
    }

    onClickRowEdit(element) {
        this.context.router.push('/randomCoupon/edit/' + element.id);
    }

    showNotification(message, isSuccess = true) {
        Notification.showNotification(this.props.dispatch, this.props.route.path, message);
    }

    render() {
        return (
            <div>
                <Notification path={this.props.route.path}/>
                <div className="widget widget__page__input">
                    <div className="widget__page__input__title">
                        <div className="widget__page__type__search"/>
                        <span className="font-headline1">{Globalize.localize('filter_search_condition', Globalize.culture())}</span>
                        <span>{Globalize.localize('filter_search_description', Globalize.culture())}</span>
                    </div>
                    <Filter
                        currentUser={this.props.currentUser}
                        filter={this.state.filter}
                        onChangeFilter={(newFilter) => this.onChangeFilter(newFilter)}
                        onSearch={() => this.onSearch(false)}
                    />
                </div>
                <Table
                    data={this.props.randomCoupons}
                    formats={this.tableFormat}
                    totalCount={this.props.randomCouponCount}
                    curPage={this.state.curFilter.page}
                    onDelete={(deleteIds) => this.onDelete(deleteIds)}
                    cellForKey={(key, element) => this.cellForKey(key, element)}
                    hasOptionFunc={false}
                    hasEditButtonForRow={(element) => this.hasEditButtonForRow(element)}
                    onClickEdit={(element) => this.onClickRowEdit(element)}
                    onChangePage={(data) => this.onChangePage(data)}
                />
            </div>
        );
    }
}

RandomCouponList.contextTypes = {
    router: React.PropTypes.object,
};

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        randomCoupons: state.randomCoupons,
        randomCouponCount: state.randomCouponCount,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RandomCouponList);
