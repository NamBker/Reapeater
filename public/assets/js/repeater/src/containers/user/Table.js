import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'

import Checkbox from '../../components/commons/Checkbox'
import { PER_PAGE } from '../../constants/Constants';
import ReactPaginate from 'react-paginate';
import ColumnTitle from '../../components/commons/ColumnTitle'

import { authorities } from '../../utils/CommonUtils'


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
                        <div className="section_title_table user_title_table">
                            <div className="section_name"><span>No</span></div>
                            <div className="section_name"><span>権限</span></div>
                            <div className="section_name user_company"><span>企業名</span></div>
                            <div className="section_name user_brand"><span>ブランド名</span></div>
                            <div className="section_name user_brand"><span>店舗名</span></div>
                            <div className="section_name"><span>ユーザ名</span></div>
                        </div>
                        :
                        <div className="section_button_delete" data-tip={Globalize.localize('map_delete', Globalize.culture())} data-for="tooltip_table_button" onClick={this.props.onClickDelete}><span className="other_trigger up"></span></div>
                    }
                </dt>
                {data.map((user, index) => <dd key={index}>
                    <ul>
                        <Checkbox  id={'users_' + user.id}
                                   label=""
                                   key={user.id}
                                   check={(id) => this.props.onCheckRow(id)}
                                   className="section_check_box"
                                   isChecked={selectedIds.indexOf(user.id) >=0}
                            />
                        <li className="no-number user_no">{index + 1}</li>
                        <li className="news-new-name user_new">{authorities[parseInt(user.authority) - 1]}</li>
                        <li className="news-new-name user_new">{user.company_name}</li>
                        <li className="news-new-name user_new">{user.brand_name}</li>
                        <li className="news-new-name user_new">{user.store_name}</li>
                        <li className="news__title user_title">{user.name}</li>
                        <li className="widget__page__button__detail"><p><Link to={"/user/edit/" + user.id}>編集</Link></p></li>
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
