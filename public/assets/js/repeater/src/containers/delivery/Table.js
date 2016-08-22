import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Link } from 'react-router';
import Checkbox from '../../components/commons/Checkbox';
import { PER_PAGE } from '../../constants/Constants';
import ReactPaginate from 'react-paginate';
import ColumnTitle from '../../components/commons/ColumnTitle';
import ReactTooltip from 'react-tooltip';

class Table extends Component {

    isAllCheck() {
        return (0 < this.props.data.length) &&
            (this.props.data.length <= this.props.selectedIds.length);
    }

    render() {
        const { data, total_count, cur_page, selectedIds } = this.props;
        return (
            <dl className="widget widget__page__table">
                <dt>
                    <span className="check-all">
                        <input type="checkbox"
                            id="checkbox_all"
                            checked={this.isAllCheck() ? 'checked' : ''}
                            onClick={(e) => this.props.onCheckAll(e.target.checked)} />
                        <label htmlFor="checkbox_all"></label>
                    </span>

                    {(selectedIds.length < 1) ?
                        <div className="table__title">
                            <ColumnTitle title={Globalize.localize('map_delivery_date', Globalize.culture())} style={{width: "120px"}}/>
                            <ColumnTitle title={Globalize.localize('map_title', Globalize.culture())} style={{marginRight: 'auto', float: 'left'}}/>
                        </div>
                        :
                        <div>
                            <div className="section_button_delete" data-tip={Globalize.localize('map_delete', Globalize.culture())} data-for="tooltip_table_button" onClick={this.props.onClickDelete}><span className="other_trigger up"></span></div>
                            {selectedIds.length === 1 ?
                                <div className="section_button_copy" data-tip={Globalize.localize('map_copy', Globalize.culture())} data-for="tooltip_table_button" onClick={this.props.onClickCopy}><span className="other_trigger up"></span></div>
                                :
                                null}
                            <ReactTooltip class="tooltip__theme" id="tooltip_table_button" place="top" type="light" effect="solid"/>
                        </div>
                    }
                </dt>
                {data.map((element, index) => <dd key={index}>
                    <ul>
                        <Checkbox  id={'data_table_' + element.id}
                                       label=""
                                       key={element.id}
                                       check={(id) => this.props.onCheckRow(id)}
                                       className="check_box_delivery delivery_table"
                                       isChecked={selectedIds.indexOf(element.id) >=0}
                                       />
                        <li className="no-number">{index + 1 + PER_PAGE * (cur_page - 1)}</li>
                        <li className="widget__page__delivery__table__date">
                            {moment(element.delivery_schedule).format(Globalize.localize('display_date_no_weekday_format', Globalize.culture())) != "Invalid date" ?
                                moment(element.delivery_schedule).format(Globalize.localize('display_date_no_weekday_format', Globalize.culture())) : '　'}
                        </li>
                        <li className="widget__page__delivery__table__title">
                            {this.props.canEdit ?
                                <Link to={"/delivery/edit/" + element.id}>{element.delivery_title}</Link>
                                : element.delivery_title
                            }
                        </li>
                        {this.props.canEdit ?
                        <li className="widget__page__button__detail"><p>
                                <Link to={"/delivery/edit/" + element.id}>{Globalize.localize('filter_update', Globalize.culture())}</Link>
                        </p></li>
                        : null}
                    </ul>
                </dd>)}
                <dd className="widget__page__table__pagination">
                    <span style={{width: '130px'}}>{Globalize.localize('map_total', Globalize.culture())}：{total_count} {Globalize.localize('map_matter', Globalize.culture())}</span>
                    {0 < total_count ?
                        <ReactPaginate
                            previousLabel={" "}
                            forceSelected={cur_page - 1}
                            nextLabel={" "}
                            breakLabel={<a>...</a>}
                            pageNum={Math.ceil(total_count / PER_PAGE)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            clickCallback={this.props.onChangePage}
                            containerClassName={"pagination delivery_paginate"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"}
                            />
                            :
                            null}
                    <span style={{width: '130px'}}></span>
                </dd>

            </dl>
        );
    }
}

Table.propTypes = {
    cur_page: PropTypes.number.isRequired
};

export default Table;

