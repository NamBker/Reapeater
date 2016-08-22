import React, { Component, PropTypes } from 'react';
import moment from 'moment'
import { informationStatus, informationType } from '../../utils/CommonUtils'
import { connect } from 'react-redux';
import { Link } from 'react-router'
import Checkbox from '../../components/commons/Checkbox'
import { deleteInformation } from '../../actions/information'
import * as Const from '../../constants/Constants';
import ReactPaginate from 'react-paginate';
import { fetchInformation } from '../../actions/information'
import ColumnTitle from '../../components/commons/ColumnTitle'

class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isCheckAll: false,
            checkedItems_Arr : [],
            page : 1,
        };
        this.handlePageChanged = this.handlePageChanged.bind(this);
        this.handleChangeChecked = this.handleChangeChecked.bind(this);
        this.handleInformationId = this.handleInformationId.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }

    componentDidMount() {
        const { dispatch, filter } = this.props;
        dispatch(fetchInformation(filter));
    }

    handlePageChanged(newPage) {
        this.setState({ current : newPage });
    }

    handleChangeChecked() {
        this.setState({ isCheckAll: !this.state.isCheckAll });
        let checkedItems = [];
        if (!this.state.isCheckAll) {
            let informationList = this.props.informations;
            for (var i = 0; i < informationList.length; i++) {
                checkedItems.push(informationList[i].id);
            }
        }

        this.setState({checkedItems_Arr : checkedItems});
    }

    handleInformationId(informationId) {
        let checkedItems = this.state.checkedItems_Arr;
        let index = checkedItems.indexOf(informationId);
        if (index >= 0) {
            checkedItems.splice(index, 1);
            this.setState({checkedItems_Arr: checkedItems, isCheckAll: false});
        } else {
            checkedItems.push(informationId);
            this.setState({checkedItems_Arr: checkedItems});
        }

    }

    handlePageClick(data) {
        let page = data.selected + 1;
        this.setState({isCheckAll: false, checkedItems: []}, () => {
            this.props.dispatch(fetchInformation(Object.assign(this.props.filter, {page: page, per_page: Const.PER_PAGE})));
        });
    }

    render() {
        const { informations, titles, filter, information_count } = this.props;
        var checked = this.state.isCheckAll ? "checked" : '';
        var offset = (filter.page - 1) * Const.PER_PAGE;

        return (
            <dl className="widget widget__page__table">
                <dt>
                    <span className="check-all">
                        <input type="checkbox" id="checkbox_all" checked={checked} onClick={this.handleChangeChecked} />
                        <label htmlFor="checkbox_all"></label>
                    </span>

                    {(!this.state.isCheckAll && this.state.checkedItems_Arr.length == 0) ?
                        <div className="table__title">
                            <ColumnTitle title={Globalize.localize('map_publish_start_date', Globalize.culture())} style={{width: "120px"}}/>
                            <ColumnTitle title={Globalize.localize('map_status', Globalize.culture())} style={{float: 'right', width: '60px'}}/>
                            <ColumnTitle title={Globalize.localize('map_title', Globalize.culture())} style={{marginRight: 'auto', float: 'left'}}/>
                            <ColumnTitle title={Globalize.localize('map_store_name', Globalize.culture())} style={{width: "242px"}}/>
                        </div>
                        :
                        <div className="section_button_delete"><span className="other_trigger up"><img src="../assets/img/icon-garbage.png" onClick={this.props.deleteSelectedInformation.bind(null, this.state.checkedItems_Arr)} /></span></div>
                    }
                </dt>
                {informations.map((info, index) => <dd key={index}>
                    <ul>
                        <Checkbox  id={'infor_' + info.id}
                                       label=""
                                       key={info.id}
                                       check={this.handleInformationId}
                                       className="check_box_information information_table"
                                       isChecked={this.state.isCheckAll || this.state.checkedItems_Arr.indexOf(info.id) >=0}
                                       />
                        <li className="no-number">{index + 1 + Const.PER_PAGE * (filter.page - 1)}</li>
                        <li className="widget__page__information__table__date">{moment(info.effective_period_from).format('YYYY年MM月DD日')}</li>
                        <li className="widget__page__information__table__status">{informationStatus[info.status]}</li>
                        <li className="widget__page__information__table__title"><Link to={"/information/edit/" + info.id}>{info.title}</Link></li>
                        <li className="widget__page__information__table__delivery">{info.delivery}</li>
                        <li className="widget__page__button__detail"><p><Link to={"/information/edit/" + info.id}>{Globalize.localize('filter_update', Globalize.culture())}</Link></p></li>
                    </ul>
                </dd>)}

                <dd className="widget__page__table__pagination">
                    <span style={{width: '130px'}}>{Globalize.localize('map_total', Globalize.culture())}：{information_count} {Globalize.localize('map_matter', Globalize.culture())}</span>
                    <ReactPaginate
                        previousLabel={" "}
                        forceSelected={filter.page - 1}
                        nextLabel={" "}
                        breakLabel={<a>...</a>}
                        pageNum={Math.ceil(information_count / Const.PER_PAGE)}
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
    informations: PropTypes.array.isRequired,
    titles: PropTypes.object,
    filter: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        informations: state.informations,
        information_count: state.information_count,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        deleteSelectedInformation: (CheckedItems) => {
            if(confirm(Globalize.localize('confirm_before_delete', Globalize.culture()))){
                var filters = ownProps.filter;
                var checkItems = CheckedItems;
                filters.information_ids = checkItems;
                dispatch(deleteInformation(filters));
            }
        },
        dispatch
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Table)
