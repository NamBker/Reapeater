import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Filter from './area/Filter'
import Table from '../components/commons/Table'
import Notification from '../components/commons/Notification'
import CreateDialog from './area/CreateDialog'
import UpdateDialog from './area/UpdateDialog'
import { Link } from 'react-router'
import * as Const from '../constants/Constants';
import { fetchUserInfo } from '../actions/user'
import { fetchAreas, deleteAreas } from '../actions/area'
import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE } from '../constants/Constants'
import Dialog from  '../components/commons/Dialog'
import { doneCustomCreate } from '../actions/routes'

class AreaList extends Component {

    constructor(props) {
        super(props);
        this.state= {
            filter: {
                company_id: USER_AUTHORITY_COMPANY <= props.currentUser.authority ? props.currentUser.company_id : 0,
                brand_id: USER_AUTHORITY_BRAND <= props.currentUser.authority ? props.currentUser.brand_id: 0,
                title: '',
                body: '',
                page: 1,
                per_page: Const.PER_PAGE,
                pattern: Const.GET_ALL_PATTERN,
                area_type: '',
                area_name: '',
                update_flg: false,
            },
            curFilter: {
                page: 1,
            },
            doUpdate: {
                showDialog: false,
                area: {
                    id: 0,
                    company_id: 0,
                    brand_id: 0,
                    area_type: '',
                    area_name: '',
                },
            }

        };

        this.tableFormat = [
            {
                title: Globalize.localize('map_company_name', Globalize.culture()),
                valueKey: 'company_name',
                style: {
                    width: '120px',
                    marginLeft: '0px',
                    marginRight: '10px',
                    lineHeight: '50px',
                    height: '50px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    flexShrink: '0',
                },
            },
            {
                title: Globalize.localize('map_brand_name', Globalize.culture()),
                valueKey: 'brand_name',
                style: {
                    width: '120px',
                    marginLeft: '0px',
                    marginRight: '10px',
                    lineHeight: '50px',
                    height: '50px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    flexShrink: '0',
                },
            },
            {
                title: Globalize.localize('map_area_section', Globalize.culture()),
                valueKey: 'area_type',
                style: {
                    width: '120px',
                    marginLeft: '0px',
                    marginRight: '10px',
                    lineHeight: '50px',
                    height: '50px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    flexShrink: '0',
                },
            },
            {
                title: Globalize.localize('map_area_name', Globalize.culture()),
                valueKey: 'area_name',
                style: {
                    width: '100%',
                    marginLeft: '0px',
                    marginRight: '90px',
                    lineHeight: '50px',
                    height: '50px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                },
            },
        ];
        this.areaTypes = [
            Globalize.localize('l_area', Globalize.culture()),
            Globalize.localize('m_area', Globalize.culture()),
            Globalize.localize('s_area', Globalize.culture()),
        ];
        this.doneCustomUpdate = this.doneCustomUpdate.bind(this);
    }

    cellForKey(key, element) {
        switch(key) {
        case 'company_name':
            return (
                <span>{element.company_name}</span>
            );
        case 'brand_name':
            return (
                <span>{element.brand_name}</span>
            );
        case 'area_type':
            return (
                <span>{this.areaTypes[element.area_type - 1]}</span>
            );
        case 'area_name':
            return (
                <span>{element.area_name}</span>
            );
        }
    }

    componentWillMount() {
        this.props.dispatch(fetchUserInfo('me', (err) => {}, (res) => {
            let filter = this.state.filter;
            filter.company_id = USER_AUTHORITY_COMPANY <= res.user.authority ? res.user.company_id : 0,
            filter.brand_id = USER_AUTHORITY_BRAND <= res.user.authority ? res.user.brand_id : 0,
            this.setState({filter}, () => {
                this.onSearch();
            });
        }));
    }

    onChangeFilter(filter) {
        this.setState({filter});
    }

    handleSelectUpdate(area){
        let doUpdate = this.state.doUpdate;
        doUpdate.showDialog = true;
        doUpdate.area = area;
        this.setState({doUpdate: doUpdate});
    }

    doneCustomUpdate(){
        let doUpdate = this.state.doUpdate;
        doUpdate.showDialog = false;
        this.setState({doUpdate: doUpdate});
    }

    onSubmit(e){
        e.preventDefault();
        this.onSearch();
    }

    onSearch() {
        let curFilter = {...this.state.filter};
        this.setState({curFilter}, () => {
            this.props.dispatch(fetchAreas(curFilter))
        });
    }

    showNotification(message, isSuccess = true) {
        Notification.showNotification(this.props.dispatch, this.props.route.path, message);
    }

    onDelete(deleteIds) {
        if(confirm(Globalize.localize('confirm_delete', Globalize.culture()))) {
            let curFilter = this.state.curFilter;
            if (this.props.areas.length <= deleteIds.length && 1 < curFilter.page) {
                curFilter.page = curFilter.page - 1;
            }
            let titles = $.grep(this.props.areas.map((area) => {return 0 <= deleteIds.indexOf(area.id) ? area.area_name : null}), Boolean).join(", ");
            this.setState({curFilter}, () => {
                deleteAreas(deleteIds,
                    (err) => {
                        this.showNotification(Globalize.localize('area_cant_delete', Globalize.culture()) + '\n' + err.toString());
                    },
                    (res) => {
                        this.showNotification(Globalize.localize('area_deleted', Globalize.culture()) + '\n・' + titles);
                        this.onSearch();
                    }
                );
            });
        }
    }

    onClickRowEdit(element) {
        let doUpdate = this.state.doUpdate;
        doUpdate.showDialog = true;
        doUpdate.area = {
            id: element.id,
            company_id: element.company_id,
            company_name: element.company_name,
            brand_id: element.brand_id,
            brand_name: element.brand_name,
            area_type: element.area_type,
            area_name: element.area_name,
        };
        this.setState({doUpdate});
    }

    onChangePage(data) {
        let curFilter = this.state.curFilter;
        curFilter.page = data.selected + 1;
        this.setState({curFilter}, () => {
            this.props.dispatch(fetchAreas(curFilter));
        });
    }

    render() {
        var data = {};
        data['company_id'] = this.state.filter.company_id;
        data['brand_id'] = this.state.filter.brand_id;
        data['status'] = '';
        data['area_name'] = '';

        if(data['company_id'] == 0){
            data['company_id'] = this.props.currentUser.company_id
        }
        if(data['brand_id'] == 0){
            data['brand_id'] = this.props.currentUser.brand_id
        }

        return (
            <div>
                <Notification path={this.props.route.path}/>
                {this.props.doCreate ?
                <CreateDialog isOpen={this.props.doCreate}
                        title={Globalize.localize('area_create', Globalize.culture())}
                        content=""
                        areaTypes={this.areaTypes}
                        closeDialog={() => {this.props.dispatch(doneCustomCreate())}}
                        data={data}
                        filter={this.state.curFilter}
                    /> : null}
                {this.state.doUpdate.showDialog ?
                <UpdateDialog isOpen={this.state.doUpdate.showDialog}
                          title={Globalize.localize('area_update', Globalize.culture())}
                          content=""
                          closeDialog={() => {this.doneCustomUpdate()}}
                          doUpdate={this.state.doUpdate}
                          data={this.state.doUpdate.area}
                          filter={this.state.curFilter}
                    /> : null}
                <Filter
                    filter={this.state.filter}
                    areaTypes={this.areaTypes}
                    onChangeFilter={(filter) => this.onChangeFilter(filter)}
                    onSubmit = {(e) => this.onSubmit(e)}
                    />
                <Table
                    data={this.props.areas}
                    formats={this.tableFormat}
                    totalCount={this.props.areaCount}
                    curPage={this.state.curFilter.page}
                    onDelete={(deleteIds) => this.onDelete(deleteIds)}
                    cellForKey={(key, element) => this.cellForKey(key, element)}
                    hasOptionFunc={false}
                    hasEditButtonForRow={(element) => true}
                    onClickEdit={(element) => this.onClickRowEdit(element)}
                    onChangePage={(data) => this.onChangePage(data)}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        areas: state.areas,
        areaCount: state.areas_count,
        doCreate: state.doCreate,
        doUpdate: state.doUpdate
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AreaList);
