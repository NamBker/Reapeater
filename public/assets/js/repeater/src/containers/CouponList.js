import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Filter from './coupon/Filter'
import Table from '../components/commons/Table'
import * as Const from '../constants/Constants';
import { getGroupHandle } from '../utils/CommonUtils'
import { fetchCoupons, deleteCoupons } from '../actions/coupon'
import SelectCouponDialog from './randomCoupon/SelectCouponDialog';
import Notification from '../components/commons/Notification';

class CouponList extends Component {
    constructor(props) {
        super(props);
        this.state= {
            filter: {
                page: 1,
                coupon_status: '',
                coupon_name:'',
                per_page:Const.PER_PAGE,
                coupon_limit_from: null,
                coupon_limit_to: null,
                pattern: Const.GET_DISPLAY_ITEMS_ONLY_PATTERN,
            },
        };
        this.handleStatusChange  = this.handleStatusChange.bind(this);
        this.handleEffectivePeriodFromChange = this.handleEffectivePeriodFromChange.bind(this);
        this.handleEffectivePeriodToChange = this.handleEffectivePeriodToChange.bind(this);
        this.handleKeyWordChange = this.handleKeyWordChange.bind(this);

        this.tableFormat = [
            {
                title: Globalize.localize('map_code', Globalize.culture()),
                valueKey: 'coupon_code',
                style: {
                    width: '110px',
                    marginLeft: '0px',
                    marginRight: '20px',
                    lineHeight: '50px',
                    flexShrink: '0',
                },
            },
            {
                title: Globalize.localize('map_status', Globalize.culture()),
                valueKey: 'coupon_status',
                style: {
                    width: '50px',
                    marginLeft: '0px',
                    marginRight: '20px',
                    lineHeight: '50px',
                    flexShrink: '0',
                },
            },
            {
                title: Globalize.localize('map_coupon_name', Globalize.culture()),
                valueKey: 'coupon_name',
                style: {
                    width: 'auto',
                    marginLeft: '0px',
                    marginRight: 'auto',
                    minWidth: '140px',
                    overflow: 'hidden',
                    height: '50px',
                    lineHeight: '50px',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                },
            },
            {
                title: Globalize.localize('map_available_period', Globalize.culture()),
                valueKey: 'coupon_limit',
                style: {
                    width: '190px',
                    marginLeft: '10px',
                    marginRight: '0px',
                    lineHeight: '50px',
                    flexShrink: '0',
                },
            },
            {
                title: '',
                valueKey: 'coupon_release_flg',
                style: {
                    width: '60px',
                    marginLeft: '10px',
                    marginRight: '10px',
                    flexShrink: '0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
            },
        ];
        this.statuses = [
            Globalize.localize('flg_close', Globalize.culture()),
            Globalize.localize('flg_open', Globalize.culture()),
        ];
    }

    componentWillMount() {
        this.onSearch();
    }

    cellForKey(key, element) {
        switch (key) {
        case 'coupon_code':
            return (
                <span>{element.coupon_code}</span>
            );
        case 'coupon_status':
            return (
                <span>{this.statuses[element.coupon_status]}</span>
            );
        case 'coupon_name':
            return (
                element.coupon_release_flg == 0 ? <Link to={'/coupon/edit/' + element.id}>{element.coupon_name}</Link> : element.coupon_name
            );
        case 'coupon_limit':
            return (
                <span>{SelectCouponDialog.getCouponLimitString(element)}</span>
            );
        case 'coupon_release_flg':
            return (
                <span>{element.coupon_release_flg == 1 ? Globalize.localize('flg_published', Globalize.culture()) : ''}</span>
            );
        }
    }

    hasEditButtonForRow(element) {
        return element.coupon_release_flg == 0;
    }

    isSelectableRow(element) {
        return element.coupon_release_flg == 0;
    }

    handleStatusChange(e){
        let filter = {...this.state.filter};
        filter.coupon_status = e.target.value;
        this.setState({filter: filter});
    }

    handleEffectivePeriodFromChange(date) {
        let filter = {...this.state.filter};
        filter.coupon_limit_from = date;
        this.setState({
            filter: filter
        });
    }

    handleEffectivePeriodToChange(date) {
        let filter = {...this.state.filter};
        filter.coupon_limit_to = date;
        this.setState({
            filter: filter
        });
    }

    handleKeyWordChange(e) {
        let filter = {...this.state.filter};
        filter.coupon_name = e.target.value;
        this.setState({filter: filter});
    }

    onSubmit(e) {
        e.preventDefault();
        this.onSearch();
    }

    onSearch() {
        let submitFilter = {...this.state.filter};
        this.setState({submitFilter}, () => {
            this.props.dispatch(fetchCoupons(submitFilter));
        });
    }

    onChangePage(data) {
        let submitFilter = {...this.state.submitFilter};
        submitFilter.page = data.selected + 1;
        this.setState({submitFilter}, () => {
            this.props.dispatch(fetchCoupons(submitFilter));
        });
    }

    onClickRowEdit(element) {
        this.context.router.push('/coupon/edit/' + element.id);
    }

    onDelete(deleteIds) {
        let titles = this.props.coupons.map((coupon) => {
            if (0 <= deleteIds.indexOf(coupon.id)) {
                return coupon.coupon_name;
            }
        }).filter(name => name);
        deleteCoupons(deleteIds, (err) => {
            this.showNotification(Globalize.localize('coupon_cant_delete', Globalize.culture()) + '\n' + err.toString());
        }, (res) => {
            this.showNotification(Globalize.localize('coupon_deleted', Globalize.culture()) + '\n' + titles.join(", "));
            let submitFilter = this.state.submitFilter;
            if (this.props.coupons.length <= deleteIds.length && 1 < submitFilter.page) {
                submitFilter.page = submitFilter.page - 1;
            }
            this.setState({submitFilter}, () => {
                this.props.dispatch(fetchCoupons(submitFilter));
            });
        });
    }

    showNotification(message) {
        Notification.showNotification(this.props.dispatch, this.props.route.path, message)
    }

    render() {
        return (
            <div>
                <Notification path="/coupon"/>
                <Filter
                    filter={this.state.filter}
                    submitfilter={this.state.submitfilter}
                    handleEffectivePeriodToChange={this.handleEffectivePeriodToChange}
                    handleEffectivePeriodFromChange={this.handleEffectivePeriodFromChange}
                    handleStatusChange={this.handleStatusChange}
                    handleKeyWordChange={this.handleKeyWordChange}i
                    onSubmit={(e) => this.onSubmit(e)}
                />
                <Table
                    data={this.props.coupons}
                    formats={this.tableFormat}
                    totalCount={this.props.count}
                    curPage={this.state.submitFilter.page}
                    onDelete={(deleteIds) => this.onDelete(deleteIds)}
                    cellForKey={(key, element) => this.cellForKey(key, element)}
                    hasEditButtonForRow={(element) => this.hasEditButtonForRow(element)}
                    onClickEdit={(element) => this.onClickRowEdit(element)}
                    onChangePage={(data) => this.onChangePage(data)}
                    isSelectableRow={(element) => this.isSelectableRow(element)}
                />
            </div>
        )
    }
}

CouponList.contextTypes = {
    router: React.PropTypes.object,
};

const mapStateToProps = (state) => {
    return {
        coupons: state.coupons,
        count: state.coupons_count,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CouponList);
