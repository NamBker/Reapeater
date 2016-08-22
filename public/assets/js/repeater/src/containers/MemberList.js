import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Filter from './member/Filter';
import Table from '../components/commons/Table';
import CSVUploadDialog from '../components/commons/CSVUploadDialog';
import Notification from '../components/commons/Notification';
import { USER_AUTHORITY_ADMIN, USER_AUTHORITY_COMPANY, USER_AUTHORITY_BRAND, USER_AUTHORITY_SECTION, USER_AUTHORITY_STORE } from '../constants/Constants';
import { PER_PAGE } from '../constants/Constants';
import { GET_DISPLAY_ITEMS_ONLY_PATTERN } from '../constants/Constants';
import { MEMBER_DELIVERY_STATUS_ERROR } from '../constants/Constants';

import { fetchUserInfo } from '../actions/user';
import { fetchMembers, deleteMembers, memberCSVUpload, memberCSVDownload } from '../actions/member';
import Rpapi from '../actions/rpapi';

class MemberList extends Component {
    constructor(props) {
        super(props);
        const { currentUser } = this.props;
        this.state = {
            filter: {
                member_mail_address: '',
                member_company_id: USER_AUTHORITY_COMPANY <= props.currentUser.authority ? currentUser.company_id : 0,
                member_brand_ids: USER_AUTHORITY_BRAND <= props.currentUser.authority ? [currentUser.brand_id] : [],
                member_store_ids: USER_AUTHORITY_STORE <= props.currentUser.authority ? [currentUser.store_id] : [],
                member_registration_date_from: null,
                member_registration_date_to: null,
                store_member_statuses: [],
                mail_receptions: [],
                mail_delivery_statuses: [],
                genders: [],
                birthday_from: null,
                birthday_to: null,
                name: '',
                prefectures: [],
                jobs: [],
                page: 1,
                per_page: PER_PAGE,
                pattern: GET_DISPLAY_ITEMS_ONLY_PATTERN,
            },
            curFilter: {
                page: 1,
            },
            selectedIds: [],
            showCSVDialog: false,
        };
        this.tableFormat = [
            {
                title: Globalize.localize('member_table_title_mail_address', Globalize.culture()),
                valueKey: 'mail_address',
                style: {
                    width: 'auto',
                    marginLeft: '2px',
                    marginRight: 'auto',
                    lineHeight: '50px',
                },
            },
            {
                title: Globalize.localize('member_table_title_delivery_condition', Globalize.culture()),
                valueKey: 'mail_reception',
                style: {
                    width: '90px',
                    marginLeft: '2px',
                    marginRight: '2px',
                    lineHeight: '50px',
                },
            },
            {
                title: Globalize.localize('member_table_title_delivery_status', Globalize.culture()),
                valueKey: 'mail_delivery_status',
                style: {
                    width: '90px',
                    marginLeft: '2px',
                    marginRight: '2px',
                    lineHeight: '50px',
                },
            },
            {
                title: Globalize.localize('member_table_title_registration_date', Globalize.culture()),
                valueKey: 'member_registration_date',
                style: {
                    width: '150px',
                    marginLeft: '2px',
                    marginRight: '2px',
                    lineHeight: '50px',
                },
            },
            {
                title: Globalize.localize('member_table_title_member_status', Globalize.culture()),
                valueKey: 'store_member_status',
                style: {
                    width: '100px',
                    marginLeft: '2px',
                    marginRight: '90px',
                    lineHeight: '50px',
                },
            },
        ];
        this.tableOptions = [
            {
                label: Globalize.localize('member_csv_upload', Globalize.culture()),
                func: (e) => {this.onOpenCSVDialog()},
            },
            {
                label: Globalize.localize('member_csv_download', Globalize.culture()),
                func: (e) => {e.preventDefault(); this.onDownloadCSV()},
            },
        ];
        this.deliveryConditions = [
            Globalize.localize('member_delivery_condition_denied', Globalize.culture()),
            Globalize.localize('member_delivery_condition_permitted', Globalize.culture()),
        ];
        this.deliveryStatuses = [
            Globalize.localize('error', Globalize.culture()),
            Globalize.localize('normal', Globalize.culture()),
        ];
        this.storeMemberStatuses= [
            Globalize.localize('registered', Globalize.culture()),
            Globalize.localize('withdraw', Globalize.culture()),
        ];
    }

    componentDidMount() {
        this.props.dispatch(fetchUserInfo());
        let curFilter = this.state.filter;
        this.setState({curFilter: this.state.filter});
        this.onSearch();
    }

    onChangeFilter(newFilter) {
        this.setState({filter: newFilter});
    }

    onSearch() {
        let filter = Object.assign({}, this.state.filter);
        this.setState({curFilter: filter}, () => {
            this.props.dispatch(fetchMembers(filter, (err) => {
                this.showNotification(err.toString())
            }, (res) => {

            }));
        });
    }

    cellForKey(key, element) {
        switch(key) {
        case 'mail_address':
            return (
                <Link to={"/member/edit/store/" + element.store_id + "/member/" + element.member_id}>{element.mail_address}</Link>
            );
        case 'mail_reception':
            return (
                <span>{this.deliveryConditions[element.mail_reception]}</span>
            );
        case 'mail_delivery_status':
            return (
                <span className={element.mail_delivery_status == MEMBER_DELIVERY_STATUS_ERROR ? "orange-text" : ""}>
                    {this.deliveryStatuses[element.mail_delivery_status]}
                </span>
            );
        case 'member_registration_date':
            return (
                <span>{element.member_registration_date.substring(0, 16)}</span>
            );
        case 'store_member_status':
            return (
                <span>{this.storeMemberStatuses[element.store_member_status - 1]}</span>
            );
        }
    }

    hasEditButtonForRow(element) {
        return true;
    }

    onChangePage(data) {
        let filter = this.state.curFilter;
        filter.page = data.selected + 1;
        this.setState({curFilter: filter, selectedIds: []}, () => {
            this.props.dispatch(fetchMembers(filter, (err) => {
                this.showNotification(err.toString(), false);
            }, (res) => {}));
        });
    }

    onDelete(deleteIds) {
        let filter = this.state.curFilter;
        if (this.props.members.length <= deleteIds.length && 1 < filter.page) {
            filter.page = filter.page - 1;
        }
        let titles = $.grep(this.props.members.map((member) => {return 0 <= deleteIds.indexOf(member.id) ? member.mail_address : null}), Boolean).join(", ");
        this.setState({curFilter: filter}, () => {
            this.props.dispatch(deleteMembers(deleteIds,
                (err) => {
                    this.showNotification(err.toString(), false);
                },
                (res) => {
                    this.showNotification('会員「' + titles + '」を削除しました。');
                    this.onSearch();
                }
            ));
        });
    }

    onClickRowEdit(element) {
        this.context.router.push('/member/edit/store/' + element.store_id + '/member/' + element.member_id);
    }

    showNotification(message, isSuccess = true) {
        Notification.showNotification(this.props.dispatch, this.props.route.path, message);
    }

    onOpenCSVDialog() {
        this.setState({showCSVDialog: true});
    }

    onCloseCSVDialog() {
        this.setState({showCSVDialog: false});
    }

    onUploadCSV(uploadFile) {
        let file = uploadFile;
        this.setState({showCSVDialog: false}, () => {
            this.props.dispatch(memberCSVUpload(uploadFile, (err) => {
                this.showNotification(err.toString());
            }, (res) => {
                this.showNotification(Globalize.localize('csv_upload_succeeded_message', Globalize.culture()))
            }));
        });
    }

    onDownloadCSV() {
        let rpapi = new Rpapi('get', '/members/')
            .query(this.state.curFilter);
        let srcUrl = '/web/member/export' + '?' + rpapi.getQuery().join('&');
        $('body').append("<iframe src='" + srcUrl + "' style='display: none;'></iframe>");
    }

    render() {
        return (
            <div>
                <Notification path={this.props.route.path}/>
                {this.state.showCSVDialog ?
                <CSVUploadDialog
                    isOpen={this.state.showCSVDialog}
                    description={Globalize.localize('member_csv_upload_modal_description', Globalize.culture())}
                    onClose={() => this.onCloseCSVDialog()}
                    onUpload={(uploadFile) => this.onUploadCSV(uploadFile)}
                /> : null}
                <div className="widget widget__page__input">
                    <div className="widget__page__input__title">
                        <div className="widget__page__type__search"/>
                        <span className="font-headline1">{Globalize.localize('filter_search_condition', Globalize.culture())}</span>
                        <span>{Globalize.localize('filter_search_description', Globalize.culture())}</span>
                    </div>
                    <Filter
                        currentUser={this.props.currentUser}
                        filter={this.state.filter}
                        onChangeFilter={(newFilter) => this.onChangeFilter(newFilter)}
                        onSearch={() => this.onSearch()}
                    />
                </div>
                <Table
                    data={this.props.members}
                    formats={this.tableFormat}
                    totalCount={this.props.memberCount}
                    curPage={this.state.curFilter.page}
                    onDelete={(deleteIds) => this.onDelete(deleteIds)}
                    cellForKey={(key, element) => this.cellForKey(key, element)}
                    hasOptionFunc={true}
                    optionFuncs={this.tableOptions}
                    hasEditButtonForRow={(element) => this.hasEditButtonForRow(element)}
                    onClickEdit={(element) => this.onClickRowEdit(element)}
                    onChangePage={(data) => this.onChangePage(data)}
                />
            </div>
        );
    }
}

MemberList.contextTypes = {
    router: React.PropTypes.object,
};

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        members: state.members,
        memberCount: state.member_count,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberList);
