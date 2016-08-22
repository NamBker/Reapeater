import React, { Component, PropTypes } from 'react';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';


const DragHandle = SortableHandle(() => <span className="drap_handle"></span>);

const SortableItem = SortableElement(({value, index, deleteItem, editItem}) => {
    return (
        <dl>
            <input value={value || ''} onChange={(e) => {editItem(index, e.target.value)}} type="text"/>
            <div className="section_button_delete" onClick={() => {deleteItem(index)}}>
                <span className="other_trigger up"></span>
            </div>
            <DragHandle />
        </dl>
    )
});

const SortableList = SortableContainer(({items, deleteItem, editItem}) => {
    return (
        <div>
            {items.map((value, index) =>
                <SortableItem key={`item-${index}`} index={index} deleteItem={deleteItem} editItem={editItem} value={value} />
            )}
        </div>
    );
});


class AnswerList extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const { onSortEnd, addItem , btnText, items, deleteItem, editItem} =  this.props;
        return (
            <dl>
                <div className="group_input select_answer_input">
                    <SortableList items={items} onSortEnd={onSortEnd} useDragHandle={true} deleteItem={deleteItem} editItem={editItem}/>
                    <dl className="add_answer_button" onClick={addItem}>
                        <div><span className="plus"></span><span>{btnText}</span></div>
                    </dl>
                </div>
            </dl>
        );
    }
}

export default AnswerList;
