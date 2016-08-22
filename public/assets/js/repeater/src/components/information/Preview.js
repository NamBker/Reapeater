import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import Modal from '../commons/Modal'
import { informationStatus } from '../../constants/Constants'

class Preview extends Component {

    replaceParameterToTmpString(content) {
        const { parameterNames } = this.props;
        return content.replace(/{([a-z][[a-z_]+[a-z])((: )([1-9][0-9]*)){0,1}}/g, (match, p1, p2, p3, p4, offset, string) => {
            switch(p1) {
            case 'left':
                return '{';
            case 'right':
                return '}';
            case 'picture':
                if (p4) {
                    let picture = this.props.pictures.find(picture => picture.id == p4);
                    if (picture) {
                        return "<img src='" + picture.picture_url + "' width='100%'/>";
                    }
                    return "【" + Globalize.localize('delivery_add_default_parameter_picture', Globalize.culture()) + p4 + "】";
                }
                break;
            }
            return "";
        });
    }

    render() {
        const {isOpen, fileUrl, closeModal, handleSubmitForm, isNew, stores, information} = this.props;
        if (!isOpen) return null;
        return (
            <Modal isOpen={true} classModal="modal__container">
                <div className="modal_preview">
                    <div className="modal_title">{isNew ? Globalize.localize('information_create_preview_title', Globalize.culture()) : Globalize.localize('information_update_preview_title', Globalize.culture())}</div>
                    <div className="modal_content">
                        <Tabs className="widget__page__delivery__select__tabs">
                            <TabList>
                                <Tab>スマートフォン</Tab>
                            </TabList>
                            <TabPanel>
                                <div className="coupon_review">
                                    <div className="smartphone_question_preview information_preview">
                                        <div>
                                            <img src={fileUrl} width="100%"/>
                                            <div>
                                                <p className="title">{information.title}</p>
                                                <div className="content"
                                                    dangerouslySetInnerHTML={{__html: this.replaceParameterToTmpString(information.body)}}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                        </Tabs>
                        <span>※{Globalize.localize('delivery_add_preview_asterisk', Globalize.culture())}</span>
                    </div>
                    <div className="modal_sidebar">
                        <div className="sidebar_component">
                            <dl>対象店舗</dl>
                            <dl>
                                <dt>{Globalize.localize('store', Globalize.culture())}</dt>
                                <dd>{information.publisher_store_ids.map((store_id) => {
                                    let store = stores.find((store) => store.id == store_id);
                                    return store.store_name;
                                }).join(',')}</dd>
                            </dl>
                            <dl>設定</dl>
                            <dl>
                                <dt>{Globalize.localize('map_status', Globalize.culture())}</dt>
                                <dd>{informationStatus[information.status]}</dd>
                            </dl>
                            <dl>
                                <dt>{Globalize.localize('map_publish_start_date', Globalize.culture())}</dt>
                                <dd>{information.effective_period_from.format('LL (ddd) LT')}</dd>
                            </dl>
                            <dl>
                                <dt>{Globalize.localize('map_publish_end_date', Globalize.culture())}</dt>
                                <dd>{information.effective_period_to.format('LL (ddd')}</dd>
                            </dl>
                        </div>
                        <div className="sidebar_footer">
                            <button className="btn-gray"
                                    onClick={closeModal}>{Globalize.localize('close', Globalize.culture())}</button>
                            &nbsp;
                            <input type="submit" value={isNew ? "登録する" : "更新する"} className="btn-base"
                                   onClick={handleSubmitForm}/>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

Preview.propTypes = {
    fileUrl: PropTypes.string.isRequired,
    information: PropTypes.object.isRequired,
    isNew: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    handleSubmitForm: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    return {
        pictures: state.pictures,
    };
};

export default connect(mapStateToProps)(Preview);

