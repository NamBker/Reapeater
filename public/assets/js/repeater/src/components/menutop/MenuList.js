import React, { Component, PropTypes } from 'react';
import {SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

const DragHandle = SortableHandle(() => <input type="button" value={Globalize.localize('b_move', Globalize.culture())} className="btn_move" />);

const SortableItem = SortableElement(({value, index, deleteItem, onDeletePicture, openModal, onOpenSelectPicture, siteMap }) => {
let menuId = value.menu
let menuName = ""
    siteMap.map((site) =>{
        if (menuId == site.id){
            menuName = site.sitemap_name
        }
    })

    return (
        <div className="contents__container__dl clearfix">
            <div className="contents__container__dt">{Globalize.localize('menu_top_menu_classification_order', Globalize.culture()) +  (index+1)}</div>
            <div className="contents__container__dd__inner">
                <div className="contents__container__dl__inner clearfix">
                    <div className="contents__container__dt__inner">{Globalize.localize('l_eye_catching_image', Globalize.culture())}</div>
                    <div className="contents__container__dd__inner">
                        <div className="contents__container__logo-container mb10 mt10">
                            <div className="contents__container__image-btn">
                                <input type="button"
                                       value={Globalize.localize('l_image_selection', Globalize.culture())}
                                       className="contents__container__input-button"
                                       onClick={() => {onOpenSelectPicture(index)}} />
                            </div>
                            <div className="contents__container__image-name">{value.filename}</div>
                            {value.id > 0 ?
                            <div className="contents__container__del-btn">
                                <img src="/assets/img/img-dell.png" alt={Globalize.localize('l_deletion', Globalize.culture())} height="20" width="20" onClick={() => {onDeletePicture(value,index)}}/>
                            </div> : ""}
                        </div>
                        <div className="contents__container__logo mb10">
                            <img src={value.url} className="preview_image"/>
                        </div>
                    </div>
                </div>
                <div className="contents__container__dl__inner clearfix">
                    <div className="contents__container__dt__inner">{Globalize.localize('l_link_destination_menu', Globalize.culture())}</div>
                    <div className="contents__container__dd__inner2">
                        {value.menu ? <div className="inner2-left">{menuName}</div>
                        : <div className="inner2-left invalid">{Globalize.localize('l_link_menu_not_selected', Globalize.culture())}</div>
                        }
                        <div className="inner2-right">
                            <div className="contents__container__td__btn_edit">
                                <input type="button" value={Globalize.localize('b_edit', Globalize.culture())} className="btn_edit mt7" onClick={() => {openModal(value,index)}}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="contents__container__dd icon__cell">
                {(index!=0)? <input type="button" value={Globalize.localize('l_deletion', Globalize.culture())} className="btn_garbage" onClick={() => {deleteItem(index)}}/>  : null}
                <DragHandle />
            </div>
        </div>
    )
});

const MenuList = SortableContainer(({ items, siteMap, deleteItem, onDeletePicture, openModal, onOpenSelectPicture, onSortEnd}) => {
    return (
        <div className="hometop_border_bottom">
            {items.map((value, index) =>
                <SortableItem key={`item-${index}`}
                              index={index}
                              value={value}
                              deleteItem={deleteItem}
                              onDeletePicture={onDeletePicture}
                              onOpenSelectPicture={onOpenSelectPicture}
                              onSortEnd={onSortEnd}
                              openModal={openModal}
                              siteMap={siteMap}/>
            )}
        </div>
    );
});

export default MenuList;