import React, { Component, PropTypes } from 'react';
import Modal from './Modal'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class ModalTabPreview extends Component {
    render() {
        return (
            <Modal isOpen={this.props.isOpen}>
                <div className="modal__w700a">
                    <div className="widget">
                        <div className="contents__modal__h2">
                            <div className="contents__modal__h2--title">{this.props.title}</div>
                            <div className="contents__modal__del" onClick={this.props.closeModal}/>
                        </div>
                        <div className="widget__contents modal__w700a_table mb100">
                            <div className="modal__w700a_table_left widget__page__input__preview__tabs__margin">
                                <Tabs className="widget__page__input__preview__tabs preview__margin">
                                    <TabList>
                                        <Tab className="widget__page__input__preview__tab">スマートフォン</Tab>
                                        <Tab className="widget__page__input__preview__tab">ガラケー</Tab>
                                    </TabList>
                                    <TabPanel className="widget__page__input__preview__panel">
                                        <div className="coupon_review">
                                            <div>
                                                {this.props.children[0]}
                                            </div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel className="widget__page__input__preview__panel">
                                        <div className="coupon_review_garake">
                                            <div>
                                                {this.props.children[1]}
                                            </div>
                                        </div>
                                    </TabPanel>
                                </Tabs>
                            </div>
                            <div className="modal__w700a_table_right">
                                <div className="modal__w700a_right_scroll"></div>
                                <div className="widget__page__input__preview__right__bottom">
                                    <pre className="preview_message">{this.props.msg}</pre>
                                    <div className="widget__page__input__preview__right__bottom__buttons">
                                        <button className="btn-gray" onClick={this.props.closeModal}>{this.props.backBtn}</button>
                                        <button className="btn-base" onClick={this.props.handleSubmitForm}>{this.props.isCreateNew ? "登録" : "更新"}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}

ModalTabPreview.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    isCreateNew: PropTypes.bool,
    title: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    msg: PropTypes.string,
    backBtn: PropTypes.string,
    handleSubmitForm: PropTypes.func.isRequired,
};

ModalTabPreview.defaultProps = {
    backBtn: "戻る",
};

export default ModalTabPreview;
