import React, { Component, PropTypes } from 'react';
import Toggle from 'react-toggle'
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';


const DragHandle = SortableHandle(() => <span className="drap_handle"></span>);
const SortableItem = SortableElement(({value, index, deleteItem, onChangeTitleItem, onChangeBodyItem, onChangeToggleItem}) => {
    return (
        <div className="contents__container__tr">
            <div className="contents__container__td contents__container__td__toggle2">
                <Toggle checked={value.display || false} onChange={(e) => {onChangeToggleItem(index, e.target.checked)}} />
            </div>
            <div className="contents__container__td contents__container__td__komoku2">
                <input  onChange={(e) => {onChangeTitleItem(index, e.target.value)}} value={value.title || ''} type="text" className="contents__container__input--text width150" />
            </div>
            <div className="contents__container__td">
                <input onChange={(e) => {onChangeBodyItem(index, e.target.value)}} value={value.body || ''} type="text" className="contents__container__input--text width-full"></input>
            </div>
            <div className="contents__container__td icon__cell">
                <input type="button" defaultValue="削除" className="btn_garbage btn_garbage_modify" onClick={() => {deleteItem(index)}} />
                <dl className="drag_handle_style"><DragHandle /></dl>
            </div>
        </div>
    )
});

const SortableList = SortableContainer(({items ,deleteItem, onChangeTitleItem, onChangeBodyItem, onChangeToggleItem}) => {
    return (
        <div>
            {items.map((item, index) => <SortableItem key={`item-${index}`} index={index} value={item} deleteItem={deleteItem} onChangeTitleItem={onChangeTitleItem} onChangeBodyItem={onChangeBodyItem} onChangeToggleItem={onChangeToggleItem} ItemLength={items.length}/>)}
        </div>
    );

});

class CompanySummaryListItem extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const { onSortEnd, addItem , btnText, items, deleteItem, onChangeTitleItem, onChangeBodyItem, onChangeToggleItem } =  this.props;
        return (
            <div>
                <SortableList items={items} onSortEnd={onSortEnd} useDragHandle={true} deleteItem={deleteItem} onChangeTitleItem={onChangeTitleItem} onChangeBodyItem={onChangeBodyItem} onChangeToggleItem={onChangeToggleItem} />
                <div className="contents__container__dl clearfix">
                    <div className="contents__container__dd text-center"><input type="button" onClick={addItem}  defaultValue={btnText} className="contents__container__input-button btn_add" /></div>
                </div>
            </div>
        );
    }
}

export default CompanySummaryListItem;
