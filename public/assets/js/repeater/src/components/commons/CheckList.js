import React, { Component, PropTypes } from 'react';
import Checkbox from './Checkbox'
import { uuid } from '../../utils/CommonUtils'

class CheckList extends Component {
    constructor(props) {
        super(props);
        this.datas = '';
        this.checkedItems = '';
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.isVisibleData) {
            let nextDatas = JSON.stringify(nextProps.data.map((element) => {return this.props.isVisibleData(element) ? element : null}));
            if (nextDatas != this.datas) {
                this.datas = nextDatas;
                this.checkedItems = '';
                return true;
            }
        }
        let nextCheckedItems = JSON.stringify(nextProps.checkedItems);
        if (nextCheckedItems != this.checkedItems) {
            this.checkedItems = nextCheckedItems;
            return true;
        }
        return false;
    }

    onChange(key, checked) {
        let v = this.props.isKeyNumber ? parseInt(key) : key;
        let checkedItems = this.props.checkedItems;
        let index = checkedItems.indexOf(v);
        if (index >= 0) {
            if (!checked) {
                checkedItems.splice(index, 1);
                this.props.onChangedSelection(checkedItems);
            }
        } else {
            if (checked) {
                checkedItems.push(v);
                this.props.onChangedSelection(checkedItems);
            }
        }
    }

    render() {
        const { className, id, checkedItems, dataLabelKey, dataValueKey, isVisibleData, data } = this.props;
        return (
            <div className={"check__list__contents" + (className ? " " + className : "")}>
                {data.map((element) => {
                    return isVisibleData == null || isVisibleData(element) ? <Checkbox id={id + '_' + element[dataValueKey]}
                        key={element[dataValueKey]}
                        checkValue={element[dataValueKey]}
                        label={element[dataLabelKey]}
                        onChange={(key, checked) => this.onChange(key, checked)}
                        editable={this.props.editable}
                        isChecked={checkedItems.indexOf(element[dataValueKey]) >= 0}/> :
                            null
                })}
            </div>
        );
    }
}

CheckList.propTypes = {
    id: PropTypes.string,
    data: PropTypes.array.isRequired,
    checkedItems: PropTypes.array,
    onChangedSelection: PropTypes.func,
    dataLabelKey: PropTypes.string.isRequired,
    dataValueKey: PropTypes.string.isRequired,
    isVisibleData: PropTypes.func,
    editable: PropTypes.bool,
    isKeyNumber: PropTypes.bool,
    className: PropTypes.string,
};

CheckList.defaultProps = {
    checkedItems: [],
    isVisibleData: null,
    id: uuid(),
    editable: false,
    isKeyNumber: true,
};

export default CheckList
