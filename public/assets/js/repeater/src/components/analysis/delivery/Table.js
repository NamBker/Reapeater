import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router'

import moment from 'moment';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const {year, month, deliveries,
            previous, next} = this.props;
        return (
            <div className="widget widget__wrapper widget__memberanalysis">
                <div className="widget__memberanalysis__table__label">
                    <div>{year + '年' + ("0" + month).slice(-2) + '月'}</div>
                    <div>
                        <button className="btn btn-default move_to_left" onClick={previous}></button>
                    </div>
                    <div>
                        <button className="btn btn-default move_to_right" onClick={next}></button>
                    </div>
                </div>
                <div className="deliveryAnalysis-table-wrap">
                    <table className="deliveryAnalysis-table">
                        <thead>
                        <tr>
                            <th></th>
                            <th>{Globalize.localize('delivery_l_date', Globalize.culture())}</th>
                            <th>{Globalize.localize('delivery_add_send_title', Globalize.culture())}</th>
                            <th>{Globalize.localize('delivery_l_count', Globalize.culture())}</th>
                            <th>{Globalize.localize('delivery_l_open_count', Globalize.culture())}</th>
                            <th>{Globalize.localize('delivery_l_open_percent', Globalize.culture())}</th>
                            <th>{Globalize.localize('delivery_l_visit_count', Globalize.culture())}</th>
                            <th>{Globalize.localize('delivery_l_visit_percent', Globalize.culture())}</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {deliveries.map((delivery, index) => {
                            let totalHistory = delivery.delivery_total;
                            return <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{moment(delivery.delivery.delivery_schedule).format('LL (ddd) HH:mm')}</td>
                                <td>{delivery.delivery.delivery_title}</td>
                                <td>{totalHistory}</td>
                                <td>{delivery.reach_count}</td>
                                <td>{Math.round(delivery.reach_count * 100/totalHistory)}%</td>
                                <td>{totalHistory - delivery.reach_count}</td>
                                <td>{Math.round((totalHistory - delivery.reach_count) * 100/totalHistory)}%</td>
                                <td><Link to={"/delivery/edit/" + delivery.delivery_id} className="btn btn-default">{Globalize.localize('detail', Globalize.culture())}</Link></td>
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
