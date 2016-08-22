import React, { Component, PropTypes } from 'react';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
import Toggle from 'react-toggle'
import { MODAL_CREATED_QUESTION_LIST } from '../../constants/Constants'
import Checkbox from  '../commons/Checkbox'

const DragHandle = SortableHandle(() => <input type="button" value={Globalize.localize('b_move', Globalize.culture())} className="btn_move" />);

const SortableItem = SortableElement(({value, index, lastIndex ,deleteItem,onDeleteMainImagePicture,onSelectMainImagePicture,openModal}) => {
    return (
        <div className={(index==lastIndex) ? "contents__container__dl clearfix" : "contents__container__dl clearfix border-harf" }>
            {(index==0)?
            <div className="contents__container__dt">{Globalize.localize('l_main_image', Globalize.culture())}
                <span className="contents__container__dt_small">{(index+1) + Globalize.localize('l_position_order', Globalize.culture())}</span>
            </div> :
            <div className="contents__container__dt">
                <span className="contents__container__dt_small">{(index+1) + Globalize.localize('l_position_order', Globalize.culture())}</span>
            </div>    }

            <div className="contents__container__dd__inner">
                <div className="contents__container__dl__inner clearfix">
                    <div className="contents__container__dt__inner">{Globalize.localize('l_image', Globalize.culture())}</div>
                    <div className="contents__container__dd__inner">
                        <div className="contents__container__logo-contaner mb10 mt10">
                            <div className="contents__container__image-btn">
                                <input type="button" value={Globalize.localize('l_image_selection', Globalize.culture())} className="contents__container__input-button" onClick={()=> {onSelectMainImagePicture(index)}} />
                            </div>
                            {<div className="contents__container__image-name">{value.filename}</div>}
                            {value.id > 0 ? <div className="contents__container__del-btn"><img src="/assets/img/img-dell.png" onClick={() => {onDeleteMainImagePicture(value,index)}}/></div> : ""}
                        </div>
                        <div className="contents__container__logo mb10">
                            <img src={value.url} className="preview_image"/>
                        </div>
                    </div>
                </div>
                <div className="contents__container__dl__inner clearfix">
                    <div className="contents__container__dt__inner v__middle">{Globalize.localize('l_link_destination', Globalize.culture())}</div>
                    <div className="contents__container__dd__inner">{ (value.link != "") ? value.link : Globalize.localize('l_link_destination_tobe_not_selected', Globalize.culture())}</div>
                    <div className="contents__container__dd contents__container__td__btn_edit" >
                        <input type="button" value={Globalize.localize('l_selection', Globalize.culture())} className="btn_edit" onClick={() => { openModal("MAIN_IMAGE",value,index) }} />
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

const MainImage = SortableContainer(({items, deleteItem, onDeleteMainImagePicture, onSelectMainImagePicture, openModal}) => {
    return (
        <div className="hometop_border_bottom">
            {items.map((value, index) =>
                <SortableItem key={`item-${index}`}
                              index={index} openModal={openModal}
                              lastIndex={items.length-1}
                              deleteItem={deleteItem}
                              value={value}
                              onDeleteMainImagePicture={onDeleteMainImagePicture}
                              onSelectMainImagePicture={onSelectMainImagePicture}/>
            )}
        </div>
    );
});


export default MainImage;
