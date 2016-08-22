import React, { Component, PropTypes } from 'react';

import { COUPON_LIMIT_TYPE_UNSET, COUPON_LIMIT_TYPE_SET, COUPON_LIMIT_TYPE_MAIL } from '../../constants/Constants';

class RandomCouponInputItemForm extends Component {
    getCouponDescription() {
        const { item } = this.props;
        if (0 < item.coupon_id) {
            return item.coupon_name + '　' + item.coupon_limit_string;
        }
        return Globalize.localize('random_coupon_no_coupon', Globalize.culture());
    }

    onChangeAdSlogan(e) {
        e.preventDefault();
        this.updateItem('coupon_ad_slogan', e.target.value);
    }

    onChangeProbability(e) {
        e.preventDefault();
        let value = e.target.value;
        value = value ? parseInt(value) : 0;
        if (value < 0) {
            value = 0;
        } else if (100 < value) {
            value = 100;
        }
        this.updateItem('coupon_probability', value);
    }

    onChangeMaxCount(e) {
        e.preventDefault();
        let value = e.target.value;
        value = value ? parseInt(value) : 0;
        if (value < 0) {
            value = 0;
        }
        this.updateItem('coupon_max_count', value);
    }

    onChangeFreeTextTop(e) {
        e.preventDefault();
        this.updateItem('coupon_screen_free_text_top', e.target.value);
    }

    onClickClearPicture(e) {
        e.preventDefault();
        let item = this.props.item;
        item.coupon_screen_picture_id = 0;
        item.image.filename = '';
        item.image.imageUrl = '';
        this.props.updateItem(item);
    }

    onChangeButtonLabel(e) {
        e.preventDefault();
        this.updateItem('coupon_screen_button_label', e.target.value);
    }

    onChangeFreeTextBottom(e) {
        e.preventDefault();
        this.updateItem('coupon_screen_free_text_bottom', e.target.value);
    }

    onClickOpenSelectCoupon(e) {
        e.preventDefault();
        this.props.onClickOpenSelectCoupon(this.props.item);
    }

    onClickOpenSelectPicture(e) {
        e.preventDefault();
        this.props.onClickOpenSelectPicture(this.props.item);
    }

    onClickDeleteItem(e) {
        e.preventDefault();
        this.props.onClickDeleteItem(this.props.item);
    }

    updateItem(key, value) {
        let item = this.props.item;
        item[key] = value;
        this.props.updateItem(item);
    }

    render() {
        const { item, index, isShowDelete, hasScreen } = this.props;
        return (
            <dl className="checkbox__row">
                <dt>
                    {0 <= index ?
                        (Globalize.localize('random_coupon_table_title_result', Globalize.culture()) + (index + 1)) :
                        Globalize.localize('random_coupon_table_title_blank_result', Globalize.culture())
                    }</dt>
                <dd className="random__coupon__item__row">
                    <div className="random__coupon__item__row__left">
                        <div>
                            <div className="random__coupon__item__row__left__title">
                                <span>{Globalize.localize('random_coupon_table_title_ad_slogan', Globalize.culture())}</span>
                            </div>
                            <div className="random__coupon__item__row__left__content">
                                <input type="text" maxLength="128" value={item.coupon_ad_slogan}
                                    onChange={(e) => this.onChangeAdSlogan(e)}/>
                            </div>
                        </div>
                        <div>
                            <div className="random__coupon__item__row__left__title">
                                <span>{Globalize.localize('random_coupon_table_title_coupon', Globalize.culture())}</span>
                            </div>
                            <div className="random__coupon__item__row__left__content">
                                <div className="random__coupon__item__select__coupon">
                                    <span>{this.getCouponDescription()}</span>
                                    <div className="contents__container__td__btn_edit">
                                        <input type="button" value={Globalize.localize('b_edit', Globalize.culture())}
                                            onClick={(e) => this.onClickOpenSelectCoupon(e)}
                                            className="btn_edit"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="random__coupon__item__row__left__title">
                                <span>{Globalize.localize('random_coupon_table_title_display_probability', Globalize.culture())}</span>
                            </div>
                            <div className="random__coupon__item__row__left__content">
                                <input type="number" size="5" maxLength="3" value={item.coupon_probability}
                                    className="mr10"
                                    onChange={(e) => this.onChangeProbability(e)}/>
                                {"%"}
                            </div>
                        </div>
                        <div>
                            <div className="random__coupon__item__row__left__title">
                                <span>{Globalize.localize('random_coupon_table_title_display_count', Globalize.culture())}</span>
                            </div>
                            <div className="random__coupon__item__row__left__content">
                                {0 <= index ?
                                <input type="number" size="10" maxLength="10" value={item.coupon_max_count}
                                    className="mr10"
                                    onChange={(e) => this.onChangeMaxCount(e)}/> : null}
                                {Globalize.localize(0 <= index ? 'random_coupon_max_count_deco' : 'random_coupon_max_count_unlimit', Globalize.culture())}
                            </div>
                        </div>
                        {hasScreen ?
                        <div>
                            <div className="random__coupon__item__row__left__title">
                                {Globalize.localize('random_coupon_table_title_free_text_top', Globalize.culture())}
                            </div>
                            <div className="random__coupon__item__row__left__content">
                                <textarea
                                    className="widget__page__input__textarea"
                                    onChange={(e) => this.onChangeFreeTextTop(e)}
                                    value={item.coupon_screen_free_text_top}
                                />
                            </div>
                        </div> : null}
                        {hasScreen ?
                        <div>
                            <div className="random__coupon__item__row__left__title">
                                {Globalize.localize('random_coupon_table_title_picture', Globalize.culture())}
                            </div>
                            <div className="random__coupon__item__row__left__content">
                                <div className="contents__container__logo-container">
                                    <div className="contents__container__image-btn">
                                        <input type="button" value={Globalize.localize('add_picture', Globalize.culture())}
                                            onClick={(e) => this.onClickOpenSelectPicture(e)}
                                            className="contents__container__input-button"/>
                                    </div>
                                    <div className="contents__container__image-name">
                                        {item.image.filename ? item.image.filename : Globalize.localize('filter_select_file', Globalize.culture())}
                                    </div>
                                    <div className="contents__container__del-btn">
                                        <a className="btn-img-dell" onClick={(e) => this.onClickClearPicture(e)}/>
                                    </div>
                                </div>
                            </div>
                        </div> : null}
                        {hasScreen ?
                        <div>
                            <div className="random__coupon__item__row__left__title">
                                {Globalize.localize('random_coupon_table_title_button_label', Globalize.culture())}
                            </div>
                            <div className="random__coupon__item__row__left__content">
                                <input type="text" maxLength="32" value={item.coupon_screen_button_label}
                                    onChange={(e) => this.onChangeButtonLabel(e)}/>
                            </div>
                        </div> : null}
                        {hasScreen ?
                        <div>
                            <div className="random__coupon__item__row__left__title">
                                {Globalize.localize('random_coupon_table_title_free_text_bottom', Globalize.culture())}
                            </div>
                            <div className="random__coupon__item__row__left__content">
                                <textarea
                                    className="widget__page__input__textarea"
                                    onChange={(e) => this.onChangeFreeTextBottom(e)}
                                    value={item.coupon_screen_free_text_bottom}
                                />
                            </div>
                        </div> : null}
                    </div>
                    {isShowDelete ?
                    <div className="random__coupon__item__row__right">
                        <input
                            type="button"
                            value={Globalize.localize('l_deletion', Globalize.culture())}
                            className="btn_garbage"
                            onClick={(e) => this.onClickDeleteItem(e)}
                        />
                    </div> : null}
                </dd>
            </dl>
        );
    }
}

export default RandomCouponInputItemForm;
