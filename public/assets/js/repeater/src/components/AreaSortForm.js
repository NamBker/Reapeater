import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import DropDownList from  './commons/DropDownList'
import Notification from '../components/commons/Notification';
import * as Const from '../constants/Constants';
import { eachArea, eachCompany, eachBrand, eachStore } from '../utils/CommonUtils'
import { Link } from 'react-router'

class AreaSortForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter : {
                company_id : props.currentUser.authority < Const.USER_AUTHORITY_COMPANY ? -1 : props.currentUser.company_id,
                brand_id : props.currentUser.authority < Const.USER_AUTHORITY_BRAND ? -1 : props.currentUser.brand_id,
                pattern : Const.GET_ALL_PATTERN
            } ,
            submitfilter : {
                company_id : -1,
                brand_id : -1,
                pattern : Const.GET_ALL_PATTERN
            } ,
            brands : props.brands,
            error : props.error == null ? 0 : props.error,  
            arrData : props.areaSort.arrData
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.handleCompanyIdChange = this.handleCompanyIdChange.bind(this);
        this.handleBrandIdChange = this.handleBrandIdChange.bind(this);
        this.onChangeLargeAreaSortIndex = this.onChangeLargeAreaSortIndex.bind(this);
        this.onChangeNoLargeAreaStoreSortIndex = this.onChangeNoLargeAreaStoreSortIndex.bind(this);
        this.onChangeMediumAreaSortIndex = this.onChangeMediumAreaSortIndex.bind(this);
        this.onChangeNoMediumAreaStoreSortIndex = this.onChangeNoMediumAreaStoreSortIndex.bind(this);
        this.onChangeSmallAreaSortIndex = this.onChangeSmallAreaSortIndex.bind(this);
        this.onChangeNoSmallAreaStoreSortIndex = this.onChangeNoSmallAreaStoreSortIndex.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        const {notificationAction} = this.props;
        notificationAction.hideNotification(this.props.route.path);
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.error != this.props.error && nextProps.error != null) {
            this.setState({
                error: nextProps.error,
            });
        }
        if (nextProps.areaSort != this.props.areaSort && nextProps.areaSort != null) {
            nextProps.areaSort.toArray();
            nextProps.areaSort.sortIndexOrder();
            this.setState({
                arrData: nextProps.areaSort.arrData,
            });
        }
        if (nextProps.currentUser != this.props.currentUser && nextProps.currentUser != null) {
            let {filter} = this.state;
            let {storeAction} = this.props;
            let company_id = nextProps.currentUser.authority < Const.USER_AUTHORITY_COMPANY ? -1 : nextProps.currentUser.company_id;
            let brand_id =  nextProps.currentUser.authority < Const.USER_AUTHORITY_BRAND ? -1 : nextProps.currentUser.brand_id;
            if(company_id != filter.company_id || brand_id != filter.brand_id) {
                let newFilter = {...filter,company_id:company_id, brand_id:brand_id};
                this.setState({
                    filter: newFilter,
                    submitfilter: newFilter,
                });
                if(newFilter.brand_id != -1) {
                    storeAction.fetchStores(newFilter);   
                }
            }
        }
    }

    onSubmit(e) {
        e.preventDefault(); 
        const {site,error} = this.state;
        const {storeAction, areaSort} = this.props;
        this.props.areaSort.toSubmitStores()
        if(Object.keys(error).length === 0) {
            let item = areaSort.submitStores.slice(0,1)[0];
            item = {...item,multiple_record : areaSort.submitStores};
            storeAction.updateStore(item.id,item,
                (err) => {  
                    this.showNotification(err, false);
                },
                (res) => {
                    this.showNotification("店舗一覧ソート順は更新されました");
                }
            );
        }
        else {
            alert(error);
        }
    }

    showNotification(message, isSuccess = true) {
        const {notificationAction} = this.props;
        notificationAction.showNotification(this.props.route.path, message, isSuccess);
    }

    handleCompanyIdChange(e) {
        let filter = this.state.filter;
        filter.company_id = this.props.currentUser.authority < Const.USER_AUTHORITY_COMPANY ? e.target.value : this.props.currentUser.company_id;
        filter.brand_id = "";
        var brand_arr = [];
        this.props.brands.map(brand => {
            if (brand.company_id == filter.company_id) {
                brand_arr.push(brand);
            }
        });
        this.setState({ filter: filter, brands: brand_arr });
    }

    handleBrandIdChange(e) {
        let filter = this.state.filter;
        const {storeAction} = this.props;
        filter.brand_id = e.target.value;
        this.setState({ submitfilter: filter });
        storeAction.fetchStores(filter);
        console.log(this.state.arrData);
    }

    onChangeLargeAreaSortIndex(index,e) {
        let {arrData} = this.state;
        let newLargeItem = arrData.slice(index,index+1);
        newLargeItem[0].large_area_index = e.target.value;
        let new_arrData = [...arrData.slice(0,index),...newLargeItem,...arrData.slice(index+1)];        
        this.setState({
            arrData : new_arrData
        });
    }

    onChangeMediumAreaSortIndex(large_index,medium_index,e) {
        let {arrData} = this.state;
        let newLargeItem = arrData.slice(large_index,large_index+1);
        newLargeItem[0].medium_area[medium_index].medium_area_index = e.target.value;
        let new_arrData = [...arrData.slice(0,large_index),...newLargeItem,...arrData.slice(large_index+1)];        
        this.setState({
            arrData : new_arrData
        });
    }

    onChangeSmallAreaSortIndex(large_index,medium_index,small_index,e) {
        let {arrData} = this.state;
        let newLargeItem = arrData.slice(large_index,large_index+1);
        newLargeItem[0].medium_area[medium_index].small_area[small_index].small_area_index = e.target.value;
        let new_arrData = [...arrData.slice(0,large_index),...newLargeItem,...arrData.slice(large_index+1)];        
        this.setState({
            arrData : new_arrData
        });
    }

    onChangeNoLargeAreaStoreSortIndex(large_index,store_index,e) {
        let {arrData} = this.state;
        let newLargeItem = arrData.slice(large_index,large_index+1);
        newLargeItem[0].stores[store_index].store_sort_index = e.target.value;
        let new_arrData = [...arrData.slice(0,large_index),...newLargeItem,...arrData.slice(large_index+1)];        
        this.setState({
            arrData : new_arrData
        });
    }

    onChangeNoMediumAreaStoreSortIndex(large_index,medium_index,store_index,e) {
        let {arrData} = this.state;
        let newLargeItem = arrData.slice(large_index,large_index+1);
        newLargeItem[0].medium_area[medium_index].stores[store_index].store_sort_index = e.target.value;
        let new_arrData = [...arrData.slice(0,large_index),...newLargeItem,...arrData.slice(large_index+1)];        
        this.setState({
            arrData : new_arrData
        });
    }

    onChangeNoSmallAreaStoreSortIndex(large_index,medium_index,small_index,store_index,e) {
        let {arrData} = this.state;
        let newLargeItem = arrData.slice(large_index,large_index+1);
        newLargeItem[0].medium_area[medium_index].small_area[small_index].stores[store_index].store_sort_index = e.target.value;
        let new_arrData = [...arrData.slice(0,large_index),...newLargeItem,...arrData.slice(large_index+1)];        
        this.setState({
            arrData : new_arrData
        });
    }

    render() {
        const { currentUser, isCreateNew ,companies, brands } = this.props;
        const { arrData } = this.state;
        let brands_of_company = [];
        isCreateNew ? brands.map((brand) => {
            if (brand.company_id == currentUser.company_id) {
                brands_of_company.push(brand);
            }
        }) : brands_of_company;
        return (
            <div>
            <Notification path={this.props.route.path}/>
            <form acceptCharset="utf-8" onSubmit={this.onSubmit.bind(this)} autoComplete="off">
                <div className="contents__container">
                    <div className="contents__h2 contents__icon--smartphone">
                        <span className="contents__container__h2--title">{Globalize.localize('area_sort_title_smart_phone', Globalize.culture())}</span>
                    </div>
                    <div className="contents__container__content">
                        <div className="font-headline1 mb10">{Globalize.localize('l_area_sort_setting_brand', Globalize.culture())}</div>
                        <div className="contents__container__box mb20">
                            <div className="contents__container__dl clearfix">
                                <div className="contents__container__dt v__middle">{Globalize.localize('map_company', Globalize.culture())}</div>
                                <div className="contents__container__dd">
                                    {isCreateNew ? currentUser.authority >= Const.USER_AUTHORITY_COMPANY ? currentUser.company_name :
                                    <DropDownList
                                        data={companies}
                                        defaultValue={this.state.filter.company_id}
                                        hasEmptyOption={true}
                                        onChange={this.handleCompanyIdChange}
                                        eachCallback={eachCompany()}/> : ""}
                                </div>
                            </div>
                            <div className="contents__container__dl clearfix">
                                <div className="contents__container__dt">{Globalize.localize('map_brand', Globalize.culture())}</div>
                                <div className="contents__container__dd">
                                    {isCreateNew ? currentUser.authority >= Const.USER_AUTHORITY_BRAND ? currentUser.brand_name :
                                    <DropDownList
                                        data={currentUser.authority == Const.USER_AUTHORITY_COMPANY ? brands_of_company : this.state.brands}
                                        defaultValue={this.state.filter.brand_id}
                                        hasEmptyOption={true}
                                        onChange={this.handleBrandIdChange}
                                        eachCallback={eachBrand()}
                                        />  
                                    : "" }
                                </div>
                            </div>
                        </div>
                        <span className="font-headline1">{Globalize.localize('l_area_sort', Globalize.culture())}</span>　
                        <span className="invalid">{Globalize.localize('l_area_sort_enter_note', Globalize.culture())}</span>
                        <div className="contents__container__box area_order">
                            <div className="widget__title">
                                <div className="areaLMS">{Globalize.localize('l_area', Globalize.culture())}</div>
                                <div className="areaLMS">{Globalize.localize('m_area', Globalize.culture())}</div>
                                <div className="areaLMS">{Globalize.localize('s_area', Globalize.culture())}</div>
                                <div className="areaLMS">{Globalize.localize('store', Globalize.culture())}</div>
                            </div>
                    { this.state.submitfilter.brand_id != -1 ? arrData.map((value,index,arr) => 
                        value.large_area_name == "no_l_area" ? 
                            <div className="contents__container__tr" key={value.large_area_name + index}>
                                <div className="contents__container__td">
                                    <div className="line_sideR"><input type="text" required value={value.large_area_index >= 0? value.large_area_index : ""} onChange={(e)=>{this.onChangeLargeAreaSortIndex(index,e)}} className="contents__container__input--text" />{Globalize.localize('l_no_area', Globalize.culture())}</div>
                                </div>
                                <div className="contents__container__td area_storeS">
                                    {value.stores.map((store,store_index,store_arr) => 
                                    <div className="spot" key={store.store_name + store_index}>
                                        <div className={store_index == store_arr.length-1 ? "" : "line_length"}>
                                            <input type="text" required value={store.store_sort_index >= 0? store.store_sort_index : ""} onChange={(e)=>{this.onChangeNoLargeAreaStoreSortIndex(index,store_index,e)}} className="contents__container__input--text" />
                                            <Link to={"/store/edit/"+store.id}>{store.store_name}</Link>
                                        </div>
                                    </div>
                                    )}
                                </div>
                            </div>
                        :   <div className="contents__container__tr" key={value.large_area_name + index}>
                                <div className="contents__container__td areaL">
                                    <div className="line_sideR"><input type="text" required value={value.large_area_index >= 0? value.large_area_index : ""} onChange={(e)=>{this.onChangeLargeAreaSortIndex(index,e)}} className="contents__container__input--text" />{value.large_area_name}</div>
                                </div>
                                <div className="contents__container__td">
                                    {value.medium_area.map((medium_item,medium_index,medium_arr) => 
                                        medium_item.medium_area_name == "no_m_area" ?
                                        <div className="contents__container__tr" key={medium_item.medium_area_name+ medium_index}>
                                            <div className={"contents__container__td areaML " + (medium_index == medium_arr.length-1 ? "" : " line_length")}>
                                                <div className="line_sideR"><input type="text" required value={medium_item.medium_area_index >= 0? medium_item.medium_area_index : ""} onChange={(e)=> {this.onChangeMediumAreaSortIndex(index,medium_index,e)}} className="contents__container__input--text" />{Globalize.localize('l_no_area', Globalize.culture())}</div>
                                            </div>
                                            <div className="contents__container__td area_storeM">
                                                {medium_item.stores.map((store,store_index,store_arr)=>
                                                    <div className="spot" key={store.store_name + store_index}>
                                                        <div className={store_index == store_arr.length-1 ? "" : "line_length"}>
                                                            <input type="text" required value={store.store_sort_index >= 0? store.store_sort_index : ""} onChange={(e)=>{this.onChangeNoMediumAreaStoreSortIndex(index,medium_index,store_index,e)}} className="contents__container__input--text" />
                                                            <Link to={"/store/edit/"+store.id}>{store.store_name}</Link>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        : 
                                        <div className="contents__container__tr" key={medium_item.medium_area_name+ medium_index}>
                                            <div className={"contents__container__td areaMM " + (medium_index == medium_arr.length-1 ? "" : " line_length")}>
                                                <div className="line_sideR"><input type="text" required value={medium_item.medium_area_index >= 0 ? medium_item.medium_area_index : ""} onChange={(e)=> {this.onChangeMediumAreaSortIndex(index,medium_index,e)}} className="contents__container__input--text" />{medium_item.medium_area_name}</div>
                                            </div>
                                            <div className="contents__container__td">
                                                {medium_item.small_area.map((small_item,small_index,small_arr) => 
                                                    small_item.small_area_name == "no_s_area" ?
                                                    <div className="contents__container__tr" key={small_item.small_area_name+small_index}>
                                                        <div className={"contents__container__td areaS " + (small_index == small_arr.length-1 ? "" : " line_length")}>
                                                            <div className="line_sideR"><input type="text" required value={small_item.small_area_index >= 0 ? small_item.small_area_index : ""} onChange={(e)=>{this.onChangeSmallAreaSortIndex(index,medium_index,small_index,e)}} className="contents__container__input--text" />{Globalize.localize('l_no_area', Globalize.culture())}</div>
                                                        </div>
                                                        <div className="contents__container__td area_storeM">
                                                            {small_item.stores.map((store,store_index,store_arr)=>
                                                                <div className="spot" key={store.store_name + store_index}>
                                                                    <div className={store_index == store_arr.length-1 ? "" : "line_length"}>
                                                                        <input type="text" required value={store.store_sort_index >= 0 ? store.store_sort_index : ""} onChange={(e)=>{this.onChangeNoSmallAreaStoreSortIndex(index,medium_index,small_index,store_index,e)}} className="contents__container__input--text" />
                                                                        <Link to={"/store/edit/"+store.id}>{store.store_name}</Link>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className="contents__container__tr" key={small_item.small_area_name+small_index}>
                                                        <div className={"contents__container__td areaS " + (small_index == small_arr.length-1 ? "" : " line_length")}>
                                                            <div className="line_sideR"><input type="text" required value={small_item.small_area_index >= 0 ? small_item.small_area_index : 0} onChange={(e)=>{this.onChangeSmallAreaSortIndex(index,medium_index,small_index,e)}} className="contents__container__input--text" />{small_item.small_area_name}</div>
                                                        </div>
                                                        <div className="contents__container__td area_storeM">
                                                            {small_item.stores.map((store,store_index,store_arr)=>
                                                                <div className="spot" key={store.store_name + store_index}>
                                                                    <div className={store_index == store_arr.length-1 ? "" : "line_length"}>
                                                                        <input type="text" required value={store.store_sort_index >= 0 ? store.store_sort_index : ""} onChange={(e)=>{this.onChangeNoSmallAreaStoreSortIndex(index,medium_index,small_index,store_index,e)}} className="contents__container__input--text" />
                                                                        <Link to={"/store/edit/"+store.id}>{store.store_name}</Link>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )} 
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                    ) : null }
                </div>
                <div className="text-center mt20 mb20">
                    <input type="submit"  value={Globalize.localize('b_area_sort_set', Globalize.culture())} className="btn-base" onSubmit={this.onSubmit} />
                </div>
            </div>
        </div>
    </form>
</div>  
        )
    }
}

export default AreaSortForm;   
