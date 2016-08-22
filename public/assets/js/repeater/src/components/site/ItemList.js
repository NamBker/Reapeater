import React, { Component, PropTypes } from 'react';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';


const DragHandle = SortableHandle(() => <span className="drap_handle"></span>);
const SortableItem = SortableElement(({value, index, deleteItem, onChangeTitleItem, onChangeBodyItem, isCheckedStatus, content}) => {
    return (
        <div className="contents__container__dl clearfix">
            <div className="contents__container__dt">自由項目{index + 1}</div>
            <div className="contents__container__dd__inner">
                <div className="contents__container__dl__inner clearfix">
                    <div className="contents__container__dt__inner">タイトル</div>
                    <div className="contents__container__dd__inner2"><input  onChange={(e) => {onChangeTitleItem(index, e.target.value)}} value={value.title || ''} type="text" className="contents__container__input--text width-full" /></div>
                </div>
                <div className="contents__container__dl__inner clearfix">
                    <div className="contents__container__dt__inner">テキスト</div>
                    <div className="contents__container__dd__inner2"><textarea onChange={(e) => {onChangeBodyItem(index, e.target.value)}} value={value.body || ''} className="contents__container__textarea width-full"></textarea></div>
                </div>
            </div>
            <div className="contents__container__dd icon__cell">{index == 0 ? null : <input type="button" defaultValue="削除" className="btn_garbage btn_garbage_modify" onClick={() => {deleteItem(index)}} />}<dl className="drag_handle_style"><DragHandle /></dl></div>
        </div>
    )
});

const SortableList = SortableContainer(({items, content ,deleteItem, onChangeTitleItem, onChangeBodyItem, isCheckedStatus}) => {
    return (
        <div>
            {items.map((item, index) => <SortableItem key={`item-${index}`} index={index} value={item} content={content} deleteItem={deleteItem} onChangeTitleItem={onChangeTitleItem} onChangeBodyItem={onChangeBodyItem} isCheckedStatus={isCheckedStatus} />)}
        </div>
    );

});

class ItemList extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const { onSortEnd, addItem , btnText, items, deleteItem, onChangeTitleItem, onChangeBodyItem, isCheckedStatus, editItem, content} =  this.props;
        return (
            <dl>
                <div className="group_input select_answer_input">
                    <SortableList items={items} content={content} onSortEnd={onSortEnd} useDragHandle={true} deleteItem={deleteItem} onChangeTitleItem={onChangeTitleItem} onChangeBodyItem={onChangeBodyItem} editItem={editItem} isCheckedStatus={isCheckedStatus} />
                    <div className="contents__container__dl clearfix">
                        <div className="contents__container__dd text-center"><input type="button" onClick={addItem}  defaultValue="自由項目を追加する" className="contents__container__input-button btn_add" /></div>
                    </div>
                </div>
            </dl>
        );
    }
}

export default ItemList;
