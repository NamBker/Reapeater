import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Link } from 'react-router';
import Checkbox from '../../components/commons/Checkbox';
import { PER_PAGE } from '../../constants/Constants';
import ReactPaginate from 'react-paginate';
import ColumnTitle from '../../components/commons/ColumnTitle';
import ReactTooltip from 'react-tooltip';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIds: props.initSelection ? props.initSelection : [],    // Checkbox
            selectedId: props.initSelection ? props.initSelection: '',     // Radio
        };
        this.data = null;
        this.selectableRowCount = 0;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data != this.data) {
            this.data = nextProps.data;
            this.selectableRowCount = 0;
            nextProps.data.forEach(element => {
                if (this.props.isSelectableRow(element)) {
                    this.selectableRowCount++;
                }
            });
            this.setState({selectedIds: []});
        }
    }

    onClickEntireRow(e, id) {
        if (this.props.selectableEntireRow) {
            this.onCheckRow(id);
        }
    }

    onCheckRow(id) {
        if (this.props.selectType == Table.selectTypeCheckbox) {
            let selectedIds = this.state.selectedIds;
            let idx = selectedIds.indexOf(id);
            if (0 <= idx) {
                selectedIds.splice(idx, 1);
            } else {
                selectedIds.push(id);
            }
            this.setState({selectedIds}, () => {
                if (this.props.onChangeCheck) {
                    this.props.onChangeCheck(selectedIds);
                }
            });
        } else {
            this.setState({selectedId: id}, () => {
                this.props.onChangeCheck(id);
            });
        }
    }

    onCheckAll(isCheckAll) {
        let selectedIds = [];
        if (isCheckAll) {
            selectedIds = this.props.data.map((element) => {return this.props.isSelectableRow(element) ? element.id : null}).filter(id => id);
        }
        this.setState({selectedIds}, () => {
            if (this.props.onChangeCheck) {
                this.props.onChangeCheck(selectedIds);
            }
        });
    }

    isAllCheck() {
        return (0 < this.selectableRowCount) &&
            (this.selectableRowCount <= this.state.selectedIds.length);
    }

    render() {
        const { className, data, formats, totalCount, curPage, selectType, isShowPagenate, additionalRow } = this.props;
        const { selectedIds, selectedId } = this.state;
        return (
            <dl className={"widget widget__page__table mt20" + (className ? " " + className : "")}>
                <dt className="widget__page__input__contents__table__title">
                    {selectType == Table.selectTypeCheckbox ?
                    <span className="check-all">
                        <input type="checkbox"
                            id="checkbox_all"
                            checked={this.isAllCheck() ? 'checked' : ''}
                            onClick={(e) => this.onCheckAll(e.target.checked)} />
                        <label htmlFor="checkbox_all"></label>
                    </span>
                    :
                    <span className="check-all-dummy" />}
                    {(selectedIds.length < 1) ?
                    <div className="table__title">
                        {formats.map((format) =>
                            <ColumnTitle key={format.valueKey} title={format.title} style={format.style}/>
                        )}
                    </div>
                    :
                    <div>
                        <div className="section_button_delete"
                            data-tip={Globalize.localize('map_delete', Globalize.culture())}
                            data-for="tooltip_table_button" onClick={() => this.props.onDelete(this.state.selectedIds)}>
                            <span className="other_trigger up"></span>
                        </div>
                        <ReactTooltip class="tooltip__theme" id="tooltip_table_button" place="top" type="light" effect="solid"/>
                    </div>}
                    {this.props.hasOptionFunc ?
                    <div className="widget__page__input__contents__optional__button">
                        <a key="optional__button"></a>
                        <ul key="optiional__button__menu" className="dropmenu">
                            {this.props.optionFuncs.map((func, index) =>
                                <li key={'optional__button__list__' + index}>
                                    <a key={'optional__button__key__' + index} onClick={func.func}>{func.label}</a>
                                </li>
                            )}
                        </ul>
                    </div>
                    :null}
                </dt>
                {data.map((element, index) =>
                <dd key={index} className={"widget__page__input__contents__table__row" + (this.props.selectableEntireRow ? " widget__page__input__selectable" : "")}
                    onClick={(e) => {this.onClickEntireRow(e, element.id)}}>
                    <ul key={"widget__page__input__contents__table__row__" + index}>
                        {this.props.isSelectableRow(element) ?
                        (selectType == Table.selectTypeCheckbox ?
                        <Checkbox
                            id={'data_table_' + element.id}
                            label=""
                            key={element.id}
                            check={(id) => this.onCheckRow(element.id)}
                            className="widget__page__input__contents__table__row__checkbox"
                            isChecked={selectedIds.indexOf(element.id) >=0}
                        />
                        :
                        <div className="widget__page__input__contents__table__row__radio__button">
                            <label key={'data_table_radio_' + element.id} className="contents__container__radio">
                                <input type="radio"
                                    id={'data_table_' + element.id}
                                    name="data_table_group"
                                    value={element.id}
                                    onChange={(e) => this.onCheckRow(e.target.value)}
                                    className="input__radio"
                                    checked={selectedId == element.id}/>
                            </label>
                        </div>) : <div className="widget__page__input__contents__table__row__dummy__column"/>}
                        <li key={"no-number_" + index} className="no-number">{index + 1 + PER_PAGE * (curPage - 1)}</li>
                        {formats.map((format) =>
                        <li key={"cell__for__key__" + format.valueKey + "__" + index} style={format.style}>
                            {this.props.cellForKey(format.valueKey, element)}
                        </li>
                        )}
                    </ul>
                    {this.props.hasEditButtonForRow(element) ?
                    <div className="widget__page__input__contents__optional__button">
                        <div className="widget__page__input__contents__table__row__edit__btn"
                            onClick={(e) => this.props.onClickEdit(element)}>
                            {Globalize.localize('filter_update', Globalize.culture())}
                        </div>
                    </div> : null}
                </dd>)}
                {additionalRow ?
                <dd key="table__additinal__row">
                    {additionalRow()}
                </dd>
                : null}
                {isShowPagenate ?
                <dd className="widget__page__table__pagination">
                    <span>{Globalize.localize('map_total', Globalize.culture())}：{totalCount} {Globalize.localize('map_matter', Globalize.culture())}</span>
                    {0 < totalCount ?
                        <ReactPaginate
                            previousLabel={" "}
                            forceSelected={curPage - 1}
                            nextLabel={" "}
                            breakLabel={<a>...</a>}
                            pageNum={Math.ceil(totalCount / PER_PAGE)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            clickCallback={this.props.onChangePage}
                            containerClassName={"pagination member_paginate"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"}
                            />
                            :
                            null}
                    <span style={{width: '130px'}}></span>
                </dd> : null}
            </dl>
        );
    }
}

Table.selectTypeCheckbox = 1;
Table.selectTypeRadio = 2;

Table.propTypes = {
    data: PropTypes.array.isRequired,
    formats: PropTypes.array.isRequired,
    curPage: PropTypes.number.isRequired,
    totalCount: PropTypes.number,
    selectType: PropTypes.number,
    onDelete: PropTypes.func,
    onChangePage: PropTypes.func,
    hasOptionFunc: PropTypes.bool,
    optionFuncs: PropTypes.array,
    hasEditButtonForRow: PropTypes.func,
    onClickEdit: PropTypes.func,
    onChangeCheck: PropTypes.func,
    selectableEntireRow: PropTypes.bool,
    isShowPagenate: PropTypes.bool,
    className: PropTypes.string,
    additionalRow: PropTypes.func,
    isSelectableRow: PropTypes.func,
    initSelection: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string,
        PropTypes.number,
    ]),
};

Table.defaultProps = {
    selectType: Table.selectTypeCheckbox,
    onChangeCheck: (selectedId) => {},
    hasEditButtonForRow: (element) => false,
    selectableEntireRow: false,
    isShowPagenate: true,
    hasOptionFunc: false,
    hasEditButtonForRow: (element) => true,
    isSelectableRow: (element) => true,
};

export default Table;

