import React, { Component, PropTypes } from 'react';
import Modal from './Modal'
import ModalTabPreview from '../commons/ModalTabPreview'

class ModalPreview extends Component {
    render() {
        return (
            <ModalTabPreview
                title={"店舗トップページのプレビュー"}
                msg="携帯電話の種類によって表示が違う場合があります。"
                isOpen={this.state.isOpenModal}
                closeModal={this.closeModal}
                isCreateNew={isCreateNew}
                handleSubmitForm={this.handleCreateSiteConfig}>
                <div className="smartphone_question_preview_content">
                    <div className="content">
                        <div>
                            <div className="shopContents clearfix modal_scroll_content">
                                <h1>徳樹庵千葉ニュータウン店</h1>

                                <div className="catchCopy">共通【店舗】ヘッダ キャッチコピー</div>
                                <h2>店舗情報</h2>
                                <table>
                                    <tbody>
                                    {this.state.site.organize_parts.address_display_setting ? <tr>
                                        <th>住所</th>
                                        <td>{store_info.store_address}</td>
                                    </tr> : <tr></tr>}
                                    {this.state.site.organize_parts.access_display_setting ? <tr>
                                        <th>アクセス</th>
                                        <td>{store_info.store_access}</td>
                                    </tr> : <tr></tr>}
                                    {this.state.site.organize_parts.phone_display_setting ? <tr>
                                        <th>電話</th>
                                        <td>{store_info.store_phone_no}</td>
                                    </tr> : <tr></tr>}
                                    {this.state.site.organize_parts.business_hours_display_setting ? <tr>
                                        <th>営業時間</th>
                                        <td>{store_info.store_business_hours_from + "時〜" + store_info.store_business_hours_to}</td>
                                    </tr> : <tr></tr>}
                                    {this.state.site.organize_parts.regular_holiday_display_setting ? <tr>
                                        <th>定休日</th>
                                        <td>{store_info.store_regular_holiday}</td>
                                    </tr> : <tr></tr>}
                                    </tbody>
                                </table>
                                <div className="freeText">{this.state.site.organize_parts.free_text}</div>
                                <div className="shopTopImg1"><img
                                    src={this.state.site.hasOwnProperty("sitemap_picture_url_left") ? this.state.site.sitemap_picture_url_left : null}
                                    className="aligncenter" title="画像左側"/></div>
                                <div className="shopTopImg2"><img
                                    src={this.state.site.hasOwnProperty("sitemap_picture_url_right") ? this.state.site.sitemap_picture_url_right : null}
                                    className="aligncenter" title="画像右側"/></div>
                                <h2>自由項目</h2>

                                <div className="freeText">
                                    {
                                        this.state.site.organize_parts.content.map((value, index) => {
                                            return value.body + "\n";
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="garake_question_preview_content">
                    <div className="content">

                    </div>
                </div>
            </ModalTabPreview>
        )
    }
}

ModalPreview.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    isCreateNew: PropTypes.bool,
    title: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    msg: PropTypes.string,
    backBtn: PropTypes.string,
    handleSubmitForm: PropTypes.func.isRequired,
};

ModalPreview.defaultProps = {
    backBtn: "戻る",
};

export default ModalPreview;