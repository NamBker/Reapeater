import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Modal from '../../components/commons/Modal';
import Table from '../../components/commons/Table';

import { PER_PAGE, GET_DISPLAY_ITEMS_ONLY_PATTERN } from '../../constants/Constants';
import { COUPON_LIMIT_TYPE_UNSET, COUPON_LIMIT_TYPE_SET, COUPON_LIMIT_TYPE_MAIL } from '../../constants/Constants';

import { fetchCoupons } from '../../actions/coupon';

class SelectCouponDialog extends Component {
    static getCouponLimitString(coupon) {
        if (coupon) {
            switch (coupon.coupon_limit_type) {
            case COUPON_LIMIT_TYPE_UNSET:
                return Globalize.localize('random_coupon_limit_unset', Globalize.culture());
            case COUPON_LIMIT_TYPE_SET:
                let from = coupon.coupon_limit_from.substring(0, 10).replace(/-/g, '/');
                let to = coupon.coupon_limit_to.substring(0, 10).replace(/-/g, '/');
                return from + " ～ " + to;
            case COUPON_LIMIT_TYPE_MAIL:
                if (coupon.coupon_limit_send_count < 1) {
                    return Globalize.localize('random_coupon_limit_mail_one_day', Globalize.culture());
                }
                return Globalize.localize('random_coupon_limit_mail', Globalize.culture()).format(coupon.coupon_limit_send_count);
            }
        }
        return '';
    }

    constructor(props) {
        super(props);
        this.state = {
            selectedId: 0,
            page: 1,
            per_page: PER_PAGE,
            pattern: GET_DISPLAY_ITEMS_ONLY_PATTERN,
        };
        this.tableFormats = [
            {
                title: Globalize.localize('map_available_period', Globalize.culture()),
                valueKey: 'coupon_description',
                style: {
                    width: '190px',
                    marginLeft: '10px',
                    marginRight: '20px',
                    lineHeight: '50px',
                    textAlign: 'left',
                    flexShrink: '0',
                },
            },
            {
                title: Globalize.localize('map_title', Globalize.culture()),
                valueKey: 'coupon_name',
                style: {
                    width: 'auto',
                    marginLeft: '0px',
                    marginRight: '10px',
                    textAlign: 'left',
                    lineHeight: '50px',
                    height: '100%',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                },
            },
        ];
    }

    componentWillMount() {
        this.props.dispatch(fetchCoupons(this.state));
    }

    cellForKey(key, element) {
        switch (key) {
        case 'coupon_description':
            return (
                <span>{SelectCouponDialog.getCouponLimitString(element)}</span>
            );
        case 'coupon_name':
            return (
                <span>{element.coupon_name}</span>
            );
        }
    }

    onChangeCheck(id) {
        this.setState({selectedId: id});
    }

    onChangePage(data) {
        let selectedPage = data.selected + 1;
        if (this.state.page != selectedPage) {
            let state = this.state;
            state.page = selectedPage;
            this.setState({page: selectedPage}, () => {
                this.props.dispatch(fetchCoupons(state));
            });
        }
    }

    onClose(e) {
        e.preventDefault();
        this.props.onClose();
    }

    onSelected(e) {
        e.preventDefault();
        if (this.state.selectedId < 1) {
            return;
        }
        let coupon = this.props.coupons.find((coupon) => {return coupon.id == this.state.selectedId});
        this.props.onSelected(coupon);
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen}>
                <div className="dialog widget widget__page__input__dialog__csv__upload">
                    <div className="contents__modal__h2">
                        <span className="contents__modal__h2--title">{Globalize.localize('random_coupon_select_coupon_title', Globalize.culture())}</span>
                        <div className="contents__modal__del" onClick={this.props.onClose}/>
                    </div>
                    <div className="mt20 ml20 mr20">
                        <Table
                            className="widget__page__input__coupon__list__table"
                            selectType={Table.selectTypeRadio}
                            data={this.props.coupons}
                            formats={this.tableFormats}
                            cellForKey={(key, element) => this.cellForKey(key,element)}
                            curPage={this.state.page}
                            onChangePage={(data) => this.onChangePage(data)}
                            totalCount={this.props.couponCount}
                            selectableEntireRow={true}
                            onChangeCheck={(id) => this.onChangeCheck(id)}
                            hasEditButtonForRow={(element) => false}
                        />
                        <div>
                            <div className="btn-gray mr10" onClick={(e) => this.onClose(e)}>{Globalize.localize('close', Globalize.culture())}</div>
                            <div className={"btn-base" + (this.state.selectedId ? "" : " disabled")}
                                onClick={(e) => this.onSelected(e)}>{Globalize.localize('random_coupon_select_coupon_use_button')}</div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

SelectCouponDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSelected: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    return {
        coupons: state.coupons,
        couponCount: state.coupons_count,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectCouponDialog);
