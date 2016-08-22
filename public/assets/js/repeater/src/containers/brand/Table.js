import React, { Component, PropTypes } from 'react';
import moment from 'moment'
import { connect } from 'react-redux';
import { Link } from 'react-router'
import Checkbox from '../../components/commons/Checkbox'
import * as Const from '../../constants/Constants';
import ReactPaginate from 'react-paginate';
import { fetchBrands, deleteBrands } from '../../actions/brand'
import ColumnTitle from '../../components/commons/ColumnTitle'
import { brand_status } from '../../utils/CommonUtils'


class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isCheckAll: false,
            checkedItems : [],
            page : 1,
        };

        this.handlePageChanged = this.handlePageChanged.bind(this);
        this.handleChangeChecked = this.handleChangeChecked.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.handleBrandIds = this.handleBrandIds.bind(this);

    }

    componentDidMount() {
        const { dispatch, filter } = this.props;
        dispatch(fetchBrands(Object.assign(filter, {per_page: Const.PER_PAGE})));
    }

    handlePageChanged(newPage) {
        this.setState({ current : newPage });
    }

    handleChangeChecked() {
        this.setState({ isCheckAll: !this.state.isCheckAll });
        let checkedItems = [];
        if (!this.state.isCheckAll) {
            let brandList = this.props.brands;
            for (var i = 0; i < brandList.length; i++) {
                checkedItems.push(brandList[i].id);
            }
        }

        this.setState({checkedItems : checkedItems});
    }

    handleBrandIds(brandId) {
        console.log(brandId);
        brandId = parseInt(brandId);
        let checkedItems = this.state.checkedItems;
        let index = checkedItems.indexOf(brandId);
        if (index >= 0) {
            checkedItems.splice(index, 1);
            this.setState({checkedItems: checkedItems, isCheckAll: false});
        } else {
            checkedItems.push(brandId);
            this.setState({checkedItems: checkedItems});
        }

    }

    handlePageClick(data) {
        let page = data.selected + 1;
        this.setState({isCheckAll: false, checkedItems: []}, () => {
            this.props.dispatch(fetchBrands(Object.assign(this.props.filter, {page: page, per_page: Const.PER_PAGE})));
        });
    }

    render() {
        const { brands, filter, count, deleteSelectedBrands } = this.props;

        var checked = this.state.isCheckAll ? "checked" : '';
        var offset = (filter.page - 1) * Const.PER_PAGE;

        return (
            <dl className="widget widget__page__table">
                <dt className="widget__title">
                    <span className="check-all">
                        <input type="checkbox" id="checkbox_all" checked={checked} onClick={this.handleChangeChecked} />
                        <label htmlFor="checkbox_all"></label>
                    </span>

                    {(!this.state.isCheckAll && this.state.checkedItems.length == 0) ?
                        <div className="section_title_table">
                            <div className="section_name "><span>{Globalize.localize('map_company_name', Globalize.culture())}</span></div>
                            <div className="section_name"><span>{Globalize.localize('map_brand_name', Globalize.culture())}</span></div>
                            <div className="section_store_name"><span>{Globalize.localize('map_brand_code', Globalize.culture())}</span></div>
                            <div className="section_store_name"><span>{Globalize.localize('map_status', Globalize.culture())}</span></div>
                            <div className="section_store_edit"></div>
                        </div>
                        :
                        <a className="section_button_delete" onClick={deleteSelectedBrands.bind(null, this.state.checkedItems)}></a>
                    }
                </dt>
                {brands.map((brand, index) => <dd key={index}>
                    <ul>
                        <Checkbox  id={'infor_' + brand.id}
                                   label=""
                                   key={brand.id}
                                   check={this.handleBrandIds}
                                   className="section_check_box"
                                   isChecked={this.state.isCheckAll || this.state.checkedItems.indexOf(brand.id) >=0}
                            />
                        <li className="no-number">{index+1+offset}</li>
                        <li className="news-new-name">{brand.company_name}</li>
                        <li className="news-new-name">{brand.brand_name}</li>
                        <li className="news-new-name">{brand.brand_code}</li>
                        <li className="news__title">{brand_status[brand.brand_status]}</li>
                        <li className="widget__page__button__detail">
                            <Link to={"/brand/edit/" + brand.id} className="btn btn-info">{Globalize.localize('filter_update', Globalize.culture())}</Link>
                        </li>
                    </ul>
                </dd>)}

                <dd className="widget__page__table__pagination">
                    <span style={{width: '130px'}}>{Globalize.localize('map_total', Globalize.culture())}：{count} {Globalize.localize('map_matter', Globalize.culture())}</span>
                    <ReactPaginate
                        previousLabel={" "}
                        forceSelected={filter.page - 1}
                        nextLabel={" "}
                        breakLabel={<a>...</a>}
                        pageNum={Math.ceil(count / Const.PER_PAGE)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        clickCallback={this.handlePageClick}
                        containerClassName={"pagination information_paginate"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"}
                        />
                    <span style={{width: '130px'}}></span>
                </dd>
            </dl>
        );
    }
}

Table.propTypes = {
    brands: PropTypes.array.isRequired,
    filter: PropTypes.object.isRequired,
    isCheckAll: PropTypes.bool,
    checkedItems: PropTypes.array,
};

const mapStateToProps = (state) => {
    return {
        brands: state.brands,
        count: state.brands_count
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        //deleteSelectedBrands: (CheckedItems) => {
        //    if(confirm(Globalize.localize('confirm_delete', Globalize.culture()))){
        //        var filters = ownProps.filter;
        //        var checkItems = CheckedItems;
        //        filters.brand_ids = checkItems;
        //        dispatch(deleteBrands(filters));
        //    }
        //},
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Table)
