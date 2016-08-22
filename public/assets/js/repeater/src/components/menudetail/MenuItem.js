import React, { Component, PropTypes } from 'react';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';

const DragHandle = SortableHandle(() => <input type="button" value={Globalize.localize('b_move', Globalize.culture())} className="btn_move" />);

const SortableItem = SortableElement(({value, index, deleteItem, onOpenSelectPicture, onDeleteMenuItemPicture, onChangeMenuItemName, onChangeMenuItemPrice, onChangeMenuItemDescription}) => {
    return (
        <div className="contents__container__dl clearfix">
            <div className="contents__container__dt">{Globalize.localize('l_menu_item', Globalize.culture()) + (index+1)}</div>
            <div className="contents__container__dd__inner">
                <div className="contents__container__dl__inner clearfix">
                    <div className="contents__container__dt__inner">{Globalize.localize('l_item_name', Globalize.culture())}</div>
                    <div className="contents__container__dd__inner">
                        <input type="text" className="contents__container__input--text width-full" value={value.item_name} onChange={(event) => {onChangeMenuItemName(value,index,event)}}/>
                    </div>
                </div>
                <div className="contents__container__dl__inner clearfix">
                    <div className="contents__container__dt__inner">{Globalize.localize('l_price', Globalize.culture())}</div>
                    <div className="contents__container__dd__inner">
                        <input type="text" className="contents__container__input--text width-full" value={value.price} onChange={(event) => {onChangeMenuItemPrice(value,index,event)}}/>
                    </div>
                </div>
                <div className="contents__container__dl__inner clearfix">
                    <div className="contents__container__dt__inner">{Globalize.localize('l_description', Globalize.culture())}</div>
                    <div className="contents__container__dd__inner">
                        <textarea className="contents__container__textarea width-full" value={value.description} onChange={(e)=>{onChangeMenuItemDescription(value,index,e)}} placeholder={Globalize.localize('place_holder_html_editor', Globalize.culture())}></textarea>
                    </div>
                </div>
                <div className="contents__container__dl__inner clearfix">
                    <div className="contents__container__dt__inner">{Globalize.localize('l_image', Globalize.culture())}</div>
                    <div className="contents__container__dd__inner">
                        <div className="contents__container__logo-container mb10 mt10">
                            <div className="contents__container__image-btn">
                                <input type="button" value={Globalize.localize('l_image_selection', Globalize.culture())} className="contents__container__input-button" onClick={() => {onOpenSelectPicture(index)}} />
                            </div>
                            <div className="contents__container__image-name">{value.picture_name}</div>
                            {value.picture_id ? <div className="contents__container__del-btn"><img src="/assets/img/img-dell.png" onClick={() => {onDeleteMenuItemPicture(value,index)}}/></div> : ""}
                        </div>
                        <div className="contents__container__logo mb10">
                            <img src={value.picture_url}  className="preview_image"/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="contents__container__dd icon__cell">
                {(index!=0)? <input type="button" value={Globalize.localize('l_deletion', Globalize.culture())} className="btn_garbage" onClick={() => {deleteItem(index)}} />  : null}
                <DragHandle />
            </div>
        </div>
    )
});

const MenuItem = SortableContainer(({items, deleteItem, onOpenSelectPicture, onDeleteMenuItemPicture, onChangeMenuItemName, onChangeMenuItemPrice, onChangeMenuItemDescription, onSortEnd}) => {
    return (
        <div className="hometop_border_bottom">
            {items.map((value, index) =>
                <SortableItem key={`item-${index}`}
                              index={index}
                              value={value}
                              deleteItem={deleteItem}
                              onSortEnd={onSortEnd}
                              onOpenSelectPicture={onOpenSelectPicture}
                              onDeleteMenuItemPicture={onDeleteMenuItemPicture}
                              onChangeMenuItemName={onChangeMenuItemName}
                              onChangeMenuItemPrice={onChangeMenuItemPrice}
                              onChangeMenuItemDescription={onChangeMenuItemDescription}/>
            )}
        </div>
    );
});

export default MenuItem;
