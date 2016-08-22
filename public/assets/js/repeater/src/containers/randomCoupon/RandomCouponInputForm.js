import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { GET_DISPLAY_ITEMS_ONLY_PATTERN } from '../../constants/Constants';
import { RANDOM_COUPON_STATUS_ENABLED, RANDOM_COUPON_STATUS_DISABLED } from '../../constants/Constants';
import { RANDOM_COUPON_SCREEN_FLG_UNDISPLAY, RANDOM_COUPON_SCREEN_FLG_DISPLAY } from '../../constants/Constants';
import Routes from '../../constants/Routes';

import Notification from '../../components/commons/Notification';
import RadioGroup from '../../components/commons/RadioGroup';
import RandomCouponInputItemForm from './RandomCouponInputItemForm';
import SelectPicture from '../../components/SelectPicture';
import SelectCouponDialog from './SelectCouponDialog';

import { fetchUserInfo } from '../../actions/user';
import { createRandomCoupon, updateRandomCoupon, getRandomCouponDetail } from '../../actions/randomCoupon';

class RandomCouponInputForm extends Component {
    createItem() {
        return {
            id: 0,
            coupon_id: 0,
            coupon_ad_slogan: '',
            coupon_probability: 0,
            coupon_max_count: 0,
            coupon_screen_free_text_top: '',
            coupon_screen_picture_id: 0,
            coupon_screen_button_label: '',
            coupon_screen_free_text_bottom: '',
            coupon_limit_string: '',
            coupon_name: '',
            image: {
                filename: '',
                imageUrl: '',
            }
        };
    }

    createItemByData(item) {
        let picture = item.coupon_screen_picture;
        return {
            id: parseInt(item.id),
            coupon_id: parseInt(item.coupon_id),
            coupon_ad_slogan: item.coupon_ad_slogan,
            coupon_probability: item.coupon_probability,
            coupon_max_count: item.coupon_max_count,
            coupon_screen_free_text_top: item.coupon_screen_free_text_top,
            coupon_screen_picture_id: item.coupon_screen_picture_id,
            coupon_screen_button_label: item.coupon_screen_button_label,
            coupon_screen_free_text_bottom: item.coupon_screen_free_text_bottom,
            coupon_limit_string: SelectCouponDialog.getCouponLimitString(item.coupon),
            coupon_name: item.coupon.coupon_name,
            image: {
                filename: picture ? picture.filename : '',
                imageUrl: picture ? picture.thumbnail : '',
            }
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            data: {
                random_coupon_name: '',
                random_coupon_status: RANDOM_COUPON_STATUS_ENABLED,
                random_coupon_screen_flg: RANDOM_COUPON_SCREEN_FLG_UNDISPLAY,
                random_coupon_screen_free_text_top: '',
                random_coupon_screen_picture_id: 0,
                random_coupon_screen_button_label: '',
                random_coupon_screen_free_text_bottom: '',
                random_coupon_items: [
                    this.createItem(),
                ],
                random_coupon_blank_item: this.createItem(),
            },
            isShowSelectPicture: false,
            pictureTarget: null,
            filename: '',
            imageUrl: '',
            isShowSelectCoupon: false,
            couponTarget: null,
        };
        this.statuses = [
            { 'label': Globalize.localize('l_display_flag_yes', Globalize.culture()), 'key': RANDOM_COUPON_STATUS_ENABLED },
            { 'label': Globalize.localize('l_display_flag_no', Globalize.culture()), 'key': RANDOM_COUPON_STATUS_DISABLED },
        ];
        this.screenFlgs = [
            { 'label': Globalize.localize('none', Globalize.culture()), 'key': RANDOM_COUPON_SCREEN_FLG_UNDISPLAY },
            { 'label': Globalize.localize('presence', Globalize.culture()), 'key': RANDOM_COUPON_SCREEN_FLG_DISPLAY },
        ];
    }

    componentWillMount() {
        this.props.dispatch(fetchUserInfo());
        if (!this.props.isNew) {
            getRandomCouponDetail(this.props.params.randomCouponId, (err) => {
                this.showNotification(err.toString());
            }, (res) => {
                let picture = res.random_coupon.random_coupon_screen_picture;
                let filename = picture ? picture.filename : '';
                let imageUrl = picture ? picture.thumbnail : '';
                let data = this.state.data;
                data.random_coupon_name = res.random_coupon.random_coupon_name;
                data.random_coupon_status = res.random_coupon.random_coupon_status;
                data.random_coupon_screen_flg = res.random_coupon.random_coupon_screen_flg;
                data.random_coupon_screen_free_text_top = res.random_coupon.random_coupon_screen_free_text_top;
                data.random_coupon_screen_picture_id = res.random_coupon.random_coupon_screen_picture_id;
                data.random_coupon_screen_button_label = res.random_coupon.random_coupon_screen_button_label;
                data.random_coupon_screen_free_text_bottom = res.random_coupon.random_coupon_screen_free_text_bottom;
                data.random_coupon_items = [];
                res.random_coupon.random_coupon_items.forEach((item) => {
                    data.random_coupon_items.push(this.createItemByData(item));
                });
                data.random_coupon_blank_item = this.createItemByData(res.random_coupon.random_coupon_blank_item);
                this.setState({data, filename, imageUrl});
            });
        }
    }

    onClickSubmit(e) {
        e.preventDefault();
        if (!this.checkValidation()) {
            return;
        }
        if (this.props.isNew) {
            createRandomCoupon(this.state.data, (err) => {
                this.showNotification(err.toString());
            }, (res) => {
                const route = Routes[this.props.route.path];
                Notification.showNotification(this.props.dispatch, route.parent, Globalize.localize('random_coupon_created_notification', Globalize.culture()));
                this.context.router.push(route.parent);
            });
        } else {
            updateRandomCoupon(this.props.params.randomCouponId, this.state.data, (err) => {
                this.showNotification(err.toString());
            }, (res) => {
                const route = Routes[this.props.route.path];
                Notification.showNotification(this.props.dispatch, route.parent, Globalize.localize('random_coupon_created_notification', Globalize.culture()));
                this.context.router.push(route.parent);
            });
        }
    }

    showNotification(message) {
        Notification.showNotification(this.props.dispatch, this.props.route.path, message);
    }

    onChangeName(e) {
        e.preventDefault();
        this.updateData('random_coupon_name', e.target.value);
    }

    onChangeStatus(value) {
        this.updateData('random_coupon_status', parseInt(value));
    }

    onChangeScreenFlg(value) {
        this.updateData('random_coupon_screen_flg', parseInt(value));
    }

    onChangeScreenFreeTextTop(e) {
        e.preventDefault();
        this.updateData('random_coupon_screen_free_text_top', e.target.value);
    }

    onChangeScreenButtonLabel(e) {
        e.preventDefault();
        this.updateData('random_coupon_screen_button_label', e.target.value);
    }

    onChangeScreenFreeTextBottom(e) {
        e.preventDefault();
        this.updateData('random_coupon_screen_free_text_bottom', e.target.value);
    }

    updateData(key, value) {
        let data = this.state.data;
        data[key] = value;
        this.setState({data});
    }

    updateItem(item) {
        this.setState({data: this.state.data});
    }

    onClickDeleteItem(item) {
        let data = this.state.data;
        let idx = data.random_coupon_items.indexOf(item);
        data.random_coupon_items.splice(idx, 1);
        this.setState({data});
    }

    onClickAddResult(e) {
        e.preventDefault();
        let data = this.state.data;
        data.random_coupon_items.push(this.createItem())
        this.setState({data});
    }

    onClickOpenSelectPicture(e) {
        e.preventDefault();
        this.setState({isShowSelectPicture: true, pictureTarget: null});
    }

    onClickClearPicture(e) {
        e.preventDefault();
        let data = this.state.data;
        data.random_coupon_screen_picture_id = 0;
        this.setState({data, filename: '', imageUrl: '', isShowSelectPicture: false});
    }

    onClickOpenSelectItemPicture(item) {
        this.setState({isShowSelectPicture: true, pictureTarget: item});
    }

    onCloseSelectPicture() {
        this.setState({isShowSelectPicture: false, pictureTarget: null});
    }

    onSelectedPicture(pictureInfo) {
        if (this.state.pictureTarget) {
            this.state.pictureTarget.coupon_screen_picture_id = parseInt(pictureInfo.id);
            this.state.pictureTarget.image.filename = pictureInfo.filename;
            this.state.pictureTarget.image.imageUrl = pictureInfo.thumbnail;
            this.setState({data: this.state.data, pictureTarget: null, isShowSelectPicture: false});
        } else {
            let data = this.state.data;
            data.random_coupon_screen_picture_id = parseInt(pictureInfo.id);
            this.setState({data, filename: pictureInfo.filename, imageUrl: pictureInfo.thumbnail, isShowSelectPicture: false});
        }
    }

    onClickOpenSelectItemCoupon(item) {
        this.setState({isShowSelectCoupon: true, couponTarget: item});
    }

    onCloseSelectCoupon() {
        this.setState({isShowSelectCoupon: false, couponTarget: null});
    }

    onSelectedCoupon(coupon) {
        if (this.state.couponTarget) {
            this.state.couponTarget.coupon_id = parseInt(coupon.id);
            this.state.couponTarget.coupon_limit_string = SelectCouponDialog.getCouponLimitString(coupon);
            this.state.couponTarget.coupon_name = coupon.coupon_name;
        }
        this.setState({isShowSelectCoupon: false, couponTarget: null, data: this.state.data});
    }

    checkValidation() {
        const { data } = this.state;
        let requiredErrors = [];
        let numberErrors = [];
        let sameCouponErrors = [];
        if (data.random_coupon_name.length < 1) {
            // タイトル必須
            requiredErrors.push(Globalize.localize('random_coupon_table_title_title', Globalize.culture()));
        }
        let totalPercent = 0;
        let couponIds = [];
        data.random_coupon_items.forEach((item, index) => {
            if (item.coupon_ad_slogan.length < 1) {
                // キャッチコピー必須
                requiredErrors.push(Globalize.localize('random_coupon_validation_item_error_format', Globalize.culture()).format(
                    Globalize.localize('random_coupon_table_title_result', Globalize.culture()) + (index + 1),
                    Globalize.localize('random_coupon_table_title_ad_slogan', Globalize.culture())
                ));
            }
            if (item.coupon_id < 1) {
                // クーポン必須
                requiredErrors.push(Globalize.localize('random_coupon_validation_item_error_format', Globalize.culture()).format(
                    Globalize.localize('random_coupon_table_title_result', Globalize.culture()) + (index + 1),
                    Globalize.localize('random_coupon_table_title_coupon', Globalize.culture())
                ));
            } else if (0 <= couponIds.indexOf(item.coupon_id)) {
                // 同じクーポンを複数設定できない
                sameCouponErrors.push(Globalize.localize('random_coupon_validation_item_error_format', Globalize.culture()).format(
                    Globalize.localize('random_coupon_table_title_result', Globalize.culture()) + (index + 1),
                    Globalize.localize('random_coupon_table_title_coupon', Globalize.culture())
                ));
            } else {
                couponIds.push(item.coupon_id);
            }
            if (item.coupon_probability < 1) {
                // 確率必須
                numberErrors.push(Globalize.localize('random_coupon_validation_item_error_format', Globalize.culture()).format(
                    Globalize.localize('random_coupon_table_title_result', Globalize.culture()) + (index + 1),
                    Globalize.localize('random_coupon_table_title_display_probability', Globalize.culture())
                ));
            }
            if (item.coupon_max_count < 1) {
                // 表示回数
                numberErrors.push(Globalize.localize('random_coupon_validation_item_error_format', Globalize.culture()).format(
                    Globalize.localize('random_coupon_table_title_result', Globalize.culture()) + (index + 1),
                    Globalize.localize('random_coupon_table_title_display_count', Globalize.culture())
                ));
            }
            totalPercent += item.coupon_probability;
        });
        // 確率の合計が100である必要がある
        if (data.random_coupon_blank_item) {
            let item = data.random_coupon_blank_item;
            if (item.coupon_ad_slogan.length < 1) {
                // キャッチコピー必須
                requiredErrors.push(Globalize.localize('random_coupon_validation_item_error_format', Globalize.culture()).format(
                    Globalize.localize('random_coupon_table_title_blank_result', Globalize.culture()),
                    Globalize.localize('random_coupon_table_title_ad_slogan', Globalize.culture())
                ));
            }
            if (item.coupon_id < 1) {
                // クーポン必須
                requiredErrors.push(Globalize.localize('random_coupon_validation_item_error_format', Globalize.culture()).format(
                    Globalize.localize('random_coupon_table_title_blank_result', Globalize.culture()),
                    Globalize.localize('random_coupon_table_title_coupon', Globalize.culture())
                ));
            } else if (0 <= couponIds.indexOf(item.coupon_id)) {
                // 同じクーポンを複数設定できない
                sameCouponErrors.push(Globalize.localize('random_coupon_validation_item_error_format', Globalize.culture()).format(
                    Globalize.localize('random_coupon_table_title_blank_result', Globalize.culture()),
                    Globalize.localize('random_coupon_table_title_coupon', Globalize.culture())
                ));
            }
            if (item.coupon_probability < 1) {
                // 確率必須
                numberErrors.push(Globalize.localize('random_coupon_validation_item_error_format', Globalize.culture()).format(
                    Globalize.localize('random_coupon_table_title_blank_result', Globalize.culture()),
                    Globalize.localize('random_coupon_table_title_display_probability', Globalize.culture())
                ));
            }
            totalPercent += item.coupon_probability;
        }
        if (0 < requiredErrors.length) {
            this.showNotification(Globalize.localize('delivery_add_error_for_not_null', Globalize.culture()) + '\n・' + requiredErrors.join('\n・'));
            return false;
        }
        if (0 < numberErrors.length) {
            this.showNotification(Globalize.localize('random_coupon_error_for_zero_number', Globalize.culture()) + '\n・' + numberErrors.join('\n・'));
            return false;
        }
        if (0 < sameCouponErrors.length) {
            this.showNotification(Globalize.localize('random_coupon_error_for_same_coupon', Globalize.culture()) + '\n・' + sameCouponErrors.join('\n・'));
            return false;
        }
        if (totalPercent != 100) {
            this.showNotification(Globalize.localize('random_coupon_error_for_percent', Globalize.culture()));
            return false;
        }
        return true;
    }

    render() {
        const { currentUser, isNew } = this.props;
        const { data } = this.state;
        return (
            <div>
                <Notification path={this.props.route.path}/>
                {this.state.isShowSelectPicture ?
                <SelectPicture
                    isOpen={this.state.isShowSelectPicture}
                    title={Globalize.localize('select_picture_title', Globalize.culture())}
                    closeDialog={() => this.onCloseSelectPicture()}
                    onSelectedPicture={(pictureInfo) => this.onSelectedPicture(pictureInfo)}
                /> : null}
                {this.state.isShowSelectCoupon ?
                <SelectCouponDialog
                    isOpen={this.state.isShowSelectCoupon}
                    onClose={() => this.onCloseSelectCoupon()}
                    onSelected={(coupon) => this.onSelectedCoupon(coupon)}
                /> : null}
                <dl className="widget widget__page__input">
                    <dt className="widget__page__input__title">
                        <div className="widget__page__type__create"></div>
                        <span className="widget__page__main__title font-base1">
                            {Globalize.localize(isNew ? 'random_coupon_input_form_title_register' : 'random_coupon_input_form_title_update', Globalize.culture())}
                        </span>
                    </dt>
                    <dt className="widget__page__input__contents">
                        <div className="widget__page__input__contents__table mt20 mb20">
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('random_coupon_table_title_title', Globalize.culture())}</dt>
                                <dd>
                                    <input type="text" size="34" maxLength="32" value={data.random_coupon_name} onChange={(e) => this.onChangeName(e)}/>
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('random_coupon_table_title_status', Globalize.culture())}</dt>
                                <dd>
                                    <RadioGroup
                                        data={this.statuses}
                                        groupName="random_coupon_status"
                                        dataLabelKey='label'
                                        dataValueKey='key'
                                        value={data.random_coupon_status}
                                        onChange={(value) => this.onChangeStatus(value)}
                                    />
                                </dd>
                            </dl>
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('random_coupon_table_title_screen_flg', Globalize.culture())}</dt>
                                <dd>
                                    <RadioGroup
                                        data={this.screenFlgs}
                                        groupName="random_coupon_screen_flg"
                                        dataLabelKey='label'
                                        dataValueKey='key'
                                        value={data.random_coupon_screen_flg}
                                        onChange={(value) => this.onChangeScreenFlg(value)}
                                    />
                                </dd>
                            </dl>
                            {data.random_coupon_screen_flg == RANDOM_COUPON_SCREEN_FLG_DISPLAY ?
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('random_coupon_table_title_free_text_top', Globalize.culture())}</dt>
                                <dd>
                                    <textarea
                                        className="widget__page__input__textarea"
                                        onChange={(e) => this.onChangeScreenFreeTextTop(e)}
                                        value={data.random_coupon_screen_free_text_top}
                                    />
                                </dd>
                            </dl> : null}
                            {data.random_coupon_screen_flg == RANDOM_COUPON_SCREEN_FLG_DISPLAY ?
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('random_coupon_table_title_picture', Globalize.culture())}</dt>
                                <dd>
                                    <div className="contents__container__logo-container mt10 mb10">
                                        <div className="contents__container__image-btn">
                                            <input type="button" value={Globalize.localize('add_picture', Globalize.culture())}
                                                onClick={(e) => this.onClickOpenSelectPicture(e)}
                                                className="contents__container__input-button"/>
                                        </div>
                                        <div className="contents__container__image-name">
                                            {this.state.filename ? this.state.filename : Globalize.localize('filter_select_file', Globalize.culture())}
                                        </div>
                                        <div className="contents__container__del-btn">
                                            <a className="btn-img-dell" onClick={(e) => this.onClickClearPicture(e)}/>
                                        </div>
                                    </div>
                                    <div className="contents__container__logo-image mb10">
                                        {this.state.filename ?
                                        <img src={this.state.imageUrl}/> : null}
                                    </div>
                                </dd>
                            </dl> : null}
                            {data.random_coupon_screen_flg == RANDOM_COUPON_SCREEN_FLG_DISPLAY ?
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('random_coupon_table_title_button_label', Globalize.culture())}</dt>
                                <dd>
                                    <input type="text" size="50" maxLength="32" value={data.random_coupon_screen_button_label}
                                        onChange={(e) => this.onChangeScreenButtonLabel(e)}/>
                                </dd>
                            </dl> : null}
                            {data.random_coupon_screen_flg == RANDOM_COUPON_SCREEN_FLG_DISPLAY ?
                            <dl className="checkbox__row">
                                <dt>{Globalize.localize('random_coupon_table_title_free_text_bottom', Globalize.culture())}</dt>
                                <dd>
                                    <textarea
                                        className="widget__page__input__textarea"
                                        onChange={(e) => this.onChangeScreenFreeTextBottom(e)}
                                        value={data.random_coupon_screen_free_text_bottom}
                                    />
                                </dd>
                            </dl> : null}
                            {data.random_coupon_items.map((item, index) =>
                            <RandomCouponInputItemForm
                                key={"random_coupon_result_item_" + index}
                                item={item}
                                index={index}
                                hasScreen={data.random_coupon_screen_flg == RANDOM_COUPON_SCREEN_FLG_DISPLAY}
                                isShowDelete={1 < data.random_coupon_items.length}
                                onClickOpenSelectCoupon={(item) => this.onClickOpenSelectItemCoupon(item)}
                                onClickOpenSelectPicture={(item) => this.onClickOpenSelectItemPicture(item)}
                                updateItem={(item) => this.updateItem(item)}
                                onClickDeleteItem={(item) => this.onClickDeleteItem(item)}
                            />
                            )}
                            <dl className="contents__container__dl clearfix">
                                <div className="contents__container__dd text-center">
                                    <input
                                        type="button"
                                        value={Globalize.localize('random_coupon_table_add_result', Globalize.culture())}
                                        className="contents__container__input-button btn_add"
                                        onClick={(e) => this.onClickAddResult(e)}
                                    />
                                </div>
                            </dl>
                            <RandomCouponInputItemForm
                                item={data.random_coupon_blank_item}
                                index={-1}
                                hasScreen={data.random_coupon_screen_flg == RANDOM_COUPON_SCREEN_FLG_DISPLAY}
                                isShowDelete={false}
                                onClickOpenSelectCoupon={(item) => this.onClickOpenSelectItemCoupon(item)}
                                onClickOpenSelectPicture={(item) => this.onClickOpenSelectItemPicture(item)}
                                updateItem={(item) => this.updateItem(item)}
                            />
                        </div>
                    </dt>
                    <div className="widget__page__input__bottom mb20">
                        <button className="btn-base" onClick={(e) => this.onClickSubmit(e)}>
                            {Globalize.localize(this.props.isNew ? 'random_coupon_create_button' : 'random_coupon_update_button', Globalize.culture())}
                        </button>
                    </div>
                </dl>
            </div>
        );
    }
}

RandomCouponInputForm.contextTypes = {
    router: React.PropTypes.object,
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
    };
};

export default connect(mapStateToProps)(RandomCouponInputForm);
