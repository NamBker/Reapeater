import React, { Component, PropTypes } from 'react';
import { fetchStoreInfo, createStore, updateStore } from '../actions/store'
import { USER_AUTHORITY_COMPANY } from '../constants/Constants'
import Notification from './commons/Notification';
import Routes from '../constants/Routes';
import SelectPicture from '../components/SelectPicture'

class StoreForm extends Component {
    constructor(props) {
        super(props);
        this.state =  {
            store: {
                store_status : 2,
                store_name: '',
                store_code : '',
                store_address: '',
                store_prefectures : '',
                store_building: '',
                store_access: '',
                store_location: '',
                store_phone_no: '',
                store_fax_no: '',
                store_business_hours: '',
                store_business_hours_from: '',
                store_business_hours_to: '',
                store_regular_holiday: '',
                store_parking_lot: '',
                store_seat: '',
                store_kids_room: '',
                store_signature_block: '',
                store_terms_of_use: '',
                store_privacy_policy: '',
                store_freeword: '',
                store_sort_index : 0,
                store_area_L_id: 0,
                store_area_M_id: 0,
                store_area_S_id: 0,
                store_seo_key1: '',
                store_seo_key2: '',
                store_seo_key3: '',
                twitter_access_token: '',
                twitter_access_token_secret: '',
                store_header_picture_id: '',
                store_header_picture_name: '',
                store_header_picture_url: '',
                facebook_id: '',
            },
            gotData: props.isCreate ? true : false,
            companyId: this.props.isCreate ? (USER_AUTHORITY_COMPANY <= this.props.currentUser.authority ? this.props.currentUser.company_id : 0) : 0,
            isShowSelectPicture: false
        };
        this.onSubmit = this.onSubmit.bind(this);

    }

    componentDidMount() {
        if (!this.props.isCreate) {
            this.props.dispatch(fetchStoreInfo(this.props.params.storeId));
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.isCreate && !this.state.gotData && this.state.store != nextProps.storeDetail && 0 < Object.keys(nextProps.storeDetail).length) {
            this.setState({
                gotData: true,
                store: nextProps.storeDetail,
                company_id: nextProps.storeDetail.company_id,
            });
        }
    }

    handleCompanyIdChange(e) {
        let companyId = e.target.value ? parseInt(e.target.value) : 0;
        let store = this.state.store;
        if (store.brand_id) {
            let selectedBrand = this.props.brands.find((brand) => {return brand.id == store.brand_id;});
            if (selectedBrand.company_id != companyId) {
                store.brand_id = '';
            }
        }
        this.setState({ companyId: companyId, store: store });
    }

    handleBrandIdChange(e) {
        let store = {...this.state.store};
        store.brand_id = e.target.value;
        store.section_id = "";
        store.store_status = 2;
        this.setState({ store: store });
    }

    handleStoreCodeChange(e) {
        let store = {...this.state.store};
        store.store_code = e.target.value;
        this.setState({store: store});
    }

    handleStoreNameChange(e) {
        let store = {...this.state.store};
        store.store_name = e.target.value;
        this.setState({store: store});
    }

    handleStoreStatusChange(e) {
        let store = {...this.state.store};
        store.store_status = e.target.value;
        this.setState({ store: store });
    }

    handleStorePostalCodeChange(e) {
        let store = {...this.state.store};
        store.store_postal_code = e.target.value;
        this.setState({ store: store });
    }

    handleStorePrefectureChange(e) {
        let store = {...this.state.store};
        store.store_prefectures = e.target.value;
        this.setState({ store: store });
    }

    handleStoreAddressChange(e) {
        let store = {...this.state.store};
        store.store_address = e.target.value;
        this.setState({ store: store });
    }

    handleStoreBuildingChange(e) {
        let store = {...this.state.store};
        store.store_building = e.target.value;
        this.setState({ store: store });
    }

    handleStoreAccessChange(e) {
        let store = {...this.state.store};
        store.store_access = e.target.value;
        this.setState({ store: store });
    }

    handleStoreLocationChange(e) {
        let store = {...this.state.store};
        store.store_location = e.target.value;
        this.setState({ store: store });
    }

    handleStorePhoneNoChange(e) {
        let store = {...this.state.store};
        store.store_phone_no = e.target.value;
        this.setState({ store: store });
    }

    handleStoreFaxNoChange(e) {
        let store = {...this.state.store};
        store.store_fax_no = e.target.value;
        this.setState({ store: store });
    }

    handleStoreManagerNameChange(e) {
        let store = {...this.state.store};
        store.store_manager_name = e.target.value;
        this.setState({ store: store });
    }

    handleStoreBusinessHourChange(e) {
        let store = {...this.state.store};
        store.store_business_hours = e.target.value;
        this.setState({ store: store });
    }

    handleStoreBusinessHourFromChange(e) {
        let store = {...this.state.store};
        store.store_business_hours_from = e.target.value;
        this.setState({ store: store });
    }

    handleStoreBusinessHourToChange(e) {
        let store = {...this.state.store};
        store.store_business_hours_to = e.target.value;
        this.setState({ store: store });
    }

    handleStoreRegularHolidayChange(e) {
        let store = {...this.state.store};
        store.store_regular_holiday = e.target.value;
        this.setState({ store: store });
    }

    handleStoreParkingLotChange(e) {
        let store = {...this.state.store};
        store.store_parking_lot = e.target.value;
        this.setState({ store: store });
    }

    handleStoreSeatChange(e) {
        let store = {...this.state.store};
        store.store_seat = e.target.value;
        this.setState({ store: store });
    }

    handleStoreKidsRoomChange(e) {
        let store = {...this.state.store};
        store.store_kids_room = e.target.value;
        this.setState({ store: store });
    }

    handleStoreSignatureBlockChange(e) {
        let store = {...this.state.store};
        store.store_signature_block = e.target.value;
        this.setState({ store: store });
    }

    handleStoreTermsOfUseChange(e) {
        let store = {...this.state.store};
        store.store_terms_of_use = e.target.value;
        this.setState({ store: store });
    }

    handleStorePrivacyPolicyChange(e) {
        let store = {...this.state.store};
        store.store_privacy_policy = e.target.value;
        this.setState({ store: store });
    }

    handleStoreFreeWordChange(e) {
        let store = {...this.state.store};
        store.store_freeword = e.target.value;
        this.setState({ store: store });
    }

    handleStoreHeaderPictureIdChange(e) {
        let store = {...this.state.store};
        store.store_header_picture_id = e.target.value;
        this.setState({ store: store });
    }

    handleStoreAreaLChange(e) {
        let store = {...this.state.store};
        store.store_area_L_id = e.target.value || 0;
        this.setState({ store: store });
    }

    handleStoreAreaMChange(e) {
        let store = {...this.state.store};
        store.store_area_M_id = e.target.value || 0;
        this.setState({ store: store });
    }

    handleStoreAreaSChange(e) {
        let store = {...this.state.store};
        store.store_area_S_id = e.target.value || 0;
        this.setState({ store: store });
    }

    handleStoreSeoKey1Change(e) {
        let store = {...this.state.store};
        store.store_seo_key1 = e.target.value;
        this.setState({ store: store });
    }

    handleStoreSeoKey2Change(e) {
        let store = {...this.state.store};
        store.store_seo_key2 = e.target.value;
        this.setState({ store: store });
    }

    handleStoreSeoKey3Change(e) {
        let store = {...this.state.store};
        store.store_seo_key3 = e.target.value;
        this.setState({ store: store });
    }

    handleStoreAccessTokenChange(e) {
        let store = {...this.state.store};
        store.twitter_access_token = e.target.value;
        this.setState({ store: store });
    }

    handleStoreAccessTokenSecretChange(e) {
        let store = {...this.state.store};
        store.twitter_access_token_secret = e.target.value;
        this.setState({ store: store });
    }

    handleStoreFacebookIdChange(e) {
        let store = {...this.state.store};
        store.facebook_id = e.target.value;
        this.setState({ store: store });
    }

    handleStoreFirstOpenDateChange(e) {
        let store = {...this.state.store};
        store.store_first_open_date = e.target.value;
        this.setState({ store: store });
    }

    onSubmit(e) {
        const { store } = this.state;
        let errors = [];

        if (!store.brand_id) {
            errors.push(Globalize.localize('map_brand_name', Globalize.culture()));
        }
        if (!store.store_code) {
            errors.push(Globalize.localize('map_store_code', Globalize.culture()));
        }
        if (!store.store_name) {
            errors.push(Globalize.localize('map_store_name', Globalize.culture()));
        }
        if (!store.store_postal_code) {
            errors.push(Globalize.localize('map_postal_code', Globalize.culture()));
        }
        if (!store.store_prefectures) {
            errors.push(Globalize.localize('map_prefecture', Globalize.culture()));
        }
        if (!store.store_address) {
            errors.push(Globalize.localize('map_city', Globalize.culture()));
        }

        if (0 < errors.length) {
            let message = Globalize.localize('alert_message_for_error_not_null', Globalize.culture());
            message += '\n\n' + errors.join('\n');
            alert(message);
            return;
        }
        this.props.history.push(this.props.location.pathname + "/confirm");
    }

    onRegister(e) {
        this.props.dispatch(createStore(this.state.store, (err) => {
            Notification.showNotification(this.props.dispatch, this.props.route.path, Globalize.localize('store_fail_to_create_notification', Globalize.culture()) + '\n' + err.toString());
        }, (res) => {
            const route = Routes[this.props.route.path];
            Notification.showNotification(this.props.dispatch, route.parent, Globalize.localize('store_created_notification', Globalize.culture()));
            this.props.history.push(route.parent);
        }));
    }

    onUpdate(e) {
        this.props.dispatch(updateStore(this.props.params.storeId, this.state.store, (err) => {
            Notification.showNotification(this.props.dispatch, this.props.route.path, Globalize.localize('store_fail_to_update_notification', Globalize.culture()) + '\n' + err.toString());
        }, (res) => {
            const route = Routes[this.props.route.path];
            Notification.showNotification(this.props.dispatch, route.parent, Globalize.localize('store_updated_notification', Globalize.culture()));
            this.props.history.push(route.parent);
        }));
    }

    onOpenSelectPicture() {
        this.setState({isShowSelectPicture: true});
    }

    onSelectPicture(pictureInfo) {
        let store = {...this.state.store};
        store.store_header_picture_id = pictureInfo.id;
        store.store_header_picture_name = pictureInfo.filename;
        store.store_header_picture_url = pictureInfo.url;
        this.setState({store});
    }

    onDeletePicture() {
    let store = {...this.state.store};
    store.store_header_picture_id = 0;
    store.store_header_picture_name = "";
    store.store_header_picture_url = "";
    this.setState({store});
    }

    render() {
        const { companies, brands, currentUser } = this.props;
        const children = React.cloneElement(this.props.children, {
            props: this.props,
            state: this.state,
            currentUser: currentUser,
            companies: this.props.isCreate ? companies : [],
            brands: this.props.isCreate ? brands : [],
            handleCompanyIdChange: (e) => this.handleCompanyIdChange(e),
            handleBrandIdChange: (e) => this.handleBrandIdChange(e),
            handleStoreCodeChange: (e) => this.handleStoreCodeChange(e),
            handleStoreNameChange: (e) => this.handleStoreNameChange(e),
            handleStoreStatusChange: (e) => this.handleStoreStatusChange(e),
            handleStorePostalCodeChange: (e) => this.handleStorePostalCodeChange(e),
            handleStorePrefectureChange: (e) => this.handleStorePrefectureChange(e),
            handleStoreAddressChange: (e) => this.handleStoreAddressChange(e),
            handleStoreBuildingChange: (e) => this.handleStoreBuildingChange(e),
            handleStorePhoneNoChange: (e) => this.handleStorePhoneNoChange(e),
            handleStoreAccessChange: (e) => this.handleStoreAccessChange(e),
            handleStoreFaxNoChange: (e) => this.handleStoreFaxNoChange(e),
            handleStoreManagerNameChange: (e) => this.handleStoreManagerNameChange(e),
            handleStoreBusinessHourChange: (e) => this.handleStoreBusinessHourChange(e),
            handleStoreBusinessHourFromChange: (e) => this.handleStoreBusinessHourFromChange(e),
            handleStoreBusinessHourToChange: (e) => this.handleStoreBusinessHourToChange(e),
            handleStoreRegularHolidayChange: (e) => this.handleStoreRegularHolidayChange(e),
            handleStoreParkingLotChange: (e) => this.handleStoreParkingLotChange(e),
            handleStoreSeatChange: (e) => this.handleStoreSeatChange(e),
            handleStoreKidsRoomChange: (e) => this.handleStoreKidsRoomChange(e),
            handleStoreSignatureBlockChange: (e) => this.handleStoreSignatureBlockChange(e),
            handleStoreTermsOfUseChange: (e) => this.handleStoreTermsOfUseChange(e),
            handleStorePrivacyPolicyChange: (e) => this.handleStorePrivacyPolicyChange(e),
            handleStoreFreeWordChange: (e) => this.handleStoreFreeWordChange(e),
            handleStoreHeaderPictureIdChange: (e) => this.handleStoreHeaderPictureIdChange(e),
            handleStoreAreaLChange: (e) => this.handleStoreAreaLChange(e),
            handleStoreAreaMChange: (e) => this.handleStoreAreaMChange(e),
            handleStoreAreaSChange: (e) => this.handleStoreAreaSChange(e),
            handleStoreSeoKey1Change: (e) => this.handleStoreSeoKey1Change(e),
            handleStoreSeoKey2Change: (e) => this.handleStoreSeoKey2Change(e),
            handleStoreSeoKey3Change: (e) => this.handleStoreSeoKey3Change(e),
            handleStoreAccessTokenChange: (e) => this.handleStoreAccessTokenChange(e),
            handleStoreAccessTokenSecretChange: (e) => this.handleStoreAccessTokenSecretChange(e),
            handleStoreFacebookIdChange: (e) => this.handleStoreFacebookIdChange(e),
            handleStoreFirstOpenDateChange: (e) => this.handleStoreFirstOpenDateChange(e),
            onOpenSelectPicture: (e) => this.onOpenSelectPicture(e),
            onDeletePicture: (e) => this.onDeletePicture(e),

            onSubmit: this.onSubmit,
            onRegister: this.onRegister,
            onUpdate: this.onUpdate,
        });

        if(this.props.isCreate){
            var comment = Globalize.localize('store_create_comment', Globalize.culture());
        }else{
            var comment = Globalize.localize('store_update_comment', Globalize.culture());
        }

        return (
            <div>
                <Notification
                    path={this.props.route.path}
                    ref="notification"
                />
                <SelectPicture
                    isOpen={this.state.isShowSelectPicture}
                    title={Globalize.localize('random_coupon_select_picture_title', Globalize.culture())}
                    closeDialog={() => {this.setState({isShowSelectPicture: false})}}
                    onSelectedPicture={(pictureInfo) => this.onSelectPicture(pictureInfo)}/>
                <dl className="widget">
                    <dt className="widget__page__input__title">
                        <div className="widget__page__type__create"/>
                        <span className="widget__page__main__title font-base1">{comment}</span>
                    </dt>
                    {children}
                </dl>
            </div>
        );
    }
}

export default StoreForm;
