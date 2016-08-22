import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Filter from './section/Filter'
import Table from '../components/commons/Table';
import Notification from '../components/commons/Notification';
import * as Const from '../constants/Constants';
import { fetchUserInfo } from '../actions/user'
import { fetchSections, deleteSections } from '../actions/section'

class SectionList extends Component {

    constructor(props) {
        super(props);
        const { currentUser } = this.props;
        this.state= {
            filter: {
                company_id: currentUser.authority >= Const.USER_AUTHORITY_COMPANY ? currentUser.company_id : 0,
                brand_id: currentUser.authority >= Const.USER_AUTHORITY_BRAND ? currentUser.brand_id: 0,
                section_name: '',
                page: 1,
                per_page: Const.PER_PAGE,
                pattern: Const.GET_ALL_PATTERN
            },
        };
        this.tableFormat = [
            {
                title: Globalize.localize('map_section_name', Globalize.culture()),
                valueKey: 'section_name',
                style: {
                    width: '180px',
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
                title: Globalize.localize('map_status', Globalize.culture()),
                valueKey: 'section_status',
                style: {
                    width: '50px',
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
                title: Globalize.localize('map_store_count', Globalize.culture()),
                valueKey: 'store_count',
                style: {
                    width: '50px',
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
                title: Globalize.localize('map_store_name', Globalize.culture()),
                valueKey: 'store_names',
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
        this.statuses = [
            Globalize.localize('business_condition_delete', Globalize.culture()),
            Globalize.localize('business_condition_close', Globalize.culture()),
            Globalize.localize('business_condition_prepare', Globalize.culture()),
            Globalize.localize('business_condition_open', Globalize.culture()),
        ];

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    cellForKey(key, element) {
        switch(key) {
        case 'section_name':
            return (
                <span>{element.section_name}</span>
            );
        case 'section_status':
            return (
                <span>{this.statuses[element.section_status]}</span>
            );
        case 'store_count':
            return (
                <span>{element.store_names.length + Globalize.localize('map_store', Globalize.culture())}</span>
            );
        case 'store_names':
            return (
                <span>{element.store_names.join(', ')}</span>
            );
        }
    }

    componentWillMount() {
        this.props.dispatch(fetchUserInfo());
        this.onSearch();
    }

    onChangeFilter(filter) {
        this.setState({filter});
    }

    handleSubmit(e) {
        e.preventDefault();
        this.onSearch();
    }

    onChangePage(data) {
        let curFilter = this.state.curFilter;
        curFilter.page = data.selected + 1;
        let page = data.selected + 1;
        this.setState({curFilter}, () => {
            this.props.dispatch(fetchSections(curFilter));
        });
    }

    onSearch() {
        let curFilter = {...this.state.filter};
        this.setState({curFilter}, () => {
            this.props.dispatch(fetchSections(curFilter));
        });
    }

    onDelete(deleteIds) {
        if(confirm(Globalize.localize('confirm_delete', Globalize.culture()))) {
            let curFilter = this.state.curFilter;
            if (this.props.sections.length <= deleteIds.length && 1 < curFilter.page) {
                curFilter.page = curFilter.page - 1;
            }
            let titles = $.grep(this.props.sections.map((section) => {return 0 <= deleteIds.indexOf(section.id) ? section.section_name : null}), Boolean).join("\n・");
            this.setState({curFilter}, () => {
                deleteSections(deleteIds,
                    (err) => {
                        this.showNotification(Globalize.localize('section_cant_delete', Globalize.culture()) + '\n' + err.toString());
                    },
                    (res) => {
                        this.showNotification(Globalize.localize('section_deleted', Globalize.culture()) + '\n・' + titles);
                        this.onSearch();
                    }
                );
            });
        }
    }

    onClickRowEdit(element) {
        this.context.router.push('/section/edit/' + element.id);
    }

    showNotification(message) {
        Notification.showNotification(this.props.dispatch, this.props.route.path, message);
    }

    render() {
       if(this.props.currentUser.mail_address == '') return null;
        return (
            <div>
                <Notification path={this.props.route.path}/>
                <Filter filter={this.state.filter}
                    onChangeFilter={(filter) => this.onChangeFilter(filter)}
                    handleSubmit={this.handleSubmit} />
                <Table
                    data={this.props.sections}
                    formats={this.tableFormat}
                    totalCount={this.props.sectionCount}
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

SectionList.contextTypes = {
    router: React.PropTypes.object,
};

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        sections: state.sections,
        sectionCount: state.sections_count,
    }
}

export default connect(mapStateToProps)(SectionList);
