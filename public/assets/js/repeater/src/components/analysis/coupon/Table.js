import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router'

import moment from 'moment';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const {year, month, coupons,
            previous, next} = this.props;
        return (
            <div className="widget widget__wrapper widget__memberanalysis">
                <div className="widget__memberanalysis__table__label">
                    <div>{year + Globalize.localize('year', Globalize.culture()) + ("0" + month).slice(-2) + Globalize.localize('month', Globalize.culture())}</div>
                    <div><button className="btn btn-default move_to_left" onClick={previous}></button></div>
                    <div><button className="btn btn-default move_to_right" onClick={next}></button></div>
                </div>
                <div className="couponAnalysis-table-wrap">
                    <table className="couponAnalysis-table">
                        <thead>
                        <tr>
                            <th></th>
                            <th>ID</th>
                            <th>{Globalize.localize('delivery_add_send_title', Globalize.culture())}</th>
                            <th>PV</th>
                            <th>UU</th>
                            <th>{Globalize.localize('user', Globalize.culture())}</th>
                            <th>CVR</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {coupons.map((coupon, index) => {
                            return <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{coupon.id}</td>
                                <td>{coupon.coupon_title}</td>
                                <td>{coupon.display_coupon_count}</td>
                                <td>{coupon.unique_user_count}</td>
                                <td>{coupon.used_coupon_count}</td>
                                <td>{Math.round(coupon.used_coupon_count * 100 / coupon.display_coupon_count)}%</td>
                                <td><Link to={"/coupon/edit/" + coupon.coupon_id} className="btn btn-default">{Globalize.localize('detail', Globalize.culture())}</Link></td>
                            </tr>
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Table
