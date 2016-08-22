import React, { Component, PropTypes } from 'react';
import Checkbox from '../commons/Checkbox'
import DropDownList from  '../commons/DropDownList'
import CheckList from './CheckList';

import { connect } from 'react-redux';
import { eachArea } from '../../utils/CommonUtils'
import { AREA_TYPE_LARGE, AREA_TYPE_MEDIUM, AREA_TYPE_SMALL } from '../../constants/Constants'
var keyWord = '';
class Selection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isCheckAll: false,
            data: [],
            largeAreaId: '',
            mediumAreaId: '',
            smallAreaId: '',
        };
        let checkItems = [];
        props.data.forEach((element) => {
            if (this.checkCondition(element)) {
                this.state.data.push(element);
                if (props.checkedItems.indexOf(element.id) >= 0) {
                    checkItems.push(element.id);
                }
            }
        });
        this.state.isCheckAll = this.state.data.length <= props.checkedItems.length;
        this.check = this.check.bind(this);
        this.checkAll = this.checkAll.bind(this);
        this.searchFromKeyWord = this.searchFromKeyWord.bind(this);
        this.checkCondition = this.checkCondition.bind(this);
    }

    checkAll() {
        let checkItems = [];
        if (!this.state.isCheckAll) {
            this.state.data.map(element => {
                checkItems.push(element.id);
            });
        }
        this.props.changeItem(checkItems);
        this.setState({isCheckAll: !this.state.isCheckAll});
    }

    componentWillReceiveProps(nextProps) {
        var data = [];
        let checkItems = [];
        if (this.state.data.length == 0) {
            nextProps.data.map((element) => {
                if (this.checkCondition(element)) {
                    data.push(element);
                    if (nextProps.checkedItems.indexOf(element.id) >= 0) {
                        checkItems.push(element.id);
                    }
                }
            });
            if (nextProps.checkedItems.length < data.length) {
                this.setState({isCheckAll: false, data: data});
            } else {
                this.setState({data: data});
            }
        }
    }

    searchFromKeyWord() {
        var data = [];
        let checkItems = [];
        this.props.data.map((element) => {
            if (this.checkCondition(element)) {
                data.push(element);
                if (this.props.checkedItems.indexOf(element.id) >= 0) {
                    checkItems.push(element.id);
                }
            }
        });
        this.props.changeItem(checkItems);
        this.setState({data: data});
    }

    check(itemId) {
        let id = parseInt(itemId);
        let checkedItems = this.props.checkedItems;
        let index = checkedItems.indexOf(id);
        if (index >= 0) {
            checkedItems.splice(index, 1);
        } else {
            checkedItems.push(id);
        }
        this.props.changeItem(checkedItems);
    }


    checkCondition(element) {
        return this.props.checkCondition && element.store_name.search(keyWord) >= 0
            && (!this.state.largeAreaId || this.state.largeAreaId == element.store_area_L_id)
            && (!this.state.mediumAreaId || this.state.largeAreaId == element.store_area_M_id)
            && (!this.state.smallAreaId || this.state.largeAreaId == element.store_area_S_id);
    }

    handleLargeAreaId(e) {
        let new_data = [];
        let checkItems = [];
        if (e.target.value) {
            this.state.data.map((element) => {
                if (element.store_area_L_id == e.target.value) {
                    new_data.push(element);
                    if (this.props.checkedItems.indexOf(element.id) >= 0) {
                        checkItems.push(element.id);
                    }
                }
            });
            this.props.changeItem(checkItems);
        } else {
            this.state.largeAreaId = '';
            this.props.data.map((element) => {
                if (this.checkCondition(element)) {
                    new_data.push(element);
                }
            });
        }
        this.setState({ data : new_data, largeAreaId : e.target.value});
    }

    handleMediumAreaId(e) {
        let new_data = [];
        let checkItems = [];
        if (e.target.value) {
            this.state.data.map((element) => {
                if (element.store_area_M_id == e.target.value) {
                    new_data.push(element);
                    if (this.props.checkedItems.indexOf(element.id) >= 0) {
                        checkItems.push(element.id);
                    }
                }
            });
            this.props.changeItem(checkItems);
        } else {
            this.props.data.map((element) => {
                this.state.mediumAreaId = '';
                if (this.checkCondition(element)) {
                    new_data.push(element);
                }
            });
        }
        this.setState({ data : new_data, mediumAreaId : e.target.value});
    }

    handleSmallAreaId(e) {
        let new_data = [];
        let checkItems = [];
        if (e.target.value) {
            this.state.data.map((element) => {
                if (element.store_area_S_id == e.target.value) {
                    new_data.push(element);
                    if (this.props.checkedItems.indexOf(element.id) >= 0) {
                        checkItems.push(element.id);
                    }
                }
            });
            this.props.changeItem(checkItems);
        } else {
            this.props.data.map((element) => {
                this.state.smallAreaId = '';
                if (this.checkCondition(element)) {
                    new_data.push(element);
                }
            });
        }
        this.setState({ data : new_data, smallAreaId : e.target.value});
    }

    renderSelectArea(areaType) {
        return (
            <div key={"select__store__header__area__" + areaType}>
                <span className="select__store__header__area__title">{Globalize.localize('filter_area_' + areaType, Globalize.culture())}</span>
                <DropDownList
                    hasEmptyOption={true}
                    defaultValue={areaType == AREA_TYPE_LARGE ? this.state.largeAreaId : areaType == AREA_TYPE_MEDIUM ? this.state.mediumAreaId : this.state.smallAreaId}
                    data={this.props.areas}
                    onChange={(e) => {
                        switch (areaType) {
                            case AREA_TYPE_LARGE:
                                this.handleLargeAreaId(e);
                                break;
                            case AREA_TYPE_MEDIUM:
                                this.handleMediumAreaId(e);
                                break;
                            case AREA_TYPE_SMALL:
                                this.handleSmallAreaId(e);
                                break;
                        }
                    }}
                    eachCallback={eachArea(areaType, this.props.isVisibleArea)}/>
            </div>
        );
    }

    render() {
        const { checkedItems, isShowCheckAll, hasArea } = this.props;
        const { data } = this.state;
        var prefix = 'store_';
        var name = Globalize.localize('map_store_name', Globalize.culture());
        return (
            <div style={{paddingTop: '5px', paddingBottom: '10px'}}>
                <div className="select__store__header">
                    {isShowCheckAll ?
                        <Checkbox id={prefix + 0}
                                  label={Globalize.localize('filter_all_of', Globalize.culture()) + Globalize.localize('map_store', Globalize.culture()) + Globalize.localize('filter_to_select', Globalize.culture())}
                                  check={this.checkAll}
                                  isChecked={this.state.isCheckAll}
                                  style={{marginRight: 'auto'}}/> :
                        <span style={{marginRight: 'auto'}}>{Globalize.localize('filter_select_store', Globalize.culture())}：{checkedItems.length} {Globalize.localize('filter_short_store', Globalize.culture())}</span>
                    }
                    <div className="select__store__search">
                        <input type="text" placeholder={name + Globalize.localize('filter_to_search', Globalize.culture())}
                               onKeyDown={(e) => {if(e.key === 'Enter') this.searchFromKeyWord()}}
                               onChange={(e) => {keyWord = e.target.value}}/>
                        <input type="submit" value=" " className="btn-base" onClick={(e) => {e.preventDefault();this.searchFromKeyWord()}}/>
                    </div>
                </div>
                {
                    hasArea ?
                        <div className="select__store__header">
                            {[AREA_TYPE_LARGE, AREA_TYPE_MEDIUM, AREA_TYPE_SMALL].map((areaType) => this.renderSelectArea(areaType))}
                        </div>
                        : null
                }
                <div className="select__store__contents">
                    <CheckList
                        id="store__select__check__list"
                        data={data}
                        checkedItems={checkedItems}
                        onChangedSelection={this.props.changeItem}
                        dataLabelKey="store_name"
                        dataValueKey="id"
                        isVisibleData={this.props.checkCondition}
                    />
                </div>
            </div>
        );
    }
}

Selection.propTypes = {
    data: PropTypes.array.isRequired,
    changeItem: PropTypes.func.isRequired,
    checkedItems: PropTypes.array,
    checkCondition: PropTypes.func,
    isShowCheckAll: PropTypes.bool,
    areas: PropTypes.array,
    isVisibleArea: PropTypes.func,
    selectedAreas: PropTypes.object,
    onChangeArea: PropTypes.func,
};

Selection.defaultProps = {
    checkedItems: [],
    isShowCheckAll: true,
    checkCondition: () => true,
    hasArea: false,
    isVisibleArea: (area) => true,
    selectedAreas: {1: 0, 2: 0, 3: 0},
    onChangeArea: (type, areaId) => {},
};

const mapStateToProps = (state) => {
    return {
        areas: state.currentAreas
    }
}

export default connect(mapStateToProps)(Selection)
