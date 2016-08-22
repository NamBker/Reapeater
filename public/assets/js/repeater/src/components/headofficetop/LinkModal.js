import React, { Component, PropTypes } from 'react';
import Modal from '../commons/Modal'
import Checkbox from '../commons/Checkbox'
import DropDownList from '../commons/DropDownList'
import DateSelect from '../commons/DateSelect'
import RadioButton from '../commons/RadioButton'
import ReactPaginate from 'react-paginate';
import { MODAL_CREATED_QUESTION_LIST, MODAL_CREATE_QUESTION_FORM, QUESTIONNAIRE_TYPE_INITIAL_REGISTRATION, QUESTIONNAIRE_STATUS_UNUSED, QUESTIONNAIRE_STATUS_USING } from '../../constants/Constants'



class LinkModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            questionnaireResponds: props.questionnaireResponds,
            isCheckAll: false,
        }
    }

    render() {
        const { closeModal, modalTemp, setMainImageLink, setContentLink, setModalLink,setBannerLink, tempLink, sitemap_url ,sitemap_count,sitemap_url_filter} = this.props;
        return (
            <Modal isOpen={this.props.isOpen} classModal="modal__container">
                <dl className="widget">
                    <div className="modal">
                        <div className="masking"></div>
                        <div className="modal-window">
                            <div className="contents__modal__menu">
                                <div className="contents__modal__h2">
                                    <div className="contents__modal__h2--title">{Globalize.localize('l_link_destination_selection', Globalize.culture())}</div>
                                    <div className="contents__modal__del">
                                        <a><img src="/assets/img/cross2.png" srcSet="/assets/img/cross2@2x.png 2x" className="vertical-middle" onClick={closeModal} /></a>
                                    </div>
                                </div>
                                <div className="contents__modal__content">
                                    <div className="clearfix">
                                        <div className="contents__modal__menu--box clearfix">
                                            <div className="contents__modal__menu--list contents__modal__h3">
                                                <div className="list-box">
                                                    <div className="list-box-3">
                                                        <div className="child">{Globalize.localize('l_page_name', Globalize.culture())}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            {sitemap_url.map((value,index) => 
                                                <div className="contents__modal__menu--list" key={index} >
                                                    <div className="list-box">
                                                        <label className="contents__container__radio2">
                                                            <div className="list-box-1"><input type="radio" name="menu" onChange={()=> {setModalLink(value.sitemap_url)}} value={index+1} /></div>
                                                            <span>
                                                                <div className="list-box-2">
                                                                    <div className="list-box-2-child">{index + 1 + sitemap_url_filter.per_page * (sitemap_url_filter.page - 1)}</div>
                                                                    <div className="list-box-2-child">{value.sitemap_name}</div>
                                                                </div>
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            )}

                                        <div className="contents__modal__menu--list2">
                                            <dd className="contents__pagination widget__page__table__pagination">
                                                <div className="number child">{sitemap_count}</div>
                                                <ReactPaginate
                                                    previousLabel={" "}
                                                    forceSelected={sitemap_url_filter.page - 1}
                                                    nextLabel={" "}
                                                    breakLabel={<a>...</a>}
                                                    pageNum={Math.ceil(sitemap_count / sitemap_url_filter.per_page)}
                                                    marginPagesDisplayed={2}
                                                    pageRangeDisplayed={5}
                                                    clickCallback={this.props.handlePageClick}
                                                    containerClassName={"page child pagination information_paginate"}
                                                    subContainerClassName={"pages pagination"}
                                                    activeClassName={"active"} />
                                                    <span></span>
                                            </dd>
                                        </div>

                                            

                                                                                       
                                     </div>
                                     </div>
                                     <div><input type="button" onClick={()=> {  
                                        if(modalTemp.type == "MAIN_IMAGE") {
                                            setMainImageLink(modalTemp.item,modalTemp.index,tempLink);
                                        }
                                        if(modalTemp.type == "CONTENT") {
                                            setContentLink(modalTemp.item,modalTemp.index,tempLink);
                                        }
                                        if(modalTemp.type == "BANNER") {
                                            setBannerLink(tempLink);
                                        }

                                        closeModal();

                                     }} className="btn-base contents__btn--save" value={Globalize.localize('l_menu_setting', Globalize.culture())} /></div>
                                </div>
                                
                            </div>                                  
                        </div>
                    </div>                  
                </dl>                 
            </Modal>
        );
    }
}

export default LinkModal;
