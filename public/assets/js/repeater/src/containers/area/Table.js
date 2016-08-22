import React, { Component, PropTypes } from 'react';
import moment from 'moment'
import { connect } from 'react-redux';
import { Link } from 'react-router'
import Checkbox from '../../components/commons/Checkbox'
import * as Const from '../../constants/Constants';
import ReactPaginate from 'react-paginate';
import { fetchAreas, deleteArea } from '../../actions/area'
import ColumnTitle from '../../components/commons/ColumnTitle'
import { areaNames } from '../../utils/CommonUtils'
import { doCustomUpdate } from '../../actions/routes'

class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isCheckAll: false,
            checkedItems : [],
            page : 1,
            doUpdate: false,
        };
        this.handlePageChanged = this.handlePageChanged.bind(this);
        this.handleChangeChecked = this.handleChangeChecked.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.handleAreaIds = this.handleAreaIds.bind(this);
        //this.handleSelectUpdate = this.handleSelectUpdate.bind(this);
    }

    componentDidMount() {
        const { dispatch, filter } = this.props;
        dispatch(fetchAreas(Object.assign(filter, {per_page: Const.PER_PAGE})));
    }

    handlePageChanged(newPage) {
        this.setState({ current : newPage });
    }

    handleChangeChecked() {
        this.setState({ isCheckAll: !this.state.isCheckAll });
        let checkedItems = [];
        if (!this.state.isCheckAll) {
            let areaList = this.props.areas;
            for (var i = 0; i < areaList.length; i++) {
                checkedItems.push(areaList[i].id);
            }
        }

        this.setState({checkedItems : checkedItems});
    }

    handleAreaIds(areaId) {
        console.log(areaId);
        let checkedItems = this.state.checkedItems;
        let index = checkedItems.indexOf(areaId);
        if (index >= 0) {
            checkedItems.splice(index, 1);
            this.setState({checkedItems: checkedItems, isCheckAll: false});
        } else {
            checkedItems.push(areaId);
            this.setState({checkedItems: checkedItems});
        }

    }

    handlePageClick(data) {
        let page = data.selected + 1;
        this.setState({isCheckAll: false, checkedItems: []}, () => {
            this.props.dispatch(fetchAreas(Object.assign(this.props.filter, {page: page, per_page: Const.PER_PAGE})));
        });
    }

    handleSelectUpdate(areaId){
        console.log("AREA ID:" + areaId.target.value);

        let areas = this.props.areas;
        let target = {};
        for (let area of areas) {
            if (areaId.target.value == area.id){
                target = area;
                break;
            }
        }
        // TODO find AREA
        this.props.handleSelectUpdate(target);
    }

    render() {
        const { areas, titles, filter, count } = this.props;
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
                            <div className="section_name "><span>{Globalize.localize('map_company', Globalize.culture())}</span></div>
                            <div className="section_store_name"><span>{Globalize.localize('map_brand', Globalize.culture())}</span></div>
                            <div className="section_store_name"><span>{Globalize.localize('map_area_section', Globalize.culture())}</span></div>
                            <div className="section_store_name"><span>{Globalize.localize('map_area_name', Globalize.culture())}</span></div>
                            <div className="section_store_edit"></div>
                        </div>
                        :
                        <a className="section_button_delete" onClick={this.props.deleteSelectedArea.bind(null, this.state.checkedItems)}></a>
                }
                </dt>
                {areas.map((area, index) => <dd key={index}>
                    <ul>
                        <Checkbox  id={'infor_' + area.id}
                                   label=""
                                   key={area.id}
                                   check={this.handleAreaIds}
                                   className="section_check_box"
                                   isChecked={this.state.isCheckAll || this.state.checkedItems.indexOf(area.id) >=0}
                            />
                        <li className="no-number">{index+1+offset}</li>
                        <li className="news-new-name">{area.company_name}</li>
                        <li className="news-new-name">{area.brand_name}</li>
                        <li className="news-new-name">{areaNames[area.area_type - 1]}</li>
                        <li className="news__title">{area.area_name}</li>
                        <li className="widget__page__button__detail">
                            <div value={area.id} onClick={(e) => this.handleSelectUpdate(e)}>{Globalize.localize('filter_update', Globalize.culture())}</div>
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
    areas: PropTypes.array.isRequired,
    titles: PropTypes.object,
    filter: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        areas: state.areas,
        count: state.areas_count
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        deleteSelectedArea: (CheckedItems) => {
            if(confirm(Globalize.localize('confirm_delete', Globalize.culture()))){
                var filters = ownProps.filter;
                var checkItems = CheckedItems;
                filters.area_ids = checkItems;
                dispatch(deleteArea(filters));
            }
        },
        dispatch
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Table)
