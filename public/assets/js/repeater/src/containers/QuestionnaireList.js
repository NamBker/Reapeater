import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';
import Filter from './questionnaire/Filter'
import Table from '../components/commons/Table'
import { PER_PAGE, GET_DISPLAY_ITEMS_ONLY_PATTERN } from '../constants/Constants';
import { QUESTIONNAIRE_TYPE_INITIAL_REGISTRATION, QUESTIONNAIRE_RELEASE_FLG_PUBLISHED, QUESTIONNAIRE_RELEASE_FLG_UNPUBLISHED } from '../constants/Constants';
import { fetchQuestionnaires, deleteQuestionnaires } from '../actions/questionnaire';
import Notification from '../components/commons/Notification'

class QuestionnaireList extends Component {
    constructor(props) {
        super(props);
        this.state= {
            filter: {
                questionnaire_name: '',
                questionnaire_release_flg: '',
                questionnaire_limit_from: null,
                questionnaire_limit_to: null,
                pattern: GET_DISPLAY_ITEMS_ONLY_PATTERN,
                page: 1,
                per_page: PER_PAGE,
            },
        };
        this.handleQuestionnaireReleaseFlgChange = this.handleQuestionnaireReleaseFlgChange.bind(this);
        this.handleQuestionnaireLimitFromChange = this.handleQuestionnaireLimitFromChange.bind(this);
        this.handleQuestionnaireLimitToChange = this.handleQuestionnaireLimitToChange.bind(this);
        this.handleKeyWordChange = this.handleKeyWordChange.bind(this);
        this.tableFormat = [
            {
                title: Globalize.localize('map_code', Globalize.culture()),
                valueKey: 'questionnaire_code',
                style: {
                    width: '100px',
                    marginLeft: '2px',
                    marginRight: '5px',
                    lineHeight: '50px',
                    flexShrink: '0',
                },
            },
            {
                title: Globalize.localize('map_status', Globalize.culture()),
                valueKey: 'questionnaire_release_flg',
                style: {
                    width: '65px',
                    marginLeft: '2px',
                    marginRight: '5px',
                    lineHeight: '50px',
                    flexShrink: '0',
                },
            },
            {
                title: Globalize.localize('map_title', Globalize.culture()),
                valueKey: 'questionnaire_name',
                style: {
                    width: '100%',
                    marginLeft: '2px',
                    marginRight: '5px',
                    lineHeight: '50px',
                    height: '100%',
                    overflow: 'hidden',
                    whitespace: 'nowrap',
                    textOverflow: 'ellipsis',
                },
            },
            {
                title: Globalize.localize('map_end_date', Globalize.culture()),
                valueKey: 'questionnaire_limit',
                style: {
                    width: '115px',
                    marginLeft: '2px',
                    marginRight: '90px',
                    lineHeight: '50px',
                    flexShrink: '0',
                },
            },
        ];
        this.questionnaireReleaseFlgs = [
            Globalize.localize('flg_unpublished', Globalize.culture()),
            Globalize.localize('flg_published', Globalize.culture()),
        ];
    }

    componentWillMount() {
        this.onSearch();
    }

    cellForKey(key, element) {
        switch (key) {
        case 'questionnaire_code':
            return (
                <span>{element.questionnaire_code}</span>
            );
        case 'questionnaire_release_flg':
            return (
                <span>{this.questionnaireReleaseFlgs[element.questionnaire_release_flg]}</span>
            );
        case 'questionnaire_name':
            return (
                <div className="widget_table_questionnaire_name">
                    {element.questionnaire_type == QUESTIONNAIRE_TYPE_INITIAL_REGISTRATION ?
                    <span>{Globalize.localize('filter_questionnaire_member', Globalize.culture())}</span>
                    : null}
                    {element.questionnaire_release_flg == QUESTIONNAIRE_RELEASE_FLG_PUBLISHED ?
                    element.questionnaire_name :
                    <Link to={"/questionnaire/edit/" + element.id}>{element.questionnaire_name}</Link>}
                </div>
            );
        case 'questionnaire_limit':
            let tmp = moment(element.questionnaire_limit);
            return (
                <span>{tmp.isValid() ? tmp.format(Globalize.localize('display_date_no_weekday_format', Globalize.culture())) : ""}</span>
            );
        }
    }

    onClickRowEdit(element) {
        this.context.router.push('/questionnaire/edit/' + element.id);
    }

    hasEditButtonForRow(element) {
        return element.questionnaire_release_flg == QUESTIONNAIRE_RELEASE_FLG_UNPUBLISHED;
    }

    onChangePage(data) {
        let curFilter = this.state.curFilter;
        curFilter.page = data.selected + 1;
        this.setState({curFilter}, () => {
            this.props.dispatch(fetchQuestionnaires(curFilter));
        });
    }

    handleQuestionnaireReleaseFlgChange(e) {
        let filter = {...this.state.filter};
        filter.questionnaire_release_flg = e.target.value;
        this.setState({filter: filter});
    }

    handleQuestionnaireLimitFromChange(data) {
        let filter = {...this.state.filter};
        filter.questionnaire_limit_from = data;
        this.setState({filter: filter});
    }

    handleQuestionnaireLimitToChange(data) {
        let filter = {...this.state.filter};
        filter.questionnaire_limit_to = data;
        this.setState({filter: filter});
    }

    handleKeyWordChange(e) {
        let filter = this.state.filter;
        filter.questionnaire_name = e.target.value;
        this.setState({filter: filter});
    }

    onSubmit(e) {
        e.preventDefault();
        this.onSearch();
    }

    onSearch() {
        let curFilter = Object.assign({}, this.state.filter);
        this.setState({curFilter}, () => {
            this.props.dispatch(fetchQuestionnaires(curFilter));
        });
    }

    onDelete(deleteIds) {
        let titles = this.props.questionnaires.map((questionnaire) => {
            if (0 <= deleteIds.indexOf(questionnaire.id)) {
                return questionnaire.questionnaire_name;
            }
        }).filter(name => name);
        deleteQuestionnaires(deleteIds, (err) => {
            this.showNotification(Globalize.localize('questionnaire_cant_delete', Globalize.culture()) + '\n' + err.toString());
        }, (res) => {
            this.showNotification(Globalize.localize('questionnaire_deleted', Globalize.culture()) + '\n' + titles.join(", "));
            let curFilter = this.state.curFilter;
            if (this.props.questionnaires.length <= deleteIds.length && 1 < curFilter.page) {
                curFilter.page = curFilter.page - 1;
            }
            this.setState({curFilter}, () => {
                this.props.dispatch(fetchQuestionnaires(curFilter));
            });
        });
    }

    showNotification(message) {
        Notification.showNotification(this.props.dispatch, this.props.route.path, message);
    }

    render() {
        return (
            <div>
                <Notification path={this.props.route.path}/>
                <Filter filter={this.state.filter}
                        handleKeyWordChange={this.handleKeyWordChange}
                        handleQuestionnaireReleaseFlgChange={this.handleQuestionnaireReleaseFlgChange}
                        handleQuestionnaireLimitFromChange={this.handleQuestionnaireLimitFromChange}
                        handleQuestionnaireLimitToChange={this.handleQuestionnaireLimitToChange}
                        onSubmit={(e) => this.onSubmit(e)}/>
                    <Table
                        data={this.props.questionnaires}
                        formats={this.tableFormat}
                        totalCount={this.props.count}
                        curPage={this.state.curFilter.page}
                        onDelete={(deleteIds) => this.onDelete(deleteIds)}
                        cellForKey={(key, element) => this.cellForKey(key, element)}
                        hasOptionFunc={false}
                        hasEditButtonForRow={(element) => this.hasEditButtonForRow(element)}
                        onClickEdit={(element) => this.onClickRowEdit(element)}
                        onChangePage={(data) => this.onChangePage(data)}
                        isSelectableRow={(element) => element.questionnaire_type != QUESTIONNAIRE_TYPE_INITIAL_REGISTRATION}
                    />
            </div>
        )
    }
}

QuestionnaireList.contextTypes = {
    router: React.PropTypes.object,
};

const mapStateToProps = (state) => {
    return {
        questionnaires: state.questionnaires,
        count: state.questionnaire_count,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionnaireList);
